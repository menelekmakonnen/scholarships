import type { ScholarshipPreview } from './types';

function formatList(values: string[], conjunction = 'and'): string {
  if (values.length === 0) {
    return '';
  }
  if (values.length === 1) {
    return values[0];
  }
  if (values.length === 2) {
    return `${values[0]} ${conjunction} ${values[1]}`;
  }
  const last = values[values.length - 1];
  return `${values.slice(0, -1).join(', ')}, ${conjunction} ${last}`;
}

export function buildScholarshipExcerpt(scholarship: ScholarshipPreview): string {
  if (scholarship.sheetSummary) {
    return scholarship.sheetSummary;
  }

  const location = scholarship.countries.length ? formatList(scholarship.countries) : 'global talent';
  const level = scholarship.levelTags.length ? formatList(scholarship.levelTags) : 'exceptional scholars';
  const fundingDescriptor = scholarship.fundingType
    ? `${scholarship.fundingType.toLowerCase()} funding`
    : 'comprehensive support';
  const organisation = scholarship.organisation ?? 'world-leading partners';
  const coverage = scholarship.coverage.slice(0, 3);
  const coverageText = coverage.length
    ? `Highlights include ${formatList(coverage, 'and').toLowerCase()}.`
    : 'Comprehensive benefits support your journey abroad.';
  const deadline = scholarship.deadlineLabel || 'a rolling review timeline';
  return `${scholarship.name} partners with ${organisation} to back ${level.toLowerCase()} pursuing opportunities in ${location}. This ${fundingDescriptor} package ${coverageText} Submit your application by ${deadline}.`;
}

export function buildScholarshipImageAlt(scholarship: ScholarshipPreview): string {
  const location = scholarship.countries.length ? formatList(scholarship.countries) : 'global destinations';
  const level = scholarship.levelTags.length ? formatList(scholarship.levelTags) : 'emerging leaders';
  return `${scholarship.name} scholarship imagery celebrating ${level.toLowerCase()} heading to ${location}.`;
}
