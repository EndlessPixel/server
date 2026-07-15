// app/api/gh_api/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * GitHub API 代理路由
 * 支持环境变量 GH_TOKEN 进行认证
 * 用法: /api/gh_api?url=https://api.github.com/...
 * 例如: /api/gh_api?url=https://api.github.com/repos/vercel/next.js
 */
export async function GET(request: NextRequest) {
  try {
    // 从查询参数中获取 GitHub API URL
    const searchParams = request.nextUrl.searchParams;
    const githubUrl = searchParams.get('url');
    
    if (!githubUrl) {
      return NextResponse.json(
        { error: 'Missing GitHub API URL. Usage: ?url=https://api.github.com/...' },
        { status: 400 }
      );
    }

    // 验证 URL 是否为 GitHub API
    if (!githubUrl.startsWith('https://api.github.com/')) {
      return NextResponse.json(
        { error: 'Invalid GitHub API URL. Must start with https://api.github.com/' },
        { status: 400 }
      );
    }

    // 准备请求头
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Next.js-GitHub-Proxy',
    };

    // 如果有 GH_TOKEN 环境变量，添加认证头
    const ghToken = process.env.GH_TOKEN;
    if (ghToken) {
      headers['Authorization'] = `Bearer ${ghToken}`;
    }

    // 发起请求到 GitHub API
    const response = await fetch(githubUrl, {
      method: 'GET',
      headers,
    });

    // 获取响应数据
    const data = await response.json();

    // 返回响应，包含速率限制信息
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'X-RateLimit-Limit': response.headers.get('X-RateLimit-Limit') || '',
        'X-RateLimit-Remaining': response.headers.get('X-RateLimit-Remaining') || '',
        'X-RateLimit-Reset': response.headers.get('X-RateLimit-Reset') || '',
      },
    });

  } catch (error) {
    console.error('GitHub API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub API' },
      { status: 500 }
    );
  }
}

/**
 * 支持 POST 请求
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const githubUrl = searchParams.get('url');
    
    if (!githubUrl) {
      return NextResponse.json(
        { error: 'Missing GitHub API URL. Usage: ?url=https://api.github.com/...' },
        { status: 400 }
      );
    }

    if (!githubUrl.startsWith('https://api.github.com/')) {
      return NextResponse.json(
        { error: 'Invalid GitHub API URL. Must start with https://api.github.com/' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Next.js-GitHub-Proxy',
      'Content-Type': 'application/json',
    };

    const ghToken = process.env.GH_TOKEN;
    if (ghToken) {
      headers['Authorization'] = `Bearer ${ghToken}`;
    }

    const response = await fetch(githubUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });

  } catch (error) {
    console.error('GitHub API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub API' },
      { status: 500 }
    );
  }
}

/**
 * 支持其他 HTTP 方法
 */
export async function PATCH(request: NextRequest) {
  return handleWithBody(request, 'PATCH');
}

export async function PUT(request: NextRequest) {
  return handleWithBody(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleWithBody(request, 'DELETE');
}

async function handleWithBody(request: NextRequest, method: string) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const githubUrl = searchParams.get('url');
    
    if (!githubUrl) {
      return NextResponse.json(
        { error: 'Missing GitHub API URL' },
        { status: 400 }
      );
    }

    if (!githubUrl.startsWith('https://api.github.com/')) {
      return NextResponse.json(
        { error: 'Invalid GitHub API URL' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Next.js-GitHub-Proxy',
      'Content-Type': 'application/json',
    };

    const ghToken = process.env.GH_TOKEN;
    if (ghToken) {
      headers['Authorization'] = `Bearer ${ghToken}`;
    }

    const response = await fetch(githubUrl, {
      method,
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });

  } catch (error) {
    console.error('GitHub API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub API' },
      { status: 500 }
    );
  }
}