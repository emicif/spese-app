const MONTH_NAMES = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

export function getCurrentMonth(): string {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function formatMonth(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);

  return `${MONTH_NAMES[monthNumber - 1]} ${year}`;
}

export function getPreviousMonth(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);

  if (monthNumber === 1) {
    return `${year - 1}-12`;
  }

  return `${year}-${String(monthNumber - 1).padStart(2, "0")}`;
}

export function getNextMonth(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);

  if (monthNumber === 12) {
    return `${year + 1}-01`;
  }

  return `${year}-${String(monthNumber + 1).padStart(2, "0")}`;
}
