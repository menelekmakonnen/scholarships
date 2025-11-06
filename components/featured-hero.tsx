'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { ScholarshipPreview } from '@/lib/types';

interface FeaturedHeroProps {
  scholarship: ScholarshipPreview;
}

export function FeaturedHero({ scholarship }: FeaturedHeroProps) {
  const backgroundStyle = scholarship.previewImage
    ? {
        backgroundImage: `linear-gradient(120deg, rgba(15, 20, 25, 0.8), rgba(15, 20, 25, 0.4)), url(${scholarship.previewImage})`
      }
    : {
        backgroundImage: 'linear-gradient(120deg, rgba(15, 20, 25, 0.85), rgba(15, 20, 25, 0.55))'
      };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-10 shadow-aurora">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="grid gap-12 lg:grid-cols-[1.4fr_1fr]"
      >
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm tracking-[0.2em] text-luxe-gold">
            FEATURED SCHOLARSHIP
          </div>
          <h1 className="font-serif text-4xl font-semibold leading-tight text-luxe-ivory md:text-5xl lg:text-6xl">
            {scholarship.name}
          </h1>
          <p className="max-w-2xl text-lg text-luxe-ash">
            {scholarship.shortDescription ??
              'A distinguished opportunity curated for visionary scholars ready to embark on their next chapter.'}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm uppercase tracking-widest text-luxe-ash">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              {scholarship.countries.length > 0 ? scholarship.countries.join(' • ') : 'Global'}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              {scholarship.levelTags.join(' • ')}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Deadline: {scholarship.deadlineLabel}
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href={scholarship.link}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-luxe-gold/60 bg-luxe-gold/10 px-8 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-luxe-ivory transition hover:bg-luxe-gold/20"
            >
              Visit Scholarship Site
            </Link>
          </div>
        </div>
        <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-white/10">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out will-change-transform"
            style={{ ...backgroundStyle, backgroundSize: 'cover' }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-6 right-6 rounded-full bg-black/60 px-4 py-2 text-xs font-medium tracking-[0.3em] text-luxe-gold">
            DISCOVER
          </div>
        </div>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-luxe-gold/10 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1.2 }}
      />
    </section>
  );
}
