import { useCallback, useEffect, useState } from "react";

import "./Summary.css";

import { getSalaryByMonth } from "../../repositories/salaryRepository";
import { getSavingsByMonth } from "../../repositories/savingRepository";
import { getExpensesByMonth } from "../../repositories/expenseRepository";
import { getCategories } from "../../repositories/categoryRepository";

import {
  calculateTotalSavings,
  calculateAvailableAmount,
} from "../../utils/dashboardUtils";

import {
  getCurrentMonth,
  formatMonth,
  getNextMonth,
  getPreviousMonth,
} from "../../utils/monthUtils";

import type { Expense } from "../../types/expense";
import type { Category } from "../../types/category";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function Summary() {
  const [month, setMonth] = useState(
    getCurrentMonth(),
  );

  const [salary, setSalary] = useState(0);
  const [savings, setSavings] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const loadSummary = useCallback(async () => {
    const [
      salaryRecord,
      savingsRecords,
      expenseRecords,
      categoryRecords,
    ] = await Promise.all([
      getSalaryByMonth(month),
      getSavingsByMonth(month),
      getExpensesByMonth(month),
      getCategories(),
    ]);

    setSalary(salaryRecord?.amount ?? 0);
    setSavings(calculateTotalSavings(savingsRecords));
    setExpenses(expenseRecords);
    setCategories(categoryRecords);
  }, [month]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  const available = calculateAvailableAmount(
    salary,
    savings,
    totalExpenses,
  );

  const expensePercentage =
    salary > 0
      ? Math.min((totalExpenses / salary) * 100, 100)
      : 0;

  const savingPercentage =
    salary > 0
      ? Math.min((savings / salary) * 100, 100)
      : 0;

  function getCategory(categoryId: number) {
    return categories.find(
      (category) => category.id === categoryId,
    );
  }

  const categoryTotals = categories
    .map((category) => {
      const total = expenses
        .filter(
          (expense) =>
            expense.categoryId === category.id,
        )
        .reduce(
          (sum, expense) => sum + expense.amount,
          0,
        );

      return {
        category,
        total,
      };
    })
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <main className="summary-page">
      <header className="summary-header">
        <div>
          <p className="summary-eyebrow">
            Analisi finanziaria
          </p>

          <h1>Riepilogo</h1>
        </div>

        <div className="summary-header-icon">
          📊
        </div>
      </header>

      <section className="summary-month-card">
        <span className="summary-month-label">
          Periodo
        </span>

        <div className="summary-month-selector">
          <button
            type="button"
            onClick={() =>
              setMonth(getPreviousMonth(month))
            }
            aria-label="Mese precedente"
          >
            ‹
          </button>

          <strong>{formatMonth(month)}</strong>

          <button
            type="button"
            onClick={() =>
              setMonth(getNextMonth(month))
            }
            aria-label="Mese successivo"
          >
            ›
          </button>
        </div>
      </section>

      <section className="summary-available-card">
        <div className="summary-available-top">
          <div>
            <span>Disponibile</span>

            <small>
              Dopo spese e risparmi
            </small>
          </div>

          <div className="summary-available-icon">
            €
          </div>
        </div>

        <strong className="summary-available-value">
          {formatCurrency(available)}
        </strong>

        <div className="summary-available-progress">
          <div
            style={{
              width:
                salary > 0
                  ? `${Math.min(
                      Math.max(
                        (available / salary) * 100,
                        0,
                      ),
                      100,
                    )}%`
                  : "0%",
            }}
          />
        </div>

        <small className="summary-available-caption">
          {salary > 0
            ? `${Math.round(
                Math.max(
                  (available / salary) * 100,
                  0,
                ),
              )}% dello stipendio ancora disponibile`
            : "Inserisci lo stipendio per visualizzare i dati"}
        </small>
      </section>

      <section className="summary-overview">
        <article className="summary-overview-card salary">
          <div className="summary-overview-icon">
            💰
          </div>

          <div>
            <span>Stipendio</span>

            <strong>
              {formatCurrency(salary)}
            </strong>
          </div>
        </article>

        <article className="summary-overview-card expense">
          <div className="summary-overview-icon">
            📉
          </div>

          <div>
            <span>Spese</span>

            <strong>
              {formatCurrency(totalExpenses)}
            </strong>

            {salary > 0 && (
              <small>
                {expensePercentage.toFixed(0)}% dello
                stipendio
              </small>
            )}
          </div>
        </article>

        <article className="summary-overview-card saving">
          <div className="summary-overview-icon">
            🏦
          </div>

          <div>
            <span>Risparmi</span>

            <strong>
              {formatCurrency(savings)}
            </strong>

            {salary > 0 && (
              <small>
                {savingPercentage.toFixed(0)}% dello
                stipendio
              </small>
            )}
          </div>
        </article>
      </section>

      <section className="summary-section">
        <div className="summary-section-header">
          <div>
            <span>Distribuzione</span>
            <h2>Spese per categoria</h2>
          </div>

          <span className="summary-count">
            {expenses.length}{" "}
            {expenses.length === 1
              ? "spesa"
              : "spese"}
          </span>
        </div>

        {categoryTotals.length === 0 ? (
          <div className="summary-empty">
            <div className="summary-empty-icon">
              🧾
            </div>

            <strong>Nessuna spesa</strong>

            <p>
              Non ci sono spese registrate per
              questo mese.
            </p>
          </div>
        ) : (
          <div className="summary-category-list">
            {categoryTotals.map(
              ({ category, total }) => {
                const percentage =
                  totalExpenses > 0
                    ? (total / totalExpenses) * 100
                    : 0;

                return (
                  <article
                    className="summary-category"
                    key={category.id}
                  >
                    <div className="summary-category-top">
                      <div className="summary-category-name">
                        <span className="summary-category-icon">
                          {category.icon}
                        </span>

                        <div>
                          <strong>
                            {category.name}
                          </strong>

                          <small>
                            {percentage.toFixed(0)}%
                          </small>
                        </div>
                      </div>

                      <strong className="summary-category-total">
                        {formatCurrency(total)}
                      </strong>
                    </div>

                    <div className="summary-progress">
                      <div
                        className="summary-progress-bar"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </article>
                );
              },
            )}
          </div>
        )}
      </section>

      <section className="summary-section">
        <div className="summary-section-header">
          <div>
            <span>Movimenti</span>
            <h2>Ultime spese</h2>
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="summary-empty">
            <div className="summary-empty-icon">
              ✨
            </div>

            <strong>Tutto tranquillo</strong>

            <p>
              Non hai ancora registrato spese
              questo mese.
            </p>
          </div>
        ) : (
          <div className="summary-expense-list">
            {expenses
              .slice(0, 5)
              .map((expense) => {
                const category = getCategory(
                  expense.categoryId,
                );

                return (
                  <article
                    className="summary-expense"
                    key={expense.id}
                  >
                    <div className="summary-expense-left">
                      <span className="summary-expense-icon">
                        {category?.icon ?? "📦"}
                      </span>

                      <div className="summary-expense-info">
                        <strong>
                          {category?.name ?? "Altro"}
                        </strong>

                        <small>
                          {expense.description ||
                            expense.date}
                        </small>
                      </div>
                    </div>

                    <strong className="summary-expense-amount">
                      {formatCurrency(
                        expense.amount,
                      )}
                    </strong>
                  </article>
                );
              })}
          </div>
        )}
      </section>
    </main>
  );
}