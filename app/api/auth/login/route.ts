import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';

const LOGIN_API_URL = `${process.env.TARGET_API_URL}:10737/v1/api/auth/login`;

function encrypt(name: string, password: string): string {
    const text = `ÜÄaeut//&/=I ${password}7421€547${name}__+IÄIH§%NK ${password}`;
    // 计算字符长度
    const charLen = text.length;
    // 获取UTF-8字节
    const buf = Buffer.from(text, 'utf8');
    // 截取前charLen个字节（注意charLen是字符数，不是字节数）
    const truncated = buf.subarray(0, charLen);
    const hash = crypto.createHash('sha512');
    hash.update(truncated);
    return hash.digest('hex');
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, password } = body;

        if (!name || !password) {
            return NextResponse.json({ error: '缺少用户名或密码' }, { status: 400 });
        }

        const encryptedPassword = encrypt(name, password);

        const res = await fetch(LOGIN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Forwarded-For': request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
                Referer: '',
                Origin: '',
            },
            body: JSON.stringify({ name, password: encryptedPassword }),
        });

        const data = await res.json();
        // 标准化返回格式
        return NextResponse.json({
            name: data.name || name,
            success: data.success || false
        });
    } catch (error) {
        console.error('登录代理失败:', error);
        return NextResponse.json({ error: '请求失败' }, { status: 500 });
    }
}