import { ReactNode } from "react";

// 页面标题组件
interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, className = "", actions }: PageHeaderProps) {
  return (
    <div className={`mb-12 text-center ${className}`}>
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
      {actions && <div className="mt-6 flex justify-center gap-3">{actions}</div>}
    </div>
  );
}

// 内容容器组件
interface ContentContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "default" | "wide" | "narrow";
}

const MAX_WIDTH: Record<NonNullable<ContentContainerProps["maxWidth"]>, string> = {
  default: "max-w-7xl",
  wide: "max-w-[1400px]",
  narrow: "max-w-4xl",
};

export function ContentContainer({
  children,
  className = "",
  maxWidth = "default",
}: ContentContainerProps) {
  return (
    <div className={`${MAX_WIDTH[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
