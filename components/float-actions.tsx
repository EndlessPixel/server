"use client";

import { BackToTop } from '@/components/back-to-top';
import FloatChatButton from '@/components/float-chat-button';
import { useAppearance } from '@/lib/appearance-context';

export default function FloatActions() {
  const { settings } = useAppearance();

  if (!settings.showAIChat && !settings.showBackToTop) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 items-end">
      {settings.showAIChat && <FloatChatButton />}
      {settings.showBackToTop && <BackToTop />}
    </div>
  );
}
