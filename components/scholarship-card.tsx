'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import type { ScholarshipDetail, ScholarshipPreview } from '@/lib/types';
import { buildScholarshipExcerpt, buildScholarshipImageAlt } from '@/lib/presenters';
import { fetchScholarshipDetail } from '@/lib/api';

interface ScholarshipCardProps {
  scholarship: ScholarshipPreview;
  onSelect: (scholarship: ScholarshipPreview) => void;
}

export function ScholarshipCard({ scholarship, onSelect }: ScholarshipCardProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const { data } = useSWRImmutable<ScholarshipDetail>(
    () => (visible ? `/api/scholarships/${scholarship.id}` : null),
    (url) => fetchScholarshipDetail<ScholarshipDetail>(url),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const enriched = (data ?? scholarship) as ScholarshipPreview;

  const handleClick = () => {
    onSelect(enriched);
  };

  return (
    <motion.button
      ref={ref}
      onClick={handleClick}
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-black/10 bg-white/85 text-left shadow-[0_18px_45px_-30px_rgba(15,20,25,0.35)] transition duration-500 hover:-translate-y-1 hover:border-luxe-gold/50 hover:shadow-[0_24px_65px_-32px_rgba(212,175,55,0.65)] focus:outline-none dark:border-white/10 dark:bg-white/10"
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {enriched.previewImage ? (
          <Image
            src={enriched.previewImage}
            alt={buildScholarshipImageAlt(enriched)}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
            className="object-cover transition-transform duration-[2500ms] ease-out group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-luxe-gold/30 via-white to-luxe-gold/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 space-y-2 text-sm text-white sm:space-y-3">
          <span className="inline-flex items-center rounded-full border border-white/30 bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.45em]">
            {enriched.levelTags.join(' • ')}
          </span>
          <h3 className="font-serif text-lg font-semibold leading-snug sm:text-xl line-clamp-2 drop-shadow-lg">
            {enriched.name}
          </h3>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/75">
            {enriched.countries.length ? enriched.countries.join(' • ') : 'Global'}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 text-sm text-luxe-ash dark:text-luxe-ash/80">
        <p className="line-clamp-3 text-[0.9rem] leading-relaxed text-luxe-ebony/85 dark:text-luxe-ivory/85">
          {enriched.shortDescription ?? enriched.sheetSummary ?? buildScholarshipExcerpt(enriched)}
        </p>
        <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.35em] text-luxe-ash dark:text-luxe-ash/70">
          {enriched.fundingType && (
            <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/5">
              {enriched.fundingType}
            </span>
          )}
          {enriched.coverage.slice(0, 3).map((item) => (
            <span key={item} className="rounded-full border border-black/10 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/5">
              {item}
            </span>
          ))}
          {enriched.coverage.length === 0 && (
            <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/5">
              Comprehensive Support
            </span>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-luxe-ash/80 dark:text-luxe-ash/70">
          <span className="max-w-[70%] truncate text-left" title={enriched.deadlineLabel}>
            {enriched.deadlineLabel}
          </span>
          {enriched.isExpired && <span className="text-red-400">Expired</span>}
        </div>
      </div>
    </motion.button>
  );
}
