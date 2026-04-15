import { BackToTop } from '@/components/back-to-top';
import FloatChatButton from '@/components/float-chat-button';

export default function FloatActions() {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
      <FloatChatButton />
      <BackToTop />
    </div>
  );
}