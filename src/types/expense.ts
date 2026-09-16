export interface Expense {
  id?: number;
  date: string; // YYYY-MM-DD
  amount: number;
  categoryId: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
