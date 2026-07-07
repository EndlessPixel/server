import { NextResponse, NextRequest } from 'next/server';

const USER_INFO_API_URL = `${process.env.TARGET_API_URL}:10737/v1/api/users/info`;

export async function GET(request: NextRequest) {
    try {
        // 从 Cookie 中获取用户名（登录时设置的 mc_user）
        const cookie = request.cookies.get('mc_user');
        const name = cookie?.value || request.nextUrl.searchParams.get('name');

        if (!name) {
            return NextResponse.json({ error: '未提供用户名' }, { status: 400 });
        }

        const url = new URL(USER_INFO_API_URL);
        url.searchParams.append('name', name);

        const res = await fetch(url.toString(), {
            headers: {
                'X-Forwarded-For': request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
            },
        });

        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json({ error: data.detail || '获取用户信息失败' }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('用户信息代理失败:', error);
        return NextResponse.json({ error: '请求失败' }, { status: 500 });
    }
}