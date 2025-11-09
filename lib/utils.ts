import crypto from 'node:crypto';
import { parse, isValid, format } from 'date-fns';
import type { ScholarshipLevel } from './types';

const LEVEL_KEYWORDS: Record<string, ScholarshipLevel> = {
  undergraduate: 'Undergraduate',
  bachelor: 'Undergraduate',
  bachelors: 'Undergraduate',
  foundation: 'Undergraduate',
  master: 'Masters',
  masters: 'Masters',
  postgraduate: 'Postgraduate',
  graduate: 'Postgraduate',
  postgrad: 'Postgraduate',
  phd: 'PhD',
  doctor: 'PhD',
  doctoral: 'PhD',
  doctorate: 'PhD',
  postdoc: 'Postdoctoral',
  postdoctoral: 'Postdoctoral',
  research: 'Research',
  researcher: 'Research',
  fellowship: 'Fellowship',
  fellow: 'Fellowship',
  professional: 'Professional',
  executive: 'Professional',
  diploma: 'Professional',
  certificate: 'Professional',
  mba: 'MBA',
  'business administration': 'MBA'
};

const DATE_FORMATS = [
  'd MMMM yyyy',
  'd MMM yyyy',
  'MMMM d, yyyy',
  'MMM d, yyyy',
  'yyyy-MM-dd',
  'MM/dd/yyyy',
  'dd/MM/yyyy',
  'MMMM yyyy',
  'MMM yyyy'
];

const LIST_SEPARATORS = /[\n,;\/\\|•·]+/;

export function normalizeList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(LIST_SEPARATORS)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function normalizeTextBlock(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalised = value
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n\n');
  return normalised.length > 0 ? normalised : null;
}

export function normalizeLevels(value: string | null | undefined): ScholarshipLevel[] {
  const tokens = normalizeList(value).flatMap((chunk) => chunk.split(/\s+-\s+|\s+and\s+/i));
  const levels = new Set<ScholarshipLevel>();
  tokens.forEach((token) => {
    const normalized = token.toLowerCase();
    for (const [keyword, level] of Object.entries(LEVEL_KEYWORDS)) {
      if (normalized.includes(keyword)) {
        levels.add(level);
      }
    }
    if (/(any|all|various|multiple)/i.test(normalized)) {
      levels.add('Undergraduate');
      levels.add('Postgraduate');
    }
  });
  if (levels.size === 0) {
    return ['Postgraduate'];
  }
  return Array.from(levels);
}

export function parseDeadline(value: string | null | undefined): { label: string; date: Date | null } {
  if (!value) return { label: 'Rolling', date: null };
  const trimmed = value.trim();
  if (!trimmed) return { label: 'Rolling', date: null };
  if (/rolling|open|varies|ongoing|tba|not available|n\/a/i.test(trimmed)) {
    return { label: capitalize(trimmed), date: null };
  }
  const normaliseMidday = (date: Date) => {
    const clone = new Date(date.getTime());
    clone.setHours(12, 0, 0, 0);
    return clone;
  };
  const dateFormula = trimmed.match(/date\s*\(\s*(\d{4})\s*,\s*(\d{1,2})\s*,\s*(\d{1,2})\s*\)/i);
  if (dateFormula) {
    const [, y, m, d] = dateFormula;
    const parsed = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), 12));
    if (isValid(parsed)) {
      const label = format(parsed, 'EEEE, MMMM do, yyyy');
      return { label, date: parsed };
    }
  }
  let parsedDate: Date | null = null;
  for (const format of DATE_FORMATS) {
    const parsed = parse(trimmed, format, new Date());
    if (isValid(parsed)) {
      parsedDate = normaliseMidday(parsed);
      break;
    }
  }
  if (!parsedDate) {
    const auto = new Date(trimmed);
    if (isValid(auto)) {
      parsedDate = normaliseMidday(auto);
    }
  }
  if (parsedDate) {
    const label = format(parsedDate, 'EEEE, MMMM do, yyyy');
    return { label, date: parsedDate };
  }
  return { label: capitalize(trimmed), date: null };
}

export function createScholarshipId(name: string, link: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const hash = crypto.createHash('md5').update(`${name}-${link}`).digest('hex').slice(0, 8);
  return `${slug}-${hash}`;
}

export function capitalize(input: string): string {
  return input
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

export function normalizeUrl(candidate: string, baseUrl: string): string {
  try {
    return new URL(candidate, baseUrl).toString();
  } catch (error) {
    return candidate;
  }
}
