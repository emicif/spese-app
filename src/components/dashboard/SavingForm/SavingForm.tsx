import { useState } from "react";

import "./SavingForm.css";

import { addSaving } from "../../../repositories/savingRepository";

interface SavingFormProps {
  month: string;
  onSaved: () => void;
}

export function SavingForm({
  month,
  onSaved,
}: SavingFormProps) {
  const [amount, setAmount] = useState("");
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
      await addSaving({
        date: `${month}-01`,
        amount: numericAmount,
      });

      setAmount("");
      onSaved();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="saving-form"
      onSubmit={handleSubmit}
    >
      <div className="saving-input-wrapper">
        <span className="saving-currency">€</span>

        <input
          id="saving"
          type="text"
          inputMode="decimal"
          placeholder="300,00"
          value={amount}
          onChange={(event) =>
            setAmount(event.target.value)
          }
          aria-label="Importo da mettere da parte"
        />
      </div>

      <button
        type="submit"
        className="saving-submit-button"
        disabled={isSaving}
      >
        {isSaving
          ? "Salvataggio..."
          : "Aggiungi risparmio"}
      </button>
    </form>
  );
}
