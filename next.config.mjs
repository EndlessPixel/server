// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,   // 慎用，仅临时绕过类型错误
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;