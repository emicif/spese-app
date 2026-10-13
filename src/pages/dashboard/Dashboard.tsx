import { useCallback, useEffect, useState } from "react";

import "./Dashboard.css";

import { FinancialSummary } from "../../components/dashboard/FinancialSummary/FinancialSummary";
import { SalaryForm } from "../../components/dashboard/SalaryForm/SalaryForm";
import { SavingForm } from "../../components/dashboard/SavingForm/SavingForm";

import {
  getCurrentFinancialPeriodWithSalary,
} from "../../repositories/financialPeriodRepository";

import {
  getExpensesByPeriod,
} from "../../repositories/expenseRepository";

import {
  getSavingsByPeriod,
} from "../../repositories/savingRepository";

import {
  calculateTotalExpenses,
  calculateTotalSavings,
  calculateAvailableAmount,
} from "../../utils/dashboardUtils";

import type { FinancialPeriod } from "../../types/financialPeriod";

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

export function Dashboard() {
  const [period, setPeriod] =
    useState<FinancialPeriod | undefined>();

  const [salary, setSalary] = useState(0);
  const [savings, setSavings] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [editingSalary, setEditingSalary] = useState(false);

  const loadDashboard = useCallback(async () => {
    const current =
      await getCurrentFinancialPeriodWithSalary();

    if (!current) {
      setPeriod(undefined);
      setSalary(0);
      setSavings(0);
      setExpenses(0);
      return;
    }

    setPeriod(current.period);
    setSalary(current.salary.amount);

    const [savingsRecords, expenseRecords] =
      await Promise.all([
        getSavingsByPeriod(
          current.period.startDate,
          current.period.endDate,
        ),
        getExpensesByPeriod(
          current.period.startDate,
          current.period.endDate,
        ),
      ]);

    setSavings(calculateTotalSavings(savingsRecords));
    setExpenses(calculateTotalExpenses(expenseRecords));
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const available = calculateAvailableAmount(
    salary,
    savings,
    expenses,
  );

  const isOverBudget = available < 0;

  // Base della barra: lo stipendio, oppure il totale uscite se lo supera
  const barBase = Math.max(salary, expenses + savings);

  const share = (value: number) =>
    barBase > 0
      ? (Math.max(value, 0) / barBase) * 100
      : 0;

  const availablePercent =
    salary > 0
      ? Math.round(Math.max((available / salary) * 100, 0))
      : 0;

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <h1>Le mie finanze</h1>

        <p className="dashboard-period">
          {period ? (
            <>
              {!period.endDate && (
                <span
                  className="dashboard-period-dot"
                  aria-hidden="true"
                />
              )}

              {period.endDate
                ? `Dal ${formatDate(period.startDate)} al ${formatDate(period.endDate)}`
                : `Dal ${formatDate(period.startDate)}, in corso`}
            </>
          ) : (
            "Nessun periodo attivo"
          )}
        </p>
      </header>

      <section
        className="dashboard-hero"
        aria-label="Importo disponibile"
      >
        <div className="dashboard-hero-top">
          <span className="dashboard-hero-label">
            Disponibile
          </span>

          {salary > 0 && (
            <span className="dashboard-hero-pill">
              {availablePercent}% dello stipendio
            </span>
          )}
        </div>

        <strong
          className={
            isOverBudget
              ? "dashboard-hero-value is-negative"
              : "dashboard-hero-value"
          }
        >
          {formatCurrency(available)}
        </strong>

        <p className="dashboard-hero-caption">
          {salary > 0
            ? "Dopo spese e risparmi"
            : "Inserisci lo stipendio per iniziare"}
        </p>

        <div
          className="dashboard-split"
          role="img"
          aria-label={`Ripartizione dello stipendio: ${formatCurrency(expenses)} di spese, ${formatCurrency(savings)} di risparmi, ${formatCurrency(Math.max(available, 0))} disponibili`}
        >
          <span
            className="dashboard-split-segment expense"
            style={{ width: `${share(expenses)}%` }}
          />
          <span
            className="dashboard-split-segment saving"
            style={{ width: `${share(savings)}%` }}
          />
          <span
            className="dashboard-split-segment available"
            style={{ width: `${share(available)}%` }}
          />
        </div>

        <ul className="dashboard-legend">
          <li className="expense">Spese</li>
          <li className="saving">Risparmi</li>
          <li className="available">Disponibile</li>
        </ul>
      </section>

      <FinancialSummary
        salary={salary}
        savings={savings}
        expenses={expenses}
      />

      <section className="dashboard-section">
        {period && (
          <div className="dashboard-section-heading">
            <h2>Gestisci il periodo</h2>
          </div>
        )}

        <div className="dashboard-forms">
          {period ? (
            <>
              <div className="dashboard-salary-row">
                <div className="dashboard-salary-info">
                  <span>Stipendio del periodo</span>
                  <strong>{formatCurrency(salary)}</strong>
                </div>

                <button
                  type="button"
                  className="dashboard-link-button"
                  onClick={() =>
                    setEditingSalary((open) => !open)
                  }
                >
                  {editingSalary ? "Annulla" : "Modifica"}
                </button>
              </div>

              {editingSalary && (
                <div className="dashboard-form-card">
                  <div className="dashboard-form-header">
                    <h3>Aggiorna lo stipendio</h3>
                  </div>

                  <SalaryForm
                    currentAmount={salary}
                    onSaved={() => {
                      setEditingSalary(false);
                      loadDashboard();
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="dashboard-form-card dashboard-welcome">
              <div className="dashboard-form-header">
                <h3>Registra il tuo stipendio</h3>

                <p>
                  Da qui parte il periodo: spese e risparmi
                  si contano fino al prossimo stipendio.
                </p>
              </div>

              <SalaryForm
                currentAmount={salary}
                onSaved={loadDashboard}
              />
            </div>
          )}

          {period && (
            <div className="dashboard-form-card">
              <div className="dashboard-form-header">
                <h3>Risparmio</h3>

                <p>Metti da parte una somma</p>
              </div>

              <SavingForm onSaved={loadDashboard} />
            </div>
          )}
        </div>
      </section>

      <p className="dashboard-note">
        Spese e risparmi vengono conteggiati dal giorno
        dello stipendio fino al prossimo stipendio.
      </p>
    </main>
  );
}
