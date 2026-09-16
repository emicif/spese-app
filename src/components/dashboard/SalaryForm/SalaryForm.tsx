import { useState } from "react";

import "./SalaryForm.css";

interface SalaryFormProps {
  month: string;
  currentAmount: number;
  onSaved: () => void;
}

export function SalaryForm({
  month,
  currentAmount,
  onSaved,
}: SalaryFormProps) {
  const [amount, setAmount] = useState(
    currentAmount > 0 ? String(currentAmount) : "",
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
      const { saveSalary } = await import(
        "../../../repositories/salaryRepository"
      );

      await saveSalary(month, numericAmount);

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
        <span className="salary-currency">€</span>

        <input
          id="salary"
          type="text"
          inputMode="decimal"
          placeholder="1.800,00"
          value={amount}
          onChange={(event) =>
            setAmount(event.target.value)
          }
          aria-label={`Stipendio di ${month}`}
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
