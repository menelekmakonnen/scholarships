'use client';

import { motion } from 'framer-motion';
import type { ScholarshipPreview } from '@/lib/types';

interface ScholarshipCardProps {
  scholarship: ScholarshipPreview;
  onSelect: (scholarship: ScholarshipPreview) => void;
}

export function ScholarshipCard({ scholarship, onSelect }: ScholarshipCardProps) {
  const handleClick = () => {
    onSelect(scholarship);
  };

  return (
    <motion.button
      onClick={handleClick}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left shadow-aurora transition duration-500 hover:-translate-y-1 hover:border-luxe-gold/40 hover:shadow-[0_24px_70px_-40px_rgba(212,175,55,0.9)] focus:outline-none"
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[3000ms] ease-out group-hover:scale-110"
          style={{
            backgroundImage: scholarship.previewImage
              ? `url(${scholarship.previewImage})`
              : 'linear-gradient(135deg, rgba(212,175,55,0.35), rgba(94,154,255,0.2))'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5 space-y-3 text-sm text-luxe-ivory">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.4em] text-luxe-gold">
            {scholarship.levelTags.join(' • ')}
          </span>
          <h3 className="font-serif text-2xl font-semibold leading-tight">{scholarship.name}</h3>
          <p className="text-xs uppercase tracking-[0.3em] text-luxe-ash">
            {scholarship.countries.length ? scholarship.countries.join(' • ') : 'Global'}
          </p>
        </div>
      </div>
      <div className="space-y-4 p-5 text-sm text-luxe-ash">
        <p className="line-clamp-3 text-base text-luxe-ivory/90">
          {scholarship.shortDescription ?? 'Tap to unveil the full details of this prestigious award.'}
        </p>
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em]">
          {scholarship.coverage.slice(0, 3).map((item) => (
            <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-luxe-ash">
              {item}
            </span>
          ))}
          {scholarship.coverage.length === 0 && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-luxe-ash">Comprehensive Support</span>
          )}
        </div>
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-luxe-ash">
          <span>{scholarship.deadlineLabel}</span>
          {scholarship.isExpired && <span className="text-red-300">Expired</span>}
        </div>
      </div>
    </motion.button>
  );
}
