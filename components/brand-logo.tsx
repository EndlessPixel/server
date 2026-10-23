import Image from "next/image";
import { BRAND_ASSETS, BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * 品牌标识组件（全站唯一入口）。
 *
 * 两种形态：
 * - `variant="wordmark"`：横向字标图，用于导航栏等需要品牌名的位置
 * - `variant="mark"`（默认）：方形图标，可用 children 搭配品牌文字
 *
 * 图标路径全部来自 `lib/brand.ts`，不要在调用方再写死 `/favicon.ico` 之类的字符串。
 */
export function BrandLogo({
  variant = "mark",
  className,
  children,
}: {
  variant?: "mark" | "wordmark";
  className?: string;
  children?: React.ReactNode;
}) {
  if (variant === "wordmark") {
    return (
      <img
        src={BRAND_ASSETS.logo}
        alt={`${BRAND_NAME} Logo`}
        className={cn("h-8 w-64 object-contain", className)}
      />
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src={BRAND_ASSETS.faviconIco}
        alt={BRAND_NAME}
        width={48}
        height={48}
        className="rounded-xl"
      />
      {children}
    </div>
  );
}
