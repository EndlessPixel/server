import { NextResponse, NextRequest } from 'next/server';

const USER_INFO_API_URL = `${process.env.TARGET_API_URL}:10737/v1/api/users/info`;

// 用户名验证（与登录保持一致）
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,16}$/;

export async function GET(request: NextRequest) {
    try {
        // 修复：严格只从 Cookie 获取用户名，拒绝 URL 参数传入
        const cookie = request.cookies.get('mc_user');
        const name = cookie?.value;

        if (!name) {
            return NextResponse.json(
                { error: '未登录' }, 
                { status: 401 }
            );
        }

        // 修复：验证 Cookie 中的用户名格式，防止伪造/注入
        if (!USERNAME_PATTERN.test(name)) {
            return NextResponse.json(
                { error: '无效的登录状态' }, 
                { status: 400 }
            );
        }

        const url = new URL(USER_INFO_API_URL);
        url.searchParams.append('name', name);

        // 修复：优先使用 x-real-ip（更难伪造），x-forwarded-for 取第一个值
        const clientIp = request.headers.get('x-real-ip') 
            || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
            || '127.0.0.1';

        const res = await fetch(url.toString(), {
            headers: {
                'X-Forwarded-For': clientIp,
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