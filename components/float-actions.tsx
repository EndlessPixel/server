"use client";

import { BackToTop } from "@/components/back-to-top";
import FloatChatButton from "@/components/float-chat-button";
import { useAppearance } from "@/lib/appearance-context";

export default function FloatActions() {
  const { settings } = useAppearance();

  if (!settings.showAIChat && !settings.showBackToTop) {
    return null;
  }

  return (
    <div className="fixed right-8 bottom-8 z-50 flex flex-col items-end gap-3">
      {settings.showAIChat && <FloatChatButton />}
      {settings.showBackToTop && <BackToTop />}
    </div>
  );
}
