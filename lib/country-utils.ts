/**
 * Normalizes country names and extracts clean country identifiers
 * from verbose scholarship location strings.
 */

// Country name mappings (short to full)
const COUNTRY_ALIASES: Record<string, string> = {
  'uk': 'United Kingdom',
  'usa': 'United States',
  'us': 'United States',
  'uae': 'United Arab Emirates',
  'sar': 'Saudi Arabia',
};

// Common city-to-country mappings
const CITY_TO_COUNTRY: Record<string, string> = {
  'london': 'United Kingdom',
  'edinburgh': 'United Kingdom',
  'birmingham': 'United Kingdom',
  'bristol': 'United Kingdom',
  'cambridge': 'United Kingdom',
  'oxford': 'United Kingdom',
  'nottingham': 'United Kingdom',
  'liverpool': 'United Kingdom',
  'coventry': 'United Kingdom',
  'toronto': 'Canada',
  'beijing': 'China',
  'shanghai': 'China',
  'hong kong': 'China',
  'hongkong': 'China',
  'zurich': 'Switzerland',
  'geneva': 'Switzerland',
  'paris': 'France',
  'reims': 'France',
  'delft': 'Netherlands',
  'groningen': 'Netherlands',
  'amsterdam': 'Netherlands',
  'nijmegen': 'Netherlands',
  'enschede': 'Netherlands',
  'maastricht': 'Netherlands',
  'leuven': 'Belgium',
  'gothenburg': 'Sweden',
  'uppsala': 'Sweden',
  'lund': 'Sweden',
  'stockholm': 'Sweden',
  'roskilde': 'Denmark',
  'thuwal': 'Saudi Arabia',
  'melbourne': 'Australia',
  'sydney': 'Australia',
  'oregon': 'United States',
};

// Known country names (for validation)
const KNOWN_COUNTRIES = new Set([
  'United Kingdom',
  'United States',
  'Netherlands',
  'Spain',
  'Austria',
  'Switzerland',
  'Thailand',
  'Turkey',
  'Singapore',
  'South Korea',
  'Sweden',
  'New Zealand',
  'Oman',
  'Portugal',
  'Qatar',
  'Russia',
  'Saudi Arabia',
  'Italy',
  'Japan',
  'Iceland',
  'Hungary',
  'Germany',
  'China',
  'Canada',
  'France',
  'Finland',
  'India',
  'Denmark',
  'Belgium',
  'Australia',
  'Uganda',
  'Global',
  'Various',
  'Multiple',
]);

/**
 * Normalizes a single country string
 */
function normalizeCountryName(raw: string): string {
  const normalized = raw.trim().toLowerCase();

  // Check if it's an alias
  if (COUNTRY_ALIASES[normalized]) {
    return COUNTRY_ALIASES[normalized];
  }

  // Check if it's a city
  for (const [city, country] of Object.entries(CITY_TO_COUNTRY)) {
    if (normalized.includes(city)) {
      return country;
    }
  }

  // Check if it matches a known country (case-insensitive)
  for (const country of KNOWN_COUNTRIES) {
    if (normalized === country.toLowerCase()) {
      return country;
    }
  }

  // If not found, capitalize first letter of each word
  return raw
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Extracts clean country names from a verbose location string
 */
export function extractCountries(locationString: string): string[] {
  const countries = new Set<string>();

  // Normalize the input
  const normalized = locationString.trim();

  // Handle empty or null
  if (!normalized) {
    return ['Global'];
  }

  // Handle common multi-country patterns
  if (normalized.toLowerCase().includes('multi') ||
      normalized.toLowerCase().includes('various') ||
      normalized.toLowerCase().includes('multiple universities')) {

    // Try to extract specific countries mentioned
    const parts = normalized.split(/\s+/);
    parts.forEach(part => {
      const clean = part.replace(/[^a-zA-Z]/g, '');
      if (clean.length > 2) {
        const country = normalizeCountryName(clean);
        if (KNOWN_COUNTRIES.has(country)) {
          countries.add(country);
        }
      }
    });

    // If we found specific countries, return them, otherwise return Multiple
    if (countries.size > 0) {
      return Array.from(countries);
    }
    return ['Multiple'];
  }

  // Handle "Remote" or online delivery
  if (normalized.toLowerCase().includes('remote') ||
      normalized.toLowerCase().includes('online')) {
    // Extract base country if mentioned
    const words = normalized.split(/\s+/);
    for (const word of words) {
      const country = normalizeCountryName(word);
      if (KNOWN_COUNTRIES.has(country)) {
        countries.add(country);
        break;
      }
    }
    if (countries.size === 0) {
      return ['Global'];
    }
    return Array.from(countries);
  }

  // Split by common delimiters
  const parts = normalized.split(/[,;]|\s+/).filter(p => p.trim());

  for (const part of parts) {
    const cleaned = part.trim();

    // Skip university names, institution codes, etc.
    if (cleaned.toLowerCase().includes('university') ||
        cleaned.toLowerCase().includes('institut') ||
        cleaned.toLowerCase().includes('nus') ||
        cleaned.toLowerCase().includes('ntu') ||
        cleaned.toLowerCase().includes('smu') ||
        cleaned.toLowerCase().includes('sutd') ||
        cleaned.toLowerCase().includes('cas') ||
        cleaned.toLowerCase().includes('ucas') ||
        cleaned.toLowerCase().includes('ustc') ||
        cleaned.length < 3) {
      continue;
    }

    const country = normalizeCountryName(cleaned);

    // Only add if it's a known country or a city we can map
    if (KNOWN_COUNTRIES.has(country) || CITY_TO_COUNTRY[cleaned.toLowerCase()]) {
      countries.add(country);
    }
  }

  // If we couldn't extract any countries, try one more time with the first word
  if (countries.size === 0) {
    const firstWord = normalized.split(/\s+/)[0];
    const country = normalizeCountryName(firstWord);
    if (KNOWN_COUNTRIES.has(country)) {
      countries.add(country);
    } else {
      // Default to Global if we really can't determine
      return ['Global'];
    }
  }

  return Array.from(countries);
}

/**
 * Normalizes an array of country strings
 */
export function normalizeCountries(countries: string[]): string[] {
  if (!countries || countries.length === 0) {
    return ['Global'];
  }

  const normalized = new Set<string>();

  for (const country of countries) {
    const extracted = extractCountries(country);
    extracted.forEach(c => normalized.add(c));
  }

  return Array.from(normalized).sort();
}
