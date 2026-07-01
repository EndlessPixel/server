import { NextRequest, NextResponse } from "next/server";
import http from "http";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") ||
      "";

    const postData = JSON.stringify({ ...body, ip });

    const response = await new Promise<{ status: number; data: any }>((resolve) => {
      const req = http.request(
        {
          hostname: "45.205.31.33",
          port: 6000,
          path: "/api/stats",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData),
          },
          timeout: 5000,
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            try {
              resolve({ status: res.statusCode || 500, data: JSON.parse(data) });
            } catch {
              resolve({ status: res.statusCode || 500, data: { code: -1, msg: "响应解析失败" } });
            }
          });
        }
      );

      req.on("error", () => {
        resolve({ status: 500, data: { code: -1, msg: "上报失败" } });
      });

      req.on("timeout", () => {
        req.destroy();
        resolve({ status: 504, data: { code: -1, msg: "请求超时" } });
      });

      req.write(postData);
      req.end();
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("Stats proxy error:", error);
    return NextResponse.json({ code: -1, msg: "上报失败" });
  }
}