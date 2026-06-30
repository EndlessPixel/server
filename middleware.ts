import { NextResponse, NextRequest } from "next/server";

const STATISTICS_API = "http://45.205.31.33:6000/api/statistics";

async function reportStatistics(url: string, path: string) {
  try {
    const serverTime = Math.floor(Date.now() / 1000);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    await fetch(STATISTICS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        path,
        client_time: serverTime,
        server_time: serverTime,
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
  } catch {
    // 上报失败不影响主业务
  }
}

export async function middleware(request: NextRequest) {
  const url = request.url;
  const path = request.nextUrl.pathname;
  
  if (path.startsWith("/_next/") || path.startsWith("/favicon.ico") || path.startsWith("/fonts/") || path.startsWith("/images/")) {
    return NextResponse.next();
  }
  
  reportStatistics(url, path);
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/|favicon.ico|fonts/|images/).*)", "/api/:path*"],
};