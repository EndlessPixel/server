import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { THINKING_PROMPT } from "@/lib/ai-thinking-prompt";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;
const ipRequestMap = new Map<string, number[]>();
const PLAYER_INFO_API_URL = `https://login-and-data.epmc.qzz.io/v1/api/users/info`;
// 上游响应头超时。中转服务即使只是返回 401/502 也可能拖 20~40 秒（上游日志实测），
// 不能让用户干等着。响应头一到立即取消计时，流式传输期间不再计时。
const UPSTREAM_HEADER_TIMEOUT_MS = 25_000;

function isRateLimited(ip: string | null): boolean {
  if (!ip) return false;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxReq = 10;
  const requests = ipRequestMap.get(ip) ?? [];
  const recent = requests.filter((t) => now - t < windowMs);
  if (recent.length >= maxReq) return true;
  ipRequestMap.set(ip, [...recent, now]);
  if (ipRequestMap.size > 1000) {
    for (const [key, timestamps] of ipRequestMap.entries()) {
      if (timestamps.every((t) => now - t > windowMs)) {
        ipRequestMap.delete(key);
      }
    }
  }
  return false;
}
let systemPromptCache: string | null = null;
async function getSystemPrompt(): Promise<string> {
  if (systemPromptCache) return systemPromptCache;
  const filePath = path.join(process.cwd(), "public", "system.md");
  try {
    const content = await fs.readFile(filePath, "utf-8");
    systemPromptCache = content;
    return content;
  } catch (err) {
    console.error("Failed to read system.md:", err);
    throw new Error("系统提示词加载失败");
  }
}
// Dynamic timestamp injected at the top of the system prompt on every
// request, e.g. "Now: 2026/07/29 15:26:01" (Asia/Shanghai).
// 强约束：模型回答时间相关问题必须以该行时间为准。
function getNowLine(): string {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const date = `${get("year")}/${get("month")}/${get("day")}`;
  const time = `${get("hour")}:${get("minute")}:${get("second")}`;
  const weekday =
    { 周日: "日", 周一: "一", 周二: "二", 周三: "三", 周四: "四", 周五: "五", 周六: "六" }[
      get("weekday")
    ] ?? "";
  return [
    "【当前真实时间】回答一切与时间相关的问题（现在几点、今天几号、当前版本、最近等）必须以这一行时间为准，严禁使用你训练记忆里的日期。",
    `Now: ${date} ${time} (UTC+8, 星期${weekday})`,
    "【结束时间块】",
  ].join("\n");
}
function getClientIP(req: NextRequest): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || null;
}

// 若当前请求携带有效登录会话（ep_session），拉取该玩家的公开资料，
// 作为「当前玩家」上下文注入系统提示，让 AI 能基于真实身份作答
// （例如「你上次登录是…」「你的账号目前状态正常」）。
// 任何异常都静默降级：拿不到资料就当作未登录，不影响正常对话。
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{1,32}$/;
async function getPlayerContextBlock(req: NextRequest): Promise<string> {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const name = verifySessionToken(token);
    if (!name) return "";
    const upstream = await fetch(`${PLAYER_INFO_API_URL}?name=${encodeURIComponent(name)}`, {
      cache: "no-store",
      // 玩家资料只是增强上下文，拿不到就降级。超时压到 2s：
      // 这个 await 在上游 AI 请求之前，慢一点会直接推迟首字节到达。
      signal: AbortSignal.timeout(2000),
    });
    if (!upstream.ok) return "";
    // 该接口返回的是**扁平**的玩家资料对象（name / uuid / ban / lastActive / ipLocation …），
    // 不是 { success, data } 包裹体 —— 前端 /api/users/info 也是原样透传给 profile 页的。
    // 这里曾按包裹体解包，等于永远取不到资料，AI 客服因此一直缺少玩家身份上下文（现已修正）。
    const u = (await upstream.json()) as {
      name?: unknown;
      uuid?: unknown;
      ban?: unknown;
      lastActive?: unknown;
      ipLocation?: unknown;
    } | null;
    if (!u || typeof u !== "object") return "";
    const banned = u.ban ? "已被封禁" : "正常";
    const gameId = typeof u.name === "string" && USERNAME_PATTERN.test(u.name) ? u.name : name;
    const lines = [
      "【当前玩家身份（仅供回答玩家本人相关问题时参考，禁止对外泄露或用于越权操作）】",
      `- 游戏 ID：${gameId}`,
      `- UUID：${String(u.uuid ?? "未知")}`,
      `- 账号状态：${banned}`,
    ];
    if (u.lastActive) {
      lines.push(`- 最后登录时间：${String(u.lastActive)}（服务器本地时间，非精确校准）`);
    }
    if (u.ipLocation) {
      lines.push(`- 登录属地：${String(u.ipLocation)}`);
    }
    lines.push("【结束玩家身份块】");
    return lines.join("\n");
  } catch {
    return "";
  }
}
/** 错误类别：结构化上报用，前端与日志都能据此判断失败原因 */
export type AiErrorKind =
  | "rate_limited"
  | "bad_request"
  | "invalid_params"
  | "invalid_model"
  | "config"
  | "upstream_unreachable"
  | "upstream_timeout"
  | "upstream_status"
  | "upstream_stream"
  | "internal";

