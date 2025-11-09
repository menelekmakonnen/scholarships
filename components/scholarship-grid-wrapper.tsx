'use client';

import { useEffect, useMemo, useState } from 'react';
import { ScholarshipCard } from './scholarship-card';
import { ScholarshipModal } from './scholarship-modal';
import { FilterPanel, FilterState } from './filter-panel';
import type { ScholarshipPreview } from '@/lib/types';

interface ScholarshipGridWrapperProps {
  scholarships: ScholarshipPreview[];
  heading?: string;
  description?: string;
  heroRef?: React.RefObject<HTMLDivElement>;
  externalFilters?: FilterState;
  onFiltersChange?: (filters: FilterState) => void;
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
  heroRef,
  externalFilters,
  onFiltersChange,
  initialFilters,
  initialSort = 'deadline-asc',
  initialSearch = ''
}: ScholarshipGridWrapperProps) {
  const [selected, setSelected] = useState<ScholarshipPreview | null>(null);
  const defaultFilters = useMemo<FilterState>(() => {
    if (externalFilters) return externalFilters;
    const base = initialFilters ?? {};
    return {
      levels: new Set(base.levels ?? []),
      countries: new Set(base.countries ?? []),
      fundingTypes: new Set(base.fundingTypes ?? []),
      modalities: new Set(base.modalities ?? []),
      eligibilities: new Set(base.eligibilities ?? []),
      showExpired: base.showExpired ?? false
    };
  }, [initialFilters, externalFilters]);

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [search, setSearch] = useState(initialSearch);
  const [filterOpen, setFilterOpen] = useState(false);

  // Sync with external filters
  useEffect(() => {
    if (externalFilters) {
      setFilters(externalFilters);
    }
  }, [externalFilters]);

  useEffect(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  useEffect(() => {
    setSort(initialSort);
  }, [initialSort]);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

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

  const handleFilterUpdate = (updater: (prev: FilterState) => FilterState) => {
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
      const newFilters = {
        levels: new Set(next.levels),
        countries: new Set(next.countries),
        fundingTypes: new Set(next.fundingTypes),
        modalities: new Set(next.modalities),
        eligibilities: new Set(next.eligibilities),
        showExpired: next.showExpired
      };
      onFiltersChange?.(newFilters);
      return newFilters;
    });
  };

  const totalVisible = new Intl.NumberFormat().format(visibleScholarships.length);
  const effectiveHeading = heading ?? 'Curated Opportunities';
  const effectiveDescription =
    description ??
    `${totalVisible} scholarships tailored to your ambitions. Refine the gallery to uncover your perfect fit.`;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h2 className="font-serif text-3xl text-luxe-ebony dark:text-luxe-ivory">{effectiveHeading}</h2>
          <p className="text-sm text-luxe-ash dark:text-luxe-ash/80">{effectiveDescription}</p>
        </div>
      </div>

      {visibleScholarships.length > 0 ? (
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visibleScholarships.map((scholarship) => (
            <ScholarshipCard key={scholarship.id} scholarship={scholarship} onSelect={setSelected} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-black/10 bg-white/80 p-10 text-center text-sm text-luxe-ash dark:border-white/10 dark:bg-white/5">
          <p>No scholarships match your filters yet.</p>
          <button
            type="button"
            onClick={() => {
              const clearedFilters = {
                levels: new Set<string>(),
                countries: new Set<string>(),
                fundingTypes: new Set<string>(),
                modalities: new Set<string>(),
                eligibilities: new Set<string>(),
                showExpired: filters.showExpired
              };
              setFilters(clearedFilters);
              onFiltersChange?.(clearedFilters);
            }}
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
        onUpdate={handleFilterUpdate}
        levelOptions={levelOptions}
        countryOptions={countryOptions}
        fundingTypeOptions={fundingTypeOptions}
        modalityOptions={modalityOptions}
        eligibilityOptions={eligibilityOptions}
      />
      <ScholarshipModal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        scholarship={selected}
        allScholarships={visibleScholarships}
        onNavigate={setSelected}
      />
    </div>
  );
}
