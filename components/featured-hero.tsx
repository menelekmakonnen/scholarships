'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { ScholarshipPreview } from '@/lib/types';
import { buildScholarshipExcerpt, buildScholarshipImageAlt } from '@/lib/presenters';

interface FeaturedHeroProps {
  scholarships: ScholarshipPreview[];
  onSelect?: (scholarship: ScholarshipPreview) => void;
}

export function FeaturedHero({ scholarships, onSelect }: FeaturedHeroProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (scholarships.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % scholarships.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [scholarships.length]);

  const active = scholarships[index];

  const goTo = (nextIndex: number) => {
    setIndex(nextIndex);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/80 p-10 shadow-aurora transition dark:border-white/10 dark:bg-white/5 h-[600px] lg:h-[500px]">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-luxe-gold/20 opacity-60 dark:from-white/5 dark:via-transparent dark:to-luxe-gold/10" aria-hidden="true" />
      <div className="relative grid gap-10 h-full lg:grid-cols-[1.35fr_1fr]">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-black/5 bg-white/70 px-5 py-2 text-sm tracking-[0.3em] text-luxe-ash shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-luxe-gold">
            FEATURED COLLECTION
          </div>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.5em] text-luxe-ash dark:text-luxe-ash/80">Spotlight Scholarship</p>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-luxe-ebony sm:text-5xl lg:text-6xl dark:text-luxe-ivory">
              {active.name}
            </h2>
          </div>
          <p className="max-w-2xl text-lg text-luxe-ash dark:text-luxe-ash/90">
            {active.shortDescription ?? active.sheetSummary ?? buildScholarshipExcerpt(active)}
          </p>
          {active.organisation && (
            <p className="text-xs uppercase tracking-[0.45em] text-luxe-ash/80 dark:text-luxe-ash/70">
              Presented by {active.organisation}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-luxe-ash dark:text-luxe-ash/80">
            <span className="rounded-full border border-black/10 bg-white/70 px-4 py-2 dark:border-white/10 dark:bg-white/10">
              {active.countries.length > 0 ? active.countries.join(' • ') : 'Global'}
            </span>
            <span className="rounded-full border border-black/10 bg-white/70 px-4 py-2 dark:border-white/10 dark:bg-white/10">
              {active.levelTags.join(' • ')}
            </span>
            {active.fundingType && (
              <span className="rounded-full border border-black/10 bg-white/70 px-4 py-2 dark:border-white/10 dark:bg-white/10">
                {active.fundingType}
              </span>
            )}
            <span className="rounded-full border border-black/10 bg-white/70 px-4 py-2 dark:border-white/10 dark:bg-white/10">
              Deadline: {active.deadlineLabel}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelect?.(active)}
              className="rounded-full border border-luxe-gold/60 bg-gradient-to-r from-luxe-gold/30 to-luxe-gold/10 px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-luxe-ebony transition hover:border-luxe-gold/80 hover:from-luxe-gold/40 hover:shadow-lg dark:text-luxe-ivory"
            >
              View Details
            </button>
            <Link
              href={active.link}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-luxe-gold/40 bg-gradient-to-r from-luxe-gold/20 to-transparent px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-luxe-ebony transition hover:border-luxe-gold/70 hover:from-luxe-gold/30 hover:text-luxe-gold dark:text-luxe-ivory"
            >
              Visit Site
            </Link>
            <div className="flex items-center gap-2">
              {scholarships.map((item, itemIndex) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(itemIndex)}
                  className={`h-2.5 rounded-full transition ${
                    itemIndex === index
                      ? 'w-8 bg-luxe-gold'
                      : 'w-2 bg-black/20 hover:w-4 hover:bg-black/40 dark:bg-white/30 dark:hover:bg-white/50'
                  }`}
                  aria-label={`View featured scholarship ${itemIndex + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
        <button
          onClick={() => onSelect?.(active)}
          className="relative overflow-hidden rounded-3xl border border-black/10 bg-black/5 shadow-inner dark:border-white/10 dark:bg-black/60 cursor-pointer transition hover:border-luxe-gold/40 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-luxe-gold/50 h-full"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.previewImage ?? active.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              {active.previewImage ? (
                <Image
                  src={active.previewImage}
                  alt={buildScholarshipImageAlt(active)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-luxe-gold/30 via-white to-luxe-gold/20 text-sm uppercase tracking-[0.4em] text-luxe-ash dark:from-luxe-gold/15 dark:via-black/40 dark:to-luxe-gold/10">
                  Visual preview arriving shortly
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100 bg-black/30 backdrop-blur-sm">
            <span className="rounded-full border border-white/60 bg-white/90 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-luxe-ebony shadow-lg">
              View Details
            </span>
          </div>
        </button>
      </div>
    </section>
  );
}
