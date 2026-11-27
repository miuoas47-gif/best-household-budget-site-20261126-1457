// views.js — every page of Alder Ledger: the dashboard, transactions,
// budgets, bills, savings goals and the monthly report. The router reads
// the hash (#/budgets and friends), renders the matching view into #app,
// and wires up that view's controls. All figures come from data.js plus
// anything this household saved in the browser.
import {
  HOUSEHOLD, INCOME, BUDGETS, TRANSACTIONS, BILLS, GOALS, MONTHLY,
  loadSaved, saveState, money, moneyShort, prettyDate,
} from './data.js';
import { categoryBarRow, monthlyChart, escapeHtml } from './charts.js';

const saved = loadSaved();
let filterCategory = 'all';
let filterText = '';
let notice = '';

function state() {
  const bills = BILLS.map(function (b) {
    return Object.assign({}, b, { paid: b.paid || saved.paidBillIds.indexOf(b.id) !== -1 });
  });
  const goals = GOALS.map(function (g) {
    return Object.assign({}, g, { saved: g.saved + (saved.goalExtra[g.id] || 0) });
  });
  return { transactions: TRANSACTIONS.concat(saved.extraTransactions), bills: bills, goals: goals };
}

function totals(tx) {
  const income = INCOME.reduce(function (sum, row) { return sum + row.amount; }, 0);
  const spent = tx.reduce(function (sum, row) { return sum + row.amount; }, 0);
  const byCategory = {};
  BUDGETS.forEach(function (b) { byCategory[b.id] = 0; });
  tx.forEach(function (row) {
    if (byCategory[row.category] !== undefined) byCategory[row.category] += row.amount;
  });
  return { income: income, spent: spent, left: income - spent, byCategory: byCategory };
}

function categoryLabel(id) {
  const found = BUDGETS.find(function (b) { return b.id === id; });
  return found ? found.label : id;
}

function setNotice(text) {
  notice = text;
  const slot = document.getElementById('notice-slot');
  if (slot) slot.innerHTML = notice ? '<div class="notice">' + escapeHtml(notice) + '</div>' : '';
}

function markNav(route) {
  document.querySelectorAll('[data-nav]').forEach(function (link) {
    link.classList.toggle('active', link.getAttribute('data-nav') === route);
  });
}

function transactionRows(tx) {
  return tx.map(function (row) {
    const isIncome = row.category === 'income';
    return '<tr><td>' + prettyDate(row.date) + '</td><td>' + escapeHtml(row.payee) + '</td>' +
      '<td><span class="cat-pill' + (isIncome ? ' income' : '') + '">' + escapeHtml(isIncome ? 'Income' : categoryLabel(row.category)) + '</span></td>' +
      '<td class="hide-phone muted">' + escapeHtml(row.note || '') + '</td>' +
      '<td class="num">' + (isIncome ? '+' : '−') + money(row.amount) + '</td></tr>';
  }).join('');
}

