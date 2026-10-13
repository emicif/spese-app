import { useCallback, useEffect, useState } from "react";

import "./Expenses.css";

import { ExpenseForm } from "../../components/expenses/ExpenseForm";

import {
  getExpensesByMonth,
  deleteExpense,
} from "../../repositories/expenseRepository";

import { getCategories } from "../../repositories/categoryRepository";

import {
  getCurrentMonth,
  formatMonth,
} from "../../utils/monthUtils";

import type { Expense } from "../../types/expense";
import type { Category } from "../../types/category";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function Expenses() {
  const [month, setMonth] = useState(
    getCurrentMonth(),
  );

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [showForm, setShowForm] = useState(false);

  const [editingExpense, setEditingExpense] =
    useState<Expense | undefined>(undefined);

  const [expenseToDelete, setExpenseToDelete] =
    useState<Expense | undefined>(undefined);

  const [isDeleting, setIsDeleting] = useState(false);

  const loadExpenses = useCallback(async () => {
    const [expenseRecords, categoryRecords] =
      await Promise.all([
        getExpensesByMonth(month),
        getCategories(),
      ]);

    setExpenses(expenseRecords);
    setCategories(categoryRecords);
  }, [month]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  function getCategory(categoryId: number) {
    return categories.find(
      (category) => category.id === categoryId,
    );
  }

  function changeMonth(offset: number) {
    const [year, monthNumber] = month
      .split("-")
      .map(Number);

    const date = new Date(
      year,
      monthNumber - 1 + offset,
      1,
    );

    const newYear = date.getFullYear();

    const newMonth = String(
      date.getMonth() + 1,
    ).padStart(2, "0");

    setMonth(`${newYear}-${newMonth}`);

    setShowForm(false);
    setEditingExpense(undefined);
    setExpenseToDelete(undefined);
  }

  async function handleDeleteExpense() {
    if (
      expenseToDelete?.id === undefined ||
      isDeleting
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteExpense(expenseToDelete.id);
      setExpenseToDelete(undefined);
      await loadExpenses();
    } finally {
      setIsDeleting(false);
    }
  }

  function handleEditExpense(expense: Expense) {
    setEditingExpense(expense);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingExpense(undefined);
  }

  return (
    <main className="expenses-page">
      <header className="expenses-header">
        <p>Le mie spese</p>

        <div className="expenses-month-selector">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Mese precedente"
          >
            ‹
          </button>

          <h1>{formatMonth(month)}</h1>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Mese successivo"
          >
            ›
          </button>
        </div>
      </header>

      <section className="expenses-total-card">
        <span className="expenses-total-label">
          Totale spese
        </span>

        <strong className="expenses-total-value">
          {formatCurrency(total)}
        </strong>
      </section>

      <button
        type="button"
        className="expenses-add-button"
        onClick={() => {
          if (showForm) {
            handleCloseForm();
          } else {
            setEditingExpense(undefined);
            setShowForm(true);
          }
        }}
      >
        {showForm
          ? "Chiudi"
          : "+ Aggiungi spesa"}
      </button>

      {showForm && (
        <section className="expenses-form-card">
          <ExpenseForm
            month={month}
            expense={editingExpense}
            onSaved={async () => {
              await loadExpenses();
              handleCloseForm();
            }}
          />
        </section>
      )}

      <section className="expenses-list">
        {expenses.length === 0 ? (
          <div className="expenses-empty">
            <p>
              Nessuna spesa registrata per questo mese.
            </p>
          </div>
        ) : (
          expenses.map((expense) => {
            const category = getCategory(
              expense.categoryId,
            );

            return (
              <article
                className="expense-card"
                key={expense.id}
              >
                <div className="expense-card-left">
                  <div className="expense-category-icon">
                    {category?.icon ?? "📦"}
                  </div>

                  <div className="expense-info">
                    <p className="expense-category">
                      {category?.name ?? "Altro"}
                    </p>

                    {expense.description && (
                      <p className="expense-description">
                        <span className="expense-description-label">
                          Note:
                        </span>{" "}
                        {expense.description}
                      </p>
                    )}

                    <span className="expense-date">
                      {formatDate(expense.date)}
                    </span>
                  </div>
                </div>

                <div className="expense-card-right">
                  <strong className="expense-amount">
                    {formatCurrency(expense.amount)}
                  </strong>

                  {expense.id !== undefined && (
                    <>
                      <button
                        type="button"
                        className="expense-edit-button"
                        onClick={() =>
                          handleEditExpense(expense)
                        }
                        aria-label="Modifica spesa"
                      >
                        ✏️
                      </button>

                      <button
                        type="button"
                        className="expense-delete-button"
                        onClick={() =>
                          setExpenseToDelete(expense)
                        }
                        aria-label="Elimina spesa"
                      >
                        ×
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>

      {expenseToDelete && (
        <div
          className="delete-modal-overlay"
          onClick={() => {
            if (!isDeleting) {
              setExpenseToDelete(undefined);
            }
          }}
        >
          <div
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div
              className="delete-modal-icon"
              aria-hidden="true"
            >
              ×
            </div>

            <h2 id="delete-modal-title">
              Eliminare questa spesa?
            </h2>

            <p>
              Stai per eliminare una spesa di{" "}
              <strong>
                {formatCurrency(
                  expenseToDelete.amount,
                )}
              </strong>
              . Questa operazione non può essere
              annullata.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-modal-cancel"
                disabled={isDeleting}
                onClick={() =>
                  setExpenseToDelete(undefined)
                }
              >
                Annulla
              </button>

              <button
                type="button"
                className="delete-modal-confirm"
                disabled={isDeleting}
                onClick={handleDeleteExpense}
              >
                {isDeleting
                  ? "Eliminazione..."
                  : "Elimina"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}