export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'https://vibeseekers-api.onrender.com';

/**
 * Resolves an image URL:
 * - If url is already absolute (http://, https://, data:, blob:), returns it as-is.
 * - If url is a relative path (e.g. /uploads/... or uploads/...), prefixes it with the backend API base URL.
 * - If url is empty/null, returns fallback or empty string.
 */
export const resolveImageUrl = (url, fallback = '') => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return fallback;
  }
  const trimmed = url.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const cleanBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${cleanBase}${cleanPath}`;
};

export default resolveImageUrl;
