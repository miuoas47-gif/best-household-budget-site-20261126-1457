# Alder Ledger — Household Budget

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/miuoas47-gif/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/miuoas47-gif/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Alder Ledger is the Alder household's working budget site, built for the
[make.fun "Make the best household budget site" bounty](https://make.fun/bounty/best-household-budget-site-20261126-1457)
(slug `best-household-budget-site-20261126-1457`, $50 prize, entries close
2026-11-29T14:57:00Z).

## What it is

A static site (no build step, no network requests) for Daniel & Priya Alder
and their kids Sam and June, covering November 2026 with real figures
throughout: $7,850 of income, $5,310.40 spent, $2,539.60 left.

- **Dashboard** — income, spending, what's left, where the money went, bills still to pay, nearest savings goal, recent spending.
- **Transactions** — all 32 November expenses plus payday income, filterable by category, searchable, with a working add-expense form.
- **Budgets** — ten envelopes (housing, groceries, transport, utilities, eating out, kids, health, fun, savings, household) with progress bars and on-track / nearly-there / over badges.
- **Bills** — every recurring November bill in due-date order, with mark-paid buttons that persist in the browser.
- **Savings goals** — emergency fund, summer holiday, bikes, kitchen refresh, with add-to-goal contributions that persist.
- **Reports** — six months of spending (June–November) as a bar chart and table, plus what November says about the household's money.

Everything added or marked paid is saved only in the visitor's own browser
(`localStorage`); nothing leaves the device.

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

or serve `app/` with any static file server and open `index.html`.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored `vendor/makefun-frontend.ts` library. It runs
with no arguments, exits 0, and writes byte-identical output on every run.

## Layout

- `main.ts` — the hand-in program (Node 22, standard library only)
- `app/index.html` — the single page, hash-routed sections
- `app/style.css` — the whole design, system fonts only
- `app/data.js` — the household's November 2026 figures and bills
- `app/views.js` — the router and all six views
- `app/charts.js` — category bars and the monthly chart
- `app/main.js` — boots the router
- `screenshots/` — four real renders of the site (desktop dashboard, budgets, reports, phone transactions)
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged

## License

MIT — see [LICENSE](LICENSE).
