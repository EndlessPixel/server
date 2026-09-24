import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="flex min-h-screen items-center justify-center">加载中...</div>}
    >
      <LoginContent />
    </Suspense>
  );
}
