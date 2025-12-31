import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip');

    if (!ip) {
        return NextResponse.json({ error: 'Missing IP parameter' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://api.mcsrvstat.us/3/${ip}`, {
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy request failed:', error);
        return NextResponse.json({ error: 'Failed to fetch server data' }, { status: 500 });
    }
}