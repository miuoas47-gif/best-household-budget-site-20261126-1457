// Hearth & Ledger — the whole site in one module.
// Hash routes (#/, #/transactions, #/budgets, #/bills, #/goals, #/reports).
// Every figure is computed from data.js; anything the household changes
// (a new transaction, a budget tweak, a goal top-up, a paid bill) is kept
// in this browser's localStorage and layered on top of the base figures.

import { HOUSEHOLD, CATEGORIES, MONTHS, MONTH_ORDER, TRANSACTIONS, BILLS, GOALS, TIPS, money, money0 } from './data.js';

const STORE_KEY = 'hearth-ledger-v1';
const app = document.getElementById('app');

let store = { added: [], planDelta: {}, goalAdd: {}, billsPaid: [] };
try {
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) store = { ...store, ...JSON.parse(raw) };
} catch { /* private mode: the site still works, it just forgets changes */ }

function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch { /* ignore */ }
}

let currentMonth = '2026-11';
let txFilter = 'all';
let txSearch = '';

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function cat(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, label: id, color: '#8a8f98', note: '' };
}

function monthData() { return MONTHS[currentMonth]; }

function incomeTotal(m) {
  return MONTHS[m].income.reduce((s, r) => s + r.amount, 0);
}

function planFor(m, id) {
  const base = MONTHS[m].plan[id] || 0;
  const delta = (store.planDelta[m] && store.planDelta[m][id]) || 0;
  return base + delta;
}

function spentFor(m, id) {
  let total = MONTHS[m].spent[id] || 0;
  if (m === '2026-11') {
    for (const t of store.added) if (t.category === id) total += t.amount;
  }
  return total;
}

function spentTotal(m) {
  return CATEGORIES.reduce((s, c) => s + spentFor(m, c.id), 0);
}

function planTotal(m) {
  return CATEGORIES.reduce((s, c) => s + planFor(m, c.id), 0);
}

function allTransactions() {
  const added = store.added.map((t) => ({ ...t, fresh: true }));
  return [...added, ...TRANSACTIONS];
}

function goalSaved(g) {
  return g.saved + (store.goalAdd[g.id] || 0);
}

function billIsPaid(b) {
  return b.status === 'scheduled' && store.billsPaid.includes(b.name) ? true
    : b.status === 'upcoming' && store.billsPaid.includes(b.name) ? true
    : b.status === 'paid';
}

// ---------- shared bits ----------

function monthSwitcher() {
  return '<div class="month-switch" role="group" aria-label="Month">' +
    MONTH_ORDER.map((m) =>
      `<button type="button" data-month="${m}" class="${m === currentMonth ? 'active' : ''}">${MONTHS[m].label.split(' ')[0]}</button>`
    ).join('') + '</div>';
}

function categoryBar(id, m) {
  const c = cat(id);
  const planned = planFor(m, id);
  const spent = spentFor(m, id);
  const pct = planned > 0 ? Math.min(100, Math.round((spent / planned) * 100)) : 0;
  const left = planned - spent;
  const over = left < 0;
  return `<div class="bar-row">
    <div class="bar-top"><b><span class="dot" style="background:${c.color}"></span>${esc(c.label)}</b>
    <span>${money0(spent)} of ${money0(planned)}</span></div>
    <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${over ? 'var(--red)' : c.color}"></div></div>
    <div class="note">${esc(c.note)} — ${over ? `<span class="over">${money0(-left)} over plan</span>` : `${money0(left)} left`}
    <span class="pill ${over ? 'over' : 'ok'}">${pct}%</span></div>
  </div>`;
}

// ---------- pages ----------

