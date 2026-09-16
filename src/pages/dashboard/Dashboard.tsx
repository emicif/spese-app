import { useCallback, useEffect, useState } from "react";

import "./Dashboard.css";

import { FinancialSummary } from "../../components/dashboard/FinancialSummary/FinancialSummary";
import { MonthSelector } from "../../components/dashboard/MonthSelector/MonthSelector";
import { SalaryForm } from "../../components/dashboard/SalaryForm/SalaryForm";
import { SavingForm } from "../../components/dashboard/SavingForm/SavingForm";

import { getSalaryByMonth } from "../../repositories/salaryRepository";
import { getExpensesByMonth } from "../../repositories/expenseRepository";
import { getSavingsByMonth } from "../../repositories/savingRepository";

import {
  calculateTotalExpenses,
  calculateTotalSavings,
  calculateAvailableAmount,
} from "../../utils/dashboardUtils";

import { getCurrentMonth } from "../../utils/monthUtils";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function Dashboard() {
  const [month, setMonth] = useState(
    getCurrentMonth(),
  );

  const [salary, setSalary] = useState(0);
  const [savings, setSavings] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const loadDashboard = useCallback(async () => {
    const [
      salaryRecord,
      savingsRecords,
      expenseRecords,
    ] = await Promise.all([
      getSalaryByMonth(month),
      getSavingsByMonth(month),
      getExpensesByMonth(month),
    ]);

    setSalary(salaryRecord?.amount ?? 0);

    setSavings(
      calculateTotalSavings(savingsRecords),
    );

    setExpenses(
      calculateTotalExpenses(expenseRecords),
    );
  }, [month]);

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
        <span>Periodo</span>

        <MonthSelector
          month={month}
          onMonthChange={setMonth}
        />
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
        available={available}
      />

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <span>Gestione</span>
            <h2>Questo mese</h2>
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
                  Imposta lo stipendio del mese
                </p>
              </div>
            </div>

            <SalaryForm
              month={month}
              currentAmount={salary}
              onSaved={loadDashboard}
            />
          </div>

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
              month={month}
              onSaved={loadDashboard}
            />
          </div>
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
            Controlla le spese e scopri quanto
            puoi ancora utilizzare questo mese.
          </p>
        </div>
      </section>
    </main>
  );
}
