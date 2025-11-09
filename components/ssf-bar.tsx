'use client';

import { useEffect, useRef, useState } from 'react';
import { IconAdjustments, IconChevronDown, IconMagnifier, IconXMark } from './icons';
import clsx from 'clsx';

export type SortOption = 'deadline' | 'name' | 'country';
export type SortDirection = 'asc' | 'desc';

interface SSFBarProps {
  search: string;
  onSearchChange: (search: string) => void;
  sort: SortOption;
  sortDirection: SortDirection;
  onSortChange: (sort: SortOption, direction: SortDirection) => void;
  onFilterClick: () => void;
  heroRef?: React.RefObject<HTMLDivElement>;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'deadline', label: 'Deadline' },
  { value: 'name', label: 'Name' },
  { value: 'country', label: 'Country' }
];

export function SSFBar({
  search,
  onSearchChange,
  sort,
  sortDirection,
  onSortChange,
  onFilterClick,
  heroRef,
  hasActiveFilters = false,
  onClearFilters
}: SSFBarProps) {
  const [isSticky, setIsSticky] = useState(false);

  // Smart SSF bar positioning
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef?.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        const shouldStick = heroBottom < 0;
        setIsSticky(shouldStick);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [heroRef]);

  const handleSortClick = (clickedSort: SortOption) => {
    // Always call with the clicked sort option and current direction
    // Parent will decide whether to toggle direction or reset
    if (clickedSort === sort) {
      // Same sort option, toggle direction
      const newDirection: SortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      onSortChange(clickedSort, newDirection);
    } else {
      // Different sort option, start with asc
      onSortChange(clickedSort, 'asc');
    }
  };

  return (
    <div
      className={clsx(
        'transition-all duration-300 z-40',
        isSticky
          ? 'fixed top-0 left-0 right-0 bg-white/95 dark:bg-luxe-ebony/95 backdrop-blur-xl shadow-lg border-b border-black/10 dark:border-white/10 py-3'
          : 'relative py-4'
      )}
    >
      <div className={clsx('mx-auto', isSticky ? 'max-w-7xl px-5 sm:px-8 lg:px-10' : '')}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <input
              type="search"
              placeholder="Search scholarships"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full rounded-full border border-black/10 bg-white/70 px-5 py-2.5 text-sm text-luxe-ebony placeholder:text-luxe-ash focus:border-luxe-gold/40 focus:outline-none focus:ring-2 focus:ring-luxe-gold/30 dark:border-white/10 dark:bg-white/10 dark:text-luxe-ivory"
            />
            <IconMagnifier className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-luxe-ash dark:text-luxe-ash/70" />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            {SORT_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => handleSortClick(option.value)}
                className={clsx(
                  'rounded-full border px-4 py-2.5 text-xs uppercase tracking-[0.3em] transition',
                  sort === option.value
                    ? 'border-luxe-gold/60 bg-luxe-gold/20 text-luxe-ebony dark:text-luxe-ivory font-semibold'
                    : 'border-luxe-gold/30 bg-white/50 text-luxe-ash hover:border-luxe-gold/50 hover:bg-luxe-gold/10 dark:bg-white/5'
                )}
              >
                {option.label}
                {sort === option.value && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            ))}
          </div>

          {/* Clear Filters (if active) */}
          {hasActiveFilters && onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="flex items-center gap-2 rounded-full border border-red-400/40 bg-red-50/50 px-4 py-2.5 text-xs uppercase tracking-[0.3em] text-red-600 transition hover:border-red-400/70 hover:bg-red-100/50 dark:border-red-400/30 dark:bg-red-900/20 dark:text-red-400"
            >
              <IconXMark className="h-4 w-4" />
              Clear
            </button>
          )}

          {/* Filters */}
          <button
            type="button"
            onClick={onFilterClick}
            className="flex items-center gap-2 rounded-full border border-luxe-gold/40 bg-gradient-to-r from-luxe-gold/20 to-transparent px-5 py-2.5 text-xs uppercase tracking-[0.3em] text-luxe-ebony transition hover:border-luxe-gold/70 hover:text-luxe-gold dark:text-luxe-ivory"
          >
            <IconAdjustments className="h-5 w-5" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 flex h-2 w-2 rounded-full bg-luxe-gold"></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
