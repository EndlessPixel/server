import { NextRequest, NextResponse } from "next/server";
import { githubFetch, isGitHubApiUrl } from "@/lib/github";

/**
 * GitHub API 代理路由（仅 GET）。
 *
 * 前端需要读取 GitHub 数据时统一走这里，由服务端注入 GH_TOKEN 认证，
 * 避免浏览器暴露 token、CORS 限制以及未鉴权的速率限制。
 *
 * 用法: /api/gh_api?url=https://api.github.com/repos/vercel/next.js
 */
export async function GET(request: NextRequest) {
  const githubUrl = request.nextUrl.searchParams.get("url");

  if (!githubUrl) {
    return NextResponse.json(
      { error: "Missing GitHub API URL. Usage: ?url=https://api.github.com/..." },
      { status: 400 },
    );
  }

  if (!isGitHubApiUrl(githubUrl)) {
    return NextResponse.json(
      { error: "Invalid GitHub API URL. Must start with https://api.github.com/" },
      { status: 400 },
    );
  }

  try {
    const response = await githubFetch(githubUrl, { method: "GET" });
    const data = await response.json();

    // 透传 GitHub 的速率限制信息，便于前端感知配额
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "X-RateLimit-Limit": response.headers.get("X-RateLimit-Limit") || "",
        "X-RateLimit-Remaining": response.headers.get("X-RateLimit-Remaining") || "",
        "X-RateLimit-Reset": response.headers.get("X-RateLimit-Reset") || "",
      },
    });
  } catch (error) {
    // 带上真实原因：开发环境常见 UNABLE_TO_VERIFY_LEAF_SIGNATURE
    // （本机 HTTPS 代理做 TLS 中间人，Node 自带 CA 校验失败），
    // 仅暴露 error.message 便于排查，不回显完整堆栈。
    console.error("GitHub API proxy error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const cause = (error as { cause?: { code?: string } })?.cause?.code;
    return NextResponse.json(
      {
        error: "Failed to fetch GitHub API",
        detail: cause ? `${message} (${cause})` : message,
      },
      { status: 500 },
    );
  }
}
