'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/navigation';

export default function NotFound() {
  useEffect(() => {
    // 创建样式标签
    const style = document.createElement('style');
    style.id = '404-hide-scrollbar';
    style.textContent = `
      html, body {
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // 移除样式标签
      const ele = document.getElementById('404-hide-scrollbar');
      if (ele) ele.remove();
    };
  }, []);

  return (
    <>
      <Navigation />
      <div className="flex flex-col items-center justify-center min-h-screen p-3 text-center bg-linear-to-b from-sky-50 to-sky-100 dark:from-slate-900 dark:to-slate-800">
        <h1 className="text-7xl font-extrabold tracking-tight text-sky-900 dark:text-sky-300 mb-2">404 Not Found</h1>
        <p className="mt-2 text-2xl text-sky-700 dark:text-sky-400 max-w-md mb-8">哎呀，页面走丢了！</p>
        <p className="text-sky-600 dark:text-sky-500 mb-8 max-w-md">我们找不到您请求的页面。可能是链接有误，或者页面已被移除。</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild variant="default" size="lg" className="bg-sky-600 hover:bg-sky-700 text-white">
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </div>
    </>
  );
}