// ---- Dashboard -------------------------------------------------------------
function renderDashboard(app) {
  const s = state();
  const t = totals(s.transactions);
  const plannedTotal = BUDGETS.reduce(function (sum, b) { return sum + b.planned; }, 0);
  const upcoming = s.bills.filter(function (b) { return !b.paid; });
  const recent = s.transactions.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).slice(0, 8);
  const sortedCats = BUDGETS.slice().sort(function (a, b) { return t.byCategory[b.id] - t.byCategory[a.id]; });
  const topGoal = s.goals.slice().sort(function (a, b) { return b.saved / b.target - a.saved / a.target; })[0];

  app.innerHTML =
    '<div class="page-head"><div><h1>November at a glance</h1>' +
    '<p>' + escapeHtml(HOUSEHOLD.members) + ' — income, spending and what is left, up to 26 November 2026.</p></div>' +
    '<a href="#/transactions"><button type="button">Add an expense</button></a></div>' +
    '<div id="notice-slot"></div>' +
    '<section class="cards" aria-label="Month summary">' +
    statCard('Income this month', money(t.income), 'Two salaries, paid 1 November', '') +
    statCard('Spent so far', money(t.spent), 'Of ' + money(plannedTotal) + ' planned', '') +
    statCard('Left this month', money(t.left), 'Income minus spending', t.left >= 0 ? 'good' : 'bad') +
    statCard('Saved this month', money(t.byCategory.savings), 'Emergency fund &amp; goals', 'good') +
    '</section>' +
    '<div class="grid-2"><section class="card"><h2>Where the money went</h2>' +
    sortedCats.slice(0, 6).map(function (b) { return categoryBarRow(b.label, t.byCategory[b.id], b.planned); }).join('') +
    '<p class="small muted" style="margin-top:10px"><a href="#/budgets">See all ten budget categories &rarr;</a></p></section>' +
    '<section class="card"><h2>Still to pay</h2>' +
    (upcoming.length === 0
      ? '<p>Every November bill is paid. Nice work.</p>'
      : '<p><strong>' + money(upcoming.reduce(function (sum, b) { return sum + b.amount; }, 0)) + '</strong> due before the month ends:</p>' +
        '<ul class="tip-list">' + upcoming.map(function (b) {
          return '<li>' + escapeHtml(b.name) + ' — ' + money(b.amount) + ', due ' + prettyDate(b.due) + '</li>';
        }).join('') + '</ul><p><a href="#/bills">Open the bills page &rarr;</a></p>') +
    '<hr style="border:0;border-top:1px solid var(--line);margin:14px 0">' +
    '<h2>Closest savings goal</h2><p><strong>' + escapeHtml(topGoal.name) + '</strong> — ' + money(topGoal.saved) + ' of ' + money(topGoal.target) +
    ' (' + Math.round((topGoal.saved / topGoal.target) * 100) + '%)</p>' +
    '<p><a href="#/goals">See all savings goals &rarr;</a></p></section></div>' +
    '<section class="card"><h2>Recent spending</h2><table><thead><tr><th>Date</th><th>Where</th><th>Category</th><th class="hide-phone">Note</th><th class="num">Amount</th></tr></thead>' +
    '<tbody>' + transactionRows(recent) + '</tbody></table>' +
    '<p class="small muted" style="margin-top:10px"><a href="#/transactions">See all ' + s.transactions.length + ' November transactions &rarr;</a></p></section>';
}

function statCard(label, value, sub, tone) {
  return '<div class="card"><div class="stat-label">' + label + '</div>' +
    '<div class="stat-value ' + tone + '">' + value + '</div><div class="stat-sub">' + sub + '</div></div>';
}

// ---- Transactions ----------------------------------------------------------
function renderTransactions(app) {
  const s = state();
  const t = totals(s.transactions);
  const incomeRows = INCOME.map(function (row) {
    return { id: row.id, date: row.date, payee: row.source, category: 'income', amount: row.amount, note: 'Payday' };
  });
  let rows = s.transactions.concat(incomeRows).slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
  if (filterCategory !== 'all') rows = rows.filter(function (r) { return r.category === filterCategory; });
  if (filterText) {
    const q = filterText.toLowerCase();
    rows = rows.filter(function (r) { return (r.payee + ' ' + (r.note || '')).toLowerCase().indexOf(q) !== -1; });
  }
  const options = ['<option value="all">All categories</option>'].concat(
    BUDGETS.map(function (b) {
      return '<option value="' + b.id + '"' + (filterCategory === b.id ? ' selected' : '') + '>' + escapeHtml(b.label) + '</option>';
    }),
    ['<option value="income"' + (filterCategory === 'income' ? ' selected' : '') + '>Income</option>'],
  );

  app.innerHTML =
    '<div class="page-head"><div><h1>Transactions</h1>' +
    '<p>Every dollar the household spent — and earned — in November 2026. ' + s.transactions.length + ' expenses, ' + money(t.spent) + ' in all.</p></div></div>' +
    '<div id="notice-slot"></div>' +
    '<section class="card section"><h2>Add an expense</h2>' +
    '<form class="add-form" id="add-form"><div><label for="f-date">Date</label><input id="f-date" type="date" value="2026-11-26" required></div>' +
    '<div><label for="f-amount">Amount ($)</label><input id="f-amount" type="number" min="0.01" step="0.01" placeholder="25.00" required></div>' +
    '<div><label for="f-payee">Where / to whom</label><input id="f-payee" type="text" maxlength="80" placeholder="GreenMart" required></div>' +
    '<div><label for="f-category">Category</label><select id="f-category">' +
    BUDGETS.map(function (b) { return '<option value="' + b.id + '">' + escapeHtml(b.label) + '</option>'; }).join('') +
    '</select></div>' +
    '<div class="full"><label for="f-note">Note (optional)</label><input id="f-note" type="text" maxlength="120" placeholder="What was it for?"></div>' +
    '<div class="full"><button type="submit">Add expense</button></div></form></section>' +
    '<section class="card"><div class="toolbar">' +
    '<div class="field"><label for="filter-cat">Category</label><select id="filter-cat">' + options.join('') + '</select></div>' +
    '<div class="field"><label for="filter-text">Search</label><input id="filter-text" type="search" placeholder="Shop, note, payee…" value="' + escapeHtml(filterText) + '"></div>' +
    '</div>' +
    '<table><thead><tr><th>Date</th><th>Where</th><th>Category</th><th class="hide-phone">Note</th><th class="num">Amount</th></tr></thead>' +
    '<tbody>' + (rows.length ? transactionRows(rows) : '<tr><td colspan="5">Nothing matches that filter yet.</td></tr>') + '</tbody></table>' +
    '<p class="small muted">Showing ' + rows.length + ' of ' + (s.transactions.length + INCOME.length) + ' rows.</p></section>';

  document.getElementById('add-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const amount = Number(document.getElementById('f-amount').value);
    const payee = document.getElementById('f-payee').value.trim();
    if (!payee || !(amount > 0)) return;
    saved.extraTransactions.push({
      id: 'u' + Date.now(),
      date: document.getElementById('f-date').value || '2026-11-26',
      payee: payee,
      category: document.getElementById('f-category').value,
      amount: Math.round(amount * 100) / 100,
      note: document.getElementById('f-note').value.trim(),
    });
    saveState(saved);
    setNotice('Added: ' + payee + ' — ' + money(amount) + ' under ' + categoryLabel(document.getElementById('f-category').value) + '.');
    renderTransactions(app);
    setNotice(notice);
  });
  document.getElementById('filter-cat').addEventListener('change', function (event) {
    filterCategory = event.target.value;
    renderTransactions(app);
  });
  document.getElementById('filter-text').addEventListener('input', function (event) {
    filterText = event.target.value;
    renderTransactions(app);
    const box = document.getElementById('filter-text');
    box.focus();
    box.setSelectionRange(box.value.length, box.value.length);
  });
}

