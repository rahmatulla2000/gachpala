/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove non-word chars
    .replace(/[\s_-]+/g, '-')   // spaces/underscores → hyphens
    .replace(/^-+|-+$/g, '');   // trim leading/trailing hyphens
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Truncate text to a given length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Format a date to a human-readable string
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Format relative time
 */
export function timeAgo(date: Date | string): string {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Get confidence level label
 */
export function getConfidenceLevel(confidence: number): {
  label: string;
  color: string;
} {
  if (confidence >= 0.9) return { label: 'Very High', color: 'text-green-600' };
  if (confidence >= 0.7) return { label: 'High', color: 'text-green-500' };
  if (confidence >= 0.5) return { label: 'Moderate', color: 'text-yellow-600' };
  if (confidence >= 0.3) return { label: 'Low', color: 'text-orange-500' };
  return { label: 'Very Low', color: 'text-red-500' };
}

/**
 * Sanitize string input
 */
export function sanitize(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Get image placeholder based on type
 */
export function getImagePlaceholder(type: string): string {
  const placeholders: Record<string, string> = {
    full_tree: '/images/placeholder-tree.jpg',
    leaf: '/images/placeholder-leaf.jpg',
    flower: '/images/placeholder-flower.jpg',
    fruit: '/images/placeholder-fruit.jpg',
    bark: '/images/placeholder-bark.jpg',
    default: '/images/placeholder-tree.jpg',
  };
  return placeholders[type] || placeholders.default;
}

/**
 * Build search query for Prisma
 */
export function buildSearchFilter(query: string) {
  const searchTerms = query.trim().split(/\s+/);
  return searchTerms.map(term => ({
    OR: [
      { banglaName: { contains: term, mode: 'insensitive' as const } },
      { englishName: { contains: term, mode: 'insensitive' as const } },
      { commonName: { contains: term, mode: 'insensitive' as const } },
      { scientificName: { contains: term, mode: 'insensitive' as const } },
      { family: { contains: term, mode: 'insensitive' as const } },
      { genus: { contains: term, mode: 'insensitive' as const } },
      { species: { contains: term, mode: 'insensitive' as const } },
    ],
  }));
}
