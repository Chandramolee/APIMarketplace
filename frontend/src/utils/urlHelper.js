/**
 * Ensures a URL is absolute by prepending https:// if it lacks a protocol.
 * @param {string} url - The URL to check.
 * @returns {string} - The absolute URL.
 */
export const ensureAbsoluteUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If it starts with //, just add https:
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  return `https://${url}`;
};
