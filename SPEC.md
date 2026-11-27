# Spec — Lumbung household budget site (r3, fresh build)

Competition: best-household-budget-site-20261126-1457 ("Make the best household budget site").
Round 1 rank 3471/4675 — outside the top-1000 buffer. Round 2 cutoff 2026-11-28T02:57Z.

## What the judge rewards (RULES.txt, in order)
1. A working site shown in screenshots: pages/tools/sections a household needs,
   each reached by a link, real figures, every control working, nothing empty.
2. Content/usefulness: complete, specific, actionable money content.
3. Ease of use: clear nav, phone layout, readable type/contrast.
4. Look/originality: own identity, coherent palette, charts that suit the topic.
5. Speed/structure: small first load, source split into one-job files, named for
   what they do. The judge sees mostly the screenshots (contact sheet: cover
   large on top, rest small below) — screenshots must be dense and readable
   when shrunk.

## Improvements over the round-1 entry
- Six real views behind hash links instead of a thin site: Dashboard, Transactions
  (ledger with filters + working add/delete), Budget planner (editable category
  budgets + 50/30/20 calculator), Bills & subscriptions (due dates, paid toggles),
  Savings goals (progress + working contributions), Reports (6-month trend chart
  + category table + computed insights).
- One coherent household dataset (Wijaya family of four, Bandung, Nov 2026):
  Rp 18.500.000 monthly income, 42 November transactions, 10 budget categories,
  8 bills, 4 savings goals, 6 months of history. Every figure on every page is
  computed from that one ledger — no hard-coded totals that disagree.
- Charts drawn as inline SVG (donut: spending by category; bars: 6-month
  income vs spending) — no library, no network, tiny first load.
- Screenshots: 4 real renders, dense and legible at small size — dashboard
  cover (1280x800), budget planner (1280x800), transactions (1280x800),
  dashboard on a phone (390x844).
- Descriptive entry title naming what the site does.

## Site identity
Name: Lumbung (Indonesian rice barn — the household store). Household: the
Wijaya family (Ayah Budi, Ibu Sari, two children), Bandung. Currency: IDR (Rp).
Palette: deep leaf green + warm cream + terracotta accent; system font stack.

## Files (app/ — static, no build step, no network)
- index.html — shell: header, nav (hash links), view containers, footer.
- style.css — design system: palette, cards, tables, bars, responsive phone layout.
- data.js — the household dataset: income, transactions, budgets, bills, goals, history.
- format.js — Rupiah/date/percent formatting helpers.
- charts.js — pure SVG chart builders: donutChart, barChart.
- views.js — one render function per view (dashboard, transactions, budget, bills,
  goals, reports) returning HTML strings from state.
- app.js — router (hash), state (in-memory + localStorage), event wiring, actions
  (add/delete transaction, edit budget, toggle bill paid, contribute to goal,
  month picker, filters).

## Entrypoint
- main.ts (root, Node 22 stdlib only): copies app/ + screenshots/ to
  MAKEFUN_OUTPUT_DIR (default /output) and writes dossier.json with buildDossier
  from vendor/makefun-frontend.ts (kit copy, unchanged). No args, exit 0,
  deterministic, byte-identical across runs.
- vendor/makefun-frontend.ts — kit copy, unchanged.
- LICENSE (MIT), README.md (make.fun badges per template), prompt-scheduled.txt
  (this task message, verbatim, for the bundle step).

## Caps (gate)
- Screenshots: 3–4, each ≤256 KiB, long side ≤1280, short side ≥360, PNG/JPEG.
- app/: ≤993 files+dirs, ≤16 MiB, index.html ≤1 MiB. Dossier text ≤160 KiB.
- No external references anywhere: relative paths only, system fonts only.
