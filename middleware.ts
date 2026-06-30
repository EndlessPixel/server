import { NextResponse, NextRequest } from "next/server";

const STATISTICS_API = "http://45.205.31.33:5000/api/statistics";

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
         request.headers.get("x-real-ip") ||
         "127.0.0.1";
}

async function reportStatistics(request: NextRequest) {
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
        ip: getClientIp(request),
        url: request.url,
        path: request.nextUrl.pathname,
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
  const path = request.nextUrl.pathname;
  
  if (path.startsWith("/_next/") || path.startsWith("/favicon.ico") || path.startsWith("/fonts/") || path.startsWith("/images/")) {
    return NextResponse.next();
  }
  
  reportStatistics(request);
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/|favicon.ico|fonts/|images/).*)", "/api/:path*"],
};