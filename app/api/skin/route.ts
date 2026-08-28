import { NextRequest } from 'next/server';

// 服务端代理 Minecraft 皮肤图片，规避浏览器跨域（CORS）限制。
// skinview3d 加载皮肤时强制 crossOrigin="anonymous"，第三方皮肤源
// （mc-heads / crafatar）不一定返回 CORS 头，会导致图片加载失败并
// 抛出 [object Event] 运行时错误。改为同源代理后彻底消除该问题。
export async function GET(req: NextRequest) {
  const uuid = req.nextUrl.searchParams.get('uuid') || '';
  // 仅允许 32 位 hex（允许带连字符）
  const clean = uuid.replace(/-/g, '');
  if (!/^[0-9a-fA-F]{32}$/.test(clean)) {
    return new Response('Invalid uuid', { status: 400 });
  }

  const upstream = `https://crafatar.com/skins/${clean}`;
  try {
    const upstreamRes = await fetch(upstream, { cache: 'no-store' });
    if (!upstreamRes.ok) {
      return new Response('Skin not found', { status: upstreamRes.status });
    }
    const buf = await upstreamRes.arrayBuffer();
    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Type': upstreamRes.headers.get('content-type') || 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return new Response('Fetch skin failed', { status: 502 });
  }
}
