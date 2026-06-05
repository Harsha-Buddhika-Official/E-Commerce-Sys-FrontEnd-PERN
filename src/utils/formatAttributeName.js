export function formatAttributeName(key) {
  if (!key || typeof key !== 'string') return '';
  return key
    .split(/[_\-\s]+/)
    .map(w => w.length ? w.charAt(0).toUpperCase() + w.slice(1) : '')
    .filter(Boolean)
    .join(' ');
}
