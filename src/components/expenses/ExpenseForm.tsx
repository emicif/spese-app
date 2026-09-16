import { useEffect, useState } from "react";

import "./ExpenseForm.css";

import {
  addExpense,
  updateExpense,
} from "../../repositories/expenseRepository";

import { getCategories } from "../../repositories/categoryRepository";

import type { Category } from "../../types/category";
import type { Expense } from "../../types/expense";

interface ExpenseFormProps {
  month: string;
  expense?: Expense;
  onSaved: () => void;
}

export function ExpenseForm({
  month,
  expense,
  onSaved,
}: ExpenseFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [amount, setAmount] = useState(
    expense ? String(expense.amount).replace(".", ",") : "",
  );

  const [date, setDate] = useState(
    expense ? expense.date : `${month}-01`,
  );

  const [categoryId, setCategoryId] = useState(
    expense ? String(expense.categoryId) : "",
  );

  const [description, setDescription] = useState(
    expense?.description ?? "",
  );

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      const result = await getCategories();

      setCategories(result);

      if (
        !expense &&
        result.length > 0 &&
        result[0].id !== undefined
      ) {
        setCategoryId(String(result[0].id));
      }
    }

    loadCategories();
  }, [expense]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const numericAmount = Number(
      amount.replace(",", "."),
    );

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0 ||
      !categoryId
    ) {
      return;
    }

    setIsSaving(true);

    try {
      const expenseData = {
        date,
        amount: numericAmount,
        categoryId: Number(categoryId),
        description: description.trim(),
      };

      if (expense?.id !== undefined) {
        await updateExpense(
          expense.id,
          expenseData,
        );
      } else {
        await addExpense(expenseData);
      }

      onSaved();
    } finally {
      setIsSaving(false);
    }
  }

  const isEditing = expense !== undefined;

  return (
    <form
      className="expense-form"
      onSubmit={handleSubmit}
    >
      <div className="expense-form-field">
        <label htmlFor="expense-date">
          Data
        </label>

        <input
          id="expense-date"
          type="date"
          value={date}
          onChange={(event) =>
            setDate(event.target.value)
          }
        />
      </div>

      <div className="expense-form-field amount-field">
        <label htmlFor="expense-amount">
          Importo
        </label>

        <input
          id="expense-amount"
          type="text"
          inputMode="decimal"
          placeholder="es. 45,20"
          value={amount}
          onChange={(event) =>
            setAmount(event.target.value)
          }
        />
      </div>

      <div className="expense-form-field">
        <label htmlFor="expense-category">
          Categoria
        </label>

        <select
          id="expense-category"
          value={categoryId}
          onChange={(event) =>
            setCategoryId(event.target.value)
          }
        >
          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.icon} {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="expense-form-field">
        <label htmlFor="expense-description">
          Descrizione
        </label>

        <input
          id="expense-description"
          type="text"
          placeholder="es. Supermercato"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
        />
      </div>

      <button
        type="submit"
        className="expense-form-submit"
        disabled={isSaving}
      >
        {isSaving
          ? "Salvataggio..."
          : isEditing
            ? "Salva modifiche"
            : "Salva spesa"}
      </button>
    </form>
  );
}
