'use client';

import { useEffect, useState } from 'react';
import { IconArrowDownCircle, IconArrowUpCircle } from './icons';

export function ScrollControls() {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;
      const canScroll = scrollHeight > innerHeight * 1.1;
      setShowTop(canScroll && scrollY > innerHeight * 0.5);
      setShowBottom(canScroll && scrollY < scrollHeight - innerHeight * 1.15);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col items-center gap-3 sm:right-6">
      {showBottom && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="rounded-full border border-black/10 bg-white/80 p-2 text-luxe-ebony shadow-lg transition hover:translate-y-0.5 hover:shadow-xl dark:border-white/20 dark:bg-white/10 dark:text-luxe-ivory"
          aria-label="Skip to bottom"
        >
          <IconArrowDownCircle className="h-9 w-9" />
        </button>
      )}
      {showTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="rounded-full border border-black/10 bg-white/80 p-2 text-luxe-ebony shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/20 dark:bg-white/10 dark:text-luxe-ivory"
          aria-label="Back to top"
        >
          <IconArrowUpCircle className="h-9 w-9" />
        </button>
      )}
    </div>
  );
}
