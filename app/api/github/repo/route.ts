import { NextRequest, NextResponse } from "next/server";

/**
 * GitHub 仓库信息代理：预取仓库元数据（star、fork、描述、语言等）。
 * 用法: /api/github/repo?repo=owner/name
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

    const githubUrl = `https://api.github.com/repos/${repo}`;
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
          ? "仓库不存在"
          : response.status === 403
            ? "GitHub API 速率限制或无权访问"
            : `GitHub API 返回 ${response.status}`;
      return NextResponse.json(
        { error: message, status: response.status },
        { status: response.status === 404 ? 404 : 502 },
      );
    }

    const d = await response.json();
    return NextResponse.json(
      {
        full_name: d.full_name,
        owner: d.owner?.login,
        owner_avatar: d.owner?.avatar_url,
        description: d.description,
        html_url: d.html_url,
        homepage: d.homepage || null,
        language: d.language || null,
        stargazers_count: d.stargazers_count ?? 0,
        forks_count: d.forks_count ?? 0,
        watchers_count: d.watchers_count ?? 0,
        open_issues_count: d.open_issues_count ?? 0,
        default_branch: d.default_branch,
        license: d.license?.spdx_id && d.license.spdx_id !== "NOASSERTION"
          ? d.license.spdx_id
          : null,
        topics: Array.isArray(d.topics) ? d.topics : [],
        archived: Boolean(d.archived),
        updated_at: d.updated_at,
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
    console.error("GitHub repo proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub repo" },
      { status: 500 },
    );
  }
}
