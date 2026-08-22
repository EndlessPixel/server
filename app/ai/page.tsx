"use client";

import { useRouter } from "next/navigation";
import EPBotChat from "@/components/epbot-chat";

export default function AiPage() {
  const router = useRouter();
  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <EPBotChat isOpen={true} onClose={() => router.back()} />
    </div>
  );
}
