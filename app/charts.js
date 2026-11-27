// charts.js — the small chart pieces Alder Ledger draws with plain HTML and CSS.
// No chart library, no canvas: bars are divs, so they print and resize cleanly.
import { money, moneyShort } from './data.js';

// One horizontal bar row: a category, what it spent, and what it planned.
export function categoryBarRow(label, spent, planned) {
  const pct = planned > 0 ? Math.min(100, Math.round((spent / planned) * 100)) : 0;
  const tone = spent > planned ? 'over' : pct >= 85 ? 'near' : '';
  return (
    '<div class="bar-row">' +
    '<div class="bar-name">' + escapeHtml(label) + '</div>' +
    '<div class="bar-track" role="img" aria-label="' + escapeHtml(label) + ' spent ' + money(spent) + ' of ' + money(planned) + '">' +
    '<div class="bar-fill ' + tone + '" style="width:' + pct + '%"></div></div>' +
    '<div class="bar-amount">' + money(spent) + ' <span class="of">of ' + money(planned) + '</span></div>' +
    '</div>'
  );
}

// A row of vertical bars, one per month, for the report page.
export function monthlyChart(months) {
  const max = Math.max.apply(null, months.map(function (m) { return m.spent; }));
  const cols = months.map(function (m, i) {
    const height = Math.max(4, Math.round((m.spent / max) * 150));
    const current = i === months.length - 1;
    return (
      '<div class="month-col">' +
      '<div class="val">' + moneyShort(m.spent) + '</div>' +
      '<div class="month-bar' + (current ? ' current' : '') + '" style="height:' + height + 'px" role="img" aria-label="' + m.month + ' spent ' + money(m.spent) + '"></div>' +
      '<div class="lbl">' + m.month + '</div>' +
      '</div>'
    );
  });
  return '<div class="month-chart">' + cols.join('') + '</div>';
}

// Escape text that came from a form before it is shown on the page.
export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
