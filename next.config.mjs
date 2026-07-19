/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src 'self' data: https:",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://assets.mcasset.cloud https://api.github.com https://avatars.githubusercontent.com https://api.mcsrvstat.us https://uapis.cn https://raw.githubusercontent.com https://gh-proxy.org https://cdn.gh-proxy.org https://edgeone.gh-proxy.org https://hk.gh-proxy.org https://gh.xmly.dev https://fastly.jsdelivr.net https://gcore.jsdelivr.net https://q.qlogo.cn/",
              "object-src 'none'",
              "frame-src 'self' https://player.bilibili.com",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.vercel.app",
      },
      // 允许你的自定义CDN图片
      {
        protocol: "http",
        hostname: "45.205.31.33",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "82.152.64.152",
        port: "8080",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
