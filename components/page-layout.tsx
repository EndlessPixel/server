import { ReactNode } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  background?: "default" | "gradient" | "solid";
}

// 页面布局包装组件 - 统一页面结构
export function PageLayout({
  children,
  className = "",
  background = "gradient",
}: PageLayoutProps) {
  const bgClasses = {
    default: "bg-background",
    gradient:
      "bg-linear-to-r from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-cyan-950/20",
    solid: "bg-slate-50 dark:bg-slate-900",
  };

  return (
    <div className={`min-h-screen ${bgClasses[background]} ${className}`}>
      <Navigation />
      <main className="py-8">{children}</main>
      <Footer />
    </div>
  );
}

// 页面标题组件
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
  gradient = "default",
}: PageHeaderProps) {
  const gradientClasses = {
    default:
      "from-slate-900 via-blue-700 to-cyan-600 dark:from-slate-100 dark:via-blue-400 dark:to-cyan-400",
    blue: "from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400",
    purple: "from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400",
    cyan: "from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-400",
  };

  return (
    <div className={`text-center mb-12 ${className}`}>
      <h1
        className={`text-4xl md:text-5xl font-bold bg-linear-to-r ${gradientClasses[gradient]} bg-clip-text text-transparent mb-6`}
      >
        {title}
      </h1>
      {description && (
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
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
