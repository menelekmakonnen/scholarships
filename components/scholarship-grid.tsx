'use client';

import { Fragment, useMemo, useState } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { CheckIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { ScholarshipCard } from './scholarship-card';
import { ScholarshipModal } from './scholarship-modal';
import { FilterPanel, FilterState } from './filter-panel';
import type { ScholarshipPreview } from '@/lib/types';

interface ScholarshipGridProps {
  scholarships: ScholarshipPreview[];
}

type SortOption = 'deadline-asc' | 'deadline-desc' | 'name-asc' | 'country-asc';

const SORT_OPTIONS: Array<{ value: SortOption; label: string; helper: string }> = [
  { value: 'deadline-asc', label: 'Deadline (Soonest)', helper: 'Prioritise scholarships closing soonest.' },
  { value: 'deadline-desc', label: 'Deadline (Latest)', helper: 'Discover opportunities with the longest runway.' },
  { value: 'name-asc', label: 'Name (A–Z)', helper: 'Alphabetical order by scholarship name.' },
  { value: 'country-asc', label: 'Country (A–Z)', helper: 'Group scholarships by their first listed country.' }
];

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

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h2 className="font-serif text-3xl text-luxe-ebony dark:text-luxe-ivory">Curated Opportunities</h2>
          <p className="text-sm text-luxe-ash dark:text-luxe-ash/80">
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
              className="w-full rounded-full border border-black/10 bg-white/70 px-5 py-3 text-sm text-luxe-ebony placeholder:text-luxe-ash focus:border-luxe-gold/40 focus:outline-none focus:ring-2 focus:ring-luxe-gold/30 dark:border-white/10 dark:bg-white/10 dark:text-luxe-ivory"
            />
            <MagnifyingGlassIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-luxe-ash dark:text-luxe-ash/70" />
          </div>
          <Listbox value={sort} onChange={setSort}>
            {({ open }) => (
              <div className="relative min-w-[220px]">
                <Listbox.Label className="sr-only">Sort scholarships</Listbox.Label>
                <Listbox.Button className="flex w-full items-center justify-between gap-3 rounded-full border border-luxe-gold/40 bg-white/80 px-5 py-3 text-xs uppercase tracking-[0.3em] text-luxe-ebony shadow-sm transition hover:border-luxe-gold/70 hover:text-luxe-gold dark:border-white/10 dark:bg-white/10 dark:text-luxe-ivory">
                  <span>{SORT_OPTIONS.find((item) => item.value === sort)?.label ?? 'Sort scholarships'}</span>
                  <ChevronDownIcon className={clsx('h-4 w-4 transition', open && 'rotate-180')} />
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-150"
                  enterFrom="opacity-0 -translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 -translate-y-1"
                >
                  <Listbox.Options className="absolute right-0 z-20 mt-2 w-72 overflow-hidden rounded-3xl border border-black/10 bg-white/95 p-2 text-sm shadow-aurora focus:outline-none dark:border-white/10 dark:bg-luxe-charcoal/95">
                    {SORT_OPTIONS.map((option) => (
                      <Listbox.Option
                        key={option.value}
                        value={option.value}
                        className={({ active }) =>
                          clsx(
                            'flex cursor-pointer items-start gap-3 rounded-2xl px-4 py-3 text-left transition',
                            active ? 'bg-luxe-gold/10 text-luxe-ebony dark:text-luxe-ivory' : 'text-luxe-ash dark:text-luxe-ash/80'
                          )
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full border border-luxe-gold/40 text-luxe-gold">
                              {selected && <CheckIcon className="h-4 w-4" />}
                            </span>
                            <span>
                              <span className="block font-semibold text-luxe-ebony dark:text-luxe-ivory">{option.label}</span>
                              <span className="block text-xs uppercase tracking-[0.3em] text-luxe-ash/80 dark:text-luxe-ash/60">
                                {option.helper}
                              </span>
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            )}
          </Listbox>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-3 rounded-full border border-luxe-gold/40 bg-gradient-to-r from-luxe-gold/20 to-transparent px-6 py-3 text-xs uppercase tracking-[0.3em] text-luxe-ebony transition hover:border-luxe-gold/70 hover:text-luxe-gold dark:text-luxe-ivory"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            Filters
          </button>
        </div>
      </div>
      {visibleScholarships.length > 0 ? (
        <div
          className={clsx(
            'grid gap-5',
            'grid-cols-[repeat(auto-fill,minmax(170px,1fr))]',
            'sm:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]',
            'xl:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]'
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
                coverage: new Set(),
                showExpired: filters.showExpired
              })
            }
            className="rounded-full border border-luxe-gold/40 bg-gradient-to-r from-luxe-gold/20 to-transparent px-6 py-2 text-xs uppercase tracking-[0.3em] text-luxe-ebony transition hover:border-luxe-gold/70 hover:text-luxe-gold dark:text-luxe-ivory"
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
