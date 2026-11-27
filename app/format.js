// Lumbung formatting helpers: Rupiah, dates, percents. One job: make numbers readable.

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/** Rp 1.234.567 — compact Indonesian Rupiah, no decimals. */
export function rupiah(amount) {
  const n = Math.round(amount);
  const sign = n < 0 ? "−" : "";
  const digits = String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}Rp ${digits}`;
}

/** Short form for chart labels: Rp 1,2 jt. */
export function rupiahShort(amount) {
  const abs = Math.abs(amount);
  if (abs >= 1000000) return `Rp ${(amount / 1000000).toFixed(1).replace(".", ",")} jt`;
  if (abs >= 1000) return `Rp ${Math.round(amount / 1000)} rb`;
  return rupiah(amount);
}

/** "2026-11-04" -> "4 Nov 2026". */
export function shortDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTH_NAMES[m - 1].slice(0, 3)} ${y}`;
}

/** 0.42 -> "42%". */
export function pct(part, whole) {
  if (!whole) return "0%";
  return `${Math.round((part / whole) * 100)}%`;
}

/** Escape text for safe insertion into HTML. */
export function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
