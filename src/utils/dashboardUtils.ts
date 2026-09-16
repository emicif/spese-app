import type { Expense } from "../types/expense";
import type { Saving } from "../types/saving";

export function calculateTotalExpenses(
  expenses: Expense[],
): number {
  return expenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );
}

export function calculateTotalSavings(
  savings: Saving[],
): number {
  return savings.reduce(
    (total, saving) => total + saving.amount,
    0,
  );
}

export function calculateAvailableAmount(
  salary: number,
  savings: number,
  expenses: number,
): number {
  return salary - savings - expenses;
}
