import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/session';

export async function POST() {
  const cookieStore = await cookies();
  // 清除 HttpOnly 签名会话 cookie（前端 JS 无法删除 HttpOnly cookie）
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ success: true });
}
