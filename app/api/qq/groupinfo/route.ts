import { NextResponse, NextRequest } from 'next/server';

// 目标 API（EndlessPixel 官方 Wiki 接口，返回完整群信息）
const TARGET_API_URL = 'https://www.endlesspixel.cn/api/qq/groupinfo';

export async function GET(request: NextRequest) {
  try {
    // 获取用户真实 IP（透传计费）
    const realIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

    const res = await fetch(TARGET_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': realIp,
        'Referer': '',
        'Origin': ''
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: '请求失败' },
      { status: 500 }
    );
  }
}