function viewDashboard() {
  const m = monthData();
  const income = incomeTotal(currentMonth);
  const spent = spentTotal(currentMonth);
  const left = income - spent;
  const saved = spentFor(currentMonth, 'savings');
  const rate = Math.round((saved / income) * 1000) / 10;
  const upcoming = BILLS.filter((b) => !billIsPaid(b)).slice(0, 3);

  return `
  <div class="page-head">
    <div><h2>${esc(m.label)} at a glance</h2>
    <p>${esc(HOUSEHOLD.name)} — payday ${esc(HOUSEHOLD.payday)}. Four people, one pot of money, and a plan written before the month starts.</p></div>
    ${monthSwitcher()}
  </div>
  <div class="cards">
    <div class="card"><h3>Income</h3><div class="num">${money0(income)}</div><div class="sub">${m.income.length} pay-ins this month</div></div>
    <div class="card"><h3>Spent so far</h3><div class="num">${money0(spent)}</div><div class="sub">of ${money0(planTotal(currentMonth))} planned</div></div>
    <div class="card"><h3>Left to spend</h3><div class="num ${left < 0 ? 'over' : 'good'}">${money0(left)}</div><div class="sub">${left < 0 ? 'over the month’s income' : 'income minus spending'}</div></div>
    <div class="card"><h3>Saved</h3><div class="num">${money0(saved)}</div><div class="sub">${rate}% of income, moved on payday</div></div>
  </div>
  <div class="grid2">
    <section class="card"><h2>Where the money went</h2>
      ${CATEGORIES.map((c) => categoryBar(c.id, currentMonth)).join('')}
    </section>
    <div>
      <section class="card" style="margin-bottom:14px"><h2>Income this month</h2>
        <table><tbody>
        ${m.income.map((r) => `<tr><td>${esc(r.source)}</td><td class="amt">${money(r.amount)}</td></tr>`).join('')}
        <tr><td><b>Total income</b></td><td class="amt"><b>${money(income)}</b></td></tr>
        </tbody></table>
      </section>
      <section class="card" style="margin-bottom:14px"><h2>Coming up</h2>
        ${upcoming.map((b) => `<div class="bill"><div><b>${esc(b.name)}</b><div class="due">Due ${esc(b.due)} — ${esc(b.note)}</div></div><b>${money(b.amount)}</b></div>`).join('')}
        <p style="margin:12px 0 0"><a href="#/bills">See all bills →</a></p>
      </section>
      <section class="card"><h2>Worth knowing</h2>
        ${TIPS.slice(0, 2).map((t) => `<div class="tip"><b>${esc(t.title)}</b><p>${esc(t.body)}</p></div>`).join('')}
      </section>
    </div>
  </div>`;
}

