import Dexie, { type Table } from "dexie";

import type { Salary } from "../types/salary";
import type { Saving } from "../types/saving";
import type { Expense } from "../types/expense";
import type { Category } from "../types/category";
import type { FinancialPeriod } from "../types/financialPeriod";

export const db = new Dexie("SpeseAppDB") as Dexie & {
  salaries: Table<Salary, number>;
  savings: Table<Saving, number>;
  expenses: Table<Expense, number>;
  categories: Table<Category, number>;
  financialPeriods: Table<FinancialPeriod, number>;
};

db.version(1).stores({
  salaries: "++id, &month",
  savings: "++id, date",
  expenses: "++id, date, categoryId",
  categories: "++id, &name",
});

db.version(2).stores({
  salaries: "++id, &month",
  savings: "++id, date",
  expenses: "++id, date, categoryId",
  categories: "++id, &name, sortOrder, active",
});

db.version(3).stores({
  salaries: "++id, &month",
  savings: "++id, date",
  expenses: "++id, date, categoryId",
  categories: "++id, &name, sortOrder, active",
  financialPeriods: "++id, startDate, endDate, salaryId",
});

db.version(4).stores({
  salaries: "++id, date",
  savings: "++id, date",
  expenses: "++id, date, categoryId",
  categories: "++id, &name, sortOrder, active",
  financialPeriods: "++id, startDate, endDate, salaryId",
});
