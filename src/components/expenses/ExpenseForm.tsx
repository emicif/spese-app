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

  const [date, setDate] = useState(() => {
    if (expense) {
      return expense.date;
    }

    const today = new Date();

    const year = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${currentMonth}-${day}`;
  });

  const [categoryId, setCategoryId] = useState(
    expense ? String(expense.categoryId) : "",
  );

  const [categorySearch, setCategorySearch] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [description, setDescription] = useState(
    expense?.description ?? "",
  );

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      const result = await getCategories();
      setCategories(result);
    }

    loadCategories();
  }, []);

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

  const selectedCategory = categories.find(
    (category) => String(category.id) === categoryId,
  );

  const filteredCategories = categories.filter((category) =>
    category.name
      .toLowerCase()
      .includes(categorySearch.toLowerCase().trim()),
  );

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
  <label>Categoria</label>

  <div className="category-select">
    <button
      type="button"
      className="category-select-trigger"
      onClick={() =>
        setCategoryOpen((open) => !open)
      }
      aria-expanded={categoryOpen}
    >
      <span>
        {selectedCategory ? (
          <>
            <span className="category-selected-icon">
              {selectedCategory.icon}
            </span>

            {selectedCategory.name}
          </>
        ) : (
          <span className="category-placeholder">
            Seleziona categoria
          </span>
        )}
      </span>

      <span
        className={`category-chevron ${
          categoryOpen ? "is-open" : ""
        }`}
        aria-hidden="true"
      >
        ⌄
      </span>
    </button>

    {categoryOpen && (
      <div className="category-dropdown">
        <div className="category-search">
          <span aria-hidden="true">⌕</span>

          <input
            type="search"
            placeholder="Cerca categoria..."
            value={categorySearch}
            onChange={(event) =>
              setCategorySearch(event.target.value)
            }
            autoFocus
          />
        </div>

        <div className="category-options">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => {
                const isSelected =
                  String(category.id) === categoryId;

                return (
                  <button
                    key={category.id}
                    type="button"
                    className={`category-option ${
                      isSelected ? "is-selected" : ""
                    }`}
                    onClick={() => {
                      setCategoryId(
                        String(category.id),
                      );
                      setCategoryOpen(false);
                      setCategorySearch("");
                    }}
                  >
                    <span className="category-option-icon">
                      {category.icon}
                    </span>

                    <span>{category.name}</span>

                    {isSelected && (
                      <span className="category-check">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <p className="category-empty">
                Nessuna categoria trovata
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  </div>

      <div className="expense-form-field">
        <label htmlFor="">
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
