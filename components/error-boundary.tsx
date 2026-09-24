"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[v0] Error caught by boundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="flex min-h-100 flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="mb-4 h-16 w-16 text-destructive" />
          <h2 className="mb-2 text-2xl font-bold">出现了一些问题</h2>
          <p className="mb-6 max-w-md text-muted-foreground">
            页面遇到了意外错误。请尝试刷新页面，如果问题持续存在，请联系管理员。
          </p>
          <div className="flex gap-4">
            <Button onClick={this.resetError} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              重试
            </Button>
            <Button onClick={() => window.location.reload()}>刷新页面</Button>
          </div>
          {this.state.error && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground">错误详情</summary>
              <pre className="mt-2 max-w-md overflow-auto rounded-md bg-muted p-4 text-xs">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
