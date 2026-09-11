const DISCORD_API = 'https://discord.com/api/v10';
export const DISCORD_INVITE_CODE = 'k63hRWt3fF';

export type DiscordInvite = {
  guildId: string;
  guildName: string | null;
  iconHash: string | null;
  description: string | null;
  memberCount: number;
  presenceCount: number;
  verificationLevel: { value: number; label: string };
  joinUrl: string;
};

// guild.verification_level 枚举 -> 中文标签
const VERIFICATION_LABELS: Record<number, string> = {
  0: '无限制',
  1: '低风险',
  2: '中等',
  3: '高',
  4: '极高',
  5: '最高',
};

export function iconExtension(iconHash: string): 'gif' | 'png' {
  return iconHash.startsWith('a_') ? 'gif' : 'png';
}

export function iconCdnUrl(guildId: string, iconHash: string): string {
  return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.${iconExtension(iconHash)}`;
}

const CACHE_TTL = 60 * 1000;
let cache: { data: DiscordInvite | null; error: string | null; expires: number } | null = null;

/**
 * 服务端获取 Discord 邀请信息（含 guild 图标 hash）。
 * 走服务端代理，避免在前端暴露 token 且能正常访问 Discord API。
 * 结果缓存 60s，供 /api/discord/invite 与 /api/discord/icon 复用。
 */
export async function getDiscordInvite(): Promise<{
  data: DiscordInvite | null;
  error: string | null;
}> {
  if (cache && cache.expires > Date.now()) {
    return { data: cache.data, error: cache.error };
  }

  try {
    const res = await fetch(
      `${DISCORD_API}/invites/${encodeURIComponent(DISCORD_INVITE_CODE)}?with_counts=true`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'EndlessPixel-Web/1.0',
        },
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      const status = res.status;
      let msg = '获取 Discord 邀请信息失败';
      if (status === 404) msg = '邀请链接无效或已过期';
      else if (status === 429) msg = '请求过于频繁，请稍后再试';
      cache = { data: null, error: msg, expires: Date.now() + CACHE_TTL };
      return { data: null, error: msg };
    }

    const data = await res.json();
    const guild = data.guild ?? {};
    if (!guild.id) {
      const msg = '这不是服务器邀请链接';
      cache = { data: null, error: msg, expires: Date.now() + CACHE_TTL };
      return { data: null, error: msg };
    }

    const level = (guild.verification_level ?? 0) as number;
    const result: DiscordInvite = {
      guildId: guild.id,
      guildName: guild.name ?? null,
      iconHash: (guild.icon as string | undefined) ?? null,
      description: guild.description ?? null,
      memberCount: data.approximate_member_count ?? 0,
      presenceCount: data.approximate_presence_count ?? 0,
      verificationLevel: {
        value: level,
        label: VERIFICATION_LABELS[level] ?? '未知',
      },
      joinUrl: `https://discord.gg/${DISCORD_INVITE_CODE}`,
    };
    cache = { data: result, error: null, expires: Date.now() + CACHE_TTL };
    return { data: result, error: null };
  } catch {
    cache = { data: null, error: '请求失败', expires: Date.now() + CACHE_TTL };
    return { data: null, error: '请求失败' };
  }
}
