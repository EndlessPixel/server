import { NextResponse } from 'next/server';

const DISCORD_API = 'https://discord.com/api/v10';
const INVITE_CODE = 'k63hRWt3fF';
const CACHE_TTL = 60 * 1000;
let cache: { data: unknown; expires: number } | null = null;

// guild.verification_level 枚举 -> 中文标签
const VERIFICATION_LABELS: Record<number, string> = {
  0: '无限制',
  1: '低风险',
  2: '中等',
  3: '高',
  4: '极高',
  5: '最高',
};

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (cache && cache.expires > Date.now()) {
    return NextResponse.json(cache.data);
  }

  try {
    const res = await fetch(
      `${DISCORD_API}/invites/${encodeURIComponent(INVITE_CODE)}?with_counts=true`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'EndlessPixel-Web/1.0',
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const status = res.status;
      let msg = '获取 Discord 邀请信息失败';
      if (status === 404) msg = '邀请链接无效或已过期';
      else if (status === 429) msg = '请求过于频繁，请稍后再试';
      return NextResponse.json({ error: msg }, { status });
    }

    const data = await res.json();
    const guild = data.guild ?? {};
    if (!guild.id) {
      return NextResponse.json({ error: '这不是服务器邀请链接' }, { status: 400 });
    }

    const iconHash = guild.icon as string | undefined;
    const iconUrl = iconHash
      ? `https://cdn.discordapp.com/icons/${guild.id}/${iconHash}.${iconHash.startsWith('a_') ? 'gif' : 'png'}`
      : null;

    const level = (guild.verification_level ?? 0) as number;
    const payload = {
      name: guild.name ?? null,
      icon: iconUrl,
      description: guild.description ?? null,
      memberCount: data.approximate_member_count ?? 0,
      presenceCount: data.approximate_presence_count ?? 0,
      verificationLevel: {
        value: level,
        label: VERIFICATION_LABELS[level] ?? '未知',
      },
      joinUrl: `https://discord.gg/${INVITE_CODE}`,
    };

    cache = { data: payload, expires: Date.now() + CACHE_TTL };
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: '请求失败' }, { status: 500 });
  }
}
