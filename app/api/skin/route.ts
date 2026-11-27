import { NextRequest } from "next/server";
import {
  isValidPlayerName,
  normalizeSkinSource,
  normalizeUuid,
  resolveSkin,
} from "@/lib/minecraft-skin";

/**
 * 皮肤图片代理 —— 同源输出，规避浏览器 CORS。
 *
 * 为什么要代理：skinview3d 加载皮肤时强制 `crossOrigin="anonymous"`，
 * 第三方皮肤源（crafatar / mc-heads / textures.minecraft.net）不一定带 CORS 头，
 * 图片会加载失败并抛出 `[object Event]`，整个预览崩掉。
 *
 * 取皮链路（按顺序尝试，任一命中即返回）：
 *   1. Yggdrasil 协议 —— 正版（Mojang）与 LittleSkin 都实现了同一套接口；
 *   2. crafatar / mc-heads —— 直连镜像，作为 URL 形态的兜底；
 *   3. 默认皮肤（Steve）—— 上游整体故障时也不能让预览崩掉。
 *
 * 参数：
 *   `source` = auto(默认) | mojang | littleskin
 *   `uuid`   = 32 位 hex（可带连字符）
 *   `name`   = 角色名（3~16 位），与 uuid 二选一，uuid 优先
 *
 * 响应头 `X-Skin-Source` 会告知实际命中的来源，方便前端与排查。
 */

/** 默认皮肤用 Mojang 官方 Steve 的 UUID（该资源始终存在） */
const DEFAULT_SKIN_UUID = "069a79f444e94726a5befca90e38aaf5";

/** 连默认皮肤都拿不到时返回的 1x1 透明 PNG（仍是合法图片，避免预览报错） */
const TRANSPARENT_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64",
);

async function fetchImage(url: string): Promise<Response | null> {
  try {
    return await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  } catch {
    return null;
  }
}

function pngResponse(body: Buffer | ArrayBuffer, source: string): Response {
  return new Response(body as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      // 玩家换皮肤后最多 10 分钟能反映出来；同时允许旧内容在后台续期
      "Cache-Control": "public, max-age=600, stale-while-revalidate=3600",
      "X-Skin-Source": source,
    },
  });
}

async function imageOrNull(url: string): Promise<ArrayBuffer | null> {
  const res = await fetchImage(url);
  if (!res?.ok) return null;
  // 上游偶尔会返回一段 HTML 错误页，用内容类型挡一下
  if (!(res.headers.get("content-type") || "").startsWith("image/")) return null;
  return res.arrayBuffer();
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const source = normalizeSkinSource(params.get("source"));
  const uuid = normalizeUuid(params.get("uuid"));
  const rawName = params.get("name");
  const name = isValidPlayerName(rawName) ? rawName : null;

  if (!uuid && !name) {
    return new Response("Invalid uuid or name", { status: 400 });
  }

  // 1. Yggdrasil（正版 / LittleSkin）
  const resolved = await resolveSkin({ uuid, name, source });
  if (resolved) {
    const image = await imageOrNull(resolved.url);
    if (image) return pngResponse(image, resolved.source);
  }

  // 2. 镜像兜底：只有拿到 Mojang UUID 才有意义。
  //    指定 littleskin 时跳过 —— 那边的角色 UUID 在 crafatar 上并不存在。
  if (uuid && source !== "littleskin") {
    for (const [label, url] of [
      ["crafatar", `https://crafatar.com/skins/${uuid}`],
      ["mc-heads", `https://mc-heads.net/skin/${uuid}`],
    ] as const) {
      const image = await imageOrNull(url);
      if (image) return pngResponse(image, label);
    }
  }

  // 严格模式：查不到就返回 404，让调用方能区分「没这个角色」与「拿到了默认皮肤」。
  // 预览工具页用它，避免角色名打错时静默显示 Steve 而后误以为查询成功。
  if (params.get("strict") === "1") {
    return new Response("Skin not found", { status: 404 });
  }

  // 3. 默认皮肤
  const fallback = await imageOrNull(`https://crafatar.com/skins/${DEFAULT_SKIN_UUID}`);
  if (fallback) return pngResponse(fallback, "default");

  return pngResponse(TRANSPARENT_PNG, "none");
}