function viewTransactions() {
  const rows = allTransactions().filter((t) => {
    if (txFilter !== 'all' && t.category !== txFilter) return false;
    if (txSearch) {
      const hay = (t.payee + ' ' + (t.note || '') + ' ' + t.date).toLowerCase();
      if (!hay.includes(txSearch.toLowerCase())) return false;
    }
    return true;
  });
  const shownSpent = rows.filter((t) => t.category !== 'income').reduce((s, t) => s + t.amount, 0);

  return `
  <div class="page-head">
    <div><h2>Transactions</h2><p>Every dollar in and out, newest first. Add one below and the dashboard, budgets and report all move with it.</p></div>
  </div>
  <section class="card">
    <div class="filters">
      <input type="search" id="tx-search" placeholder="Search payee or note…" value="${esc(txSearch)}" aria-label="Search transactions">
      ${['all', ...CATEGORIES.map((c) => c.id), 'income'].map((f) =>
        `<button type="button" class="chip ${txFilter === f ? 'active' : ''}" data-filter="${f}">${f === 'all' ? 'All' : f === 'income' ? 'Income' : esc(cat(f).label)}</button>`
      ).join('')}
    </div>
    <table>
      <thead><tr><th>Date</th><th>Payee</th><th>Category</th><th class="amt">Amount</th></tr></thead>
      <tbody>
      ${rows.length ? rows.map((t) => {
        const c = t.category === 'income' ? null : cat(t.category);
        return `<tr><td>${esc(t.date)}</td>
          <td>${esc(t.payee)}${t.note ? `<div class="small">${esc(t.note)}</div>` : ''}${t.fresh ? ' <span class="pill ok">new</span>' : ''}</td>
          <td>${t.category === 'income' ? '<span class="cat-income">Income</span>' : `<span class="dot" style="background:${c.color}"></span>${esc(c.label)}`}</td>
          <td class="amt">${t.category === 'income' ? '+' : '−'}${money(t.amount)}</td></tr>`;
      }).join('') : `<tr><td colspan="4"><p class="empty">Nothing matches that search yet — try a different word or category.</p></td></tr>`}
      </tbody>
    </table>
    <p class="sub" style="color:var(--muted)">Showing ${rows.length} of ${allTransactions().length} transactions · spending shown: ${money(shownSpent)}</p>
  </section>
  <section class="card" style="margin-top:14px"><h2>Add a transaction</h2>
    <form class="add" id="add-tx">
      <div><label>Payee<input name="payee" required maxlength="80" placeholder="e.g. Green Mart groceries"></label></div>
      <div><label>Amount ($)<input name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00"></label></div>
      <div><label>Category<select name="category">${CATEGORIES.filter((c) => c.id !== 'savings').map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join('')}</select></label></div>
      <div><label>Date<input name="date" value="Nov 26" maxlength="12"></label></div>
      <div class="wide"><label>Note (optional)<input name="note" maxlength="120" placeholder="e.g. Weekly shop"></label></div>
      <div class="wide"><button class="primary" type="submit">Add to the ledger</button></div>
    </form>
  </section>`;
}

function viewBudgets() {
  const m = monthData();
  return `
  <div class="page-head">
    <div><h2>Budgets — ${esc(m.label)}</h2><p>The plan is written before the month starts. Tap − or + to move a category by $10 — the totals and the dashboard follow.</p></div>
    ${monthSwitcher()}
  </div>
  <div class="cards">
    <div class="card"><h3>Planned</h3><div class="num">${money0(planTotal(currentMonth))}</div><div class="sub">across ${CATEGORIES.length} categories</div></div>
    <div class="card"><h3>Spent</h3><div class="num">${money0(spentTotal(currentMonth))}</div><div class="sub">${money0(planTotal(currentMonth) - spentTotal(currentMonth))} of the plan still unspent</div></div>
    <div class="card"><h3>Income</h3><div class="num">${money0(incomeTotal(currentMonth))}</div><div class="sub">every dollar has a job, or stays free</div></div>
    <div class="card"><h3>Unassigned</h3><div class="num ${incomeTotal(currentMonth) - planTotal(currentMonth) < 0 ? 'over' : 'good'}">${money0(incomeTotal(currentMonth) - planTotal(currentMonth))}</div><div class="sub">income minus the whole plan</div></div>
  </div>
  <section class="card">
    ${CATEGORIES.map((c) => {
      const planned = planFor(currentMonth, c.id);
      const spent = spentFor(currentMonth, c.id);
      const left = planned - spent;
      return `<div class="bar-row">
        <div class="bar-top"><b><span class="dot" style="background:${c.color}"></span>${esc(c.label)}</b>
        <span>${money0(spent)} spent · ${money0(planned)} planned · <span class="${left < 0 ? 'over' : 'good'}">${left < 0 ? money0(-left) + ' over' : money0(left) + ' left'}</span></span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${planned > 0 ? Math.min(100, Math.round((spent / planned) * 100)) : 0}%;background:${left < 0 ? 'var(--red)' : c.color}"></div></div>
        <div style="margin-top:6px;display:flex;gap:6px;align-items:center">
          <button type="button" class="ghost small" data-plan="${c.id}" data-delta="-10">− $10</button>
          <button type="button" class="ghost small" data-plan="${c.id}" data-delta="10">+ $10</button>
          <span class="note">${esc(c.note)}</span>
        </div>
      </div>`;
    }).join('')}
  </section>`;
}

