import { db } from "./database";
import { DEFAULT_CATEGORIES } from "../data/defaultCategories";

export async function seedDatabase(): Promise<void> {
  const categoryCount = await db.categories.count();

  if (categoryCount > 0) {
    return;
  }

  await db.categories.bulkAdd(DEFAULT_CATEGORIES);
}
