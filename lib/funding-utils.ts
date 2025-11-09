/**
 * Determines the comprehensive funding category for a scholarship
 * based on its fundingType field and coverage array.
 *
 * Returns one of 4 categories:
 * - "Full": Full funding only
 * - "Partial": Partial funding only
 * - "Full (and more)": Full funding with additional benefits
 * - "Partial (and more)": Partial funding with additional benefits
 */
export function determineFundingCategory(
  fundingType: string | null,
  coverage: string[]
): 'Full' | 'Partial' | 'Full (and more)' | 'Partial (and more)' | null {
  // If no funding type, try to infer from coverage
  let inferredType: 'full' | 'partial' | null = null;

  if (fundingType) {
    const normalizedType = fundingType.toLowerCase();
    if (normalizedType.includes('full')) {
      inferredType = 'full';
    } else if (normalizedType.includes('partial')) {
      inferredType = 'partial';
    }
  }

  // If still no type, try to infer from coverage items
  if (!inferredType && coverage.length > 0) {
    const coverageText = coverage.join(' ').toLowerCase();

    // Keywords that suggest full funding
    const fullKeywords = ['full tuition', 'full coverage', 'fully funded', 'complete funding'];
    // Keywords that suggest partial funding
    const partialKeywords = ['partial tuition', 'partial coverage', 'partial support'];

    if (fullKeywords.some(keyword => coverageText.includes(keyword))) {
      inferredType = 'full';
    } else if (partialKeywords.some(keyword => coverageText.includes(keyword))) {
      inferredType = 'partial';
    } else if (coverage.length >= 3) {
      // If 3+ coverage items, likely comprehensive (full)
      inferredType = 'full';
    } else if (coverage.length >= 1) {
      // If 1-2 coverage items, likely partial
      inferredType = 'partial';
    }
  }

  if (!inferredType) {
    return null;
  }

  // Determine if there are additional benefits beyond base tuition funding
  // Look for benefits like living allowance, stipend, travel, accommodation, etc.
  const coverageText = coverage.join(' ').toLowerCase();
  const additionalBenefitKeywords = [
    'living allowance',
    'stipend',
    'travel',
    'accommodation',
    'housing',
    'meals',
    'flight',
    'airfare',
    'relocation',
    'book allowance',
    'research grant',
    'conference'
  ];

  const hasAdditionalBenefits = additionalBenefitKeywords.some(keyword =>
    coverageText.includes(keyword)
  );

  if (inferredType === 'full') {
    return hasAdditionalBenefits ? 'Full (and more)' : 'Full';
  } else {
    return hasAdditionalBenefits ? 'Partial (and more)' : 'Partial';
  }
}

/**
 * Get all possible funding categories for filter options
 */
export function getAllFundingCategories(): string[] {
  return ['Full', 'Partial', 'Full (and more)', 'Partial (and more)'];
}
