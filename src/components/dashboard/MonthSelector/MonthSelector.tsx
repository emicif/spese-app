import { ChevronLeft, ChevronRight } from "lucide-react";

import "./MonthSelector.css";

import {
  formatMonth,
  getNextMonth,
  getPreviousMonth,
} from "../../../utils/monthUtils";

interface MonthSelectorProps {
  month: string;
  onMonthChange: (month: string) => void;
}

export function MonthSelector({
  month,
  onMonthChange,
}: MonthSelectorProps) {
  return (
    <div className="month-selector">
      <button
        type="button"
        className="month-selector-button"
        onClick={() =>
          onMonthChange(getPreviousMonth(month))
        }
        aria-label="Mese precedente"
      >
        <ChevronLeft size={20} strokeWidth={2.2} />
      </button>

      <div className="month-selector-current">
        <span className="month-selector-label">
          Mese
        </span>

        <strong>{formatMonth(month)}</strong>
      </div>

      <button
        type="button"
        className="month-selector-button"
        onClick={() =>
          onMonthChange(getNextMonth(month))
        }
        aria-label="Mese successivo"
      >
        <ChevronRight size={20} strokeWidth={2.2} />
      </button>
    </div>
  );
}
