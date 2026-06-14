import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ---------- 限流（带自动清理）----------
const ipRequestMap = new Map<string, number[]>();

function isRateLimited(ip: string | null): boolean {
  if (!ip) return false;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxReq = 10;
  const requests = ipRequestMap.get(ip) ?? [];
  const recent = requests.filter(t => now - t < windowMs);
  
  if (recent.length >= maxReq) return true;
  
  ipRequestMap.set(ip, [...recent, now]);
  
  if (ipRequestMap.size > 1000) {
    for (const [key, timestamps] of ipRequestMap.entries()) {
      if (timestamps.every(t => now - t > windowMs)) {
        ipRequestMap.delete(key);
      }
    }
  }
  return false;
}

// ---------- 系统提示词缓存 ----------
let systemPromptCache: string | null = null;
async function getSystemPrompt(): Promise<string> {
  if (systemPromptCache) return systemPromptCache;
  const filePath = path.join(process.cwd(), 'public', 'system.txt');
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    systemPromptCache = content;
    return content;
  } catch (err) {
    console.error('Failed to read system.txt:', err);
    throw new Error('系统提示词加载失败');
  }
}

// ---------- 获取真实 IP ----------
function getClientIP(req: NextRequest): string | null {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || null;
}

// ---------- 辅助函数：返回 SSE 错误（始终 200 状态码）----------
function sseError(errorText: string): Response {
  // 过滤敏感信息：只返回友好提示，不要暴露内部细节
  const safeError = errorText
    .replace(/API_KEY.*/i, '配置错误')
    .replace(/read system\.txt/i, '服务初始化失败')
    .replace(/fetch failed/i, '网络连接失败');
  const body = `data: {"type":"error","errorText":"${safeError}"}\n\ndata: [DONE]\n\n`;
  return new Response(body, {
    status: 200,  // 关键：总是 200，避免前端抛异常
    headers: { 'Content-Type': 'text/event-stream' },
  });
}

export async function POST(req: NextRequest) {
  const controller = new AbortController();
  let timeout: NodeJS.Timeout | null = null;
  
  try {
    // 1. 限流
    const ip = getClientIP(req);
    if (isRateLimited(ip)) {
      return sseError('请求过于频繁，请稍后再试');
    }

    // 2. 解析请求体
    const body = await req.json().catch(() => null);
    if (!body || !Array.isArray(body.messages)) {
      return sseError('请求格式错误');
    }
    const { messages, model } = body;  // 解构 model 参数（可选）

    // 3. 加载系统提示词
    let systemPrompt: string;
    try {
      systemPrompt = await getSystemPrompt();
    } catch (err) {
      return sseError('服务初始化失败，请联系管理员');
    }

    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-20),
    ];

    // 4. 构建上游请求，支持自定义模型
    // 默认模型：qwen/qwen3-next-80b-a3b-instruct
    // 如果提供了 model 参数，则使用指定模型
    const defaultModel = "qwen/qwen3-next-80b-a3b-instruct";
    const selectedModel = (model && typeof model === 'string' && model.trim()) 
      ? model.trim() 
      : defaultModel;

    // 可选：验证模型格式，防止注入
    if (selectedModel.length > 100 || !/^[a-zA-Z0-9_\-/\.]+$/.test(selectedModel)) {
      return sseError('无效的模型参数');
    }

    const openaiBody = {
      model: selectedModel,  // 使用选择的模型
      messages: fullMessages,
      stream: true,
      temperature: 0.2,
      top_p: 0.7,
      presence_penalty: 0.5,
      frequency_penalty: 0.3,
      max_tokens: 4096
    };

    const apiBaseUrl = process.env.API_BASE_URL || "https://new.xinjianya.top";
    const upstreamUrl = `${apiBaseUrl}/v1/chat/completions`;
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error('API_KEY not set');
      return sseError('服务配置错误');
    }

    // 5. 合并信号：后端超时 + 前端取消
    timeout = setTimeout(() => controller.abort(), 120000);
    if (req.signal) {
      req.signal.addEventListener('abort', () => controller.abort());
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0 Safari/537.36",
      "Accept": "text/event-stream",
      "Referer": apiBaseUrl,
      "Origin": apiBaseUrl,
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site"
    };

    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      signal: controller.signal,
      headers: headers,
      body: JSON.stringify(openaiBody),
    });

    if (timeout) clearTimeout(timeout);
    timeout = null;

    // 6. 上游返回非 200 -> 转换为 SSE 错误
    if (!upstream.ok) {
      let errorMsg = `上游服务暂时不可用 (${upstream.status})`;
      // 尝试读取具体错误，但仅用于日志，不返回给前端
      const errorBody = await upstream.text().catch(() => '');
      console.error(`上游错误 ${upstream.status}:`, errorBody.slice(0, 500));
      // 对常见的 401/403/429 给出更友好的提示
      if (upstream.status === 401 || upstream.status === 403) {
        errorMsg = '认证失败，请联系管理员';
      } else if (upstream.status === 429) {
        errorMsg = '上游服务限流，请稍后再试';
      } else if (upstream.status >= 500) {
        errorMsg = '上游服务繁忙，请稍后再试';
      }
      return sseError(errorMsg);
    }

    // 7. 直接透传上游 SSE 流（标准 OpenAI 格式）
    return new Response(upstream.body, {
      status: 200,  // 仍然返回 200，保证前端不抛异常
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });

  } catch (err) {
    if (timeout) clearTimeout(timeout);
    console.error('API 内部错误:', err);
    
    let errorText = '服务异常，请稍后再试';
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        errorText = '请求被取消或超时';
      } else if (err.message.includes('fetch failed')) {
        errorText = '网络连接失败，请检查网络';
      }
    }
    return sseError(errorText);
  }
}