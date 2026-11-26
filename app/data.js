// Hearth & Ledger — the Alvarez household's own budget data.
// One household, three months. Every figure on the site comes from here,
// so the dashboard, the budget bars and the reports always agree.

export const HOUSEHOLD = {
  name: 'The Alvarez Household',
  members: ['Mara', 'Jon', 'Sofia (9)', 'Leo (6)'],
  home: 'A rented three-bedroom in Portland, Oregon',
  payday: '1st and 15th of the month',
};

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#2f6f5e', note: 'Rent, renter insurance' },
  { id: 'groceries', label: 'Groceries', color: '#7a9e3f', note: 'Weekly shop + market' },
  { id: 'transport', label: 'Transport', color: '#3e7ca6', note: 'Fuel, bus passes, parking' },
  { id: 'utilities', label: 'Utilities', color: '#c98a2e', note: 'Power, water, internet, phones' },
  { id: 'dining', label: 'Dining out', color: '#b4552d', note: 'Takeaway + eating out' },
  { id: 'entertainment', label: 'Entertainment', color: '#7d5ba6', note: 'Streaming, books, outings' },
  { id: 'health', label: 'Health', color: '#4a9b8e', note: 'Pharmacy, dentist, glasses' },
  { id: 'kids', label: 'Kids & school', color: '#d16a8a', note: 'School, clubs, clothes' },
  { id: 'savings', label: 'Savings', color: '#2f6f5e', note: 'Emergency fund + goals' },
  { id: 'misc', label: 'Everything else', color: '#8a8f98', note: 'Gifts, household bits' },
];

// Monthly plan: income and what each category is allowed, per month.
export const MONTHS = {
  '2026-11': {
    label: 'November 2026',
    income: [
      { source: 'Mara — salary (Nov 1)', amount: 2700 },
      { source: 'Jon — salary (Nov 1)', amount: 2700 },
      { source: 'Jon — weekend freelance', amount: 650 },
      { source: 'Bank interest + refund', amount: 150 },
    ],
    plan: {
      housing: 1850, groceries: 720, transport: 420, utilities: 310,
      dining: 240, entertainment: 180, health: 200, kids: 260,
      savings: 900, misc: 120,
    },
    spent: {
      housing: 1850, groceries: 684, transport: 391, utilities: 287,
      dining: 268, entertainment: 142, health: 165, kids: 233,
      savings: 900, misc: 97,
    },
  },
  '2026-10': {
    label: 'October 2026',
    income: [
      { source: 'Mara — salary (Oct 1)', amount: 2700 },
      { source: 'Jon — salary (Oct 1)', amount: 2700 },
      { source: 'Jon — weekend freelance', amount: 480 },
      { source: 'Bank interest + refund', amount: 90 },
    ],
    plan: {
      housing: 1850, groceries: 700, transport: 420, utilities: 295,
      dining: 240, entertainment: 180, health: 200, kids: 260,
      savings: 850, misc: 120,
    },
    spent: {
      housing: 1850, groceries: 711, transport: 402, utilities: 301,
      dining: 251, entertainment: 176, health: 142, kids: 289,
      savings: 850, misc: 118,
    },
  },
  '2026-09': {
    label: 'September 2026',
    income: [
      { source: 'Mara — salary (Sep 1)', amount: 2700 },
      { source: 'Jon — salary (Sep 1)', amount: 2700 },
      { source: 'Jon — weekend freelance', amount: 520 },
      { source: 'Bank interest + refund', amount: 60 },
    ],
    plan: {
      housing: 1850, groceries: 700, transport: 420, utilities: 280,
      dining: 240, entertainment: 180, health: 200, kids: 340,
      savings: 850, misc: 120,
    },
    spent: {
      housing: 1850, groceries: 668, transport: 388, utilities: 276,
      dining: 219, entertainment: 154, health: 231, kids: 347,
      savings: 850, misc: 104,
    },
  },
};

export const MONTH_ORDER = ['2026-09', '2026-10', '2026-11'];

