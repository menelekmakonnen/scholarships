'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, toggleTheme, isReady } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isReady) {
      setMounted(true);
    }
  }, [isReady]);

  if (!mounted) {
    return null;
  }

  const emoji = theme === 'dark' ? '🌙' : '🌞';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Activate light mode' : 'Activate dark mode'}
      className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/80 shadow-lg transition hover:scale-105 hover:shadow-xl dark:border-white/20 dark:bg-white/10"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={emoji}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
          transition={{ duration: 0.3 }}
          className="text-xl"
        >
          {emoji}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
