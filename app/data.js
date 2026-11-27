// Alder Ledger — seed data for the Alder household, November 2026.
// All figures are the household's own records. Amounts are in US dollars.
// The app loads this file, then overlays anything the household saved
// in this browser (added transactions, paid bills, goal contributions).
export const HOUSEHOLD = {
  name: 'The Alder Household',
  members: 'Daniel & Priya Alder, with Sam (9) and June (6)',
  month: 'November 2026',
  monthShort: 'Nov 2026',
  currency: 'USD',
};

export const INCOME = [
  { id: 'inc-1', date: '2026-11-01', source: 'Daniel — salary, Northgate Studio', amount: 4600 },
  { id: 'inc-2', date: '2026-11-01', source: 'Priya — salary, Riverside Clinic', amount: 3250 },
];

// Planned monthly budget per category, in dollars.
export const BUDGETS = [
  { id: 'housing', label: 'Housing', planned: 1850, note: 'Rent, 2-bed flat on Alder Street' },
  { id: 'groceries', label: 'Groceries', planned: 720, note: 'Weekly shop + top-ups' },
  { id: 'transport', label: 'Transport', planned: 380, note: 'Fuel, metro passes, car upkeep' },
  { id: 'utilities', label: 'Utilities', planned: 310, note: 'Electric, water, internet' },
  { id: 'dining', label: 'Eating out', planned: 240, note: 'One family meal out a week' },
  { id: 'kids', label: 'Kids & school', planned: 420, note: 'Lunches, clubs, kit and books' },
  { id: 'health', label: 'Health', planned: 260, note: 'Pharmacy, dentist, check-ups' },
  { id: 'fun', label: 'Fun & leisure', planned: 180, note: 'Films, streaming, games' },
  { id: 'savings', label: 'Savings', planned: 1200, note: 'Moved to savings on payday' },
  { id: 'household', label: 'Household', planned: 200, note: 'Cleaning, repairs, hardware' },
];

// Every expense recorded 1–26 November 2026. Category totals in the app
// are computed from this list, so the dashboard and the budget pages agree.
export const TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', payee: 'Alder Street Lettings', category: 'housing', amount: 1850.0, note: 'November rent' },
  { id: 't02', date: '2026-11-01', payee: 'Alder Savings Account', category: 'savings', amount: 1200.0, note: 'Payday transfer' },
  { id: 't03', date: '2026-11-01', payee: 'City Metro', category: 'transport', amount: 35.0, note: 'Monthly metro pass' },
  { id: 't04', date: '2026-11-01', payee: 'Streamline', category: 'fun', amount: 18.99, note: 'Streaming, monthly' },
  { id: 't05', date: '2026-11-02', payee: 'GreenMart', category: 'groceries', amount: 148.2, note: 'Weekly shop' },
  { id: 't06', date: '2026-11-02', payee: 'Riverside School', category: 'kids', amount: 145.0, note: 'School lunches, November' },
  { id: 't07', date: '2026-11-03', payee: 'QuickFuel', category: 'transport', amount: 62.0, note: 'Petrol' },
  { id: 't08', date: '2026-11-04', payee: 'NorthNet', category: 'utilities', amount: 84.0, note: 'Internet, monthly' },
  { id: 't09', date: '2026-11-05', payee: 'Corner Pharmacy', category: 'health', amount: 45.0, note: 'Prescriptions' },
  { id: 't10', date: '2026-11-06', payee: 'City Power', category: 'utilities', amount: 132.4, note: 'Electricity, October use' },
  { id: 't11', date: '2026-11-07', payee: 'The Corner Bistro', category: 'dining', amount: 46.8, note: 'Saturday lunch' },
  { id: 't12', date: '2026-11-08', payee: 'GreenMart', category: 'groceries', amount: 96.75, note: 'Weekly shop' },
  { id: 't13', date: '2026-11-08', payee: 'Riverside Cinema', category: 'fun', amount: 24.0, note: 'Family film, 4 tickets' },
  { id: 't14', date: '2026-11-09', payee: 'City Water', category: 'utilities', amount: 68.2, note: 'Water, quarterly' },
  { id: 't15', date: '2026-11-10', payee: 'Sports Direct', category: 'kids', amount: 89.5, note: "Sam's football kit" },
  { id: 't16', date: '2026-11-11', payee: 'QuickFuel', category: 'transport', amount: 48.5, note: 'Petrol' },
  { id: 't17', date: '2026-11-12', payee: 'FixIt Hardware', category: 'household', amount: 74.25, note: 'Tap washer, light bulbs' },
  { id: 't18', date: '2026-11-13', payee: 'Sakura Sushi', category: 'dining', amount: 58.25, note: 'Friday takeaway' },
  { id: 't19', date: '2026-11-14', payee: 'FreshCo', category: 'groceries', amount: 121.4, note: 'Weekly shop' },
  { id: 't20', date: '2026-11-14', payee: 'Game Shelf', category: 'fun', amount: 63.41, note: 'Board game for June' },
  { id: 't21', date: '2026-11-15', payee: 'AutoCare Garage', category: 'transport', amount: 96.4, note: 'Car service, oil top-up' },
  { id: 't22', date: '2026-11-16', payee: 'Book Nook', category: 'kids', amount: 64.7, note: 'School reading books' },
  { id: 't23', date: '2026-11-17', payee: 'Corner Cafe', category: 'dining', amount: 34.6, note: 'Coffee and pastries' },
  { id: 't24', date: '2026-11-18', payee: 'Riverside Dental', category: 'health', amount: 97.0, note: "June's check-up" },
  { id: 't25', date: '2026-11-19', payee: 'GreenMart', category: 'groceries', amount: 88.3, note: 'Weekly shop' },
  { id: 't26', date: '2026-11-20', payee: 'Riverside School', category: 'kids', amount: 87.0, note: 'After-school club, November' },
  { id: 't27', date: '2026-11-21', payee: 'QuickFuel', category: 'transport', amount: 56.25, note: 'Petrol' },
  { id: 't28', date: '2026-11-22', payee: 'Mama Rosa Pizza', category: 'dining', amount: 72.1, note: 'Family pizza night' },
  { id: 't29', date: '2026-11-23', payee: 'FreshCo', category: 'groceries', amount: 104.55, note: 'Weekly shop' },
  { id: 't30', date: '2026-11-24', payee: 'CleanHome Supplies', category: 'household', amount: 94.65, note: 'Cleaning products' },
  { id: 't31', date: '2026-11-25', payee: 'Corner Market', category: 'groceries', amount: 53.2, note: 'Top-up shop' },
  { id: 't32', date: '2026-11-25', payee: 'Harbour Concerts', category: 'fun', amount: 50.0, note: 'Two concert tickets' },
];

