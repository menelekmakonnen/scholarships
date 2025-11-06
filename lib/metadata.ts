import { load } from 'cheerio';
import { normalizeUrl, unique } from './utils';
import type { Scholarship, ScholarshipDetail, ScholarshipPreview } from './types';
import { buildScholarshipExcerpt } from './presenters';

interface MetadataResult {
  images: string[];
  summary: string | null;
  longDescription: string | null;
}

const metadataCache = new Map<string, { expiresAt: number; value: MetadataResult }>();

const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

const DESCRIPTION_SELECTORS = [
  'meta[name="description"]',
  'meta[property="og:description"]',
  'meta[name="twitter:description"]'
];

const IMAGE_SELECTORS = [
  'meta[property="og:image"]',
  'meta[name="twitter:image"]',
  'link[rel="image_src"]'
];

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch metadata from ${url} (${response.status})`);
  }

  return await response.text();
}

function extractDescriptions($: ReturnType<typeof load>): { summary: string | null; long: string | null } {
  for (const selector of DESCRIPTION_SELECTORS) {
    const content = $(selector).attr('content');
    if (content) {
      return { summary: content.trim(), long: null };
    }
  }

  const paragraphs = $('article p, main p, body p')
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((text) => text.length > 60);

  if (paragraphs.length > 0) {
    const summary = paragraphs[0];
    const long = paragraphs.slice(0, 6).join('\n\n');
    return { summary, long };
  }

  return { summary: null, long: null };
}

function extractImages(url: string, $: ReturnType<typeof load>): string[] {
  const candidates: string[] = [];
  for (const selector of IMAGE_SELECTORS) {
    const content = $(selector).attr('content') ?? $(selector).attr('href');
    if (content) {
      candidates.push(normalizeUrl(content, url));
    }
  }

  $('img').each((_, img) => {
    const source = $(img).attr('data-src') ?? $(img).attr('src');
    if (source) {
      candidates.push(normalizeUrl(source, url));
    }
  });

  const uniqueUrls = unique(candidates.filter(Boolean));
  return uniqueUrls.slice(0, 10);
}

export async function resolveScholarshipMetadata(scholarship: ScholarshipPreview): Promise<ScholarshipDetail> {
  const cached = metadataCache.get(scholarship.link);
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return {
      ...scholarship,
      images: cached.value.images,
      summary: cached.value.summary,
      longDescription: cached.value.longDescription
    };
  }

  try {
    const html = await fetchHtml(scholarship.link);
    const $ = load(html);
    const images = extractImages(scholarship.link, $);
    const { summary, long } = extractDescriptions($);

    const fallbackSummary = buildScholarshipExcerpt(scholarship);
    const resolved: MetadataResult = {
      images,
      summary: summary ?? long ?? fallbackSummary,
      longDescription: long ?? summary ?? fallbackSummary
    };

    metadataCache.set(scholarship.link, { expiresAt: now + CACHE_TTL, value: resolved });

    return {
      ...scholarship,
      images: resolved.images,
      summary: resolved.summary,
      longDescription: resolved.longDescription
    };
  } catch (error) {
    console.error('Metadata resolution failed', error);
    const fallbackSummary = buildScholarshipExcerpt(scholarship);
    return {
      ...scholarship,
      images: scholarship.previewImage ? [scholarship.previewImage] : [],
      summary: scholarship.shortDescription ?? fallbackSummary,
      longDescription: scholarship.shortDescription ?? fallbackSummary
    };
  }
}

export async function enrichScholarshipPreview(scholarship: Scholarship): Promise<ScholarshipPreview> {
  const cached = metadataCache.get(scholarship.link);
  if (cached) {
    const fallbackSummary = buildScholarshipExcerpt(scholarship);
    return {
      ...scholarship,
      previewImage: cached.value.images[0] ?? null,
      shortDescription: cached.value.summary ?? cached.value.longDescription ?? fallbackSummary
    };
  }

  try {
    const html = await fetchHtml(scholarship.link);
    const $ = load(html);
    const images = extractImages(scholarship.link, $);
    const { summary, long } = extractDescriptions($);

    const fallbackSummary = buildScholarshipExcerpt(scholarship);
    const resolved: MetadataResult = {
      images,
      summary: summary ?? long ?? fallbackSummary,
      longDescription: long ?? summary ?? fallbackSummary
    };

    metadataCache.set(scholarship.link, { expiresAt: Date.now() + CACHE_TTL, value: resolved });

    return {
      ...scholarship,
      previewImage: resolved.images[0] ?? null,
      shortDescription: resolved.summary ?? resolved.longDescription ?? fallbackSummary
    };
  } catch (error) {
    console.error('Preview metadata fetch failed', error);
    const fallbackSummary = buildScholarshipExcerpt(scholarship);
    return {
      ...scholarship,
      previewImage: null,
      shortDescription: scholarship.shortDescription ?? fallbackSummary
    };
  }
}
