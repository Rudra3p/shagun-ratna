// category moved from a single string to an array (multi-category support), but existing
// documents in the database weren't migrated — this normalizes either shape for display.
export function formatCategory(category) {
  if (Array.isArray(category)) return category.filter(Boolean).join(', ');
  if (typeof category === 'string') return category;
  return '';
}
