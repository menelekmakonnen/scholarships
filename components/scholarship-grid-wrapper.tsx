'use client';

import { useMemo, useState } from 'react';
import { ScholarshipCard } from './scholarship-card';
import { ScholarshipModal } from './scholarship-modal';
import type { FilterState } from './filter-panel';
import type { ScholarshipPreview } from '@/lib/types';

interface ScholarshipGridWrapperProps {
  scholarships: ScholarshipPreview[];
  heading?: string;
  description?: string;
  filters: FilterState;
  search: string;
  sort: string;
  sortDirection: string;
}

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
  filters,
  search,
  sort,
  sortDirection
}: ScholarshipGridWrapperProps) {
  const [selected, setSelected] = useState<ScholarshipPreview | null>(null);

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
      let result = 0;

      if (sort === 'deadline') {
        result = compareDates(a.deadlineDate, b.deadlineDate);
      } else if (sort === 'country') {
        const countryA = a.countries[0] ?? '';
        const countryB = b.countries[0] ?? '';
        result = countryA.localeCompare(countryB);
      } else {
        // name
        result = a.name.localeCompare(b.name);
      }

      return sortDirection === 'desc' ? -result : result;
    });

    return sorted;
  }, [scholarships, filters, search, sort, sortDirection]);

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
        </div>
      )}
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
