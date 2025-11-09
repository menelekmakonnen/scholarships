import { cache } from 'react';
import {
  normalizeLevels,
  normalizeList,
  parseDeadline,
  createScholarshipId,
  normalizeTextBlock,
  capitalize,
  unique
} from './utils';
import type { Scholarship } from './types';

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1OELmrzg_nTghtK52_YbZ-I-pCntdeuxqHxWfF8W4EZU/gviz/tq?tqx=out:json';

interface GoogleRow {
  c: Array<{ v: string | null } | null>;
}

interface GoogleColumn {
  label: string;
}

interface GoogleResponse {
  table: {
    cols: GoogleColumn[];
    rows: GoogleRow[];
  };
}

const COLUMN_ALIASES: Record<
  | 'name'
  | 'country'
  | 'level'
  | 'coverage'
  | 'deadline'
  | 'link'
  | 'fundingType'
  | 'organisation'
  | 'shortSummary'
  | 'detailedBreakdown'
  | 'eligibility'
  | 'subjects'
  | 'modality',
  string[]
> = {
  name: ['scholarship name', 'name'],
  country: ['country', 'countries'],
  level: ['level', 'study level'],
  coverage: ['coverage', 'benefits'],
  deadline: ['deadline', 'application deadline'],
  link: ['link to apply', 'link', 'application link'],
  fundingType: ['type of funding', 'funding type'],
  organisation: ['organisation offering the scholarship', 'organization offering the scholarship', 'provider'],
  shortSummary: ['short summary', 'overview'],
  detailedBreakdown: ['detailed breakdown', 'breakdown'],
  eligibility: ['eligibility criteria', 'eligibility'],
  subjects: ['available subjects', 'fields of study'],
  modality: ['on-campus or remote', 'mode', 'delivery']
};

type ColumnKey = keyof typeof COLUMN_ALIASES;

function normaliseHeader(label: string | undefined): string {
  return (label ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function buildColumnIndex(columns: GoogleColumn[]): Partial<Record<ColumnKey, number>> {
  const index: Partial<Record<ColumnKey, number>> = {};
  columns.forEach((column, columnIndex) => {
    const header = normaliseHeader(column.label);
    if (!header) return;
    (Object.entries(COLUMN_ALIASES) as Array<[ColumnKey, string[]]>).forEach(([key, candidates]) => {
      if (index[key] !== undefined) return;
      const match = candidates.some((candidate) => normaliseHeader(candidate) === header);
      if (match) {
        index[key] = columnIndex;
      }
    });
  });
  return index;
}

function readCell(cells: GoogleRow['c'], indexMap: Partial<Record<ColumnKey, number>>, key: ColumnKey): string | null {
  const index = indexMap[key];
  if (index === undefined) return null;
  const cell = cells?.[index];
  if (!cell || cell.v == null) return null;
  const value = String(cell.v).trim();
  return value.length ? value : null;
}

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

function mapRow(row: GoogleRow, columnIndex: Partial<Record<ColumnKey, number>>): Scholarship | null {
  const cells = row.c;
  const name = readCell(cells, columnIndex, 'name');
  const link = readCell(cells, columnIndex, 'link');
  if (!name || !link) return null;
  const countries = unique(normalizeList(readCell(cells, columnIndex, 'country')));
  const levelTags = normalizeLevels(readCell(cells, columnIndex, 'level') ?? '');
  const coverage = unique(normalizeList(readCell(cells, columnIndex, 'coverage'))).map(capitalize);
  const fundingTypeRaw = normalizeTextBlock(readCell(cells, columnIndex, 'fundingType'));
  const fundingType = fundingTypeRaw ? capitalize(fundingTypeRaw) : null;
  const organisation = normalizeTextBlock(readCell(cells, columnIndex, 'organisation'));
  const sheetSummary = normalizeTextBlock(readCell(cells, columnIndex, 'shortSummary'));
  const sheetBreakdown = normalizeTextBlock(readCell(cells, columnIndex, 'detailedBreakdown'));
  const eligibility = unique(normalizeList(readCell(cells, columnIndex, 'eligibility')));
  const subjects = unique(normalizeList(readCell(cells, columnIndex, 'subjects')));
  const deliveryModes = unique(normalizeList(readCell(cells, columnIndex, 'modality'))).map(capitalize);
  const { label: deadlineLabel, date } = parseDeadline(readCell(cells, columnIndex, 'deadline') ?? '');
  const id = createScholarshipId(name, link);
  return {
    id,
    name,
    countries,
    levelTags,
    coverage,
    fundingType,
    organisation,
    deadlineLabel,
    deadlineDate: date ? date.toISOString() : null,
    isExpired: date ? date.getTime() < Date.now() : false,
    link,
    previewImage: null,
    shortDescription: sheetSummary,
    sheetSummary,
    sheetBreakdown,
    eligibility,
    subjects,
    deliveryModes,
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
  const columnIndex = buildColumnIndex(parsed.table.cols);
  if (columnIndex.name === undefined || columnIndex.link === undefined) {
    throw new Error('Required columns missing in Google Sheet response');
  }
  const scholarships = parsed.table.rows
    .map((row) => mapRow(row, columnIndex))
    .filter((item): item is Scholarship => Boolean(item));
  return scholarships;
}

export const getScholarships = cache(async () => {
  const entries = await fetchSheet();
  entries.sort((a, b) => a.name.localeCompare(b.name));
  return entries;
});
