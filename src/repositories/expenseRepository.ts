import { db } from "../db/database";
import type { Expense } from "../types/expense";

export async function getExpenses(): Promise<Expense[]> {
  return db.expenses.orderBy("date").reverse().toArray();
}

export async function getExpensesByMonth(
  month: string,
): Promise<Expense[]> {
  const startDate = `${month}-01`;

  const year = Number(month.slice(0, 4));
  const monthNumber = Number(month.slice(5, 7));

  const nextMonth =
    monthNumber === 12
      ? `${year + 1}-01`
      : `${year}-${String(monthNumber + 1).padStart(2, "0")}`;

  const endDate = `${nextMonth}-01`;

  return db.expenses
    .where("date")
    .between(startDate, endDate, false, true)
    .reverse()
    .sortBy("date");
}

export async function addExpense(
  expense: Omit<Expense, "id" | "createdAt" | "updatedAt">,
): Promise<number> {
  const now = new Date().toISOString();

  return db.expenses.add({
    ...expense,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateExpense(
  id: number,
  changes: Partial<Omit<Expense, "id" | "createdAt">>,
): Promise<void> {
  await db.expenses.update(id, {
    ...changes,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteExpense(id: number): Promise<void> {
  await db.expenses.delete(id);
}
