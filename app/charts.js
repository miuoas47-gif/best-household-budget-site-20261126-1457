// Lumbung charts: pure SVG builders, no library, no network.
// Both return an SVG string; callers drop it into the page.

// Donut of spending by category. slices: [{label, value, color}].
export function donutChart(slices, size = 220) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r * 0.62;
  let angle = -Math.PI / 2;
  const parts = [];
  for (const s of slices) {
    const frac = s.value / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    parts.push(
      `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} ` +
      `L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${s.color}">` +
      `<title>${s.label}: ${Math.round(frac * 100)}%</title></path>`,
    );
  }
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" ` +
    `aria-label="Donat pengeluaran per kategori">${parts.join("")}` +
    `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" class="donut-center">` +
    `${Math.round((total / 1000000) * 10) / 10} jt</text>` +
    `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="11" fill="#5d665c">total belanja</text></svg>`;
}

// Grouped bars: income vs spending per month. rows: [{label, income, spent}].
export function barChart(rows, width = 640, height = 260) {
  const padL = 64;
  const padB = 28;
  const padT = 14;
  const max = Math.max(...rows.flatMap((r) => [r.income, r.spent]), 1);
  const innerW = width - padL - 12;
  const innerH = height - padT - padB;
  const groupW = innerW / rows.length;
  const barW = Math.min(26, (groupW - 18) / 2);
  const y = (v) => padT + innerH - (v / max) * innerH;
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const gy = padT + innerH * (1 - f);
    const label = `${Math.round((max * f) / 1000000)} jt`;
    return `<line x1="${padL}" y1="${gy}" x2="${width - 12}" y2="${gy}" stroke="#ddd5c2" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${gy + 4}" text-anchor="end" font-size="11" fill="#5d665c">${label}</text>`;
  }).join("");
  const bars = rows.map((r, i) => {
    const gx = padL + i * groupW + (groupW - barW * 2 - 6) / 2;
    return `<rect x="${gx.toFixed(1)}" y="${y(r.income).toFixed(1)}" width="${barW}" height="${(padT + innerH - y(r.income)).toFixed(1)}" rx="3" fill="#357a52"><title>${r.label} pemasukan</title></rect>` +
      `<rect x="${(gx + barW + 6).toFixed(1)}" y="${y(r.spent).toFixed(1)}" width="${barW}" height="${(padT + innerH - y(r.spent)).toFixed(1)}" rx="3" fill="#c05b2e"><title>${r.label} pengeluaran</title></rect>` +
      `<text x="${(padL + i * groupW + groupW / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="11" fill="#5d665c">${r.label}</text>`;
  }).join("");
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" ` +
    `aria-label="Batang pemasukan dan pengeluaran enam bulan">${grid}${bars}` +
    `<line x1="${padL}" y1="${padT + innerH}" x2="${width - 12}" y2="${padT + innerH}" stroke="#5d665c" stroke-width="1"/></svg>` +
    `<p class="hint"><span style="color:#357a52">■</span> Pemasukan &nbsp; <span style="color:#c05b2e">■</span> Pengeluaran</p>`;
}
