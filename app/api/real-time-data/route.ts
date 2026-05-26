import { NextResponse, NextRequest } from 'next/server';

// 从环境变量读取API源地址
// 在这里换成你要代理的真实API地址
const TARGET_API_URL = `${process.env.TARGET_API_URL}` + '/api/real-time-data';

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(TARGET_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
        'Referer': '',
        'Origin': '',
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
