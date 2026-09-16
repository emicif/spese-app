import { db } from "../db/database";
import type { Category } from "../types/category";

export async function getCategories(): Promise<Category[]> {
  const categories = await db.categories
    .orderBy("sortOrder")
    .toArray();

  return categories.filter((category) => category.active);
}

export async function getAllCategories(): Promise<Category[]> {
  return db.categories
    .orderBy("sortOrder")
    .toArray();
}

export async function addCategory(
  category: Omit<Category, "id">,
): Promise<number> {
  return db.categories.add({
    ...category,
    active: true,
  });
}

export async function deleteCategory(
  id: number,
): Promise<void> {
  await db.categories.update(id, {
    active: false,
  });
}
