import { NextRequest, NextResponse } from "next/server";

const STATISTICS_API = "http://45.205.31.33:6000/api/stats";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(STATISTICS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": request.headers.get("x-forwarded-for") || "",
        "x-real-ip": request.headers.get("x-real-ip") || "",
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ code: -1, msg: "上报失败" });
  }
}