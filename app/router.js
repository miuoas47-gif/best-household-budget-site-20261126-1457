// The store and the router. The store holds the household's figures plus
// anything the family changes in the browser (kept in localStorage, on this
// device only). The router reads the hash, renders the matching page from
// views.js, and wires up that page's forms and buttons.
import { TRANSACTIONS, BUDGETS, GOALS, BILLS } from "./data.js";
import {
  renderDashboard, renderTransactions, renderBudgets,
  renderGoals, renderBills, renderReports,
} from "./views.js";

const STORAGE_KEY = "hearth-ledger-v1";

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStored(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // A browser that refuses storage still shows the site; changes just don't persist.
  }
}

// Build the working state: the household's own figures, plus the family's edits.
export function createStore() {
  const stored = loadStored();
  const store = {
    transactions: [...TRANSACTIONS, ...(stored.addedTransactions ?? [])],
    budgets: BUDGETS.map((b) => ({
      ...b,
      amount: stored.budgetEdits?.[b.category] ?? b.amount,
    })),
    goals: GOALS.map((g) => ({
      ...g,
      saved: g.saved + (stored.goalAdds?.[g.id] ?? 0),
    })),
    bills: BILLS.map((b) => ({
      ...b,
      paid: stored.billPaid?.[b.id] ?? b.paid,
    })),
  };
  store.addTransaction = (row) => {
    store.transactions.push(row);
    const s = loadStored();
    s.addedTransactions = [...(s.addedTransactions ?? []), row];
    saveStored(s);
  };
  store.setBudget = (category, amount) => {
    const found = store.budgets.find((b) => b.category === category);
    if (found) found.amount = amount;
    const s = loadStored();
    s.budgetEdits = { ...(s.budgetEdits ?? {}), [category]: amount };
    saveStored(s);
  };
  store.addToGoal = (id, amount) => {
    const found = store.goals.find((g) => g.id === id);
    if (found) found.saved += amount;
    const s = loadStored();
    s.goalAdds = { ...(s.goalAdds ?? {}), [id]: (s.goalAdds?.[id] ?? 0) + amount };
    saveStored(s);
  };
  store.toggleBill = (id) => {
    const found = store.bills.find((b) => b.id === id);
    if (!found) return;
    found.paid = !found.paid;
    const s = loadStored();
    s.billPaid = { ...(s.billPaid ?? {}), [id]: found.paid };
    saveStored(s);
  };
  return store;
}

const PAGES = {
  "": { nav: "dashboard", render: (store) => renderDashboard(store) },
  transactions: { nav: "transactions", render: (store, filter) => renderTransactions(store, filter) },
  budgets: { nav: "budgets", render: (store) => renderBudgets(store) },
  goals: { nav: "goals", render: (store) => renderGoals(store) },
  bills: { nav: "bills", render: (store) => renderBills(store) },
  reports: { nav: "reports", render: (store) => renderReports(store) },
};

export function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, "");
  const [page, query] = hash.split("?");
  const params = new URLSearchParams(query ?? "");
  return { page: PAGES[page] ? page : "", filter: params.get("category") ?? "" };
}

export function renderRoute(store) {
  const { page, filter } = currentRoute();
  const view = document.getElementById("view");
  view.innerHTML = PAGES[page].render(store, filter);
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === PAGES[page].nav);
  });
  window.scrollTo(0, 0);
}

// One delegated listener handles every form and button the pages contain.
export function wireEvents(store) {
  const view = document.getElementById("view");

  view.addEventListener("submit", (event) => {
    const form = event.target.closest("form[data-form]");
    if (!form) return;
    event.preventDefault();
    const data = new FormData(form);
    if (form.dataset.form === "add-transaction") {
      const amount = Number(data.get("amount"));
      const payee = String(data.get("payee") ?? "").trim();
      const date = String(data.get("date") ?? "2026-11-26");
      const category = String(data.get("category") ?? "everyday");
      if (!payee || !(amount > 0)) return;
      store.addTransaction({
        id: `u-${Date.now()}`,
        date, payee, category, amount: Math.round(amount * 100) / 100,
      });
    }
    if (form.dataset.form === "set-budget") {
      const amount = Number(data.get("amount"));
      if (amount >= 0) store.setBudget(String(data.get("category")), amount);
    }
    if (form.dataset.form === "add-goal") {
      const amount = Number(data.get("amount"));
      if (amount > 0) store.addToGoal(String(data.get("id")), amount);
    }
    renderRoute(store);
  });

  view.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action='toggle-bill']");
    if (!button) return;
    store.toggleBill(button.dataset.id);
    renderRoute(store);
  });

  view.addEventListener("change", (event) => {
    const select = event.target.closest("[data-filter]");
    if (!select) return;
    const value = select.value;
    location.hash = value ? `#/transactions?category=${value}` : "#/transactions";
  });
}
