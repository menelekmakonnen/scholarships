'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { IconAdjustments, IconChevronDown, IconMagnifier } from './icons';
import clsx from 'clsx';
import { ScholarshipCard } from './scholarship-card';
import { ScholarshipModal } from './scholarship-modal';
import { FilterPanel, FilterState } from './filter-panel';
import type { ScholarshipPreview } from '@/lib/types';

interface ScholarshipGridWrapperProps {
  scholarships: ScholarshipPreview[];
  heading?: string;
  description?: string;
  initialFilters?: Partial<{
    levels: string[];
    countries: string[];
    fundingTypes: string[];
    modalities: string[];
    eligibilities: string[];
    showExpired: boolean;
  }>;
  initialSort?: SortOption;
  initialSearch?: string;
}

type SortOption = 'deadline-asc' | 'deadline-desc' | 'name-asc' | 'country-asc';

const SORT_OPTIONS: Array<{ value: SortOption; label: string; description: string }> = [
  { value: 'deadline-asc', label: 'Deadline (Soonest)', description: 'Prioritise scholarships closing soonest.' },
  { value: 'deadline-desc', label: 'Deadline (Latest)', description: 'Discover opportunities with the longest runway.' },
  { value: 'name-asc', label: 'Name (A–Z)', description: 'Alphabetical order by scholarship name.' },
  { value: 'country-asc', label: 'Country (A–Z)', description: 'Group scholarships by their first listed country.' }
];

function compareDates(a: string | null, b: string | null) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  const dateA = new Date(a).getTime();
  const dateB = new Date(b).getTime();
  return dateA - dateB;
}

