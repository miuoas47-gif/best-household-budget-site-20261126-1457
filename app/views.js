// One renderer per page. Each returns the page's HTML; the router in router.js
// puts it on the screen and wires up its forms and buttons.
import {
  CATEGORIES, HOUSEHOLD, INCOME, MONTHLY_HISTORY,
  totalIncome, totalSpent, spentByCategory, budgetFor, totalBudgeted,
  upcomingBills, paidBillsTotal,
} from "./data.js";
import { money, moneyShort, prettyDate, shortDate, pct, esc } from "./format.js";
import { donutChart, monthBars } from "./charts.js";

function categoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function categoryColor(id) {
  return CATEGORIES.find((c) => c.id === id)?.color ?? "#6b7a8f";
}

function budgetBar(spent, budget) {
  const used = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const cls = spent > budget ? "bar over" : used >= 85 ? "bar warm" : "bar";
  const note = spent > budget
    ? `<span class="bad"><strong>${money(spent - budget)} over budget</strong></span>`
    : `<span>${money(budget - spent)} left of ${money(budget)}</span>`;
  return `<div class="${cls}"><span style="width:${used}%"></span></div>
    <div class="row-bottom"><span>${money(spent)} spent · ${used}% used</span>${note}</div>`;
}

// --- Dashboard ----------------------------------------------------------------