function viewBills() {
  const upcoming = BILLS.filter((b) => !billIsPaid(b));
  const paid = BILLS.filter((b) => billIsPaid(b));
  const upTotal = upcoming.reduce((s, b) => s + b.amount, 0);
  const paidTotal = paid.reduce((s, b) => s + b.amount, 0);
  const billRow = (b) => `<div class="bill ${billIsPaid(b) ? 'paid' : ''}">
    <div><b>${esc(b.name)}</b><div class="due">Due ${esc(b.due)} — ${esc(b.note)}</div></div>
    <div style="display:flex;gap:10px;align-items:center"><b>${money(b.amount)}</b>
    ${billIsPaid(b)
      ? `<button type="button" class="ghost small" data-bill="${esc(b.name)}" data-paid="0">Undo</button>`
      : `<button type="button" class="ghost small" data-bill="${esc(b.name)}" data-paid="1">Mark paid</button>`}
    </div></div>`;
  return `
  <div class="page-head">
    <div><h2>Bills</h2><p>What is due, when, and what is already settled. Marking a bill paid moves it down here and out of the December total.</p></div>
  </div>
  <div class="cards">
    <div class="card"><h3>Still to pay</h3><div class="num">${money0(upTotal)}</div><div class="sub">${upcoming.length} bills coming up</div></div>
    <div class="card"><h3>Already paid</h3><div class="num">${money0(paidTotal)}</div><div class="sub">${paid.length} bills settled</div></div>
    <div class="card"><h3>Next due</h3><div class="num" style="font-size:22px">${upcoming.length ? esc(upcoming[0].name) : 'Nothing due'}</div><div class="sub">${upcoming.length ? 'Due ' + esc(upcoming[0].due) + ' · ' + money(upcoming[0].amount) : 'All caught up'}</div></div>
    <div class="card"><h3>December total</h3><div class="num">${money0(upTotal)}</div><div class="sub">rent, power, internet, phones and more</div></div>
  </div>
  <div class="grid2 equal">
    <section class="card"><h2>To pay</h2>${upcoming.length ? upcoming.map(billRow).join('') : '<p class="empty">Nothing left to pay — nicely done.</p>'}</section>
    <section class="card"><h2>Paid</h2>${paid.length ? paid.map(billRow).join('') : '<p class="empty">Nothing marked paid yet.</p>'}</section>
  </div>`;
}

function viewGoals() {
  return `
  <div class="page-head">
    <div><h2>Savings goals</h2><p>Money with a name on it. The emergency fund comes first and is filled on payday, before anything else can claim it.</p></div>
  </div>
  <div class="cards">
    <div class="card"><h3>Total saved</h3><div class="num">${money0(GOALS.reduce((s, g) => s + goalSaved(g), 0))}</div><div class="sub">across ${GOALS.length} goals</div></div>
    <div class="card"><h3>Emergency fund</h3><div class="num">${Math.round((goalSaved(GOALS[0]) / GOALS[0].target) * 100)}%</div><div class="sub">${money0(goalSaved(GOALS[0]))} of ${money0(GOALS[0].target)}</div></div>
    <div class="card"><h3>Closest to done</h3><div class="num" style="font-size:22px">${esc(GOALS[0].name)}</div><div class="sub">70% funded — the safety net first</div></div>
    <div class="card"><h3>Monthly to savings</h3><div class="num">${money0(spentFor(currentMonth, 'savings'))}</div><div class="sub">auto-transfer on the 1st</div></div>
  </div>
  <section class="card">
    ${GOALS.map((g) => {
      const saved = goalSaved(g);
      const pct = Math.min(100, Math.round((saved / g.target) * 100));
      const done = saved >= g.target;
      return `<div class="goal">
        <div class="goal-top"><b>${esc(g.name)}</b><span>${money0(saved)} of ${money0(g.target)} · ${pct}%</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:var(--green)"></div></div>
        <p>${esc(g.note)} ${done ? '<span class="pill ok">Reached!</span>' : ''}</p>
        <div style="margin-top:6px;display:flex;gap:6px">
          <button type="button" class="ghost small" data-goal="${g.id}" data-add="25">+ $25</button>
          <button type="button" class="ghost small" data-goal="${g.id}" data-add="50">+ $50</button>
          <button type="button" class="ghost small" data-goal="${g.id}" data-add="100">+ $100</button>
        </div>
      </div>`;
    }).join('')}
  </section>`;
}

