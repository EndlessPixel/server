import { NextRequest } from 'next/server';

// 服务端代理 Minecraft 皮肤图片，规避浏览器跨域（CORS）限制。
// skinview3d 加载皮肤时强制 crossOrigin="anonymous"，第三方皮肤源
// （mc-heads / crafatar）不一定返回 CORS 头，会导致图片加载失败并
// 抛出 [object Event] 运行时错误。改为同源代理后彻底消除该问题。
//
// 关键容错：crafatar 对部分 UUID 会偶发 500/404（服务端异常或无皮肤）。
// 若直接把上游错误状态码透传给浏览器，skinview3d 加载失败会再次抛出
// [object Event] 导致预览崩溃。因此上游异常时一律回退到默认皮肤图，
// 保证始终返回 200 + 合法 PNG，让预览永不崩。
// 默认皮肤使用 Mojang 官方 Steve 的 UUID（该资源始终存在）。
const DEFAULT_SKIN_UUID = '069a79f444e94726a5befca90e38aaf5';

export async function GET(req: NextRequest) {
  const uuid = req.nextUrl.searchParams.get('uuid') || '';
  // 仅允许 32 位 hex（允许带连字符）
  const clean = uuid.replace(/-/g, '');
  if (!/^[0-9a-fA-F]{32}$/.test(clean)) {
    return new Response('Invalid uuid', { status: 400 });
  }

  const upstream = `https://crafatar.com/skins/${clean}`;

  const tryFetch = async (url: string) => {
    try {
      return await fetch(url, { cache: 'no-store' });
    } catch {
      return null;
    }
  };

  // 先尝试玩家皮肤，失败（含 5xx/404）则回退到默认皮肤
  let upstreamRes = await tryFetch(upstream);
  if (!upstreamRes || !upstreamRes.ok) {
    upstreamRes = await tryFetch(
      `https://crafatar.com/skins/${DEFAULT_SKIN_UUID}`,
    );
  }

  if (!upstreamRes || !upstreamRes.ok) {
    // 连默认皮肤都拿不到（crafatar 整体故障），返回一张透明的 1x1 PNG，
    // 仍是合法 image/png，避免 skinview3d 抛出 [object Event]。
    const transparentPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64',
    );
    return new Response(transparentPng, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }

  const buf = await upstreamRes.arrayBuffer();
  return new Response(buf, {
    status: 200,
    headers: {
      'Content-Type': upstreamRes.headers.get('content-type') || 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
