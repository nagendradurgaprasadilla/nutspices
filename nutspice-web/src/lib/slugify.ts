/**
 * Converts a product name into a URL-safe, lowercase, hyphenated slug.
 * Example: "Premium Cashews 500g!" -> "premium-cashews-500g"
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generates a unique slug by appending a numeric suffix if needed.
 * @param name      - The product name to slugify
 * @param existing  - Set of slugs already in use
 * @returns A slug guaranteed not to conflict with existing ones
 */
export function generateUniqueSlug(name: string, existing: Set<string>): string {
  const base = slugify(name);
  if (!existing.has(base)) return base;

  let counter = 2;
  while (existing.has(base + "-" + counter)) {
    counter++;
  }
  return base + "-" + counter;
}
