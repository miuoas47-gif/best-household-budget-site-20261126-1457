// SVG charts, drawn from the household's own numbers — no library, no network.
// A donut shows where the money went; a set of bars shows the last five months.

export function donutChart(slices, size = 180) {
  // slices: [{ label, value, color }]. The hole in the middle carries the total.
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const rings = slices
    .filter((s) => s.value > 0)
    .map((s) => {
      const frac = s.value / total;
      const dash = frac * circumference;
      const ring = `<circle cx="90" cy="90" r="${radius}" fill="none" stroke="${s.color}" stroke-width="26" stroke-dasharray="${dash.toFixed(2)} ${(circumference - dash).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" />`;
      offset += dash;
      return ring;
    })
    .join("");
  return `<svg viewBox="0 0 180 180" width="${size}" height="${size}" role="img" aria-label="Donut chart of November spending by category">
    <circle cx="90" cy="90" r="${radius}" fill="none" stroke="#ece4d3" stroke-width="26" />
    ${rings}
    <text x="90" y="84" text-anchor="middle" font-size="15" font-weight="700" fill="#22302a">Spent</text>
    <text x="90" y="106" text-anchor="middle" font-size="16" font-weight="800" fill="#22302a">$${Math.round(total).toLocaleString("en-US")}</text>
  </svg>`;
}

export function monthBars(months, currentLabel) {
  // months: [{ month, spent }]. The tallest bar sets the scale.
  const max = Math.max(...months.map((m) => m.spent));
  const columns = months
    .map((m) => {
      const height = Math.max(6, Math.round((m.spent / max) * 130));
      const current = m.month === currentLabel ? " current" : "";
      return `<div class="col${current}">
        <span class="val">$${m.spent.toLocaleString("en-US")}</span>
        <span class="fill" style="height:${height}px"></span>
        <span class="lbl">${m.month}${current ? " (so far)" : ""}</span>
      </div>`;
    })
    .join("");
  return `<div class="month-bars" role="img" aria-label="Bar chart of monthly spending, July to November">${columns}</div>`;
}
