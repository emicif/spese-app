import { db } from "../db/database";
import type { Salary } from "../types/salary";

export async function getSalaryByMonth(
  month: string,
): Promise<Salary | undefined> {
  return db.salaries.where("month").equals(month).first();
}

export async function saveSalary(
  month: string,
  amount: number,
): Promise<number> {
  const existingSalary = await getSalaryByMonth(month);

  const now = new Date().toISOString();

  if (existingSalary?.id !== undefined) {
    await db.salaries.update(existingSalary.id, {
      amount,
      updatedAt: now,
    });

    return existingSalary.id;
  }

  return db.salaries.add({
    month,
    amount,
    createdAt: now,
    updatedAt: now,
  });
}

export async function deleteSalary(month: string): Promise<void> {
  const salary = await getSalaryByMonth(month);

  if (salary?.id !== undefined) {
    await db.salaries.delete(salary.id);
  }
}
