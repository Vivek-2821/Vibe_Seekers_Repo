/**
 * Smart Similar-Word Search Utility for Vibe Seekers Storefront
 *
 * Provides intelligent streetwear product searching with:
 * - Hyphen/space normalization ("t-shirt", "tshirt", "t shirt" all match)
 * - Singular / plural normalization ("shirts" <=> "shirt", "hoodies" <=> "hoodie", "jackets" <=> "jacket", "tees" <=> "tee")
 * - Synonym groups (t-shirt/tshirt/tee, hoodie/sweatshirt, jacket/overshirt/windbreaker)
 * - Multi-field matching across name, category, description, fabricDetails, gsm, colors, and collectionName
 */

// Common streetwear synonym equivalence clusters
const SYNONYM_GROUPS = [
  ['tshirt', 't shirt', 't-shirt', 'tee', 'tees', 'shirt', 'shirts', 'top', 'tops', 'oversized tee', 'oversized t-shirt'],
  ['hoodie', 'hoodies', 'sweatshirt', 'sweatshirts', 'pullover', 'fleece', 'drop shoulder hoodie'],
  ['jacket', 'jackets', 'overshirt', 'overshirts', 'windbreaker', 'windbreakers', 'outerwear', 'cargo jacket', 'shacket'],
  ['acid', 'acid wash', 'mineral', 'mineral wash', 'vintage', 'wash'],
  ['oversized', 'boxy', 'baggy', 'drop shoulder', 'relaxed fit', 'loose'],
  ['black', 'dark', 'charcoal', 'noir', 'shadow'],
  ['white', 'bone', 'ivory', 'cream', 'off white', 'vintage white'],
  ['heavyweight', '240 gsm', '400 gsm', 'fleece', 'terry', 'combed cotton'],
  ['custom', 'customized', 'customize', 'personalize', 'personalized', 'print'],
];

/**
 * Normalizes text by lowercasing, stripping punctuation, and normalizing spaces
 */
