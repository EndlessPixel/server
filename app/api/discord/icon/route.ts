import { NextResponse } from 'next/server';
import { getDiscordInvite, iconCdnUrl } from '@/lib/discord';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Discord 服务器图标代理：由服务端去拉 cdn.discordapp.com 的图标，
 * 再原样返回给前端。这样浏览器只请求同源地址，规避国内直连 Discord CDN 失败的问题。
 */
export async function GET() {
  const { data } = await getDiscordInvite();
  if (!data || !data.iconHash) {
    return new NextResponse('No icon', { status: 404 });
  }

  const url = iconCdnUrl(data.guildId, data.iconHash);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'EndlessPixel-Web/1.0' },
      cache: 'no-store',
    });
    if (!res.ok) {
      return new NextResponse('Fetch icon failed', { status: 502 });
    }

    const buf = Buffer.from(await res.arrayBuffer());
    const contentType =
      res.headers.get('content-type') ?? (url.endsWith('.gif') ? 'image/gif' : 'image/png');

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // 浏览器/CDN 缓存 1 小时，减少重复回源
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch {
    return new NextResponse('Fetch icon failed', { status: 502 });
  }
}
