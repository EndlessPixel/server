import { NextRequest, NextResponse } from 'next/server';

const data = {
    server: "EndlessPixel Server",
    code: 418,
    message: "I'm a teapot",
    meg2: "Only EndlessPixel can do.",
    time: new Date().toISOString()
};

export async function GET() {
    return NextResponse.json(data);
}

export async function POST() {
    return NextResponse.json(data);
}