import { NextResponse } from 'next/server';
import { getDiscordInvite } from '@/lib/discord';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await getDiscordInvite();
  if (error || !data) {
    return NextResponse.json(
      { error: error ?? '获取失败' },
      { status: 502 },
    );
  }

  return NextResponse.json({
    name: data.guildName,
    // 图标改为同源代理，避免前端直连被墙的 cdn.discordapp.com
    icon: data.iconHash ? '/api/discord/icon' : null,
    description: data.description,
    memberCount: data.memberCount,
    presenceCount: data.presenceCount,
    verificationLevel: data.verificationLevel,
    joinUrl: data.joinUrl,
  });
}