/** 结构化错误详情：直接承载上游返回的原始信息，不再改写成友好文案 */
export type AiErrorDetail = {
  /** 错误类别 */
  kind: AiErrorKind;
  /** 原始错误描述：上游给了什么就是什么 */
  message: string;
  /** 上游 HTTP 状态码 */
  status?: number;
  /** 上游返回体里的错误码 */
  code?: string;
  /** 上游原始响应体（截断 + 脱敏） */
  detail?: string;
  /** 相关模型 */
  model?: string;
};

/** 错误事件载荷 */
export type AiErrorPayload = {
  type: "error";
  /** 一句话直白描述（玩家看到的正文） */
  errorText: string;
  /** 是否属于服务端问题：客户端据此决定要不要展示链路自检 */
  serverSide: boolean;
  /** 结构化错误详情 */
  error: AiErrorDetail;
};

/**
 * 脱敏：只把可能泄露的凭证打码，**不再整条改写**。
 *
 * 早前的做法是把含 API_KEY / fetch failed 的信息整条替换成「配置错误」之类的固定文案，
 * 代价是原始原因全丢了 —— 排查时只能看到一句套话。现在保留原文，仅对凭证打码。
 */
function redactSecrets(text: string, secret?: string): string {
  let out = text;
  if (secret && secret.length >= 8) out = out.split(secret).join("***");
  return out
    .replace(/(bearer\s+)[A-Za-z0-9._~+/-]{8,}=*/gi, "$1***")
    .replace(/(api[_ -]?key\s*[:=]\s*)("?)[^\s",}]+\2/gi, "$1***")
    .replace(/sk-[A-Za-z0-9._-]{6,}/g, "sk-***");
}

/**
 * 构造结构化错误载荷。
 *
 * serverSide 表示「这是否属于服务端问题」：403/429 这类认证或限流响应，
 * 以及参数错误等请求侧问题传 false，客户端据此决定要不要展示链路自检 ——
 * 不是服务器的锅就不该弹给玩家看。
 */
function buildError(
  kind: AiErrorKind,
  message: string,
  options: {
    serverSide?: boolean;
    status?: number;
    code?: string;
    detail?: string;
    model?: string;
    /** 需要额外打码的凭证（通常是 API_KEY） */
    secret?: string;
  } = {},
): AiErrorPayload {
  const serverSide = options.serverSide ?? true;
  const error: AiErrorDetail = { kind, message: redactSecrets(message, options.secret) };
  if (options.status !== undefined) error.status = options.status;
  if (options.code) error.code = redactSecrets(options.code, options.secret);
  if (options.detail) error.detail = redactSecrets(options.detail, options.secret);
  if (options.model) error.model = options.model;
  return { type: "error", errorText: error.message, serverSide, error };
}

/** 错误日志：统一打印成 JSON 结构化数据，便于机器解析与聚合 */
function logError(scope: string, payload: AiErrorPayload): void {
  console.error(
    JSON.stringify({
      scope,
      at: new Date().toISOString(),
      errorText: payload.errorText,
      serverSide: payload.serverSide,
      ...payload.error,
    }),
  );
}

/** 以 SSE 事件形式回报错误（响应流尚未建立时使用） */
function sseError(payload: AiErrorPayload): Response {
  logError("ai/chat", payload);
  const body = `data: ${JSON.stringify(payload)}\n\ndata: [DONE]\n\n`;
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  });
}

