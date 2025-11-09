'use client';

import { useState, useRef, useMemo } from 'react';
import { FeaturedHero } from '@/components/featured-hero';
import { ScholarshipHighlights } from '@/components/scholarship-highlights';
import { ScholarshipGridWrapper } from '@/components/scholarship-grid-wrapper';
import { ScholarshipModal } from '@/components/scholarship-modal';
import type { ScholarshipPreview } from '@/lib/types';
import type { FilterState } from '@/components/filter-panel';

interface PageClientProps {
  featured: ScholarshipPreview[];
  scholarships: ScholarshipPreview[];
}

export function PageClient({ featured, scholarships }: PageClientProps) {
  const [selectedScholarship, setSelectedScholarship] = useState<ScholarshipPreview | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    levels: new Set(),
    countries: new Set(),
    fundingTypes: new Set(),
    modalities: new Set(),
    eligibilities: new Set(),
    showExpired: false
  });
  const heroRef = useRef<HTMLDivElement>(null);

  // Filter scholarships based on current filters
  const filteredScholarships = useMemo(() => {
    return scholarships.filter((scholarship) => {
      if (!filters.showExpired && scholarship.isExpired) return false;
      if (filters.levels.size > 0) {
        if (!scholarship.levelTags.some((level) => filters.levels.has(level))) return false;
      }
      if (filters.countries.size > 0) {
        if (!scholarship.countries.some((country) => filters.countries.has(country))) return false;
      }
      if (filters.fundingTypes.size > 0) {
        if (!scholarship.fundingType || !filters.fundingTypes.has(scholarship.fundingType)) return false;
      }
      if (filters.modalities.size > 0) {
        if (!scholarship.deliveryModes.some((mode) => filters.modalities.has(mode))) return false;
      }
      if (filters.eligibilities.size > 0) {
        if (!scholarship.eligibility.some((item) => filters.eligibilities.has(item))) return false;
      }
      return true;
    });
  }, [scholarships, filters]);

  const handleHighlightClick = (filterType: 'active' | 'countries' | 'deadline', scholarship?: ScholarshipPreview) => {
    if (scholarship) {
      setSelectedScholarship(scholarship);
    }
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <>
      <div ref={heroRef}>
        <FeaturedHero scholarships={featured} onSelect={setSelectedScholarship} />
      </div>
      <ScholarshipHighlights
        scholarships={filteredScholarships}
        onHighlightClick={handleHighlightClick}
        filters={filters}
        onFilterChange={setFilters}
      />
      <ScholarshipGridWrapper
        scholarships={scholarships}
        heroRef={heroRef}
        onFiltersChange={handleFiltersChange}
        externalFilters={filters}
      />
      <ScholarshipModal
        open={Boolean(selectedScholarship)}
        onClose={() => setSelectedScholarship(null)}
        scholarship={selectedScholarship}
        allScholarships={filteredScholarships}
        onNavigate={setSelectedScholarship}
      />
    </>
  );
}
