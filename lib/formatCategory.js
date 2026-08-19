// Materials shown in the compact category badge everywhere on the site. "Type" tags
// (Rings, Necklaces, etc.) stay selected on the product for filtering/search but don't
// clutter the visible badge — the product photo already makes the type obvious.
export const MATERIAL_CATEGORIES = ['Gold', 'Silver', 'Platinum', 'Diamond', 'Gemstone', 'Ruby', 'Emerald', 'Sapphire'];

// category moved from a single string to an array (multi-category support), but existing
// documents in the database weren't migrated — this normalizes either shape for display.
export function formatCategory(category) {
  if (Array.isArray(category)) {
    const materials = category.filter((c) => MATERIAL_CATEGORIES.includes(c));
    const shortlist = materials.length > 0 ? materials : category;
    return shortlist.filter(Boolean).join(', ');
  }
  if (typeof category === 'string') return category;
  return '';
}
