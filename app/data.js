// Hearth Ledger — the Marlowe household's own November 2026 figures.
// One household, one month, all in dollars. Every total the site shows is
// computed from these rows, so the dashboard, budgets and report can never
// disagree with each other.

export const HOUSEHOLD = {
  name: "The Marlowe household",
  members: "Ana, Ben, Mia (9) and Leo (6)",
  home: "A two-bedroom flat on Willow Court",
  month: "November 2026",
  monthLabel: "November 2026",
  currency: "USD",
};

export const CATEGORIES = [
  { id: "housing", label: "Housing", color: "#1f5c40" },
  { id: "groceries", label: "Groceries", color: "#2f6f8f" },
  { id: "utilities", label: "Utilities", color: "#d9a441" },
  { id: "transport", label: "Transport", color: "#7a5c9e" },
  { id: "dining", label: "Dining out", color: "#c96f3f" },
  { id: "family", label: "Family fun", color: "#4a9a7d" },
  { id: "kids", label: "Kids", color: "#b3402e" },
  { id: "health", label: "Health", color: "#5b8c5a" },
  { id: "home", label: "Home & garden", color: "#8a6d3b" },
  { id: "everyday", label: "Everyday", color: "#6b7a8f" },
];

export const INCOME = [
  { id: "inc-1", date: "2026-11-01", source: "Salary — Ana (Northfield Clinic)", amount: 4200 },
  { id: "inc-2", date: "2026-11-01", source: "Salary — Ben (Harbour Freight)", amount: 2350 },
  { id: "inc-3", date: "2026-11-14", source: "Weekend market stall — Ben", amount: 300 },
];

// November spending so far (1–26 November). Amounts are what was actually paid.
export const TRANSACTIONS = [
  { id: "t-01", date: "2026-11-01", payee: "Willow Court — monthly rent", category: "housing", amount: 1450.00 },
  { id: "t-02", date: "2026-11-02", payee: "GreenMart — weekly shop", category: "groceries", amount: 128.40 },
  { id: "t-03", date: "2026-11-02", payee: "School lunches — Mia & Leo", category: "kids", amount: 86.00 },
  { id: "t-04", date: "2026-11-03", payee: "Metro monthly pass — Ana", category: "transport", amount: 92.00 },
  { id: "t-05", date: "2026-11-03", payee: "Post office — parcel to Gran", category: "everyday", amount: 12.40 },
  { id: "t-06", date: "2026-11-04", payee: "City Power & Light — electricity", category: "utilities", amount: 132.00 },
  { id: "t-07", date: "2026-11-05", payee: "Petrol — Shell Lane garage", category: "transport", amount: 46.20 },
  { id: "t-08", date: "2026-11-05", payee: "Pharmacy — cough syrup & plasters", category: "health", amount: 18.60 },
  { id: "t-09", date: "2026-11-06", payee: "Pasta Palace — family dinner", category: "dining", amount: 58.40 },
  { id: "t-10", date: "2026-11-07", payee: "GreenMart — weekly shop", category: "groceries", amount: 96.75 },
  { id: "t-11", date: "2026-11-07", payee: "Hardware — light bulbs & hooks", category: "home", amount: 23.80 },
  { id: "t-12", date: "2026-11-08", payee: "Cinema — Saturday matinee", category: "family", amount: 46.00 },
  { id: "t-13", date: "2026-11-09", payee: "Corner Bakery — bread & rolls", category: "groceries", amount: 18.20 },
  { id: "t-14", date: "2026-11-09", payee: "Swimming lessons — Mia & Leo", category: "kids", amount: 64.00 },
  { id: "t-15", date: "2026-11-10", payee: "Coffee & cake — Mia's treat", category: "dining", amount: 24.60 },
  { id: "t-16", date: "2026-11-10", payee: "Dentist check-up — Ana", category: "health", amount: 85.00 },
  { id: "t-17", date: "2026-11-11", payee: "NorthNet — broadband", category: "utilities", amount: 68.00 },
  { id: "t-18", date: "2026-11-12", payee: "Haircut — Ben", category: "everyday", amount: 28.00 },
  { id: "t-19", date: "2026-11-12", payee: "Metro monthly pass — Ben", category: "transport", amount: 92.00 },
  { id: "t-20", date: "2026-11-13", payee: "GreenMart — weekly shop", category: "groceries", amount: 142.60 },
  { id: "t-21", date: "2026-11-13", payee: "Plant pots & soil", category: "home", amount: 31.20 },
  { id: "t-22", date: "2026-11-14", payee: "City Water — quarterly bill", category: "utilities", amount: 54.30 },
  { id: "t-23", date: "2026-11-14", payee: "Library books — donation box", category: "family", amount: 12.00 },
  { id: "t-24", date: "2026-11-15", payee: "Farmers' market — veg & eggs", category: "groceries", amount: 34.50 },
  { id: "t-25", date: "2026-11-15", payee: "New shoes — Leo", category: "kids", amount: 52.50 },
  { id: "t-26", date: "2026-11-16", payee: "Takeaway noodles — Friday night", category: "dining", amount: 42.75 },
  { id: "t-27", date: "2026-11-17", payee: "Petrol — Shell Lane garage", category: "transport", amount: 41.50 },
  { id: "t-28", date: "2026-11-17", payee: "Stationery & birthday cards", category: "everyday", amount: 16.75 },
  { id: "t-29", date: "2026-11-18", payee: "After-school club — Mia", category: "kids", amount: 45.00 },
  { id: "t-30", date: "2026-11-19", payee: "GreenMart — weekly shop", category: "groceries", amount: 118.90 },
  { id: "t-31", date: "2026-11-19", payee: "Pharmacy — vitamins", category: "health", amount: 24.30 },
  { id: "t-32", date: "2026-11-19", payee: "Curtain rail repair", category: "home", amount: 42.00 },
  { id: "t-33", date: "2026-11-20", payee: "Mobile — Ana & Ben", category: "utilities", amount: 96.00 },
  { id: "t-34", date: "2026-11-21", payee: "Corner Bakery — bread & rolls", category: "groceries", amount: 22.40 },
  { id: "t-35", date: "2026-11-21", payee: "Bowling — family afternoon", category: "family", amount: 58.50 },
  { id: "t-36", date: "2026-11-22", payee: "Lunch — Ben's work day", category: "dining", amount: 18.90 },
  { id: "t-37", date: "2026-11-23", payee: "Bus top-up — Leo's travel card", category: "transport", amount: 24.00 },
  { id: "t-38", date: "2026-11-23", payee: "Art supplies — Mia", category: "kids", amount: 28.75 },
  { id: "t-39", date: "2026-11-24", payee: "GreenMart — weekly shop", category: "groceries", amount: 131.85 },
  { id: "t-40", date: "2026-11-24", payee: "Gym — monthly membership", category: "health", amount: 45.00 },
  { id: "t-41", date: "2026-11-24", payee: "Board game — Leo's pick", category: "family", amount: 28.40 },
  { id: "t-42", date: "2026-11-25", payee: "Butcher & Deli — Sunday roast", category: "groceries", amount: 48.00 },
  { id: "t-43", date: "2026-11-25", payee: "Pizza night — the whole family", category: "dining", amount: 64.20 },
  { id: "t-44", date: "2026-11-26", payee: "Dry cleaning — Ben's suit", category: "everyday", amount: 22.00 },
];

