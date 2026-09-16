import { db } from "../db/database";
import type { FinancialPeriod } from "../types/financialPeriod";
import type { Salary } from "../types/salary";


export async function getFinancialPeriods(): Promise<
  FinancialPeriod[]
> {
  return db.financialPeriods
    .orderBy("startDate")
    .reverse()
    .toArray();
}

export async function getCurrentFinancialPeriod(): Promise<
  FinancialPeriod | undefined
> {
  const periods = await db.financialPeriods
    .orderBy("startDate")
    .reverse()
    .toArray();

  return periods[0];
}

export async function getFinancialPeriodById(
  id: number,
): Promise<FinancialPeriod | undefined> {
  return db.financialPeriods.get(id);
}

export async function createFinancialPeriod(
  salaryId: number,
  startDate: string,
): Promise<number> {
  const currentPeriod =
    await getCurrentFinancialPeriod();

  if (currentPeriod?.id !== undefined) {
    await db.financialPeriods.update(
      currentPeriod.id,
      {
        endDate: startDate,
      },
    );
  }

  return db.financialPeriods.add({
    salaryId,
    startDate,
    createdAt: new Date().toISOString(),
  });
}

export async function deleteFinancialPeriod(
  id: number,
): Promise<void> {
  await db.financialPeriods.delete(id);
}

export async function getCurrentFinancialPeriodWithSalary(): Promise<{
  period: FinancialPeriod;
  salary: Salary;
} | undefined> {
  const period = await getCurrentFinancialPeriod();

  if (
    !period ||
    period.id === undefined
  ) {
    return undefined;
  }

  const salary = await db.salaries.get(
    period.salaryId,
  );

  if (!salary) {
    return undefined;
  }

  return {
    period,
    salary,
  };
}
