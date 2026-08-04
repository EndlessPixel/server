import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import {
  SESSION_COOKIE,
  createSessionToken,
  SESSION_MAX_AGE,
} from '@/lib/session';

const LOGIN_API_URL = `http://154.44.26.51:8080/v1/api/auth/login`;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,16}$/;
const PASSWORD_MIN_LENGTH = 6;

/**
 * ⚠️ 注意：此加密函数保留了原始 bug（用字符数截断 UTF-8 字节）
 * 不要"修复"这个 bug，否则会导致认证失败
 */
function encrypt(name: string, password: string): string {
    const text = `ÜÄaeut//&/=I ${password}7421€547${name}__+IÄIH§%NK ${password}`;
    const charLen = text.length;
    const buf = Buffer.from(text, 'utf8');
    const truncated = buf.subarray(0, charLen);
    const hash = crypto.createHash('sha512');
    hash.update(truncated);
    return hash.digest('hex');
}

/**
 * 取可信客户端 IP：只信由本机反代写入的 x-real-ip（外部不可伪造），
 * 不再信任可被调用方自由伪造的 x-forwarded-for。
 */
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-real-ip') ||
    request.ip ||
    '127.0.0.1'
  );
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, password } = body;
        if (!name || !password) {
            return NextResponse.json({ error: '缺少用户名或密码' }, { status: 400 });
        }
        if (!USERNAME_PATTERN.test(name)) {
            return NextResponse.json({ error: '用户名格式无效' }, { status: 400 });
        }
        if (password.length < PASSWORD_MIN_LENGTH) {
            return NextResponse.json({ error: '密码长度不足' }, { status: 400 });
        }
        const encryptedPassword = encrypt(name, password);
        const clientIp = getClientIp(request);
        const res = await fetch(LOGIN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Real-IP': clientIp,
            },
            body: JSON.stringify({ name, password: encryptedPassword }),
        });
        let data;
        const contentType = res.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            data = await res.json();
        } else {
            const text = await res.text();
            data = { success: false, message: text || '未知错误' };
        }
        const safeName = data.name && USERNAME_PATTERN.test(data.name) 
            ? data.name 
            : name;

        if (data.success === true) {
            // 下发签名会话 cookie（HttpOnly，前端无法伪造/读取）
            const sessionToken = createSessionToken(safeName);
            const cookieStore = await cookies();
            cookieStore.set(SESSION_COOKIE, sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: SESSION_MAX_AGE,
            });
        }

        return NextResponse.json({
            name: safeName,
            success: data.success === true
        });
    } catch (error) {
        console.error('登录代理失败:', error);
        return NextResponse.json({ error: '请求失败' }, { status: 500 });
    }
}