// ---- Budgets ---------------------------------------------------------------
function renderBudgets(app) {
  const s = state();
  const t = totals(s.transactions);
  const plannedTotal = BUDGETS.reduce(function (sum, b) { return sum + b.planned; }, 0);
  const over = BUDGETS.filter(function (b) { return t.byCategory[b.id] > b.planned; });
  const cards = BUDGETS.map(function (b) {
    const spent = t.byCategory[b.id];
    const pct = b.planned > 0 ? Math.round((spent / b.planned) * 100) : 0;
    const left = b.planned - spent;
    const badge = spent > b.planned
      ? '<span class="badge over">Over by ' + money(-left) + '</span>'
      : pct >= 85 ? '<span class="badge near">Nearly there</span>' : '<span class="badge ok">On track</span>';
    return '<div class="card budget-card"><div class="top"><h3>' + escapeHtml(b.label) + '</h3>' + badge + '</div>' +
      '<div class="spent">' + money(spent) + ' <span class="muted small">of ' + money(b.planned) + '</span></div>' +
      '<div class="progress"><span class="' + (spent > b.planned ? 'over' : pct >= 85 ? 'near' : '') + '" style="width:' + Math.min(100, pct) + '%"></span></div>' +
      '<p class="small muted">' + pct + '% used &middot; ' + (left >= 0 ? money(left) + ' left' : money(-left) + ' over') + '<br>' + escapeHtml(b.note) + '</p></div>';
  }).join('');

  app.innerHTML =
    '<div class="page-head"><div><h1>Budgets</h1>' +
    '<p>Ten envelopes for November: ' + money(plannedTotal) + ' planned, ' + money(t.spent) + ' spent so far. ' +
    (over.length ? over.map(function (b) { return b.label; }).join(', ') + ' ' + (over.length === 1 ? 'is' : 'are') + ' over plan.' : 'Nothing is over plan yet.') + '</p></div></div>' +
    '<div class="budget-grid">' + cards + '</div>' +
    '<section class="card"><h2>How the envelopes work</h2><p>Each category gets a fixed amount on payday. Groceries, transport and eating out are the ones that move most — a big shop early in the month makes the bar jump, then it settles. If a category runs over, the household takes the difference from Fun &amp; leisure first, never from Savings.</p>' +
    '<p><a href="#/reports">See how November compares with June–October &rarr;</a></p></section>';
}

