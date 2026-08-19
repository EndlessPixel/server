// 镜像服务配置：GitHub 文件加速下载镜像列表。
// 所有下载页面（整合包、启动器）共用此处的镜像定义，便于统一维护。

export interface MirrorConfig {
  tag: string;
  url: string;
  tip: string;
  recommended?: boolean;
}

// 默认镜像配置（GitHub 文件加速下载）
export const DEFAULT_MIRRORS: MirrorConfig[] = [
  {
    tag: "Cloudflare",
    url: "https://gh-proxy.org/",
    tip: "推荐",
    recommended: true,
  },
  {
    tag: "Fastly",
    url: "https://cdn.gh-proxy.org/",
    tip: "推荐",
    recommended: true,
  },
  {
    tag: "Edgeone",
    url: "https://edgeone.gh-proxy.org/",
    tip: "推荐",
    recommended: true,
  },
  { tag: "Jasonzeng", url: "https://gh.xmly.dev/", tip: "大文件慎用" },
  { tag: "香港", url: "https://hk.gh-proxy.org/", tip: "香港节点" },
];

// MirrorFooter 默认展示的镜像域名（仅用于说明文案）
export const DEFAULT_MIRROR_DOMAINS: string[] = [
  "gh-proxy.org",
  "gh.xmly.dev",
];
