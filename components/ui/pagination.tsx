"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  total: number;
  current: number;
  onPage: (page: number) => void;
  className?: string;
}

/**
 * 通用分页导航。
 * 之前 download-base 与 github-issues-list 各维护了一份实现，现统一到这里。
 */
export function Pagination({ total, current, onPage, className = "" }: PaginationProps) {
  if (total <= 1) return null;

  const delta = 2;
  const left = Math.max(1, current - delta);
  const right = Math.min(total, current + delta);
  const pages: (number | string)[] = [];

  if (left > 1) pages.push(1, "...");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total) pages.push("...", total);

  return (
    <nav
      className={`flex items-center justify-center gap-2 pt-4 ${className}`}
      role="navigation"
      aria-label="分页导航"
    >
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPage(Math.max(1, current - 1))}
        disabled={current === 1}
        aria-label="上一页"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </Button>

      {pages.map((p, i) =>
        typeof p === "number" ? (
          <Button
            key={i}
            size="sm"
            variant={p === current ? "default" : "outline"}
            onClick={() => onPage(p)}
            aria-label={`第 ${p} 页`}
            aria-current={p === current ? "page" : undefined}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            {p}
          </Button>
        ) : (
          <span key={i} className="px-2 text-muted-foreground" aria-hidden="true">
            ...
          </span>
        ),
      )}

      <Button
        size="sm"
        variant="outline"
        onClick={() => onPage(Math.min(total, current + 1))}
        disabled={current === total}
        aria-label="下一页"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </nav>
  );
}
