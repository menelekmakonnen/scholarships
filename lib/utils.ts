import crypto from 'node:crypto';
import { parse, isValid } from 'date-fns';
import type { ScholarshipLevel } from './types';

const LEVEL_KEYWORDS: Record<string, ScholarshipLevel> = {
  undergraduate: 'Undergraduate',
  bachelor: 'Undergraduate',
  bachelors: 'Undergraduate',
  master: 'Masters',
  masters: 'Masters',
  postgraduate: 'Masters',
  graduate: 'Masters',
  phd: 'PhD',
  doctor: 'PhD',
  doctoral: 'PhD',
  doctorate: 'PhD',
  postdoc: 'Postdoctoral',
  postdoctoral: 'Postdoctoral',
  research: 'Research',
  researcher: 'Research',
  fellowship: 'Fellowship',
  fellow: 'Fellowship'
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

export function normalizeList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[\n,;/\\]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
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
  });
  if (levels.size === 0) {
    return ['Other'];
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
  let parsedDate: Date | null = null;
  for (const format of DATE_FORMATS) {
    const parsed = parse(trimmed, format, new Date());
    if (isValid(parsed)) {
      parsedDate = parsed;
      break;
    }
  }
  if (!parsedDate) {
    const auto = new Date(trimmed);
    if (isValid(auto)) {
      parsedDate = auto;
    }
  }
  return { label: trimmed, date: parsedDate };
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
