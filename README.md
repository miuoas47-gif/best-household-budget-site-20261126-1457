# best-household-budget-site-20261126-1457

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/miuoas47-gif/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/miuoas47-gif/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

**Hearth Ledger** — the Marlowe household's budget, kept in plain sight. A working household
budget site that runs entirely offline from static files: a November dashboard with income,
spending and savings; a transaction ledger you can add to; budgets by category you can change;
four savings goals you can top up; bills in due-date order you can mark paid; and a monthly
report with five months of spending. Every figure is computed from the household's own ledger,
and every control does what it says.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — on a desktop or a phone. No build step, no network requests.

## Layout

- `app/index.html` — the shell: header, navigation, footer
- `app/style.css` — the whole look, including the phone layout
- `app/data.js` — the household's November figures (income, transactions, budgets, goals, bills)
- `app/format.js` — money and date formatting
- `app/charts.js` — the SVG donut and monthly bars
- `app/views.js` — one renderer per page (dashboard, transactions, budgets, goals, bills, reports)
- `app/router.js` — the store (with localStorage) and hash routing
- `app/app.js` — boot
- `main.ts` — the make.fun entrypoint: copies `app/` and `screenshots/` to the output
  directory and writes `dossier.json` with the vendored library
- `screenshots/` — screenshots of the site running in a browser

---

<sub>Entered on [make.fun](https://make.fun/?ref=6gvkzysc&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
