'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import EPBot from './epbot';

export function FloatChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-3"
          >
            <EPBot />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'h-16 w-16 rounded-full shadow-xl flex items-center justify-center',
          'bg-linear-to-r from-purple-600 to-pink-600 text-white',
          'hover:from-purple-700 hover:to-pink-700 border border-white/20'
        )}
      >
        <MessageCircle className="h-7 w-7" />
      </motion.button>
    </div>
  );
}

export default FloatChatButton;