// Recurring bills for November 2026. `paid` is the state on 26 November.
export const BILLS = [
  { id: 'b01', name: 'Rent', payee: 'Alder Street Lettings', amount: 1850, due: '2026-11-01', paid: true },
  { id: 'b02', name: 'Internet', payee: 'NorthNet', amount: 84, due: '2026-11-04', paid: true },
  { id: 'b03', name: 'Electricity', payee: 'City Power', amount: 132.4, due: '2026-11-06', paid: true },
  { id: 'b04', name: 'Water', payee: 'City Water', amount: 68.2, due: '2026-11-09', paid: true },
  { id: 'b05', name: 'Mobile phones', payee: 'NorthNet Mobile', amount: 96, due: '2026-11-12', paid: true },
  { id: 'b06', name: 'Home insurance', payee: 'SafeHome Cover', amount: 148, due: '2026-11-15', paid: true },
  { id: 'b07', name: 'Gym', payee: 'Riverside Fitness', amount: 54, due: '2026-11-20', paid: true },
  { id: 'b08', name: 'Streaming', payee: 'Streamline', amount: 18.99, due: '2026-11-01', paid: true },
  { id: 'b09', name: 'Car insurance', payee: 'SafeDrive Cover', amount: 210, due: '2026-11-28', paid: false },
  { id: 'b10', name: 'Credit card', payee: 'Northgate Card', amount: 320, due: '2026-11-30', paid: false },
];

// Savings goals, with what is saved so far.
export const GOALS = [
  { id: 'g1', name: 'Emergency fund', target: 12000, saved: 8450, note: 'Six months of essentials, kept in a separate account.' },
  { id: 'g2', name: 'Summer holiday', target: 2400, saved: 1620, note: 'A week by the coast in July — ferry, cottage, food.' },
  { id: 'g3', name: 'Bikes for Sam & June', target: 900, saved: 540, note: 'Two bikes and helmets for spring.' },
  { id: 'g4', name: 'Kitchen refresh', target: 3500, saved: 1100, note: 'New worktop, paint and a second-hand dishwasher.' },
];

// Total spending per month, June–November 2026, for the report chart.
export const MONTHLY = [
  { month: 'Jun', spent: 5120, income: 7850 },
  { month: 'Jul', spent: 5480, income: 7850 },
  { month: 'Aug', spent: 5315, income: 7850 },
  { month: 'Sep', spent: 5025, income: 7850 },
  { month: 'Oct', spent: 5490, income: 7850 },
  { month: 'Nov', spent: 5310.4, income: 7850 },
];

const STORE_KEY = 'alder-ledger-v1';

// Load the household's own additions from this browser, if any were saved.
export function loadSaved() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { extraTransactions: [], paidBillIds: [], goalExtra: {} };
    const parsed = JSON.parse(raw);
    return {
      extraTransactions: Array.isArray(parsed.extraTransactions) ? parsed.extraTransactions : [],
      paidBillIds: Array.isArray(parsed.paidBillIds) ? parsed.paidBillIds : [],
      goalExtra: parsed.goalExtra && typeof parsed.goalExtra === 'object' ? parsed.goalExtra : {},
    };
  } catch {
    return { extraTransactions: [], paidBillIds: [], goalExtra: {} };
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    // Private browsing or storage off: the site still works for this visit.
  }
}

// Money formatting used across every view.
export function money(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function moneyShort(n) {
  if (n >= 1000) return '$' + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return '$' + Math.round(n);
}

export function prettyDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