/**
 * 上游状态码是否「与服务端健康无关」。
 * 4xx 属于请求侧或策略侧（参数、认证、限流），不该让玩家以为服务器挂了；
 * 408 是上游响应超时，属于服务侧，所以单独排除在 4xx 之外。
 */
function isNonServerStatus(status: number): boolean {
  if (status === 408) return false;
  return status >= 400 && status < 500;
}
export async function POST(req: NextRequest) {
  const controller = new AbortController();
  let timeout: NodeJS.Timeout | null = null;
  try {
    const ip = getClientIP(req);
    if (isRateLimited(ip)) {
      return sseError(buildError("rate_limited", "请求过于频繁，请稍后再试", { serverSide: false }));
    }
    const body = await req.json().catch(() => null);
    if (!body || !Array.isArray(body.messages)) {
      return sseError(buildError("bad_request", "请求格式错误", { serverSide: false }));
    }
    const { messages, model } = body;

    // —— 对外开放的采样参数：缺省用默认值，越界/非数字按请求侧错误拒绝 ——
    const readNumParam = (key: string, fallback: number, min: number, max: number): number => {
      const raw = (body as Record<string, unknown>)[key];
      if (raw === undefined || raw === null) return fallback;
      const n = typeof raw === "number" ? raw : Number(raw);
      return Number.isFinite(n) && n >= min && n <= max ? n : NaN;
    };
    const temperature = readNumParam("temperature", 0.2, 0, 2);
    const topP = readNumParam("top_p", 0.7, 0, 1);
    const presencePenalty = readNumParam("presence_penalty", 0.5, -2, 2);
    const frequencyPenalty = readNumParam("frequency_penalty", 0.3, -2, 2);
    if ([temperature, topP, presencePenalty, frequencyPenalty].some(Number.isNaN)) {
      return sseError(
        buildError(
          "invalid_params",
          "无效的采样参数：temperature(0~2) / top_p(0~1) / presence_penalty(-2~2) / frequency_penalty(-2~2)",
          { serverSide: false },
        ),
      );
    }
    // 深度思考开关：默认开启；传 false 则不注入思考提示词
    const deepThinking = body.deepThinking !== false;
    let systemPrompt: string;
    try {
      systemPrompt = await getSystemPrompt();
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      return sseError(buildError("config", `系统提示词加载失败：${reason}`));
    }
    const playerCtx = await getPlayerContextBlock(req);
    // 深度思考提示词按需注入：关闭后模型不再输出 <thinking> 块
    const systemParts = [getNowLine(), systemPrompt];
    if (deepThinking) systemParts.push(THINKING_PROMPT);
    if (playerCtx) systemParts.push(playerCtx);
    const systemContent = systemParts.join("\n\n");
    const fullMessages = [{ role: "system", content: systemContent }, ...messages.slice(-20)];
    const defaultModel = "grok-4.7";
    const selectedModel =
      model && typeof model === "string" && model.trim() ? model.trim() : defaultModel;
    if (selectedModel.length > 100 || !/^[a-zA-Z0-9_\-/\.]+$/.test(selectedModel)) {
      return sseError(buildError("invalid_model", "无效的模型参数", { serverSide: false }));
    }
    const openaiBody = {
      model: selectedModel,
      messages: fullMessages,
      stream: true,
      temperature,
      top_p: topP,
      presence_penalty: presencePenalty,
      frequency_penalty: frequencyPenalty,
    };
    const apiBaseUrl = process.env.API_BASE_URL || "https://xn--kiv260fv3i.cn";
    const upstreamUrl = `${apiBaseUrl}/v1/chat/completions`;
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return sseError(buildError("config", "服务配置错误：环境变量 API_KEY 未设置"));
    }
    timeout = setTimeout(() => controller.abort(), UPSTREAM_HEADER_TIMEOUT_MS);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0 Safari/537.36",
      Accept: "text/event-stream",
      Referer: apiBaseUrl,
      Origin: apiBaseUrl,
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
    };
    // ===== 先把响应流建好并立即"激活"，再去连上游 =====
    // 参数校验一通过就把 priming 字节推给客户端，让浏览器/网关立刻知道连接已建立，
    // 不必在模型思考的那几秒静默期里干等（前端也会马上显示"正在输入"）。
    const encoder = new TextEncoder();
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    /** 往流里写一条结构化错误事件并收尾（替代早前的 return sseError） */
    const failStream = async (payload: AiErrorPayload) => {
      logError("ai/chat", payload);
      try {
        await writer.write(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        await writer.write(encoder.encode(`data: [DONE]\n\n`));
      } catch {
        /* 客户端已断开 */
      } finally {
        // 无论写入是否成功都要关闭：漏掉 close() 会让客户端一直挂着等响应结束。
        try {
          await writer.close();
        } catch {
          /* 流已关闭 */
        }
      }
    };

    // 预热：以 ":" 开头的 SSE 注释行（EventSource 会直接忽略）+ 2KB 填充，
    // 逼着代理层立刻把响应刷到客户端。前端零改动。
    // 注意：若前面还有自己的 nginx，仍需 `proxy_buffering off;`，padding 只是兜底。
    void writer.write(encoder.encode(`:${" ".repeat(2048)}\n\n`)).catch(() => {});

    (async () => {
      let upstream: Response;
      try {
        upstream = await fetch(upstreamUrl, {
          method: "POST",
          // Merge the server timeout with the client request signal so that
          // a client disconnect (req.signal abort) cancels the upstream fetch
          // cleanly instead of leaking an unhandled AbortError to the console.
          signal: AbortSignal.any([controller.signal, req.signal]),
          headers,
          body: JSON.stringify(openaiBody),
        });
      } catch (fetchErr) {
        // 客户端主动取消（切换会话 / 点停止 / 卸载）：静默退出，不当成错误上报
        if (fetchErr instanceof Error && fetchErr.name === "AbortError" && req.signal.aborted) {
          return new Response(null, { status: 499 });
        }
        // 其余 AbortError 来自我们自己的响应头超时；TimeoutError 来自连接阶段
        const kind: AiErrorKind =
          fetchErr instanceof Error &&
          (fetchErr.name === "TimeoutError" || fetchErr.name === "AbortError")
            ? "upstream_timeout"
            : "upstream_unreachable";
        const reason =
          fetchErr instanceof Error && fetchErr.name === "TimeoutError"
            ? `连接上游超时: ${upstreamUrl}`
            : fetchErr instanceof Error && fetchErr.name === "AbortError"
              ? `上游 ${UPSTREAM_HEADER_TIMEOUT_MS}ms 内未返回响应头: ${upstreamUrl}`
              : `连接上游失败: ${fetchErr instanceof Error ? fetchErr.message : String(fetchErr)}`;
        if (timeout) clearTimeout(timeout);
        await failStream(
          buildError(kind, reason, {
            detail:
              fetchErr instanceof Error
                ? `${fetchErr.name}: ${fetchErr.message}`
                : String(fetchErr),
            model: selectedModel,
            secret: apiKey,
          }),
        );
        return;
      }

      if (timeout) clearTimeout(timeout);
      timeout = null;
      if (!upstream.ok) {
        const errorBody = await upstream.text().catch(() => "");
        // 附带 key 指纹与模型名：401/403 时能直接对比环境变量里的 KEY 是否一致、是哪个渠道
        console.error(
          JSON.stringify({
            scope: "ai/chat",
            at: new Date().toISOString(),
            kind: "upstream_key_fingerprint",
            status: upstream.status,
            key: `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}`,
            model: selectedModel,
          }),
        );

        // 解析上游返回的具体错误信息：原样取用，不再按状态码改写成固定文案
        let upstreamMsg = "";
        let upstreamCode = "";
        try {
          const parsed = JSON.parse(errorBody);
          const errObj = parsed?.error;
          upstreamMsg =
            (typeof errObj === "string" ? errObj : errObj?.message) ||
            parsed?.message ||
            parsed?.detail ||
            "";
          upstreamCode =
            (typeof errObj === "object" && errObj ? errObj.code || errObj.type : "") ||
            parsed?.code ||
            "";
        } catch {}

        // 401/403 的密钥由服务端统一管理，属于服务端配置问题，必须展示链路自检。
        // 带上模型名：上游多渠道时，失效的往往只是单个渠道的授权（KEY 本身有效）。
        const authFailure = upstream.status === 401 || upstream.status === 403;
        const message = upstreamMsg
          ? `上游服务返回 ${upstream.status}：${upstreamMsg}`
          : `上游服务返回 ${upstream.status}`;
        await failStream(
          buildError("upstream_status", message, {
            status: upstream.status,
            code: upstreamCode,
            detail: errorBody.slice(0, 500),
            model: selectedModel,
            secret: apiKey,
            serverSide: authFailure || !isNonServerStatus(upstream.status),
          }),
        );
        return;
      }
      const decoder = new TextDecoder();
      const reader = upstream.body!.getReader();
      let buffer = "";
      let hasSentUsage = false;
      // 打字机节奏：上游返回的是大小不一的块，直接转发会「一会多一会少」。
      // 这里把内容拆成单个字符放进队列，再由下面的「字符泵」按固定间隔逐字下发。
      // 15ms ≈ 每秒 66 字；调小更快、调大更慢，但始终匀速。
      const TYPE_INTERVAL_MS = 15;
      const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
      (async () => {
        const queue: string[] = [];
        let upstreamDone = false;
        let upstreamSawDone = false;
        let usagePayload: unknown = null;

        // 字符泵：每个 tick 只发一个字符；队列空且上游未结束则原地等待。
        // 写失败（客户端断开等）直接退出，避免向外抛出未处理的 rejection。
        const pump = (async () => {
          while (true) {
            if (queue.length > 0) {
              const ch = queue.shift()!;
              try {
                await writer.write(
                  encoder.encode(`data: ${JSON.stringify({ type: "text-delta", delta: ch })}\n\n`),
                );
              } catch {
                break;
              }
            } else if (upstreamDone) {
              break;
            }
            await sleep(TYPE_INTERVAL_MS);
          }
        })();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue;

              const dataStr = trimmedLine.slice(6);
              if (dataStr === "[DONE]") {
                // 延迟到队列排空后再下发，否则前端会在字符还没显示完时收尾
                upstreamSawDone = true;
                continue;
              }
              try {
                const chunk = JSON.parse(dataStr);
                if (chunk.usage && !hasSentUsage) {
                  hasSentUsage = true;
                  usagePayload = {
                    type: "usage",
                    usage: {
                      promptTokens: chunk.usage.prompt_tokens,
                      completionTokens: chunk.usage.completion_tokens,
                      totalTokens: chunk.usage.total_tokens,
                    },
                  };
                }
                const content = chunk.choices?.[0]?.delta?.content;
                if (content) {
                  // for...of 按 Unicode 码点遍历，emoji / 代理对不会被切坏
                  for (const ch of content) queue.push(ch);
                }
              } catch (e) {
                console.warn("Failed to parse SSE chunk:", e);
              }
            }
          }

          upstreamDone = true;
          await pump; // 等队列里剩下的字符逐字发完

          if (usagePayload) {
            await writer.write(encoder.encode(`data: ${JSON.stringify(usagePayload)}\n\n`));
          }
          if (upstreamSawDone || !usagePayload) {
            await writer.write(encoder.encode(`data: [DONE]\n\n`));
          }
          await writer.close();
        } catch (err) {
          // 让字符泵尽快退出
          upstreamDone = true;
          await pump;
          // A client disconnect aborts the reader; do not log it as a server error.
          if (err instanceof Error && err.name === "AbortError") {
            try {
              await writer.abort(err);
            } catch {
              /* ignore */
            }
            return;
          }
          const payload = buildError(
            "upstream_stream",
            `上游流式传输中断：${err instanceof Error ? err.message : String(err)}`,
            { model: selectedModel, secret: apiKey },
          );
          logError("ai/chat", payload);
          try {
            await writer.write(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
            await writer.write(encoder.encode(`data: [DONE]\n\n`));
            await writer.close();
          } catch {
            try {
              await writer.abort(err as Error);
            } catch {
              /* ignore */
            }
          }
        }
      })();
    })();
    return new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    if (timeout) clearTimeout(timeout);
    // Client-initiated abort (cancel / switch session / unmount): exit silently.
    if (err instanceof Error && err.name === "AbortError") {
      return new Response(null, { status: 499 });
    }
    const payload = buildError(
      "internal",
      err instanceof Error ? `服务内部错误：${err.message}` : `服务内部错误：${String(err)}`,
    );
    // 堆栈只进日志，不随错误事件发给客户端
    console.error(
      JSON.stringify({
        scope: "ai/chat",
        at: new Date().toISOString(),
        kind: "internal",
        message: payload.error.message,
        stack: err instanceof Error ? err.stack : undefined,
      }),
    );
    return sseError(payload);
  }
}
