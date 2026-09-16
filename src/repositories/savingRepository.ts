import { db } from "../db/database";
import type { Saving } from "../types/saving";

export async function getSavings(): Promise<Saving[]> {
  return db.savings.orderBy("date").reverse().toArray();
}

export async function getSavingsByMonth(
  month: string,
): Promise<Saving[]> {
  const startDate = `${month}-01`;

  const [yearString, monthString] = month.split("-");
  const year = Number(yearString);
  const monthNumber = Number(monthString);

  const nextMonth =
    monthNumber === 12
      ? `${year + 1}-01`
      : `${year}-${String(monthNumber + 1).padStart(2, "0")}`;

  const endDate = `${nextMonth}-01`;

  return db.savings
    .where("date")
    .between(startDate, endDate, true, false)
    .toArray();
}

export async function addSaving(
  saving: Omit<Saving, "id" | "createdAt">,
): Promise<number> {
  return db.savings.add({
    ...saving,
    createdAt: new Date().toISOString(),
  });
}

export async function updateSaving(
  id: number,
  changes: Partial<Omit<Saving, "id" | "createdAt">>,
): Promise<void> {
  await db.savings.update(id, changes);
}

export async function deleteSaving(id: number): Promise<void> {
  await db.savings.delete(id);
}


export async function getSavingsByPeriod(
  startDate: string,
  endDate?: string,
): Promise<Saving[]> {
  if (!endDate) {
    return db.savings
      .where("date")
      .aboveOrEqual(startDate)
      .sortBy("date");
  }

  return db.savings
    .where("date")
    .between(
      startDate,
      endDate,
      true,
      false,
    )
    .sortBy("date");
}