export function renderDashboard(store) {
  const income = totalIncome();
  const spent = totalSpent(store.transactions);
  const left = income - spent;
  const plannedSaving = income - totalBudgeted(store.budgets);
  const byCat = spentByCategory(store.transactions);
  const slices = CATEGORIES.map((c) => ({ label: c.label, value: byCat.get(c.id) ?? 0, color: c.color }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);
  const legend = slices.map((s) => `<li><span class="dot" style="background:${s.color}"></span>${s.label}<span class="amt">${money(s.value)}</span></li>`).join("");
  const recent = [...store.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const recentRows = recent.map((t) => `<li><span class="grow"><strong>${esc(t.payee)}</strong><br><span class="muted">${prettyDate(t.date)} · ${categoryLabel(t.category)}</span></span><b>${money(t.amount)}</b></li>`).join("");
  const upcoming = upcomingBills(store.bills);
  const upcomingRows = upcoming.length
    ? upcoming.map((b) => `<li><span class="grow"><strong>${esc(b.name)}</strong><br><span class="muted">Due ${prettyDate(b.due)}</span></span><b>${money(b.amount)}</b></li>`).join("")
    : `<li><span class="grow"><strong>Nothing left to pay.</strong><br><span class="muted">Every November bill is paid — December's bills arrive on the 1st.</span></span></li>`;
  const topGoals = [...store.goals].sort((a, b) => b.saved / b.target - a.saved / a.target).slice(0, 2);
  const goalRows = topGoals.map((g) => {
    const p = pct(g.saved, g.target);
    return `<div class="budget-row"><div class="row-top"><strong>${esc(g.name)}</strong><span>${money(g.saved)} of ${money(g.target)}</span></div>
      <div class="bar"><span style="width:${Math.min(100, p)}%"></span></div>
      <div class="row-bottom"><span>${p}% saved</span><span>${money(g.target - g.saved)} to go</span></div></div>`;
  }).join("");

  return `
  <div class="page-head">
    <h1>November at a glance</h1>
    <p>${HOUSEHOLD.name} — ${HOUSEHOLD.members}. Income, spending, bills and savings for
    ${HOUSEHOLD.monthLabel}, all from the household's own ledger. Four days of November are still to come.</p>
  </div>
  <div class="grid three">
    <section class="card"><div class="stat-label">Money in</div><div class="stat-big">${money(income)}</div>
      <p class="stat-delta muted">Two salaries and one market-stall weekend.</p></section>
    <section class="card"><div class="stat-label">Money out · 1–26 Nov</div><div class="stat-big">${money(spent)}</div>
      <p class="stat-delta muted">${store.transactions.length} purchases, tracked to the cent.</p></section>
    <section class="card"><div class="stat-label">Left to save</div><div class="stat-big good">${money(left)}</div>
      <p class="stat-delta">Planned saving was ${money(plannedSaving)} — the household is
      <strong class="good">${money(left - plannedSaving)} ahead</strong> of its own plan.</p></section>
  </div>
  <div class="grid dash" style="margin-top:18px">
    <section class="card">
      <h2>Where the money went</h2>
      <p class="sub">Spending by category, 1–26 November. Rent is the biggest slice, as it should be.</p>
      <div class="donut-wrap">${donutChart(slices)}
        <ul class="donut-legend" style="flex:1;min-width:220px">${legend}</ul>
      </div>
      <p class="hint"><a href="#/budgets">See every budget vs. actual →</a></p>
    </section>
    <section class="card">
      <h2>Coming up</h2>
      <p class="sub">Bills still to pay before November ends.</p>
      <ul class="list-plain">${upcomingRows}</ul>
      <p class="hint">${money(paidBillsTotal(store.bills))} of bills already paid this month.</p>
      <p><a class="btn-ghost" href="#/bills">All bills →</a></p>
    </section>
  </div>
  <div class="grid two" style="margin-top:18px">
    <section class="card">
      <h2>Latest spending</h2>
      <p class="sub">The six most recent purchases.</p>
      <ul class="list-plain">${recentRows}</ul>
      <p class="hint"><a href="#/transactions">See all ${store.transactions.length} transactions →</a></p>
    </section>
    <section class="card">
      <h2>Savings goals, nearest first</h2>
      <p class="sub">The goals closest to done.</p>
      ${goalRows}
      <p class="hint"><a href="#/goals">See all four goals →</a></p>
    </section>
  </div>`;
}

// --- Transactions ---------------------------------------------------------------

export function renderTransactions(store, filter) {
  const rows = [...store.transactions]
    .filter((t) => !filter || t.category === filter)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const shownTotal = rows.reduce((s, t) => s + t.amount, 0);
  const options = [`<option value="">All categories</option>`]
    .concat(CATEGORIES.map((c) => `<option value="${c.id}"${filter === c.id ? " selected" : ""}>${c.label}</option>`))
    .join("");
  const body = rows.map((t) => `<tr class="expense">
      <td>${shortDate(t.date)}</td>
      <td>${esc(t.payee)}</td>
      <td><span class="pill" style="background:${categoryColor(t.category)}22;color:${categoryColor(t.category)}">${categoryLabel(t.category)}</span></td>
      <td class="num amount">−${money(t.amount)}</td>
    </tr>`).join("");
  const incomeRows = INCOME.map((r) => `<tr class="income">
      <td>${shortDate(r.date)}</td><td>${esc(r.source)}</td>
      <td><span class="pill">Income</span></td>
      <td class="num amount">+${money(r.amount)}</td>
    </tr>`).join("");

  return `
  <div class="page-head">
    <h1>Transactions</h1>
    <p>Every dollar in and out of the household in November, newest first. Add a purchase below and
    the dashboard, budgets and report update at once — the figures are all computed from this list.</p>
  </div>
  <div class="grid dash">
    <section class="card">
      <div class="toolbar">
        <div class="field"><label for="cat-filter">Show category</label>
          <select id="cat-filter" data-filter>${options}</select></div>
        <div class="field"><span class="stat-label">Showing</span><br><strong>${rows.length} purchases · ${money(shownTotal)}</strong></div>
      </div>
      <div style="overflow-x:auto">
      <table>
        <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th></tr></thead>
        <tbody>${body}</tbody>
      </table>
      </div>
      <h3 style="margin-top:20px">Money in this month</h3>
      <table>
        <thead><tr><th>Date</th><th>Source</th><th>Type</th><th class="num">Amount</th></tr></thead>
        <tbody>${incomeRows}</tbody>
      </table>
    </section>
    <section class="card">
      <h2>Add a purchase</h2>
      <p class="sub">Bought something? Put it in the ledger now, while you still have the receipt.</p>
      <form class="add-form" data-form="add-transaction">
        <div><label for="tx-payee">What was it?</label>
          <input id="tx-payee" name="payee" required maxlength="80" placeholder="e.g. GreenMart — weekly shop"></div>
        <div class="field-row">
          <div><label for="tx-amount">Amount ($)</label>
            <input id="tx-amount" name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00"></div>
          <div><label for="tx-date">Date</label>
            <input id="tx-date" name="date" type="date" value="2026-11-26" required></div>
        </div>
        <div><label for="tx-category">Category</label>
          <select id="tx-category" name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join("")}</select></div>
        <button class="btn-primary" type="submit">Add to the ledger</button>
      </form>
      <p class="hint">Saved only in this browser, on this device. Nothing is sent anywhere.</p>
    </section>
  </div>`;
}

// --- Budgets --------------------------------------------------------------------

export function renderBudgets(store) {
  const byCat = spentByCategory(store.transactions);
  const total = totalBudgeted(store.budgets);
  const spent = totalSpent(store.transactions);
  const rows = CATEGORIES.map((c) => {
    const s = byCat.get(c.id) ?? 0;
    const b = budgetFor(c.id, store.budgets);
    return `<div class="budget-row">
      <div class="row-top"><strong><span class="dot" style="background:${c.color};display:inline-block;margin-right:8px"></span>${c.label}</strong>
        <span>${money(s)} of ${money(b)}</span></div>
      ${budgetBar(s, b)}
      <form class="inline-actions" data-form="set-budget" style="margin-top:8px">
        <input type="hidden" name="category" value="${c.id}">
        <label for="budget-${c.id}" style="margin:0">Monthly budget</label>
        <input id="budget-${c.id}" name="amount" type="number" min="0" step="1" value="${b}" style="width:110px">
        <button class="btn-ghost btn-small" type="submit">Save</button>
      </form>
    </div>`;
  }).join("");
  const over = CATEGORIES.filter((c) => (byCat.get(c.id) ?? 0) > budgetFor(c.id, store.budgets));
  const advice = over.length
    ? `<div class="callout terra"><p><strong>Over budget:</strong> ${over.map((c) => c.label).join(", ")}.
      Groceries and dining still have room — a home-cooked week could pull the month back in line.</p></div>`
    : `<div class="callout"><p><strong>On track:</strong> every category is inside its budget with four days of November left.</p></div>`;

  return `
  <div class="page-head">
    <h1>Budgets</h1>
    <p>The plan for November was ${money(total)} of spending. So far the household has spent
    ${money(spent)} — <strong>${money(total - spent)} under the plan</strong>. Change any budget below
    and the dashboard updates with it.</p>
  </div>
  ${advice}
  <section class="card" style="margin-top:18px">
    <h2>By category</h2>
    <p class="sub">Spent so far against the monthly budget, 1–26 November.</p>
    ${rows}
  </section>`;
}

// --- Goals ----------------------------------------------------------------------

export function renderGoals(store) {
  const totalSaved = store.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = store.goals.reduce((s, g) => s + g.target, 0);
  const cards = store.goals.map((g) => {
    const p = pct(g.saved, g.target);
    const remaining = g.target - g.saved;
    return `<section class="card">
      <h2>${esc(g.name)}</h2>
      <p class="sub">${esc(g.note)}</p>
      <div class="stat-big">${money(g.saved)}</div>
      <p class="stat-delta muted">of ${money(g.target)} · ${p}% saved · ${money(remaining)} to go</p>
      <div class="bar" style="margin:10px 0 14px"><span style="width:${Math.min(100, p)}%"></span></div>
      <form class="inline-actions" data-form="add-goal">
        <input type="hidden" name="id" value="${g.id}">
        <label for="goal-${g.id}" style="margin:0">Add savings</label>
        <input id="goal-${g.id}" name="amount" type="number" min="1" step="1" placeholder="$" style="width:110px" required>
        <button class="btn-primary btn-small" type="submit">Add</button>
      </form>
    </section>`;
  }).join("");

  return `
  <div class="page-head">
    <h1>Savings goals</h1>
    <p>Four things the household is saving for, worth ${money(totalTarget)} altogether.
    So far ${money(totalSaved)} is set aside — ${pct(totalSaved, totalTarget)}% of the way there.
    The emergency fund comes first: it is the one that keeps a broken boiler from becoming a debt.</p>
  </div>
  <div class="grid two">${cards}</div>
  <p class="hint" style="margin-top:16px">Money added here is set aside in this browser only, as a record of the household's saving.
  The real money sits in the family's savings account.</p>`;
}

// --- Bills ----------------------------------------------------------------------

export function renderBills(store) {
  const unpaid = upcomingBills(store.bills);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const rows = [...store.bills]
    .sort((a, b) => a.due.localeCompare(b.due))
    .map((b) => `<tr>
      <td><strong>${esc(b.name)}</strong></td>
      <td class="hide-phone">${prettyDate(b.due)}</td>
      <td class="num">${money(b.amount)}</td>
      <td>${b.paid ? '<span class="pill paid">Paid</span>' : '<span class="pill due">Due ' + shortDate(b.due) + '</span>'}</td>
      <td class="num">${b.paid
        ? `<button class="btn-ghost btn-small" data-action="toggle-bill" data-id="${b.id}">Mark unpaid</button>`
        : `<button class="btn-primary btn-small" data-action="toggle-bill" data-id="${b.id}">Mark paid</button>`}</td>
    </tr>`).join("");

  return `
  <div class="page-head">
    <h1>Bills</h1>
    <p>The regular bills of the household, in due-date order. ${money(paidBillsTotal(store.bills))} already paid
    this month; <strong>${money(unpaidTotal)} still to pay</strong> before November ends.</p>
  </div>
  <section class="card">
    <div style="overflow-x:auto">
    <table>
      <thead><tr><th>Bill</th><th class="hide-phone">Due</th><th class="num">Amount</th><th>Status</th><th class="num">Change</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    </div>
    <p class="hint">Rent, electricity, broadband, water, mobiles and the gym are all paid.
    Home insurance (${money(187)}) is due on 28 November and streaming (${money(16)}) on the 30th.
    Mark a bill paid when the money leaves the account and it moves to the paid list.</p>
  </section>`;
}

// --- Reports --------------------------------------------------------------------

export function renderReports(store) {
  const spent = totalSpent(store.transactions);
  const income = totalIncome();
  const months = [...MONTHLY_HISTORY, { month: "Nov", spent: Math.round(spent) }];
  const byCat = spentByCategory(store.transactions);
  const top = [...CATEGORIES]
    .map((c) => ({ label: c.label, spent: byCat.get(c.id) ?? 0, budget: budgetFor(c.id, store.budgets) }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);
  const topRows = top.map((c) => `<div class="kv"><span>${c.label}</span><span><b>${money(c.spent)}</b> of ${money(c.budget)} budgeted</span></div>`).join("");
  const avg = Math.round(months.slice(0, 4).reduce((s, m) => s + m.spent, 0) / 4);
  const vsAvg = Math.round(((spent - avg) / avg) * 100);

  return `
  <div class="page-head">
    <h1>November report</h1>
    <p>Five months of household spending, and what November teaches. The month is not finished —
    four days remain — but the shape of it is already clear.</p>
  </div>
  <div class="grid two">
    <section class="card">
      <h2>Spending by month</h2>
      <p class="sub">Whole-month spending, July to October, and November so far.</p>
      ${monthBars(months, "Nov")}
      <p class="hint">November so far is ${Math.abs(vsAvg)}% ${vsAvg < 0 ? "below" : "above"} the July–October
      average of ${money(avg)} — and four days are still to come.</p>
    </section>
    <section class="card">
      <h2>Biggest spending this month</h2>
      <p class="sub">The five categories that took the most money.</p>
      ${topRows}
      <div class="kv"><span><strong>Total spent</strong></span><span><b>${money(spent)}</b></span></div>
      <div class="kv"><span><strong>Total income</strong></span><span><b>${money(income)}</b></span></div>
      <div class="kv"><span><strong>Saved this month</strong></span><span><b class="good">${money(income - spent)}</b></span></div>
    </section>
  </div>
  <section class="card" style="margin-top:18px">
    <h2>What the numbers say</h2>
    <p class="sub">Three things worth acting on before December.</p>
    <ul class="list-plain">
      <li><span class="grow"><strong>Groceries are the lever.</strong> Five weekly shops came to ${money(byCat.get("groceries") ?? 0)}
      against a ${money(budgetFor("groceries", store.budgets))} budget. One planned shop a week, with a list, is what kept it inside.</span></li>
      <li><span class="grow"><strong>Rent is fixed, everything else moves.</strong> Housing takes ${pct(byCat.get("housing") ?? 0, spent)}% of
      November's spending. The household's real choices live in groceries, dining and family fun.</span></li>
      <li><span class="grow"><strong>The emergency fund is ${pct(store.goals[0].saved, store.goals[0].target)}% full.</strong>
      At this month's saving rate it reaches ${money(store.goals[0].target)} in about
      ${Math.max(1, Math.ceil((store.goals[0].target - store.goals[0].saved) / Math.max(1, income - spent)))} more months like November.</span></li>
    </ul>
    <p class="hint"><a href="#/budgets">Adjust December's budgets →</a> · <a href="#/goals">Top up a goal →</a></p>
  </section>`;
}
