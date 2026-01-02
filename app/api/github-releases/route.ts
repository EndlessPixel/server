// app/api/github-releases/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log('开始请求GitHub API...'); // 新增日志

        const res = await fetch('https://gh-proxy.com/https://api.github.com/repos/EndlessPixel/EndlessPixel-Modpack/releases?per_page=200', {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Next.js Server Side Request', // 新增：必须加User-Agent，否则GitHub会拒绝
            },
            next: { revalidate: 300 },
        });

        console.log('GitHub API响应状态:', res.status); // 新增日志

        if (!res.ok) {
            const errorText = await res.text();
            console.error('GitHub API返回错误:', res.status, errorText); // 新增日志
            return NextResponse.json(
                { error: `GitHub API请求失败: ${res.status} - ${errorText}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        console.log('GitHub API返回数据条数:', data.length); // 新增日志
        return NextResponse.json(data);
    } catch (err) {
        console.error('GitHub API代理失败（详细错误）:', err); // 新增：打印完整错误
        return NextResponse.json(
            { error: `服务器内部错误：${err instanceof Error ? err.message : '未知错误'}`, detail: JSON.stringify(err) },
            { status: 500 }
        );
    }
}