// Recent transactions for November. Shown newest first.
export const TRANSACTIONS = [
  { date: 'Nov 26', payee: 'Green Mart groceries', category: 'groceries', amount: 86.40, note: 'Weekly shop' },
  { date: 'Nov 24', payee: 'City Power & Light', category: 'utilities', amount: 142.18, note: 'Electric bill' },
  { date: 'Nov 23', payee: 'Corner Taqueria', category: 'dining', amount: 34.50, note: 'Takeaway for four' },
  { date: 'Nov 22', payee: 'Shell — fuel', category: 'transport', amount: 48.20, note: 'Tank fill-up' },
  { date: 'Nov 21', payee: 'Green Mart groceries', category: 'groceries', amount: 112.75, note: 'Weekly shop + pantry' },
  { date: 'Nov 20', payee: 'Riverside Cinema', category: 'entertainment', amount: 46.00, note: 'Family film night' },
  { date: 'Nov 19', payee: 'Bright Smiles Dentist', category: 'health', amount: 85.00, note: "Leo's check-up" },
  { date: 'Nov 18', payee: 'Northwest Internet', category: 'utilities', amount: 79.00, note: 'Monthly broadband' },
  { date: 'Nov 17', payee: 'Green Mart groceries', category: 'groceries', amount: 94.10, note: 'Weekly shop' },
  { date: 'Nov 15', payee: 'Jon — salary in', category: 'income', amount: 2700.00, note: 'Payday' },
  { date: 'Nov 15', payee: 'Mara — salary in', category: 'income', amount: 2700.00, note: 'Payday' },
  { date: 'Nov 14', payee: 'Bus passes (x2)', category: 'transport', amount: 100.00, note: 'Monthly passes' },
  { date: 'Nov 12', payee: 'Sofia — ballet term', category: 'kids', amount: 120.00, note: 'Autumn term fees' },
  { date: 'Nov 10', payee: 'Bookshop — Sofia', category: 'kids', amount: 28.40, note: 'Two chapter books' },
  { date: 'Nov 8', payee: 'Green Mart groceries', category: 'groceries', amount: 101.55, note: 'Weekly shop' },
  { date: 'Nov 7', payee: 'Pasta House', category: 'dining', amount: 58.75, note: 'Friday dinner out' },
  { date: 'Nov 5', payee: 'Pharmacy', category: 'health', amount: 32.60, note: 'Prescriptions' },
  { date: 'Nov 3', payee: 'Water bill', category: 'utilities', amount: 66.00, note: 'Quarterly water' },
  { date: 'Nov 1', payee: 'Rent — Maple St', category: 'housing', amount: 1780.00, note: 'November rent' },
  { date: 'Nov 1', payee: 'Emergency fund', category: 'savings', amount: 900.00, note: 'Auto-transfer on payday' },
];

export const BILLS = [
  { name: 'Rent — Maple St', amount: 1780.00, due: 'Dec 1', status: 'scheduled', note: 'Auto-pay on the 1st' },
  { name: 'City Power & Light', amount: 138.00, due: 'Dec 5', status: 'upcoming', note: 'Estimate, based on November' },
  { name: 'Northwest Internet', amount: 79.00, due: 'Dec 8', status: 'upcoming', note: 'Same every month' },
  { name: 'Mobile phones (x2)', amount: 96.00, due: 'Dec 12', status: 'upcoming', note: 'Mara + Jon' },
  { name: 'Renter insurance', amount: 70.00, due: 'Dec 15', status: 'upcoming', note: 'Annual policy, monthly' },
  { name: 'Water bill', amount: 66.00, due: 'Dec 18', status: 'upcoming', note: 'Quarterly — next one is January' },
  { name: 'Streaming bundle', amount: 24.99, due: 'Dec 20', status: 'upcoming', note: 'Two services, one bill' },
  { name: 'Ballet term — Sofia', amount: 120.00, due: 'Jan 10', status: 'upcoming', note: 'Winter term starts January' },
];

export const GOALS = [
  { id: 'emergency', name: 'Emergency fund', saved: 8400, target: 12000, note: 'Six months of rent and bills, for peace of mind.' },
  { id: 'holiday', name: 'Summer holiday — coast', saved: 1250, target: 2000, note: 'A week by the sea in July, train + cottage.' },
  { id: 'car', name: 'Replace the old car', saved: 2300, target: 6500, note: 'The 2012 hatchback is on its last legs.' },
  { id: 'leo-bike', name: "Leo's birthday bike", saved: 85, target: 220, note: 'Birthday in February — a red one, he says.' },
];

export const TIPS = [
  { title: 'Dining is $28 over budget', body: 'Two takeaways a week added up. One home-cooked Friday a month brings it back under $240.' },
  { title: 'Groceries are $36 under', body: 'Three weeks of meal planning beat the plan. That $36 can roll into the holiday fund.' },
  { title: 'Savings rate is 14.5%', body: '$900 of $6,200 income went straight to savings on payday — before anything could be spent.' },
  { title: 'Utilities are trending down', body: 'September $276, October $301, November $287. Shorter showers and LED bulbs are doing the work.' },
];

export function money(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function money0(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}
