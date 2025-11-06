'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { IconArrowLeft, IconArrowRight, IconLink, IconXMark } from './icons';
import type { ScholarshipDetail, ScholarshipPreview } from '@/lib/types';
import { buildScholarshipExcerpt, buildScholarshipImageAlt } from '@/lib/presenters';
import { formatDistanceStrict } from 'date-fns';

interface ScholarshipModalProps {
  open: boolean;
  onClose: () => void;
  scholarship: ScholarshipPreview | null;
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) {
    throw new Error('Failed to fetch scholarship');
  }
  return res.json();
});

function useCountdown(targetDate: string | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetDate) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return useMemo(() => {
    if (!targetDate) return { label: 'Open Deadline', expired: false };
    const date = new Date(targetDate);
    if (Number.isNaN(date.getTime())) {
      return { label: 'Open Deadline', expired: false };
    }
    const expired = date.getTime() < now;
    const label = expired
      ? `${formatDistanceStrict(date, now)} ago`
      : `${formatDistanceStrict(now, date)} remaining`;
    return { label, expired };
  }, [now, targetDate]);
}

export function ScholarshipModal({ open, onClose, scholarship }: ScholarshipModalProps) {
  const { data, isLoading } = useSWR<ScholarshipDetail>(
    () => (scholarship ? `/api/scholarships/${scholarship.id}` : null),
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const detail = data ?? (scholarship as ScholarshipDetail | null);
  const countdown = useCountdown(detail?.deadlineDate ?? null);
  const [index, setIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const fallbackExcerpt = detail ? buildScholarshipExcerpt(detail) : scholarship ? buildScholarshipExcerpt(scholarship) : '';
  const summaryCopy = detail?.summary ?? detail?.shortDescription ?? fallbackExcerpt;
  const longCopy = detail?.longDescription?.trim();

  useEffect(() => {
    setIndex(0);
  }, [detail?.id]);

  const activeId = scholarship?.id;

  useEffect(() => {
    if (!open || !activeId) {
      return;
    }
    document.body.classList.add('dialog-open');
    const handler = () => {
      onClose();
    };
    window.addEventListener('popstate', handler);
    const state = { modal: activeId };
    if (window.history.state?.modal) {
      window.history.replaceState(state, '');
    } else {
      window.history.pushState(state, '');
    }
    return () => {
      window.removeEventListener('popstate', handler);
      document.body.classList.remove('dialog-open');
    };
  }, [open, activeId, onClose]);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open, detail?.id]);

  const handleClose = () => {
    if (window.history.state?.modal) {
      window.history.back();
    } else {
      onClose();
    }
  };

  const images = detail?.images?.length ? detail.images : scholarship?.previewImage ? [scholarship.previewImage] : [];

  const next = () => {
    if (!images.length) return;
    setIndex((prev) => (prev + 1) % images.length);
  };

  const previous = () => {
    if (!images.length) return;
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      {open && detail && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={detail.name}
            tabIndex={-1}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-black/10 bg-white/95 shadow-aurora max-h-[calc(100vh-2rem)] sm:max-h-[90vh] focus:outline-none dark:border-white/10 dark:bg-gradient-to-br dark:from-luxe-charcoal/95 dark:via-luxe-ebony/95 dark:to-black/90"
          >
            <motion.button
              onClick={handleClose}
              className="absolute right-4 top-4 z-20 rounded-full border border-black/10 bg-white/80 p-4 text-luxe-ebony transition hover:border-luxe-gold/50 hover:text-luxe-gold focus:outline-none focus:ring-2 focus:ring-luxe-gold/30 dark:border-white/20 dark:bg-black/60 dark:text-luxe-ivory"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.08 }}
              aria-label="Close scholarship"
            >
              <IconXMark className="h-9 w-9" />
            </motion.button>
            <div className="flex max-h-full flex-col overflow-hidden sm:grid sm:grid-cols-[1.1fr_1fr]">
              <div className="relative max-h-[320px] overflow-hidden border-b border-black/10 bg-black/70 sm:max-h-none sm:h-full sm:border-b-0 sm:border-r dark:border-white/10 dark:bg-black/70">
                {images.length > 0 ? (
                  <div className="relative h-full w-full">
                    <div className="flex h-full w-full items-center justify-center bg-black/40">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={images[index]}
                          src={images[index]}
                          alt={buildScholarshipImageAlt(detail)}
                          className="max-h-full w-full object-contain"
                          initial={{ opacity: 0.3, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.6 }}
                        />
                      </AnimatePresence>
                    </div>
                    {images.length > 1 && (
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/30 px-5 py-4 text-xs uppercase tracking-[0.4em] text-luxe-ash">
                        <button
                          onClick={previous}
                          className="rounded-full border border-white/20 bg-black/60 p-2 hover:border-luxe-gold/60 hover:text-luxe-ivory"
                          aria-label="View previous scholarship image"
                        >
                          <IconArrowLeft className="h-5 w-5" />
                        </button>
                        <span>
                          {index + 1} / {images.length}
                        </span>
                        <button
                          onClick={next}
                          className="rounded-full border border-white/20 bg-black/60 p-2 hover:border-luxe-gold/60 hover:text-luxe-ivory"
                          aria-label="View next scholarship image"
                        >
                          <IconArrowRight className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-full min-h-[320px] items-center justify-center bg-gradient-to-br from-luxe-gold/10 via-transparent to-luxe-gold/10 text-sm uppercase tracking-[0.4em] text-luxe-ash">
                    Image coming soon
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-8 sm:max-h-[90vh] sm:px-8">
                <div className="space-y-4">
                  <h2 className="font-serif text-3xl font-semibold leading-tight text-luxe-ebony dark:text-luxe-ivory">
                    {detail.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-luxe-ash dark:text-luxe-ash/80">
                    <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/5">
                      {detail.countries.length ? detail.countries.join(' • ') : 'Global'}
                    </span>
                    <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/5">
                      {detail.levelTags.join(' • ')}
                    </span>
                  </div>
                  <a
                    href={detail.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 self-start rounded-full border border-luxe-gold/50 bg-gradient-to-r from-luxe-gold/25 to-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-luxe-ebony transition hover:border-luxe-gold/80 hover:text-luxe-gold focus:outline-none focus:ring-2 focus:ring-luxe-gold/40 dark:text-luxe-ivory"
                  >
                    <IconLink className="h-4 w-4" />
                    Visit Scholarship Website
                  </a>
                </div>
                <div className="space-y-2 rounded-2xl border border-black/10 bg-white/80 p-4 text-xs uppercase tracking-[0.35em] text-luxe-ash dark:border-white/10 dark:bg-white/5">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-luxe-ebony dark:text-luxe-ivory">
                    <span>Deadline</span>
                    <span className="font-semibold text-luxe-gold">{detail.deadlineLabel}</span>
                  </div>
                  <div className={`text-xs font-semibold ${countdown.expired ? 'text-red-500' : 'text-luxe-gold'}`}>
                    {countdown.label}
                  </div>
                </div>
                <div className="space-y-4 text-sm leading-relaxed text-luxe-ash dark:text-luxe-ash/80">
                  <p className="text-base text-luxe-ebony/90 dark:text-luxe-ivory/90">{summaryCopy}</p>
                  {longCopy && longCopy !== summaryCopy && (
                    <div className="space-y-3 whitespace-pre-line text-sm">
                      {longCopy.split('\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <h3 className="font-serif text-xl text-luxe-ebony dark:text-luxe-ivory">Coverage</h3>
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.35em] text-luxe-ash dark:text-luxe-ash/70">
                    {detail.coverage.length ? (
                      detail.coverage.map((item) => (
                        <span key={item} className="rounded-full border border-black/10 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/5">
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/5">Comprehensive Support</span>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-serif text-xl text-luxe-ebony dark:text-luxe-ivory">Levels</h3>
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.35em] text-luxe-ash dark:text-luxe-ash/70">
                    {detail.levelTags.map((level) => (
                      <span key={level} className="rounded-full border border-black/10 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/5">
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
                {isLoading && (
                  <div className="text-xs uppercase tracking-[0.3em] text-luxe-ash dark:text-luxe-ash/70">Refreshing details…</div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
