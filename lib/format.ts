/**
 * 通用格式化工具。
 *
 * 这些函数此前在 github-issues-list / github-issue-detail / repo-info-section
 * 中各自重复实现（口径还不完全一致），现统一收敛到此处，避免继续漂移。
 */

/** 相对时间：刚刚 / N 分钟前 / N 小时前 / N 天前 / N 个月前 / N 年前 */
export function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "刚刚";
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} 天前`;
  const mon = Math.floor(day / 30);
  if (mon < 12) return `${mon} 个月前`;
  return `${Math.floor(mon / 12)} 年前`;
}

/** 根据标签底色选择可读前景色（浅底黑字 / 深底白字） */
export function getContrastColor(hex: string): string {
  const h = hex.length === 6 ? hex : hex.repeat(2);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000 > 128 ? "#000" : "#fff";
}

/** 千分位缩写：1234 -> 1.2k */
export function formatCount(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(n);
}

/** 文件体积：小于 1MB 显示 KB，否则显示 MB */
export function formatSize(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

/** ISO 时间 -> YYYY-MM-DD */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/** 常见语言的品牌色，用于占比条 */
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  CSS: "#663399",
  HTML: "#e34c26",
  Python: "#3572A5",
  Shell: "#89e051",
  Java: "#b07219",
  Rust: "#dea584",
  Go: "#00ADD8",
  Vue: "#41b883",
  Dockerfile: "#384d54",
  Makefile: "#427819",
  Lua: "#000080",
  "C++": "#f34b7d",
  C: "#555555",
};

export const languageColor = (name: string): string => LANGUAGE_COLORS[name] ?? "#8b949e";