export function ScholarshipGridWrapper({
  scholarships,
  heading,
  description,
  initialFilters,
  initialSort = 'deadline-asc',
  initialSearch = ''
}: ScholarshipGridWrapperProps) {
  const [selected, setSelected] = useState<ScholarshipPreview | null>(null);
  const defaultFilters = useMemo<FilterState>(() => {
    const base = initialFilters ?? {};
    return {
      levels: new Set(base.levels ?? []),
      countries: new Set(base.countries ?? []),
      fundingTypes: new Set(base.fundingTypes ?? []),
      modalities: new Set(base.modalities ?? []),
      eligibilities: new Set(base.eligibilities ?? []),
      showExpired: base.showExpired ?? false
    };
  }, [initialFilters]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [search, setSearch] = useState(initialSearch);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const ssfBarRef = useRef<HTMLDivElement>(null);
  const ssfBarPlaceholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  useEffect(() => {
    setSort(initialSort);
  }, [initialSort]);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      {
        threshold: [0],
        rootMargin: '-1px 0px 0px 0px'
      }
    );

    if (ssfBarPlaceholderRef.current) {
      observer.observe(ssfBarPlaceholderRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  const fundingTypeOptions = useMemo(() => {
    const types = new Set<string>();
    scholarships.forEach((scholarship) => {
      if (scholarship.fundingType) types.add(scholarship.fundingType);
    });
    return Array.from(types).sort();
  }, [scholarships]);

  const modalityOptions = useMemo(() => {
    const modalities = new Set<string>();
    scholarships.forEach((scholarship) => scholarship.deliveryModes.forEach((mode) => modalities.add(mode)));
    return Array.from(modalities).sort();
  }, [scholarships]);

  const eligibilityOptions = useMemo(() => {
    const criteria = new Set<string>();
    scholarships.forEach((scholarship) => scholarship.eligibility.forEach((item) => criteria.add(item)));
    return Array.from(criteria).sort();
  }, [scholarships]);

  const visibleScholarships = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = scholarships.filter((scholarship) => {
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
      if (filters.fundingTypes.size > 0) {
        const match = scholarship.fundingType && filters.fundingTypes.has(scholarship.fundingType);
        if (!match) return false;
      }
      if (filters.modalities.size > 0) {
        const match = scholarship.deliveryModes.some((mode) => filters.modalities.has(mode));
        if (!match) return false;
      }
      if (filters.eligibilities.size > 0) {
        const match = scholarship.eligibility.some((item) => filters.eligibilities.has(item));
        if (!match) return false;
      }
      if (query) {
        const text = `${scholarship.name} ${scholarship.countries.join(' ')} ${scholarship.levelTags.join(' ')} ${
          scholarship.shortDescription ?? scholarship.sheetSummary ?? ''
        } ${scholarship.coverage.join(' ')} ${scholarship.fundingType ?? ''} ${scholarship.organisation ?? ''}`;
        if (!text.toLowerCase().includes(query)) {
          return false;
        }
      }
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
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

    return sorted;
  }, [scholarships, filters, search, sort]);

  const totalVisible = new Intl.NumberFormat().format(visibleScholarships.length);
  const effectiveHeading = heading ?? 'Curated Opportunities';
  const effectiveDescription =
    description ??
    `${totalVisible} scholarships tailored to your ambitions. Refine the gallery to uncover your perfect fit.`;

  return (
    <div className="space-y-10">
      {/* Placeholder to maintain layout when SSF bar becomes fixed */}
      <div ref={ssfBarPlaceholderRef} className="h-0" />

      {/* SSF Bar */}
      <div
        ref={ssfBarRef}
        className={clsx(
          'transition-all duration-300 z-20',
          isSticky
            ? 'fixed top-0 left-0 right-0 bg-white/95 dark:bg-luxe-ebony/95 backdrop-blur-xl shadow-lg border-b border-black/10 dark:border-white/10 py-4'
            : 'relative'
        )}
      >
        <div className={clsx('mx-auto', isSticky ? 'max-w-7xl px-5 sm:px-8 lg:px-10' : '')}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <div className="relative flex-1 sm:max-w-xs">
              <input
                type="search"
                placeholder="Search scholarships"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-full border border-black/10 bg-white/70 px-5 py-3 text-sm text-luxe-ebony placeholder:text-luxe-ash focus:border-luxe-gold/40 focus:outline-none focus:ring-2 focus:ring-luxe-gold/30 dark:border-white/10 dark:bg-white/10 dark:text-luxe-ivory"
              />
              <IconMagnifier className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-luxe-ash dark:text-luxe-ash/70" />
            </div>
            <div className="relative min-w-[220px]">
              <label htmlFor="sort-scholarships" className="sr-only">
                Sort scholarships
              </label>
              <select
                id="sort-scholarships"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className="w-full appearance-none rounded-full border border-luxe-gold/40 bg-white/80 px-5 py-3 text-xs uppercase tracking-[0.3em] text-luxe-ebony shadow-sm transition hover:border-luxe-gold/70 hover:text-luxe-gold focus:border-luxe-gold/70 focus:outline-none focus:ring-2 focus:ring-luxe-gold/20 dark:border-white/10 dark:bg-white/10 dark:text-luxe-ivory"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} title={option.description}>
                    {option.label}
                  </option>
                ))}
              </select>
              <IconChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-luxe-ash dark:text-luxe-ash/70" />
            </div>
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-3 rounded-full border border-luxe-gold/40 bg-gradient-to-r from-luxe-gold/20 to-transparent px-6 py-3 text-xs uppercase tracking-[0.3em] text-luxe-ebony transition hover:border-luxe-gold/70 hover:text-luxe-gold dark:text-luxe-ivory"
            >
              <IconAdjustments className="h-5 w-5" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h2 className="font-serif text-3xl text-luxe-ebony dark:text-luxe-ivory">{effectiveHeading}</h2>
          <p className="text-sm text-luxe-ash dark:text-luxe-ash/80">{effectiveDescription}</p>
        </div>
      </div>

      {visibleScholarships.length > 0 ? (
        <div
          className={clsx(
            'grid gap-5',
            'grid-cols-2',
            'sm:grid-cols-3',
            'lg:grid-cols-4',
            'xl:grid-cols-5'
          )}
        >
          {visibleScholarships.map((scholarship) => (
            <ScholarshipCard key={scholarship.id} scholarship={scholarship} onSelect={setSelected} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-black/10 bg-white/80 p-10 text-center text-sm text-luxe-ash dark:border-white/10 dark:bg-white/5">
          <p>No scholarships match your filters yet.</p>
          <button
            type="button"
            onClick={() =>
              setFilters({
                levels: new Set(),
                countries: new Set(),
                fundingTypes: new Set(),
                modalities: new Set(),
                eligibilities: new Set(),
                showExpired: filters.showExpired
              })
            }
            className="rounded-full border border-luxe-gold/40 bg-gradient-to-r from-luxe-gold/20 to-transparent px-6 py-2 text-xs uppercase tracking-[0.3em] text-luxe-ebony transition hover:border-luxe-gold/70 hover:text-luxe-gold dark:text-luxe-ivory"
          >
            Clear All Filters
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
              fundingTypes: new Set(prev.fundingTypes),
              modalities: new Set(prev.modalities),
              eligibilities: new Set(prev.eligibilities),
              showExpired: prev.showExpired
            };
            const next = updater(base);
            return {
              levels: new Set(next.levels),
              countries: new Set(next.countries),
              fundingTypes: new Set(next.fundingTypes),
              modalities: new Set(next.modalities),
              eligibilities: new Set(next.eligibilities),
              showExpired: next.showExpired
            };
          })
        }
        levelOptions={levelOptions}
        countryOptions={countryOptions}
        fundingTypeOptions={fundingTypeOptions}
        modalityOptions={modalityOptions}
        eligibilityOptions={eligibilityOptions}
      />
      <ScholarshipModal open={Boolean(selected)} onClose={() => setSelected(null)} scholarship={selected} />
    </div>
  );
}
