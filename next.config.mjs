// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    // 异步 headers 配置
    async headers() {
        return [
            {
                source: '/:path*', // 匹配所有路径
                headers: [
                    // ✅ CSP 策略（替代 HTML 中的 meta 标签）
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "img-src 'self' data: https:",
                            // 添加 Cloudflare Insights 到 script-src
                            "script-src 'self' 'unsafe-inline' https://discord.com https://www.googletagmanager.com https://static.cloudflareinsights.com",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com",
                            // 添加 Cloudflare Insights 到 connect-src（用于发送分析数据）
                            "connect-src 'self' https://discord.com https://*.vercel.app https://api.github.com https://avatars.githubusercontent.com https://api.mcsrvstat.us https://cloudflareinsights.com",
                            "object-src 'none'",
                            "frame-src 'self' https://docs.qq.com",
                            "base-uri 'self'",
                            "form-action 'self'"
                        ].join('; ')
                    },
                    // ✅ X-Frame-Options（替代无效的 meta 标签）
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    // ✅ X-Content-Type-Options
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    // 可选：其他安全头
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()'
                    }
                ]
            }
        ];
    },

    // 图片域名配置（如果使用 next/image）
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com'
            },
            {
                protocol: 'https',
                hostname: '*.vercel.app'
            }
        ]
    },

    // 可选：React 严格模式
    reactStrictMode: true,
};

export default nextConfig;