function donutSVG() {
  // Spending by category, savings left out — this is what the household lived on.
  const parts = CATEGORIES.filter((c) => c.id !== 'savings').map((c) => ({ c, v: spentFor('2026-11', c.id) }));
  const total = parts.reduce((s, p) => s + p.v, 0);
  const R = 70, C = 2 * Math.PI * R;
  let offset = 0;
  const rings = parts.map((p) => {
    const frac = p.v / total;
    const len = frac * C;
    const s = `<circle r="${R}" cx="90" cy="90" fill="none" stroke="${p.c.color}" stroke-width="34" stroke-dasharray="${len.toFixed(1)} ${(C - len).toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" />`;
    offset += len;
    return s;
  }).join('');
  return `<svg width="180" height="180" viewBox="0 0 180 180" role="img" aria-label="November spending by category">
    ${rings}
    <text x="90" y="86" text-anchor="middle" font-size="20" font-weight="700" fill="#22302a">${money0(total)}</text>
    <text x="90" y="106" text-anchor="middle" font-size="12" fill="#6b7280">November spend</text>
  </svg>
  <ul class="legend">${parts.map((p) => `<li><span class="dot" style="background:${p.c.color}"></span>${esc(p.c.label)} — ${money0(p.v)} (${Math.round((p.v / total) * 100)}%)</li>`).join('')}</ul>`;
}

function viewReports() {
  const history = MONTH_ORDER.map((m) => ({ label: MONTHS[m].label.split(' ')[0], spent: spentTotal(m) }));
  const max = Math.max(...history.map((h) => h.spent));
  const nov = spentTotal('2026-11');
  const oct = spentTotal('2026-10');
  const change = Math.round(((nov - oct) / oct) * 1000) / 10;
  return `
  <div class="page-head">
    <div><h2>Reports — three months</h2><p>Spending is falling slowly and the plan is holding. November cost ${change >= 0 ? 'more' : 'less'} than October by ${Math.abs(change)}%.</p></div>
  </div>
  <div class="grid2">
    <section class="card"><h2>Spending by month</h2>
      <div class="month-bars">
        ${history.map((h) => `<div class="col ${h.label === 'November' ? 'current' : ''}">
          <div class="val">${money0(h.spent)}</div>
          <div class="bar" style="height:${Math.round((h.spent / max) * 120)}px"></div>
          <div class="lbl">${esc(h.label)}</div></div>`).join('')}
      </div>
      <p style="color:var(--muted);font-size:14px">September ${money0(history[0].spent)} · October ${money0(history[1].spent)} · November ${money0(history[2].spent)}. The amber bar is this month.</p>
    </section>
    <section class="card"><h2>November, by category</h2><div class="donut-wrap">${donutSVG()}</div></section>
  </div>
  <div class="grid2" style="margin-top:14px">
    <section class="card"><h2>What the numbers say</h2>
      ${TIPS.map((t) => `<div class="tip"><b>${esc(t.title)}</b><p>${esc(t.body)}</p></div>`).join('')}
    </section>
    <section class="card"><h2>Savings calculator</h2>
      <p style="color:var(--muted);font-size:14px;margin-top:0">Put a fixed amount aside every month at 4% yearly interest, compounded monthly. What does it grow to?</p>
      <div class="calc">
        <div><label>Save each month ($)<input id="calc-monthly" type="number" min="10" step="10" value="150"></label></div>
        <div><label>For how many years?<input id="calc-years" type="number" min="1" max="30" step="1" value="5"></label></div>
        <div class="result" id="calc-result"></div>
      </div>
      <p style="color:var(--muted);font-size:13px">At $150 a month for 5 years: $9,000 paid in, about $9,950 out. The interest is the quiet part.</p>
    </section>
  </div>`;
}

