'use client';

import { useState, useRef, useMemo } from 'react';
import { FeaturedHero } from '@/components/featured-hero';
import { ScholarshipHighlights } from '@/components/scholarship-highlights';
import { ScholarshipGridWrapper } from '@/components/scholarship-grid-wrapper';
import { ScholarshipModal } from '@/components/scholarship-modal';
import { SSFBar, type SortOption, type SortDirection } from '@/components/ssf-bar';
import { FilterPanel, type FilterState } from '@/components/filter-panel';
import type { ScholarshipPreview } from '@/lib/types';

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
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('deadline');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterOpen, setFilterOpen] = useState(false);
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

  const handleHighlightClick = (filterType: 'active' | 'countries' | 'deadline') => {
    // Will be implemented to apply filters or show modal
  };

  const handleCountryFilter = (country: string) => {
    setFilters((prev) => {
      const newCountries = new Set(prev.countries);
      newCountries.add(country);
      return {
        ...prev,
        countries: newCountries
      };
    });
  };

  const handleFundingTypeFilter = (fundingType: string) => {
    setFilters((prev) => {
      const newFundingTypes = new Set(prev.fundingTypes);
      newFundingTypes.add(fundingType);
      return {
        ...prev,
        fundingTypes: newFundingTypes
      };
    });
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: SortOption, newDirection: SortDirection) => {
    setSort(newSort);
    setSortDirection(newDirection);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.levels.size > 0 ||
      filters.countries.size > 0 ||
      filters.fundingTypes.size > 0 ||
      filters.modalities.size > 0 ||
      filters.eligibilities.size > 0
    );
  }, [filters]);

  const handleClearFilters = () => {
    setFilters({
      levels: new Set(),
      countries: new Set(),
      fundingTypes: new Set(),
      modalities: new Set(),
      eligibilities: new Set(),
      showExpired: filters.showExpired
    });
  };

  // Generate filter options
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

  return (
    <>
      <div ref={heroRef}>
        <FeaturedHero scholarships={featured} onSelect={setSelectedScholarship} />
      </div>

      <SSFBar
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onFilterClick={() => setFilterOpen(true)}
        heroRef={heroRef}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      <ScholarshipHighlights
        scholarships={filteredScholarships}
        onFilterClick={handleHighlightClick}
        onScholarshipSelect={setSelectedScholarship}
        onCountryFilter={handleCountryFilter}
        onFundingTypeFilter={handleFundingTypeFilter}
      />

      <ScholarshipGridWrapper
        scholarships={scholarships}
        externalFilters={filters}
        initialSearch={search}
        initialSort={`${sort}-${sortDirection}` as any}
      />

      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        state={filters}
        onUpdate={(updater) => setFilters(updater)}
        levelOptions={levelOptions}
        countryOptions={countryOptions}
        fundingTypeOptions={fundingTypeOptions}
        modalityOptions={modalityOptions}
        eligibilityOptions={eligibilityOptions}
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
