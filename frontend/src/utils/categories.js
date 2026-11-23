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
 * "T-Shirt", "T-Shirts", "tshirt", "T Shirt", "TSHIRTS", "Graphic T-Shirts", "Oversized T-Shirts" -> "tshirt"
 * "Customize T-Shirt", "Customize T-Shirts", "CUSTOMIZE_TSHIRTS" -> "customizetshirt"
 * "Hoodie", "Hoodies", "HOODIES" -> "hoodie"
 * "Jacket", "Jackets", "JACKETS" -> "jacket"
 * "Shirt", "Shirts", "SHIRTS" -> "shirt"
 * "All", "all", "" -> "all"
 */
export function normalizeCategory(value) {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (trimmed === '' || trimmed.toLowerCase() === 'all') return 'all';

  const clean = trimmed.toLowerCase().replace(/[\s\-_]+/g, '');

  if (clean.includes('custom')) {
    return 'customizetshirt';
  }
  if (clean.includes('tshirt') || clean.includes('tee') || clean.includes('t_shirt') || clean.includes('t-shirt')) {
    return 'tshirt';
  }
  if (clean.includes('hoodie') || clean.includes('hoody') || clean.includes('fleece') || clean.includes('sweatshirt')) {
    return 'hoodie';
  }
  if (clean.includes('jacket') || clean.includes('coat') || clean.includes('bomber') || clean.includes('windbreaker')) {
    return 'jacket';
  }
  if (clean.includes('shirt')) {
    return 'shirt';
  }

  // General fallback: trim trailing 's' if word length > 2
  if (clean.endsWith('s') && clean.length > 2) {
    return clean.slice(0, -1);
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
 * Checks whether a product (or category string) matches the user-selected category.
 * Supports:
 *  - selectedCategory === "All" (returns true)
 *  - full product object or plain category string
 *  - normalized matching (casing, hyphens, spaces, plurals)
 *  - legacy / null category fallback via product.name
 */
export function matchCategory(productOrCategory, selectedCategory) {
  if (
    !selectedCategory ||
    selectedCategory === 'All' ||
    normalizeCategory(selectedCategory) === 'all'
  ) {
    return true;
  }

  const targetNorm = normalizeCategory(selectedCategory);

  let rawCategory = '';
  let productName = '';

  if (productOrCategory && typeof productOrCategory === 'object') {
    rawCategory = productOrCategory.category || productOrCategory.categoryName || '';
    productName = productOrCategory.name || productOrCategory.title || '';
  } else if (typeof productOrCategory === 'string') {
    rawCategory = productOrCategory;
  }

  const catNorm = normalizeCategory(rawCategory);

  // 1. Direct category match when category is non-empty and not generic
  if (
    catNorm &&
    catNorm !== 'all' &&
    catNorm !== 'uncategorized' &&
    catNorm !== 'general' &&
    catNorm !== 'null' &&
    catNorm !== 'undefined'
  ) {
    if (targetNorm === 'customizetshirt') {
      return catNorm === 'customizetshirt';
    }
    if (targetNorm === 'tshirt') {
      return catNorm === 'tshirt' && catNorm !== 'customizetshirt';
    }
    if (targetNorm === 'shirt') {
      return catNorm === 'shirt' && catNorm !== 'tshirt' && catNorm !== 'customizetshirt';
    }
    if (targetNorm === 'hoodie') {
      return catNorm === 'hoodie';
    }
    if (targetNorm === 'jacket') {
      return catNorm === 'jacket';
    }
    return catNorm === targetNorm;
  }

  // 2. Legacy / Null Category Fallback: Check product name
  if (productName && typeof productName === 'string') {
    const nameNorm = normalizeCategory(productName);
    if (targetNorm === 'customizetshirt') {
      return nameNorm.includes('custom');
    }
    if (targetNorm === 'tshirt') {
      return (
        (nameNorm.includes('tshirt') || nameNorm.includes('tee')) &&
        !nameNorm.includes('custom')
      );
    }
    if (targetNorm === 'hoodie') {
      return (
        nameNorm.includes('hoodie') ||
        nameNorm.includes('hoody') ||
        nameNorm.includes('fleece') ||
        nameNorm.includes('sweatshirt')
      );
    }
    if (targetNorm === 'jacket') {
      return (
        nameNorm.includes('jacket') ||
        nameNorm.includes('bomber') ||
        nameNorm.includes('coat') ||
        nameNorm.includes('windbreaker')
      );
    }
    if (targetNorm === 'shirt') {
      return (
        nameNorm.includes('shirt') &&
        !nameNorm.includes('tshirt') &&
        !nameNorm.includes('tee') &&
        !nameNorm.includes('custom')
      );
    }
  }

  return false;
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
        if (norm && norm !== 'all' && norm !== 'uncategorized' && !seen.has(norm)) {
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
