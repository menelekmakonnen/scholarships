import { cache } from 'react';
import { normalizeLevels, normalizeList, parseDeadline, createScholarshipId } from './utils';
import type { Scholarship } from './types';

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1N1kbNjScNxfj48X2HXDFFgSUPxnl22UeJl13O3a16is/gviz/tq?tqx=out:json';

interface GoogleRow {
  c: Array<{ v: string | null } | null>;
}

interface GoogleResponse {
  table: {
    rows: GoogleRow[];
  };
}

const COLUMN_MAP = {
  name: 0,
  country: 1,
  level: 2,
  coverage: 3,
  deadline: 4,
  link: 5
} as const;

type SheetScholarship = Required<typeof COLUMN_MAP>;

function parseResponse(payload: string): GoogleResponse {
  const marker = 'google.visualization.Query.setResponse(';
  const markerIndex = payload.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error('Unexpected Google Sheets response format: missing response wrapper');
  }

  const jsonStart = payload.indexOf('{', markerIndex + marker.length);
  const jsonEnd = payload.lastIndexOf('}');

  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    throw new Error('Unexpected Google Sheets response format: unable to locate JSON payload');
  }

  const jsonText = payload.slice(jsonStart, jsonEnd + 1);

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    throw new Error('Failed to parse Google Sheets payload');
  }
}

function mapRow(row: GoogleRow): Scholarship | null {
  const cells = row.c;
  const name = cells?.[COLUMN_MAP.name]?.v?.trim();
  const link = cells?.[COLUMN_MAP.link]?.v?.trim();
  if (!name || !link) return null;
  const countries = normalizeList(cells?.[COLUMN_MAP.country]?.v ?? '');
  const levelTags = normalizeLevels(cells?.[COLUMN_MAP.level]?.v ?? '');
  const coverage = normalizeList(cells?.[COLUMN_MAP.coverage]?.v ?? '');
  const { label: deadlineLabel, date } = parseDeadline(cells?.[COLUMN_MAP.deadline]?.v ?? '');
  const id = createScholarshipId(name, link);
  return {
    id,
    name,
    countries,
    levelTags,
    coverage,
    deadlineLabel,
    deadlineDate: date ? date.toISOString() : null,
    isExpired: date ? date.getTime() < Date.now() : false,
    link,
    previewImage: null,
    shortDescription: null,
    metadataRefreshedAt: null
  };
}

async function fetchSheet(): Promise<Scholarship[]> {
  const response = await fetch(SHEET_URL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
    },
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch spreadsheet: ${response.status}`);
  }

  const text = await response.text();
  const parsed = parseResponse(text);
  const scholarships = parsed.table.rows
    .map((row) => mapRow(row))
    .filter((item): item is Scholarship => Boolean(item));
  return scholarships;
}

export const getScholarships = cache(async () => {
  const entries = await fetchSheet();
  entries.sort((a, b) => a.name.localeCompare(b.name));
  return entries;
});
