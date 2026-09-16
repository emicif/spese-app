import { db } from "../db/database";
import type { Salary } from "../types/salary";
import { createFinancialPeriod } from "./financialPeriodRepository";

export async function getSalaries(): Promise<Salary[]> {
  return db.salaries
    .orderBy("date")
    .reverse()
    .toArray();
}

export async function getSalaryByDate(
  date: string,
): Promise<Salary | undefined> {
  return db.salaries
    .where("date")
    .equals(date)
    .first();
}

export async function getLatestSalary(): Promise<
  Salary | undefined
> {
  return db.salaries
    .orderBy("date")
    .reverse()
    .first();
}

export async function saveSalary(
  date: string,
  amount: number,
): Promise<number> {
  const existingSalary =
    await getSalaryByDate(date);

  const now = new Date().toISOString();

  if (existingSalary?.id !== undefined) {
    await db.salaries.update(
      existingSalary.id,
      {
        amount,
        updatedAt: now,
      },
    );

    return existingSalary.id;
  }

  const salaryId = await db.salaries.add({
    date,
    amount,
    createdAt: now,
    updatedAt: now,
  });

  await createFinancialPeriod(
    salaryId,
    date,
  );

  return salaryId;
}

export async function deleteSalary(
  date: string,
): Promise<void> {
  const salary = await getSalaryByDate(date);

  if (salary?.id !== undefined) {
    await db.salaries.delete(salary.id);
  }
}

export async function getSalaryByMonth(
  month: string,
): Promise<Salary | undefined> {
  const salaries = await getSalaries();

  return salaries.find((salary) =>
    salary.date.startsWith(`${month}-`),
  );
}
