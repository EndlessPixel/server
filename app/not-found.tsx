"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "404-hide-scrollbar";
    style.textContent = `
      html, body {
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const ele = document.getElementById("404-hide-scrollbar");
      if (ele) ele.remove();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-3 text-center">
      <h1 className="mb-2 text-7xl font-extrabold tracking-tight text-foreground">404 Not Found</h1>
      <p className="mt-2 mb-8 max-w-md text-2xl text-foreground/70">哎呀，页面走丢了！</p>
      <p className="mb-8 max-w-md text-muted-foreground">
        我们找不到您请求的页面。可能是链接有误，或者页面已被移除。
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          asChild
          variant="default"
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary-hover"
        >
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    </div>
  );
}
