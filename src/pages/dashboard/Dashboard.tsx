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

    const [
      savingsRecords,
      expenseRecords,
    ] = await Promise.all([
      getSavingsByPeriod(
        current.period.startDate,
        current.period.endDate,
      ),
      getExpensesByPeriod(
        current.period.startDate,
        current.period.endDate,
      ),
    ]);

    setSavings(
      calculateTotalSavings(savingsRecords),
    );

    setExpenses(
      calculateTotalExpenses(expenseRecords),
    );
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const available = calculateAvailableAmount(
    salary,
    savings,
    expenses,
  );

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            Le mie finanze
          </p>

          <h1>Dashboard</h1>
        </div>

        <div className="dashboard-wallet-icon">
          💳
        </div>
      </header>

      <section className="dashboard-month-card">
        <span>Periodo finanziario</span>

        {period ? (
          <strong>
            Dal {formatDate(period.startDate)}
            {period.endDate
              ? ` al ${formatDate(period.endDate)}`
              : " · in corso"}
          </strong>
        ) : (
          <strong>
            Nessun periodo attivo
          </strong>
        )}
      </section>

      <section className="dashboard-balance-card">
        <div className="dashboard-balance-top">
          <div>
            <span className="dashboard-balance-label">
              Disponibile
            </span>

            <span className="dashboard-balance-caption">
              Dopo spese e risparmi
            </span>
          </div>

          <span className="dashboard-balance-icon">
            €
          </span>
        </div>

        <strong className="dashboard-balance-value">
          {formatCurrency(available)}
        </strong>

        <div className="dashboard-balance-line">
          <div
            className="dashboard-balance-progress"
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

        <div className="dashboard-balance-footer">
          <span>
            {salary > 0
              ? `${Math.round(
                  Math.max(
                    (available / salary) * 100,
                    0,
                  ),
                )}% dello stipendio disponibile`
              : "Inserisci lo stipendio per iniziare"}
          </span>
        </div>
      </section>

      <FinancialSummary
        salary={salary}
        savings={savings}
        expenses={expenses}
      />

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <span>Gestione</span>
            <h2>
              {period
                ? "Periodo corrente"
                : "Inizia il tuo periodo"}
            </h2>
          </div>
        </div>

        <div className="dashboard-forms">
          <div className="dashboard-form-card">
            <div className="dashboard-form-header">
              <div className="dashboard-form-icon salary-icon">
                💰
              </div>

              <div>
                <h3>Stipendio</h3>

                <p>
                  {period
                    ? "Aggiorna lo stipendio del periodo"
                    : "Inserisci lo stipendio ricevuto oggi"}
                </p>
              </div>
            </div>

            <SalaryForm
              currentAmount={salary}
              onSaved={loadDashboard}
            />
          </div>

          {period && (
            <div className="dashboard-form-card">
              <div className="dashboard-form-header">
                <div className="dashboard-form-icon saving-icon">
                  🏦
                </div>

                <div>
                  <h3>Risparmio</h3>

                  <p>
                    Metti da parte una somma
                  </p>
                </div>
              </div>

              <SavingForm
                onSaved={loadDashboard}
              />
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-summary-box">
        <div className="dashboard-summary-icon">
          ✨
        </div>

        <div>
          <strong>
            Tieni sotto controllo le tue finanze
          </strong>

          <p>
            Le spese e i risparmi vengono conteggiati
            dal giorno dello stipendio fino al
            prossimo stipendio.
          </p>
        </div>
      </section>
    </main>
  );
}
