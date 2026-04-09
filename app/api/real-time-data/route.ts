import { NextResponse } from 'next/server';

// 在这里换成你要代理的真实API地址
const TARGET_API_URL = 'https://project-ic83o.vercel.app/api/real-time-data';

export async function GET() {
  try {
    const res = await fetch(TARGET_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
