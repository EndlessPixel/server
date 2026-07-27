import { ReactNode } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  background?: "default" | "gradient" | "solid";
}

// 页面布局包装组件 - 极简黑白版
export function PageLayout({
  children,
  className = "",
  background = "default",
}: PageLayoutProps) {
  const bgClasses = {
    default: "bg-background",
    gradient: "bg-background",
    solid: "bg-background",
  };

  return (
    <div className={`min-h-screen ${bgClasses[background]} ${className}`}>
      <Navigation />
      <main className="py-8">{children}</main>
      <Footer />
    </div>
  );
}

// 页面标题组件 - 极简黑白版
interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  gradient?: "default" | "blue" | "purple" | "cyan";
}

export function PageHeader({
  title,
  description,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

// 内容容器组件
interface ContentContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "default" | "wide" | "narrow";
}

export function ContentContainer({
  children,
  className = "",
  maxWidth = "default",
}: ContentContainerProps) {
  const maxWClasses = {
    default: "max-w-7xl",
    wide: "max-w-[1400px]",
    narrow: "max-w-4xl",
  };

  return (
    <div
      className={`${maxWClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}
