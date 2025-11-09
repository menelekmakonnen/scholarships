'use client';

import { useState, useRef } from 'react';
import { FeaturedHero } from '@/components/featured-hero';
import { ScholarshipHighlights } from '@/components/scholarship-highlights';
import { ScholarshipGridWrapper } from '@/components/scholarship-grid-wrapper';
import { ScholarshipModal } from '@/components/scholarship-modal';
import type { ScholarshipPreview } from '@/lib/types';

interface PageClientProps {
  featured: ScholarshipPreview[];
  scholarships: ScholarshipPreview[];
}

export function PageClient({ featured, scholarships }: PageClientProps) {
  const [selectedScholarship, setSelectedScholarship] = useState<ScholarshipPreview | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleHighlightClick = (filterType: 'active' | 'countries' | 'deadline') => {
    // Scroll to the grid
    if (gridRef.current) {
      const yOffset = -100; // Offset for the sticky header
      const y = gridRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <FeaturedHero scholarships={featured} onSelect={setSelectedScholarship} />
      <ScholarshipHighlights scholarships={scholarships} onFilterClick={handleHighlightClick} />
      <div ref={gridRef}>
        <ScholarshipGridWrapper scholarships={scholarships} />
      </div>
      <ScholarshipModal
        open={Boolean(selectedScholarship)}
        onClose={() => setSelectedScholarship(null)}
        scholarship={selectedScholarship}
      />
    </>
  );
}
