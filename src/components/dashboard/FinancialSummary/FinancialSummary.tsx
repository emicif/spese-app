import "./FinancialSummary.css";

interface FinancialSummaryProps {
  salary: number;
  savings: number;
  expenses: number;
  available: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function FinancialSummary({
  salary,
  savings,
  expenses,
  available,
}: FinancialSummaryProps) {
  return (
    <section className="financial-summary">
      <div className="financial-summary-header">
        <div>
          <span className="financial-summary-eyebrow">
            Riepilogo
          </span>

          <h2>Situazione finanziaria</h2>
        </div>

        <span className="financial-summary-icon">
          📊
        </span>
      </div>

      <div className="financial-summary-grid">
        <article className="financial-summary-card salary">
          <div className="financial-summary-card-top">
            <span className="financial-summary-card-icon">
              💰
            </span>

            <span className="financial-summary-card-label">
              Stipendio
            </span>
          </div>

          <strong>
            {formatCurrency(salary)}
          </strong>

          <span className="financial-summary-card-caption">
            Entrate del mese
          </span>
        </article>

        <article className="financial-summary-card expense">
          <div className="financial-summary-card-top">
            <span className="financial-summary-card-icon">
              📉
            </span>

            <span className="financial-summary-card-label">
              Spese
            </span>
          </div>

          <strong>
            {formatCurrency(expenses)}
          </strong>

          <span className="financial-summary-card-caption">
            Uscite del mese
          </span>
        </article>

        <article className="financial-summary-card saving">
          <div className="financial-summary-card-top">
            <span className="financial-summary-card-icon">
              🏦
            </span>

            <span className="financial-summary-card-label">
              Risparmi
            </span>
          </div>

          <strong>
            {formatCurrency(savings)}
          </strong>

          <span className="financial-summary-card-caption">
            Somma accantonata
          </span>
        </article>

        <article className="financial-summary-card available">
          <div className="financial-summary-card-top">
            <span className="financial-summary-card-icon">
              💳
            </span>

            <span className="financial-summary-card-label">
              Disponibile
            </span>
          </div>

          <strong>
            {formatCurrency(available)}
          </strong>

          <span className="financial-summary-card-caption">
            Ancora utilizzabile
          </span>
        </article>
      </div>
    </section>
  );
}
