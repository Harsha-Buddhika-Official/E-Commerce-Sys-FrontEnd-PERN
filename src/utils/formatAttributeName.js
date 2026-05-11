export function formatAttributeName(key) {
  if (!key || typeof key !== 'string') return '';
  // Split on underscores, hyphens or whitespace, then capitalize each word
  return key
    .split(/[_\-\s]+/)
    .map(w => w.length ? w.charAt(0).toUpperCase() + w.slice(1) : '')
    .filter(Boolean)
    .join(' ');
}
