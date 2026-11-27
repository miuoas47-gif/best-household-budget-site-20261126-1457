// Lumbung app: router, state and actions. Static imports only — no network.
// State lives in memory and is saved to localStorage, so a family's edits survive
// a reload but never leave their own browser.

import { BILLS, CATEGORIES, GOALS, MONTHS, TRANSACTIONS } from "./data.js";
import { viewBills, viewBudget, viewDashboard, viewGoals, viewReports, viewTransactions } from "./views.js";

const STORE_KEY = "lumbung-wijaya-v1";
const ROUTES = {
  "": viewDashboard,
  "transaksi": viewTransactions,
  "anggaran": viewBudget,
  "tagihan": viewBills,
  "tabungan": viewGoals,
  "laporan": viewReports,
};

function defaultState() {
  return {
    month: "2026-11",
    transactions: TRANSACTIONS.map((t) => ({ ...t })),
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
    bills: BILLS.map((b) => ({ ...b })),
    goals: GOALS.map((g) => ({ ...g })),
    filterCat: "all",
    filterType: "all",
    filterText: "",
    nextTx: 100,
    nextGoal: 100,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    const saved = JSON.parse(raw);
    const base = defaultState();
    // Only accept a saved state shaped like ours; anything else restarts fresh.
    if (!saved || !Array.isArray(saved.transactions) || !Array.isArray(saved.bills)) return base;
    return { ...base, ...saved, filterCat: "all", filterType: "all", filterText: "" };
  } catch {
    return defaultState();
  }
}

let S = loadState();
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch { /* private mode: keep in-memory only */ }
}

// Build the month model: every number on the page comes from here.
function buildModel() {
  const monthLabel = (MONTHS.find((m) => m.id === S.month) || { label: S.month }).label;
  const txs = S.transactions
    .filter((t) => t.date.startsWith(S.month))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const income = txs.filter((t) => t.amount >= 0).reduce((s, t) => s + t.amount, 0);
  const spent = txs.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0);
  const byCat = CATEGORIES.map((cat) => ({
    cat,
    spent: txs.filter((t) => t.cat === cat.id && t.amount < 0).reduce((s, t) => s - t.amount, 0),
    budget: S.budgets[cat.id],
  })).sort((a, b) => b.spent - a.spent);
  return { monthLabel, txs, income, spent, remaining: income - spent, byCat, bills: S.bills };
}

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, "").split("/")[0];
  return ROUTES[hash] ? hash : "";
}

function render() {
  const route = currentRoute();
  const M = buildModel();
  const view = document.getElementById("view");
  view.innerHTML = ROUTES[route]({ ...S, monthLabel: M.monthLabel }, M);
  document.querySelectorAll(".mainnav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === (route === "" ? "dashboard" : route));
  });
  bindView();
}

function bindView() {
  const addTx = document.getElementById("addTxForm");
  if (addTx) addTx.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(addTx);
    const amount = Math.abs(Number(f.get("amount")));
    if (!amount || amount <= 0) return;
    S.transactions.push({
      id: `u${S.nextTx++}`,
      date: String(f.get("date") || `${S.month}-28`),
      desc: String(f.get("desc") || "Transaksi baru").trim().slice(0, 80) || "Transaksi baru",
      cat: String(f.get("cat")),
      amount: f.get("kind") === "in" ? amount : -amount,
    });
    save();
    render();
  });
  const addGoal = document.getElementById("addGoalForm");
  if (addGoal) addGoal.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(addGoal);
    S.goals.push({
      id: `ug${S.nextGoal++}`,
      name: String(f.get("name")).trim().slice(0, 60) || "Tujuan baru",
      saved: 0,
      target: Math.max(100000, Number(f.get("target")) || 1000000),
      note: String(f.get("note") || "").trim().slice(0, 80) || "Tujuan baru keluarga",
    });
    save();
    render();
  });
  const fc = document.getElementById("filterCat");
  if (fc) fc.addEventListener("change", () => { S.filterCat = fc.value; render(); });
  const ft = document.getElementById("filterType");
  if (ft) ft.addEventListener("change", () => { S.filterType = ft.value; render(); });
  const fx = document.getElementById("filterText");
  if (fx) fx.addEventListener("input", () => { S.filterText = fx.value; render(); });
}

// One delegated handler for every button and budget input in the app.
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  if (action === "delete-tx") {
    S.transactions = S.transactions.filter((t) => t.id !== btn.dataset.id);
  } else if (action === "toggle-bill") {
    const bill = S.bills.find((b) => b.id === btn.dataset.id);
    if (bill) bill.paid = !bill.paid;
  } else if (action === "contribute") {
    const goal = S.goals.find((g) => g.id === btn.dataset.id);
    if (goal) goal.saved = Math.min(goal.target, goal.saved + Number(btn.dataset.amount));
  } else {
    return;
  }
  save();
  render();
});

document.addEventListener("change", (e) => {
  const input = e.target.closest("[data-action='edit-budget']");
  if (!input) return;
  const value = Math.max(0, Math.round(Number(input.value) || 0));
  S.budgets[input.dataset.id] = value;
  save();
  render();
});

document.getElementById("resetDemo").addEventListener("click", () => {
  try { localStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
  S = defaultState();
  render();
});

window.addEventListener("hashchange", render);
render();
