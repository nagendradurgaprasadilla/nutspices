import { db } from "./index";
import { products } from "./schema";
import { sql, eq } from "drizzle-orm";
import { generateUniqueSlug } from "../lib/slugify";

async function migrateSlugs() {
  console.log("Migrating product slugs...");

  // 1. Add column if not exists
  try {
    await db.run(sql.raw(`ALTER TABLE products ADD COLUMN slug text`));
    console.log("Added 'slug' column to products table.");
  } catch (e: any) {
    if (e?.message?.includes("duplicate column name") || e?.message?.includes("already exists")) {
      console.log("'slug' column already exists.");
    } else {
      console.log("Note on alter table:", e?.message || e);
    }
  }

  // 2. Fetch all products
  const allProducts = await db.select().from(products);
  console.log(`Found ${allProducts.length} products.`);

  const usedSlugs = new Set<string>();

  // Collect existing non-null slugs first
  for (const p of allProducts) {
    if (p.slug && p.slug.trim()) {
      usedSlugs.add(p.slug.trim());
    }
  }

  let updatedCount = 0;

  // Generate and set missing slugs
  for (const p of allProducts) {
    if (!p.slug || !p.slug.trim()) {
      const newSlug = generateUniqueSlug(p.name, usedSlugs);
      usedSlugs.add(newSlug);

      await db
        .update(products)
        .set({ slug: newSlug })
        .where(eq(products.id, p.id));

      console.log(`Product ID ${p.id} ("${p.name}") -> slug: "${newSlug}"`);
      updatedCount++;
    } else {
      console.log(`Product ID ${p.id} already has slug: "${p.slug}"`);
    }
  }

  console.log(`Migration completed. Updated ${updatedCount} products.`);
}

migrateSlugs().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