// What the household planned to spend in each category this month.
export const BUDGETS = [
  { category: "housing", amount: 1450 },
  { category: "groceries", amount: 900 },
  { category: "utilities", amount: 380 },
  { category: "transport", amount: 380 },
  { category: "dining", amount: 260 },
  { category: "family", amount: 300 },
  { category: "kids", amount: 350 },
  { category: "health", amount: 200 },
  { category: "home", amount: 180 },
  { category: "everyday", amount: 150 },
];

export const GOALS = [
  { id: "g-1", name: "Emergency fund", note: "Three months of rent and bills, kept apart so a broken boiler never becomes a crisis.", target: 8000, saved: 5240 },
  { id: "g-2", name: "Family holiday", note: "A week by the sea next summer — train tickets, a cottage, and ice cream money.", target: 2400, saved: 1150 },
  { id: "g-3", name: "New boiler", note: "The old one rattles every winter. A new one before next November.", target: 1800, saved: 640 },
  { id: "g-4", name: "Kids' bikes", note: "Two bikes for Mia and Leo, so the school run can be a ride instead of a bus.", target: 520, saved: 310 },
];

export const BILLS = [
  { id: "b-1", name: "Rent — Willow Court", amount: 1450.00, due: "2026-11-01", paid: true },
  { id: "b-2", name: "Electricity — City Power & Light", amount: 132.00, due: "2026-11-12", paid: true },
  { id: "b-3", name: "Broadband — NorthNet", amount: 68.00, due: "2026-11-15", paid: true },
  { id: "b-4", name: "Water — City Water", amount: 54.30, due: "2026-11-18", paid: true },
  { id: "b-5", name: "Mobile — Ana & Ben", amount: 96.00, due: "2026-11-20", paid: true },
  { id: "b-6", name: "Gym — monthly membership", amount: 45.00, due: "2026-11-25", paid: true },
  { id: "b-7", name: "Home insurance — annual, monthly part", amount: 187.00, due: "2026-11-28", paid: false },
  { id: "b-8", name: "Streaming — films & shows", amount: 16.00, due: "2026-11-30", paid: false },
];

// Whole-month spending for the last five months (November is computed live).
export const MONTHLY_HISTORY = [
  { month: "Jul", spent: 4180 },
  { month: "Aug", spent: 4402 },
  { month: "Sep", spent: 3976 },
  { month: "Oct", spent: 4215 },
];

// --- Derived figures: everything the pages show comes from here. ---

export function totalIncome() {
  return INCOME.reduce((sum, row) => sum + row.amount, 0);
}

export function totalSpent(transactions) {
  return transactions.reduce((sum, row) => sum + row.amount, 0);
}

export function spentByCategory(transactions) {
  const totals = new Map(CATEGORIES.map((c) => [c.id, 0]));
  for (const row of transactions) {
    totals.set(row.category, (totals.get(row.category) ?? 0) + row.amount);
  }
  return totals;
}

export function budgetFor(categoryId, budgets) {
  return budgets.find((b) => b.category === categoryId)?.amount ?? 0;
}

export function totalBudgeted(budgets) {
  return budgets.reduce((sum, b) => sum + b.amount, 0);
}

export function upcomingBills(bills) {
  return bills.filter((b) => !b.paid).sort((a, b) => a.due.localeCompare(b.due));
}

export function paidBillsTotal(bills) {
  return bills.filter((b) => b.paid).reduce((sum, b) => sum + b.amount, 0);
}
