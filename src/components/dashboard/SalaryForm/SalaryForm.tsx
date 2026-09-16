import { useState } from "react";

import "./SalaryForm.css";

import { saveSalary } from "../../../repositories/salaryRepository";

interface SalaryFormProps {
  currentAmount: number;
  onSaved: () => void;
}

export function SalaryForm({
  currentAmount,
  onSaved,
}: SalaryFormProps) {
  const [amount, setAmount] = useState(
    currentAmount > 0
      ? String(currentAmount)
      : "",
  );

  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const numericAmount = Number(
      amount.replace(",", "."),
    );

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return;
    }

    setIsSaving(true);

    try {
      const today = new Date();

      const date = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
      ].join("-");

      await saveSalary(
        date,
        numericAmount,
      );

      onSaved();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="salary-form"
      onSubmit={handleSubmit}
    >
      <div className="salary-input-wrapper">
        <span className="salary-currency">
          €
        </span>

        <input
          id="salary"
          type="text"
          inputMode="decimal"
          placeholder="1.800,00"
          value={amount}
          onChange={(event) =>
            setAmount(event.target.value)
          }
          aria-label="Importo stipendio"
        />
      </div>

      <button
        type="submit"
        className="salary-submit-button"
        disabled={isSaving}
      >
        {isSaving
          ? "Salvataggio..."
          : "Salva stipendio"}
      </button>
    </form>
  );
}
