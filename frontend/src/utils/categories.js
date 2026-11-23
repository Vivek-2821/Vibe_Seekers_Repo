/**
 * Shared Category Normalization and Helper Utilities
 * Used across Storefront (Shop / Catalog / Navbar / Home) and Admin Portal
 */

export const CANONICAL_CATEGORIES = [
  'T-Shirts',
  'Customize T-Shirts',
  'Hoodies',
  'Jackets',
  'Shirts',
];

/**
 * Normalizes any category string by trimming, lowercasing, removing hyphens/spaces/underscores,
 * and normalizing singular vs plural forms so:
 * "T-Shirt", "T-Shirts", "tshirt", "T Shirt", "TSHIRTS" -> "tshirt"
 * "Customize T-Shirt", "Customize T-Shirts", "CUSTOMIZE_TSHIRTS" -> "customizetshirt"
 * "Hoodie", "Hoodies", "HOODIES" -> "hoodie"
 * "Jacket", "Jackets", "JACKETS" -> "jacket"
 * "Shirt", "Shirts", "SHIRTS" -> "shirt"
 * "All", "all", "" -> "all" or ""
 */
export function normalizeCategory(value) {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (trimmed === '' || trimmed.toLowerCase() === 'all') return 'all';

  let clean = trimmed.toLowerCase().replace(/[\s\-_]+/g, '');

  if (clean.includes('custom')) {
    return 'customizetshirt';
  }
  if (clean.includes('tshirt') || clean.includes('tee')) {
    return 'tshirt';
  }
  if (clean.includes('hoodie')) {
    return 'hoodie';
  }
  if (clean.includes('jacket')) {
    return 'jacket';
  }
  if (clean.includes('shirt')) {
    return 'shirt';
  }

  // General fallback: trim trailing 's' if word length > 2
  if (clean.endsWith('s') && clean.length > 2) {
    clean = clean.slice(0, -1);
  }
  return clean;
}

/**
 * Formats a raw or normalized category into a clean display label.
 */
export function formatCategoryLabel(cat) {
  if (!cat || typeof cat !== 'string') return '';
  const norm = normalizeCategory(cat);
  switch (norm) {
    case 'all':
      return 'All';
    case 'tshirt':
      return 'T-Shirts';
    case 'customizetshirt':
      return 'Customize T-Shirts';
    case 'hoodie':
      return 'Hoodies';
    case 'jacket':
      return 'Jackets';
    case 'shirt':
      return 'Shirts';
    default:
      return cat
        .replace(/[_-]+/g, ' ')
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
  }
}

/**
 * Checks whether a product's category matches the user-selected category.
 * If selectedCategory is "All", empty, or null, it matches every product.
 */
export function matchCategory(productCategory, selectedCategory) {
  if (
    !selectedCategory ||
    selectedCategory === 'All' ||
    normalizeCategory(selectedCategory) === 'all'
  ) {
    return true;
  }
  return normalizeCategory(productCategory) === normalizeCategory(selectedCategory);
}

/**
 * Extracts a dynamic list of category tabs starting with "All",
 * followed by standard canonical categories, plus any extra unique non-empty categories
 * found on the fetched products array.
 */
export function getDynamicCategories(products = []) {
  const categories = ['All', ...CANONICAL_CATEGORIES];
  const seen = new Set(categories.map((c) => normalizeCategory(c)));

  if (Array.isArray(products)) {
    products.forEach((p) => {
      const cat = p?.category;
      if (cat && typeof cat === 'string' && cat.trim() !== '') {
        const norm = normalizeCategory(cat);
        if (norm && norm !== 'all' && !seen.has(norm)) {
          seen.add(norm);
          categories.push(formatCategoryLabel(cat));
        }
      }
    });
  }

  return categories;
}

export default {
  CANONICAL_CATEGORIES,
  normalizeCategory,
  formatCategoryLabel,
  matchCategory,
  getDynamicCategories,
};