export function normalizeText(text) {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .replace(/[-_]/g, ' ')
    .replace(/[^\w\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Stem/singularize an English word commonly used in apparel
 */
export function getWordStem(word) {
  if (!word || word.length < 3) return word;
  const w = word.toLowerCase();

  // -ies -> -y (hoodies -> hoodie / hoody)
  if (w.endsWith('ies')) {
    return w.slice(0, -3) + 'y';
  }
  // -ses, -xes, -ches, -shes
  if (w.endsWith('es') && !w.endsWith('tees')) {
    return w.slice(0, -2);
  }
  // trailing -s (except ss like glass, dress)
  if (w.endsWith('s') && !w.endsWith('ss')) {
    return w.slice(0, -1);
  }
  return w;
}

/**
 * Expands a single query term into all related forms:
 * - base term
 * - hyphen/space variants (e.g. tshirt <-> t shirt <-> t-shirt)
 * - singular and plural stems
 * - synonym group terms
 */
export function expandQueryTerm(term) {
  const normalized = normalizeText(term);
  if (!normalized) return [];

  const variants = new Set();
  variants.add(normalized);

  // Variant without spaces (e.g. "t shirt" -> "tshirt")
  const compact = normalized.replace(/\s+/g, '');
  variants.add(compact);

  // Stems & singular/plural variants
  const words = normalized.split(' ');
  const stemmedWords = words.map((w) => getWordStem(w));
  variants.add(stemmedWords.join(' '));
  variants.add(stemmedWords.join(''));

  // Expand "t-shirt" or "tshirt" explicitly
  if (normalized === 'tshirt' || normalized === 't shirt' || compact === 'tshirt' || normalized === 'tee') {
    variants.add('tshirt');
    variants.add('t shirt');
    variants.add('t-shirt');
    variants.add('tee');
    variants.add('tees');
    variants.add('shirt');
    variants.add('shirts');
    variants.add('tshirts');
  }

  // Expand "hoodie" / "hoodies"
  if (normalized.startsWith('hoodi') || compact.includes('hoodie')) {
    variants.add('hoodie');
    variants.add('hoodies');
    variants.add('sweatshirt');
    variants.add('fleece');
  }

  // Expand "jacket" / "jackets"
  if (normalized.startsWith('jacket') || compact.includes('jacket')) {
    variants.add('jacket');
    variants.add('jackets');
    variants.add('overshirt');
    variants.add('windbreaker');
  }

  // Expand synonym clusters
  for (const group of SYNONYM_GROUPS) {
    const matchesGroup = group.some((syn) => {
      const synNorm = normalizeText(syn);
      return (
        normalized === synNorm ||
        normalized.includes(synNorm) ||
        synNorm.includes(normalized) ||
        compact === synNorm.replace(/\s+/g, '')
      );
    });

    if (matchesGroup) {
      for (const syn of group) {
        variants.add(normalizeText(syn));
        variants.add(syn.replace(/\s+/g, ''));
      }
    }
  }

  return Array.from(variants).filter(Boolean);
}

/**
 * Builds a comprehensive searchable text blob from product fields
 */
function buildSearchableString(product) {
  if (!product) return '';
  const parts = [
    product.name,
    product.category,
    product.category === 'CUSTOMIZE_TSHIRTS' ? 'custom customize customized t-shirt tee personalize' : '',
    product.category === 'TSHIRTS' ? 't-shirt tshirt tee shirt' : '',
    product.category === 'HOODIES' ? 'hoodie hoodies sweatshirt fleece' : '',
    product.category === 'JACKETS' ? 'jacket jackets overshirt windbreaker' : '',
    product.description,
    product.fabricDetails,
    product.gsm,
    product.colors,
    product.collectionName,
    Array.isArray(product.tags) ? product.tags.join(' ') : product.tags,
  ];

  return normalizeText(parts.filter(Boolean).join(' '));
}

/**
 * Performs smart similar-word matching on a list of products.
 * Returns matching products ranked by relevance.
 *
 * @param {Array} products - List of products to search
 * @param {string} query - Raw search input from the buyer
 * @returns {Array} - Filtered and relevance-sorted products
 */
export function smartProductSearch(products, query) {
  if (!Array.isArray(products) || products.length === 0) {
    return [];
  }

  const rawQuery = (query || '').trim();
  if (!rawQuery) {
    return products;
  }

  const normalizedQuery = normalizeText(rawQuery);
  const queryTokens = normalizedQuery.split(' ').filter(Boolean);

  // For each token, compute expanded variations
  const tokenExpansions = queryTokens.map((token) => expandQueryTerm(token));

  // Score each product
  const scored = [];

  for (const product of products) {
    const searchable = buildSearchableString(product);
    const productNameNorm = normalizeText(product.name);
    const categoryNorm = normalizeText(product.category || '');

    let score = 0;
    let matchedTokenCount = 0;

    for (const expansions of tokenExpansions) {
      let tokenMatched = false;
      for (const variant of expansions) {
        if (!variant) continue;

        // Exact match in product title (highest weight)
        if (productNameNorm === variant) {
          score += 100;
          tokenMatched = true;
          break;
        }

        // Substring match in product title
        if (productNameNorm.includes(variant)) {
          score += 40;
          tokenMatched = true;
          break;
        }

        // Match in category
        if (categoryNorm.includes(variant)) {
          score += 30;
          tokenMatched = true;
          break;
        }

        // Match anywhere in searchable body (description, fabric, gsm, colors)
        if (searchable.includes(variant)) {
          score += 15;
          tokenMatched = true;
          break;
        }
      }

      if (tokenMatched) {
        matchedTokenCount++;
      }
    }

    // Require either all tokens or high partial match for multi-word queries
    const matchThreshold = queryTokens.length <= 2 ? queryTokens.length : Math.ceil(queryTokens.length * 0.6);
    if (matchedTokenCount >= matchThreshold && score > 0) {
      scored.push({ product, score });
    }
  }

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.map((item) => item.product);
}

export default smartProductSearch;
