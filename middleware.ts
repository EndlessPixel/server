import { NextResponse, NextRequest } from "next/server";

const STATISTICS_API = "http://45.205.31.33:6000/api/stats";

async function reportStatistics(request: NextRequest) {
  try {
    const serverTime = Math.floor(Date.now() / 1000);
    
    await fetch(STATISTICS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: request.url,
        path: request.nextUrl.pathname,
        client_time: serverTime,
        server_time: serverTime,
      }),
      cache: "no-cache",
      keepalive: true,
    });
  } catch {
    // 上报失败不影响主业务
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path.startsWith("/_next/") || path.startsWith("/favicon.ico") || path.startsWith("/fonts/") || path.startsWith("/images/")) {
    return NextResponse.next();
  }
  
  await reportStatistics(request);
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/|favicon.ico|fonts/|images/).*)", "/api/:path*"],
};