// ---------- routing + events ----------

const VIEWS = {
  dashboard: viewDashboard,
  transactions: viewTransactions,
  budgets: viewBudgets,
  bills: viewBills,
  goals: viewGoals,
  reports: viewReports,
};

function calcResult() {
  const monthly = Number(document.getElementById('calc-monthly')?.value || 0);
  const years = Number(document.getElementById('calc-years')?.value || 0);
  const el = document.getElementById('calc-result');
  if (!el) return;
  if (!(monthly > 0 && years > 0)) { el.textContent = 'Enter a monthly amount and a number of years.'; return; }
  const r = 0.04 / 12, n = years * 12;
  const fv = monthly * ((Math.pow(1 + r, n) - 1) / r);
  el.innerHTML = `In <b>${years} years</b> you will have <b>${money(fv)}</b> — ${money(monthly * n)} paid in, ${money(fv - monthly * n)} of it interest.`;
}

function render() {
  const route = (location.hash || '#/').replace(/^#\//, '').split('/')[0] || 'dashboard';
  const view = VIEWS[route] || VIEWS.dashboard;
  app.innerHTML = view();
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === (VIEWS[route] ? route : 'dashboard'));
  });
  calcResult();
}

app.addEventListener('click', (e) => {
  const monthBtn = e.target.closest('[data-month]');
  if (monthBtn) { currentMonth = monthBtn.dataset.month; render(); return; }
  const chip = e.target.closest('[data-filter]');
  if (chip) { txFilter = chip.dataset.filter; render(); return; }
  const planBtn = e.target.closest('[data-plan]');
  if (planBtn) {
    const id = planBtn.dataset.plan, d = Number(planBtn.dataset.delta);
    store.planDelta[currentMonth] = store.planDelta[currentMonth] || {};
    const next = (store.planDelta[currentMonth][id] || 0) + d;
    if (planFor(currentMonth, id) + d >= 0) { store.planDelta[currentMonth][id] = next; save(); render(); }
    return;
  }
  const goalBtn = e.target.closest('[data-goal]');
  if (goalBtn) {
    store.goalAdd[goalBtn.dataset.goal] = (store.goalAdd[goalBtn.dataset.goal] || 0) + Number(goalBtn.dataset.add);
    save(); render(); return;
  }
  const billBtn = e.target.closest('[data-bill]');
  if (billBtn) {
    const name = billBtn.dataset.bill;
    if (billBtn.dataset.paid === '1') { if (!store.billsPaid.includes(name)) store.billsPaid.push(name); }
    else store.billsPaid = store.billsPaid.filter((n) => n !== name);
    save(); render();
  }
});

app.addEventListener('input', (e) => {
  if (e.target.id === 'tx-search') {
    txSearch = e.target.value;
    const pos = e.target.selectionStart;
    render();
    const again = document.getElementById('tx-search');
    if (again) { again.focus(); again.setSelectionRange(pos, pos); }
  }
  if (e.target.id === 'calc-monthly' || e.target.id === 'calc-years') calcResult();
});

app.addEventListener('submit', (e) => {
  if (e.target.id !== 'add-tx') return;
  e.preventDefault();
  const fd = new FormData(e.target);
  const amount = Number(fd.get('amount'));
  if (!(amount > 0)) return;
  store.added.unshift({
    date: String(fd.get('date') || 'Nov 26'),
    payee: String(fd.get('payee') || 'New expense').slice(0, 80),
    category: String(fd.get('category')),
    amount,
    note: String(fd.get('note') || '').slice(0, 120),
  });
  save();
  txFilter = 'all'; txSearch = '';
  render();
});

window.addEventListener('hashchange', render);
render();
