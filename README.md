# best-household-budget-site-20261126-1457

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/miuoas47-gif/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/miuoas47-gif/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

**Hearth &amp; Ledger** — the Alvarez household's budget, kept in plain sight. A working household
budget site that runs entirely offline from static files: a November dashboard with income,
spending and savings across three months; a transaction ledger you can add to and search;
budgets by category you can move by $10; bills in due-date order you can mark paid; four
savings goals you can top up; and a monthly report with a spending donut and a savings
calculator. Every figure is computed from the household's own ledger, and every control
does what it says.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — on a desktop or a phone. No build step, no network requests.

## Layout

- `app/index.html` — the shell: header, navigation, footer
- `app/style.css` — the whole look, including the phone layout
- `app/data.js` — the household's figures for September, October and November 2026 (income, plans, spending, transactions, bills, goals)
- `app/main.js` — one module: the store, hash routing, and all six pages (dashboard, transactions, budgets, bills, goals, reports)
- `main.ts` — the make.fun entrypoint: copies `app/` and `screenshots/` to the output
  directory and writes `dossier.json` with the vendored library
- `screenshots/` — screenshots of the site running in a browser

---

<sub>Entered on [make.fun](https://make.fun/?ref=6gvkzysc&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
