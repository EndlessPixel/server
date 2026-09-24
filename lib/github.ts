/**
 * GitHub API 统一请求 / 数据解析工具。
 *
 * - 服务端调用时自动注入 GH_TOKEN，避免未鉴权导致的速率限制；
 * - 浏览器端统一走 /api/gh_api 代理，绝不接触 token；
 * - Release 的字段映射集中在这里，下载页与整合包页共用同一套口径。
 */

const GITHUB_API_PREFIX = "https://api.github.com/";

/** owner/name 形式的仓库标识 */
export const GITHUB_REPO_PATTERN = /^[\w.-]+\/[\w.-]+$/;

/** 前端使用的 GitHub 代理地址 */
export const GITHUB_PROXY_PATH = "/api/gh_api";

export function isGitHubApiUrl(url: string): boolean {
  return url.startsWith(GITHUB_API_PREFIX);
}

/** 构造 GitHub API 请求头（服务端注入 GH_TOKEN） */
export function githubHeaders(extra?: HeadersInit): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "EndlessPixel-Server",
  };
  const token = process.env.GH_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return { ...headers, ...(extra as Record<string, string> | undefined) };
}

/** 服务端携带 GH_TOKEN 调用 GitHub API */
export function githubFetch(url: string, init: RequestInit = {}): Promise<Response> {
  return fetch(url, { ...init, headers: githubHeaders(init.headers) });
}

/** 构造走本服务代理的 GitHub 请求地址 */
export function githubProxyUrl(target: string): string {
  return `${GITHUB_PROXY_PATH}?url=${encodeURIComponent(target)}`;
}

/* ------------------------------ Release 数据模型 ------------------------------ */

/** GitHub Releases API 返回的原始结构（仅保留用到的字段） */
export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
  prerelease: boolean;
  assets: Array<{
    name: string;
    download_count: number;
    browser_download_url: string;
  }>;
}

export interface ReleaseFile {
  name: string;
  downloadUrl: string;
  downloadCount: number;
}

/** 前端展示用的归一化 Release */
export interface ParsedRelease {
  name: string;
  version: string;
  mcVersion: string;
  releaseDate: string;
  isPrerelease: boolean;
  isLatest: boolean;
  downloadCount: number;
  files: ReleaseFile[];
  changelog: string;
  /** 整合包专用：main / real 分支标记 */
  branch?: "main" | "real";
}

/** 把 GitHub 原始 Release 归一化为前端模型（isLatest 由调用方按需标记） */
export function parseGitHubRelease(r: GitHubRelease): ParsedRelease {
  const files = r.assets.map((a) => ({
    name: a.name,
    downloadUrl: a.browser_download_url,
    downloadCount: a.download_count,
  }));

  return {
    name: r.name || r.tag_name,
    version: r.tag_name,
    mcVersion: r.tag_name.match(/^(\d+\.\d+(\.\d+)?)/)?.[1] ?? "Unknown",
    releaseDate: new Date(r.published_at).toLocaleDateString("zh-CN"),
    isPrerelease: r.prerelease,
    isLatest: false,
    downloadCount: files.reduce((sum, f) => sum + f.downloadCount, 0),
    files,
    changelog: r.body || "暂无更新日志。",
  };
}