// ---- Bills -----------------------------------------------------------------
function renderBills(app) {
  const s = state();
  const unpaid = s.bills.filter(function (b) { return !b.paid; });
  const unpaidTotal = unpaid.reduce(function (sum, b) { return sum + b.amount; }, 0);
  const rows = s.bills.slice().sort(function (a, b) { return a.due.localeCompare(b.due); }).map(function (b) {
    return '<tr><td>' + prettyDate(b.due) + '</td><td><strong>' + escapeHtml(b.name) + '</strong><br><span class="muted small">' + escapeHtml(b.payee) + '</span></td>' +
      '<td class="num">' + money(b.amount) + '</td>' +
      '<td>' + (b.paid
        ? '<span class="badge paid">Paid</span>'
        : '<span class="badge due">Due ' + prettyDate(b.due) + '</span>') + '</td>' +
      '<td>' + (b.paid ? '' : '<button type="button" class="secondary small-btn" data-pay="' + b.id + '">Mark paid</button>') + '</td></tr>';
  }).join('');

  app.innerHTML =
    '<div class="page-head"><div><h1>Bills</h1>' +
    '<p>Every recurring bill for November 2026, in due-date order. ' + unpaid.length + ' still to pay, ' + money(unpaidTotal) + ' in all.</p></div></div>' +
    '<div id="notice-slot"></div>' +
    (unpaid.length ? '<div class="callout section"><h3>Coming up</h3><p>' + unpaid.map(function (b) { return escapeHtml(b.name) + ' (' + money(b.amount) + ', ' + prettyDate(b.due) + ')'; }).join(' and ') + ' — set the money aside now so payday week stays calm.</p></div>' : '') +
    '<section class="card"><table><thead><tr><th>Due</th><th>Bill</th><th class="num">Amount</th><th>Status</th><th></th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></section>' +
    '<p class="small muted">Marking a bill paid saves it in this browser, so the dashboard and this list stay in step.</p>';

  app.querySelectorAll('[data-pay]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const id = btn.getAttribute('data-pay');
      if (saved.paidBillIds.indexOf(id) === -1) saved.paidBillIds.push(id);
      saveState(saved);
      const bill = BILLS.find(function (b) { return b.id === id; });
      renderBills(app);
      setNotice((bill ? bill.name : 'Bill') + ' marked paid.');
    });
  });
}

// ---- Savings goals ---------------------------------------------------------
function renderGoals(app) {
  const s = state();
  const totalSaved = s.goals.reduce(function (sum, g) { return sum + g.saved; }, 0);
  const totalTarget = s.goals.reduce(function (sum, g) { return sum + g.target; }, 0);
  const cards = s.goals.map(function (g) {
    const pct = Math.round((g.saved / g.target) * 100);
    return '<div class="card budget-card"><div class="top"><h3>' + escapeHtml(g.name) + '</h3>' +
      '<span class="badge ' + (pct >= 70 ? 'ok' : pct >= 40 ? 'near' : 'over') + '">' + pct + '%</span></div>' +
      '<div class="spent">' + money(g.saved) + ' <span class="muted small">of ' + money(g.target) + '</span></div>' +
      '<div class="progress"><span class="' + (pct >= 70 ? '' : pct >= 40 ? 'near' : 'over') + '" style="width:' + pct + '%"></span></div>' +
      '<p class="small muted">' + escapeHtml(g.note) + '<br>' + money(g.target - g.saved) + ' still to save.</p>' +
      '<form class="goal-form" data-goal="' + g.id + '" style="display:flex;gap:8px;margin-top:8px">' +
      '<input type="number" min="1" step="1" placeholder="Add $…" aria-label="Amount to add to ' + escapeHtml(g.name) + '" required>' +
      '<button type="submit" class="secondary small-btn">Add to goal</button></form></div>';
  }).join('');

  app.innerHTML =
    '<div class="page-head"><div><h1>Savings goals</h1>' +
    '<p>' + money(totalSaved) + ' saved toward ' + money(totalTarget) + ' of goals — ' + Math.round((totalSaved / totalTarget) * 100) + '% of the way there. The emergency fund comes first; the rest share what is left after the bills.</p></div></div>' +
    '<div id="notice-slot"></div>' +
    '<div class="budget-grid">' + cards + '</div>' +
    '<section class="card"><h2>How the household saves</h2><p>On payday, $1,200 moves straight to savings before anything else is spent — pay yourself first, then live on the rest. The emergency fund gets $800 of it, the holiday $200, the bikes $100 and the kitchen $100. A contribution added here is saved in this browser and shows up on the dashboard too.</p></section>';

  app.querySelectorAll('.goal-form').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const amount = Number(form.querySelector('input').value);
      if (!(amount > 0)) return;
      const id = form.getAttribute('data-goal');
      saved.goalExtra[id] = (saved.goalExtra[id] || 0) + amount;
      saveState(saved);
      const goal = GOALS.find(function (g) { return g.id === id; });
      renderGoals(app);
      setNotice('Added ' + money(amount) + ' to ' + (goal ? goal.name : 'the goal') + '.');
    });
  });
}

