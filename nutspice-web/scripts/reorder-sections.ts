import { db } from "../src/db";
import { pageSections } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Fetching existing page sections...");
  const sections = await db.select().from(pageSections);
  console.log(`Found ${sections.length} sections in the database.`);

  const desiredOrder = [
    "Dry Fruits",
    "Spices",
    "Seeds",
    "NutSpiceCo Combos",
    "Millets",
    "Berries", // Standard db spelling for "Breeies"
    "A2 Ghee",
    "Honey",
  ];

  // Map to normalize search
  const orderMap = new Map<string, number>();
  desiredOrder.forEach((title, index) => {
    orderMap.set(title.toLowerCase(), (index + 1) * 10);
  });

  // Include user typo spelling "breeies" in case database uses it
  orderMap.set("breeies", orderMap.get("berries")!);

  let nextUnlistedOrder = (desiredOrder.length + 1) * 10;

  console.log("Updating section display orders...");
  for (const section of sections) {
    const titleLower = section.title.toLowerCase();
    let newOrder = orderMap.get(titleLower);

    if (newOrder === undefined) {
      newOrder = nextUnlistedOrder;
      nextUnlistedOrder += 10;
      console.log(`Unlisted section "${section.title}" assigned displayOrder: ${newOrder}`);
    } else {
      console.log(`Listed section "${section.title}" assigned displayOrder: ${newOrder}`);
    }

    await db.update(pageSections)
      .set({ displayOrder: newOrder })
      .where(eq(pageSections.id, section.id));
  }

  console.log("Database update complete!");
}

main().catch(console.error);
