// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,   // 慎用，仅临时绕过类型错误
  },
  images: {
    unoptimized: true, // 临时禁用图片优化，待修复后删除
  },
};

export default nextConfig; // 导出