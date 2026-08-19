import { NextRequest, NextResponse } from "next/server";

/**
 * GitHub 最新 Release 代理：预取仓库最新发布版本信息。
 * 用法: /api/github/release?repo=owner/name
 * 服务端携带 GH_TOKEN 调用 GitHub API，避免前端暴露 token / CORS / 速率限制。
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const repo = searchParams.get("repo");

    if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) {
      return NextResponse.json(
        { error: "Missing or invalid repo. Usage: ?repo=owner/name" },
        { status: 400 },
      );
    }

    const githubUrl = `https://api.github.com/repos/${repo}/releases/latest`;
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "User-Agent": "EndlessPixel-Server",
    };
    const ghToken = process.env.GH_TOKEN;
    if (ghToken) {
      headers["Authorization"] = `Bearer ${ghToken}`;
    }

    const response = await fetch(githubUrl, { method: "GET", headers });
    if (!response.ok) {
      const message =
        response.status === 404
          ? "仓库或 Release 不存在"
          : response.status === 403
            ? "GitHub API 速率限制或无权访问"
            : `GitHub API 返回 ${response.status}`;
      return NextResponse.json(
        { error: message, status: response.status },
        { status: response.status === 404 ? 404 : 502 },
      );
    }

    const d = await response.json();
    const assets = Array.isArray(d.assets)
      ? d.assets.map((a: { name?: string; browser_download_url?: string; size?: number }) => ({
          name: a.name || "",
          url: a.browser_download_url || "",
          size: a.size ?? 0,
        }))
      : [];

    return NextResponse.json(
      {
        tag_name: d.tag_name || "",
        name: d.name || d.tag_name || "",
        html_url: d.html_url || "",
        published_at: d.published_at || null,
        prerelease: Boolean(d.prerelease),
        draft: Boolean(d.draft),
        body: typeof d.body === "string" ? d.body : "",
        assets,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300",
          "X-RateLimit-Remaining":
            response.headers.get("X-RateLimit-Remaining") || "",
        },
      },
    );
  } catch (error) {
    console.error("GitHub release proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub release" },
      { status: 500 },
    );
  }
}