// ---- Reports ---------------------------------------------------------------
function renderReports(app) {
  const s = state();
  const t = totals(s.transactions);
  const sortedCats = BUDGETS.slice().sort(function (a, b) { return t.byCategory[b.id] - t.byCategory[a.id]; });
  const biggest = sortedCats[0];
  const cheapest = MONTHLY.slice().sort(function (a, b) { return a.spent - b.spent; })[0];
  const savingsRate = Math.round(((t.income - t.spent) / t.income) * 100);
  const monthRows = MONTHLY.map(function (m) {
    return '<tr><td>' + m.month + ' 2026</td><td class="num">' + money(m.income) + '</td><td class="num">' + money(m.spent) + '</td><td class="num">' + money(m.income - m.spent) + '</td></tr>';
  }).join('');

  app.innerHTML =
    '<div class="page-head"><div><h1>Reports</h1>' +
    '<p>Six months of the Alder household&rsquo;s money, June to November 2026 — what changed, what stayed steady, and what to do about it.</p></div></div>' +
    '<section class="cards">' +
    statCard('Biggest category', biggest.label, money(t.byCategory[biggest.id]) + ' in November', '') +
    statCard('Cheapest month', cheapest.month, money(cheapest.spent) + ' spent', 'good') +
    statCard('Savings rate', savingsRate + '%', 'Income left after spending', savingsRate >= 20 ? 'good' : 'warn') +
    statCard('Six-month average', money(Math.round(MONTHLY.reduce(function (sum, m) { return sum + m.spent; }, 0) / MONTHLY.length)), 'Spent per month', '') +
    '</section>' +
    '<section class="card section"><h2>Spending by month</h2>' + monthlyChart(MONTHLY) +
    '<div class="legend"><span><span class="swatch" style="background:var(--pine)"></span>Earlier months</span><span><span class="swatch" style="background:var(--amber)"></span>November (so far)</span></div></section>' +
    '<div class="grid-2-equal"><section class="card"><h2>Month by month</h2>' +
    '<table><thead><tr><th>Month</th><th class="num">Income</th><th class="num">Spent</th><th class="num">Left</th></tr></thead><tbody>' + monthRows + '</tbody></table></section>' +
    '<section class="card"><h2>What November says</h2><ul class="tip-list">' +
    '<li><strong>' + escapeHtml(biggest.label) + ' is the biggest cost</strong> at ' + money(t.byCategory[biggest.id]) + ' — it is fixed rent, so the lever is everywhere else.</li>' +
    '<li><strong>Groceries are the swing category:</strong> ' + money(t.byCategory.groceries) + ' of a ' + money(720) + ' plan, with four days of the month left.</li>' +
    '<li><strong>' + escapeHtml(cheapest.month) + ' was the cheapest month</strong> (' + money(cheapest.spent) + ') — no car service and no school costs landed that month.</li>' +
    '<li><strong>Keep the $1,200 payday transfer:</strong> at this rate the emergency fund reaches its ' + money(12000) + ' target in about four and a half months.</li>' +
    '</ul></section></div>';
}

// ---- Router ----------------------------------------------------------------
const ROUTES = {
  dashboard: renderDashboard,
  transactions: renderTransactions,
  budgets: renderBudgets,
  bills: renderBills,
  goals: renderGoals,
  reports: renderReports,
};

export function render() {
  const app = document.getElementById('app');
  const hash = window.location.hash || '#/';
  const route = hash.replace(/^#\/?/, '').split('/')[0] || 'dashboard';
  const view = ROUTES[route] || ROUTES.dashboard;
  markNav(ROUTES[route] ? route : 'dashboard');
  notice = '';
  view(app);
  window.scrollTo(0, 0);
}
