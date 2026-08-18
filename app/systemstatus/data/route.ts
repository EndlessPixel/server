import { NextResponse, NextRequest } from 'next/server';

// SystemStatus 后端汇总接口：一次性返回完整快照
// { hardware_info, real_time_data, disk_usage, timestamp }
const TARGET_BASE = `${process.env.TARGET_API_URL}`.replace(/\/$/, '');
const TARGET_API_URL = (TARGET_BASE.includes(':') ? TARGET_BASE : `${TARGET_BASE}:10735`) + '/api/data';

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
