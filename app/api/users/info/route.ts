import { NextResponse, NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session';

const USER_INFO_API_URL = `http://154.44.26.51:8080/v1/api/users/info`;

export async function GET(request: NextRequest) {
    try {
        // 鉴权只认服务端签名的会话 cookie；明文 mc_user 仅前端显示用，不可作为凭证
        const token = request.cookies.get(SESSION_COOKIE)?.value;
        const name = verifySessionToken(token);

        if (!name) {
            return NextResponse.json(
                { error: '未登录或登录已失效' },
                { status: 401 }
            );
        }

        const url = new URL(USER_INFO_API_URL);
        url.searchParams.append('name', name);

        // IP 来源只信由本机反代写入的 x-real-ip（外部不可伪造）
        const clientIp =
            request.headers.get('x-real-ip') || request.ip || '127.0.0.1';

        const res = await fetch(url.toString(), {
            headers: {
                'X-Real-IP': clientIp,
            },
        });

        // 修复：安全解析响应，防止非 JSON 崩溃
        let data;
        const contentType = res.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            data = await res.json();
        } else {
            throw new Error('后端返回非 JSON 响应');
        }

        if (!res.ok) {
            // 修复：不直接透传后端错误，防止信息泄露
            return NextResponse.json(
                { error: '获取用户信息失败' }, 
                { status: res.status }
            );
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('用户信息代理失败:', error);
        return NextResponse.json(
            { error: '请求失败，请稍后重试' }, 
            { status: 500 }
        );
    }
}