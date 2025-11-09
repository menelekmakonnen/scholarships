'use client';

import { IconCalendar, IconGlobe, IconSparkles } from './icons';
import { format, formatDistanceStrict } from 'date-fns';
import type { ScholarshipPreview } from '@/lib/types';
import { useState } from 'react';

interface ScholarshipHighlightsProps {
  scholarships: ScholarshipPreview[];
}

function getUpcomingDeadline(scholarships: ScholarshipPreview[]) {
  const upcoming = scholarships
    .filter((entry) => Boolean(entry.deadlineDate) && !entry.isExpired)
    .sort((a, b) => {
      const timeA = a.deadlineDate ? new Date(a.deadlineDate).getTime() : Number.POSITIVE_INFINITY;
      const timeB = b.deadlineDate ? new Date(b.deadlineDate).getTime() : Number.POSITIVE_INFINITY;
      return timeA - timeB;
    })[0];

  if (!upcoming || !upcoming.deadlineDate) {
    return null;
  }

  const date = new Date(upcoming.deadlineDate);
  return {
    label: format(date, 'EEEE, MMMM do'),
    in: formatDistanceStrict(Date.now(), date, { addSuffix: true }),
    name: upcoming.name
  };
}

export function ScholarshipHighlights({ scholarships }: ScholarshipHighlightsProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const totalActive = scholarships.filter((entry) => !entry.isExpired).length;
  const uniqueCountries = new Set(
    scholarships.flatMap((entry) => (entry.countries.length ? entry.countries : ['Global']))
  ).size;
  const upcoming = getUpcomingDeadline(scholarships);

  const activeScholarships = scholarships.filter((entry) => !entry.isExpired);
  const countriesList = Array.from(
    new Set(scholarships.flatMap((entry) => (entry.countries.length ? entry.countries : ['Global'])))
  ).sort();

  const metrics = [
    {
      id: 'active',
      title: 'Active Scholarships',
      value: totalActive.toLocaleString(),
      description: 'Open awards meticulously curated and ready for applications.',
      icon: IconSparkles,
      accent: 'from-luxe-gold/50 via-luxe-gold/20 to-transparent',
      details: (
        <div className="space-y-3">
          <p className="text-sm text-luxe-ash dark:text-luxe-ash/80">
            We currently have <strong className="text-luxe-gold">{totalActive}</strong> active scholarships available for applications across various study levels and disciplines.
          </p>
          <div className="grid gap-2 text-xs">
            {activeScholarships.slice(0, 5).map((s) => (
              <div key={s.id} className="rounded-lg border border-luxe-gold/20 bg-white/50 p-2 dark:bg-white/5">
                <div className="font-semibold text-luxe-ebony dark:text-luxe-ivory">{s.name}</div>
                <div className="text-luxe-ash dark:text-luxe-ash/70">{s.deadlineLabel}</div>
              </div>
            ))}
            {activeScholarships.length > 5 && (
              <p className="text-center text-luxe-ash">...and {activeScholarships.length - 5} more</p>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'countries',
      title: 'Global Destinations',
      value: uniqueCountries.toLocaleString(),
      description: 'Countries represented across this season\'s catalogue.',
      icon: IconGlobe,
      accent: 'from-luxe-emerald/40 via-luxe-gold/10 to-transparent',
      details: (
        <div className="space-y-3">
          <p className="text-sm text-luxe-ash dark:text-luxe-ash/80">
            Our catalogue spans <strong className="text-luxe-gold">{uniqueCountries}</strong> countries and territories worldwide, offering diverse study destinations.
          </p>
          <div className="flex flex-wrap gap-2">
            {countriesList.map((country) => (
              <span
                key={country}
                className="rounded-full border border-luxe-gold/20 bg-white/50 px-3 py-1 text-xs dark:bg-white/5"
              >
                {country}
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'deadline',
      title: upcoming ? 'Next Deadline' : 'Rolling Opportunities',
      value: upcoming ? upcoming.label : 'Flexible timelines',
      description: upcoming
        ? `${upcoming.name} closes ${upcoming.in}.`
        : 'Many scholarships review applications throughout the year.',
      icon: IconCalendar,
      accent: 'from-luxe-azure/40 via-luxe-gold/15 to-transparent',
      details: upcoming ? (
        <div className="space-y-3">
          <p className="text-sm text-luxe-ash dark:text-luxe-ash/80">
            The next approaching deadline is <strong className="text-luxe-gold">{upcoming.in}</strong>.
          </p>
          <div className="rounded-lg border border-luxe-gold/30 bg-white/50 p-4 dark:bg-white/5">
            <h4 className="font-serif text-lg font-semibold text-luxe-ebony dark:text-luxe-ivory">{upcoming.name}</h4>
            <p className="mt-2 text-sm text-luxe-ash dark:text-luxe-ash/80">Deadline: {upcoming.label}</p>
            <p className="mt-1 text-xs text-luxe-gold">Closes {upcoming.in}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-luxe-ash dark:text-luxe-ash/80">
            Several scholarships in our catalogue offer rolling admissions, allowing you to apply throughout the year on your own timeline.
          </p>
        </div>
      )
    }
  ];

  return (
    <>
      <section className="grid gap-5 lg:grid-cols-3">
        {metrics.map(({ id, title, value, description, icon: Icon, accent }) => (
          <button
            key={title}
            onClick={() => setActiveModal(id)}
            className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/90 p-6 shadow-[0_24px_70px_-40px_rgba(20,25,35,0.55)] transition hover:-translate-y-1 hover:shadow-[0_32px_90px_-42px_rgba(212,175,55,0.55)] dark:border-white/10 dark:bg-white/10 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-luxe-gold/50"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-70`} aria-hidden />
            <div className="relative flex flex-col gap-4">
              <div className="flex items-center gap-3 text-luxe-gold dark:text-luxe-gold/90">
                <span className="rounded-full border border-luxe-gold/30 bg-white/80 p-3 dark:border-luxe-gold/20 dark:bg-black/40">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="text-xs uppercase tracking-[0.4em] text-luxe-ash dark:text-luxe-ash/80">{title}</p>
              </div>
              <p className="font-serif text-3xl text-luxe-ebony dark:text-luxe-ivory">{value}</p>
              <p className="max-w-sm text-sm leading-relaxed text-luxe-ash dark:text-luxe-ash/80">{description}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-luxe-gold/70 dark:text-luxe-gold/60">Click to learn more →</p>
            </div>
          </button>
        ))}
      </section>

      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-3xl border border-luxe-gold/30 bg-white/95 p-8 shadow-2xl dark:bg-luxe-ebony/95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 rounded-full border border-black/10 bg-white/80 p-2 text-luxe-ash transition hover:bg-luxe-gold/20 dark:border-white/10 dark:bg-white/10"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
            <h3 className="font-serif text-2xl text-luxe-ebony dark:text-luxe-ivory mb-4">
              {metrics.find((m) => m.id === activeModal)?.title}
            </h3>
            {metrics.find((m) => m.id === activeModal)?.details}
          </div>
        </div>
      )}
    </>
  );
}
