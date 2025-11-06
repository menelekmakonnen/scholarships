'use client';

import { useMemo, useState } from 'react';
import { AdjustmentsHorizontalIcon, ArrowDownCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { ScholarshipCard } from './scholarship-card';
import { ScholarshipModal } from './scholarship-modal';
import { FilterPanel, FilterState } from './filter-panel';
import type { ScholarshipPreview } from '@/lib/types';

interface ScholarshipGridProps {
  scholarships: ScholarshipPreview[];
}

type SortOption = 'deadline-asc' | 'deadline-desc' | 'name-asc' | 'country-asc';

const SORT_LABELS: Record<SortOption, string> = {
  'deadline-asc': 'Deadline (Soonest)',
  'deadline-desc': 'Deadline (Latest)',
  'name-asc': 'Name (A–Z)',
  'country-asc': 'Country (A–Z)'
};

function compareDates(a: string | null, b: string | null) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  const dateA = new Date(a).getTime();
  const dateB = new Date(b).getTime();
  return dateA - dateB;
}

export function ScholarshipGrid({ scholarships }: ScholarshipGridProps) {
  const [selected, setSelected] = useState<ScholarshipPreview | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    levels: new Set<string>(),
    countries: new Set<string>(),
    coverage: new Set<string>(),
    showExpired: false
  });
  const [sort, setSort] = useState<SortOption>('deadline-asc');
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const levelOptions = useMemo(() => {
    const levels = new Set<string>();
    scholarships.forEach((scholarship) => scholarship.levelTags.forEach((level) => levels.add(level)));
    return Array.from(levels).sort();
  }, [scholarships]);

  const countryOptions = useMemo(() => {
    const countries = new Set<string>();
    scholarships.forEach((scholarship) => scholarship.countries.forEach((country) => countries.add(country)));
    return Array.from(countries).sort();
  }, [scholarships]);

  const coverageOptions = useMemo(() => {
    const coverage = new Set<string>();
    scholarships.forEach((scholarship) => scholarship.coverage.forEach((item) => coverage.add(item)));
    return Array.from(coverage).sort();
  }, [scholarships]);

  const visibleScholarships = useMemo(() => {
    const query = search.trim().toLowerCase();
    return scholarships
      .filter((scholarship) => {
        if (!filters.showExpired && scholarship.isExpired) {
          return false;
        }
        if (filters.levels.size > 0) {
          const match = scholarship.levelTags.some((level) => filters.levels.has(level));
          if (!match) return false;
        }
        if (filters.countries.size > 0) {
          const match = scholarship.countries.some((country) => filters.countries.has(country));
          if (!match) return false;
        }
        if (filters.coverage.size > 0) {
          const match = scholarship.coverage.some((item) => filters.coverage.has(item));
          if (!match) return false;
        }
        if (query) {
          const text = `${scholarship.name} ${scholarship.countries.join(' ')} ${scholarship.levelTags.join(' ')} ${
            scholarship.shortDescription ?? ''
          }`;
          if (!text.toLowerCase().includes(query)) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sort === 'deadline-asc') {
          return compareDates(a.deadlineDate, b.deadlineDate);
        }
        if (sort === 'deadline-desc') {
          return compareDates(b.deadlineDate, a.deadlineDate);
        }
        if (sort === 'country-asc') {
          const countryA = a.countries[0] ?? '';
          const countryB = b.countries[0] ?? '';
          return countryA.localeCompare(countryB);
        }
        return a.name.localeCompare(b.name);
      });
  }, [scholarships, filters, search, sort]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h2 className="font-serif text-3xl text-luxe-ivory">Curated Opportunities</h2>
          <p className="text-sm text-luxe-ash">
            {visibleScholarships.length} scholarships tailored to your ambitions. Refine the gallery to uncover your perfect fit.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <input
              type="search"
              placeholder="Search scholarships"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm text-luxe-ivory placeholder:text-luxe-ash focus:border-luxe-gold/50 focus:outline-none focus:ring-2 focus:ring-luxe-gold/40"
            />
            <ArrowDownCircleIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-luxe-ash" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs uppercase tracking-[0.3em] text-luxe-ash">Sort</label>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-luxe-ivory focus:border-luxe-gold/40 focus:outline-none"
            >
              {Object.entries(SORT_LABELS).map(([key, label]) => (
                <option key={key} value={key} className="bg-luxe-ebony text-luxe-ivory">
                  {label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-3 rounded-full border border-luxe-gold/40 bg-luxe-gold/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-luxe-ivory transition hover:bg-luxe-gold/20"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            Filters
          </button>
        </div>
      </div>
      {visibleScholarships.length > 0 ? (
        <div
          className={clsx(
            'grid gap-6',
            'grid-cols-2',
            'sm:grid-cols-2',
            'lg:grid-cols-3',
            'xl:grid-cols-4'
          )}
        >
          {visibleScholarships.map((scholarship) => (
            <ScholarshipCard key={scholarship.id} scholarship={scholarship} onSelect={setSelected} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-luxe-ash">
          <p>No scholarships match your filters yet.</p>
          <button
            type="button"
            onClick={() =>
              setFilters({
                levels: new Set(),
                countries: new Set(),
                coverage: new Set(),
                showExpired: filters.showExpired
              })
            }
            className="rounded-full border border-luxe-gold/40 bg-luxe-gold/10 px-6 py-2 text-xs uppercase tracking-[0.3em] text-luxe-ivory hover:bg-luxe-gold/20"
          >
            Clear Level, Country & Coverage
          </button>
        </div>
      )}
      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        state={filters}
        onUpdate={(updater) =>
          setFilters((prev) => {
            const base: FilterState = {
              levels: new Set(prev.levels),
              countries: new Set(prev.countries),
              coverage: new Set(prev.coverage),
              showExpired: prev.showExpired
            };
            const next = updater(base);
            return {
              levels: new Set(next.levels),
              countries: new Set(next.countries),
              coverage: new Set(next.coverage),
              showExpired: next.showExpired
            };
          })
        }
        levelOptions={levelOptions}
        countryOptions={countryOptions}
        coverageOptions={coverageOptions}
      />
      <ScholarshipModal open={Boolean(selected)} onClose={() => setSelected(null)} scholarship={selected} />
    </div>
  );
}
