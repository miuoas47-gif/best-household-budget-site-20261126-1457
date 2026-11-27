// Lumbung views: one render function per page. Each takes the state (S) and the
// month model (M) built by app.js, and returns an HTML string. No network, no I/O.

import { CATEGORIES, GOALS, HISTORY, INCOME, MONTHS } from "./data.js";
import { esc, pct, rupiah, rupiahShort, shortDate } from "./format.js";
import { barChart, donutChart } from "./charts.js";

function catName(id) {
  if (id === "gaji") return "Pemasukan";
  return (CATEGORIES.find((c) => c.id === id) || { name: id }).name;
}

function catColor(id) {
  return (CATEGORIES.find((c) => c.id === id) || { color: "#5d665c" }).color;
}

function statCard(label, value, sub, cls = "") {
  return `<div class="card stat ${cls}"><div class="label">${label}</div>` +
    `<div class="value">${value}</div><div class="sub">${sub}</div></div>`;
}

function budgetRows(byCat, limit = 0) {
  const rows = limit ? byCat.slice(0, limit) : byCat;
  return rows.map(({ cat, spent, budget }) => {
    const ratio = budget ? spent / budget : 0;
    const cls = ratio > 1 ? "over" : ratio > 0.85 ? "near" : "";
    const left = budget - spent;
    return `<div class="budget-row"><span class="cat">${esc(cat.name)}</span>` +
      `<span class="nums"><b>${rupiah(spent)}</b> / ${rupiah(budget)}</span>` +
      `<span class="bar-track"><span class="bar-fill ${cls}" style="display:block;width:${Math.min(100, Math.round(ratio * 100))}%"></span></span>` +
      `<span class="hint">${pct(spent, budget)} terpakai · ${left >= 0 ? `sisa ${rupiah(left)}` : `lewat ${rupiah(-left)}`}</span></div>`;
  }).join("");
}

function txTable(txs, withDelete) {
  if (!txs.length) return `<p class="hint">Belum ada transaksi yang cocok dengan filter ini.</p>`;
  const rows = txs.map((t) => {
    const cls = t.amount >= 0 ? "pos" : "neg";
    const sign = t.amount >= 0 ? "+" : "−";
    return `<tr><td>${shortDate(t.date)}</td><td>${esc(t.desc)}</td>` +
      `<td><span class="tag" style="background:${catColor(t.cat)}22;color:${catColor(t.cat)}">${esc(catName(t.cat))}</span></td>` +
      `<td class="num ${cls}">${sign}${rupiah(Math.abs(t.amount))}</td>` +
      (withDelete ? `<td class="num"><button type="button" class="btn ghost small" data-action="delete-tx" data-id="${t.id}">Hapus</button></td>` : "") +
      `</tr>`;
  }).join("");
  return `<table><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th>` +
    `<th class="num">Jumlah</th>${withDelete ? "<th></th>" : ""}</tr></thead><tbody>${rows}</tbody></table>`;
}

export function viewDashboard(S, M) {
  const donutSlices = M.byCat.filter((x) => x.spent > 0)
    .map(({ cat, spent }) => ({ label: cat.name, value: spent, color: cat.color }));
  const legend = M.byCat.filter((x) => x.spent > 0).map(({ cat, spent }) =>
    `<li><span class="swatch" style="background:${cat.color}"></span>${esc(cat.name)}` +
    `<span class="amt">${rupiah(spent)}</span></li>`).join("");
  const upcoming = M.bills.filter((b) => !b.paid).slice(0, 3).map((b) =>
    `<div class="bill-row"><div class="grow"><b>${esc(b.name)}</b>` +
    `<div class="due">Jatuh tempo ${b.dueDay} ${S.monthLabel}</div></div>` +
    `<span class="amount">${rupiah(b.amount)}</span>` +
    `<span class="pill due-soon">Belum dibayar</span></div>`).join("");
  const goals = GOALS.map((g) => {
    const saved = S.goals.find((x) => x.id === g.id).saved;
    return `<div class="budget-row"><span class="cat">${esc(g.name)}</span>` +
      `<span class="nums"><b>${rupiah(saved)}</b> / ${rupiah(g.target)}</span>` +
      `<span class="bar-track"><span class="bar-fill" style="display:block;width:${Math.min(100, Math.round((saved / g.target) * 100))}%"></span></span></div>`;
  }).join("");
  const recent = txTable(M.txs.slice(0, 6), false);
  return `<div class="page-head"><h2>Dasbor ${esc(S.monthLabel)}</h2>` +
    `<p>Selamat datang, Keluarga Wijaya. Ini ringkasan uang keluarga bulan ini — ` +
    `semua angka dihitung langsung dari buku kas.</p></div>` +
    `<div class="grid grid-4">` +
    statCard("Pemasukan", rupiah(M.income), `${INCOME.length} sumber · gaji + les privat`) +
    statCard("Pengeluaran", rupiah(M.spent), `${M.txs.filter((t) => t.amount < 0).length} transaksi bulan ini`, "warn") +
    statCard("Sisa bulan ini", rupiah(M.remaining), M.remaining >= 0 ? "Masih di jalur anggaran" : "Melewati anggaran", M.remaining >= 0 ? "good" : "warn") +
    statCard("Tingkat tabungan", pct(M.remaining, M.income), "dari pemasukan disisihkan") +
    `</div>` +
    `<div class="grid grid-2" style="margin-top:1rem">` +
    `<section class="card"><h3>Ke mana uang pergi?</h3>` +
    `<div class="chart-wrap">${donutChart(donutSlices)}<ul class="legend" style="flex:1;min-width:200px">${legend}</ul></div></section>` +
    `<section class="card"><h3>Anggaran per kategori</h3>${budgetRows(M.byCat, 5)}` +
    `<p class="hint" style="margin-top:.6rem"><a href="#/anggaran">Lihat semua kategori &amp; kalkulator 50/30/20 →</a></p></section>` +
    `<section class="card"><h3>Tagihan yang belum dibayar</h3>${upcoming || '<p class="hint">Semua tagihan bulan ini sudah dibayar. 🎉</p>'} ` +
    `<p class="hint" style="margin-top:.6rem"><a href="#/tagihan">Kelola semua tagihan →</a></p></section>` +
    `<section class="card"><h3>Tabungan keluarga</h3>${goals}` +
    `<p class="hint" style="margin-top:.6rem"><a href="#/tabungan">Lihat semua tujuan tabungan →</a></p></section>` +
    `</div>` +
    `<section class="card" style="margin-top:1rem"><h3>Transaksi terbaru</h3>${recent}` +
    `<p class="hint" style="margin-top:.6rem"><a href="#/transaksi">Lihat semua transaksi &amp; tambah baru →</a></p></section>`;
}

export function viewTransactions(S, M) {
  const opts = [`<option value="all">Semua kategori</option>`,
    ...CATEGORIES.map((c) => `<option value="${c.id}" ${S.filterCat === c.id ? "selected" : ""}>${esc(c.name)}</option>`)].join("");
  const filtered = M.txs.filter((t) =>
    (S.filterCat === "all" || t.cat === S.filterCat) &&
    (S.filterType === "all" || (S.filterType === "in" ? t.amount >= 0 : t.amount < 0)) &&
    (!S.filterText || t.desc.toLowerCase().includes(S.filterText.toLowerCase())));
  const inSum = filtered.filter((t) => t.amount >= 0).reduce((s, t) => s + t.amount, 0);
  const outSum = filtered.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0);
  return `<div class="page-head"><h2>Transaksi ${esc(S.monthLabel)}</h2>` +
    `<p>Semua pemasukan dan pengeluaran keluarga, lengkap dengan filter dan form tambah transaksi. ` +
    `Menambah atau menghapus transaksi langsung mengubah dasbor, anggaran, dan laporan.</p></div>` +
    `<div class="grid grid-2"><section class="card"><h3>Tambah transaksi</h3>` +
    `<form id="addTxForm" class="form-grid">` +
    `<label>Tanggal<input type="date" name="date" value="${S.month}-28" required></label>` +
    `<label>Keterangan<input type="text" name="desc" placeholder="cth. Belanja pasar" required maxlength="80"></label>` +
    `<label>Kategori<select name="cat">${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></label>` +
    `<label>Jumlah (Rp)<input type="number" name="amount" min="1000" step="1000" placeholder="150000" required></label>` +
    `<label>Jenis<select name="kind"><option value="out">Pengeluaran</option><option value="in">Pemasukan</option></select></label>` +
    `<span></span><span><button class="btn" type="submit">Simpan transaksi</button></span>` +
    `</form></section>` +
    `<section class="card"><h3>Ringkasan filter</h3>` +
    `<p><span class="big-number">${filtered.length}</span> transaksi tampil</p>` +
    `<p>Pemasukan terfilter: <b class="pos">+${rupiah(inSum)}</b><br>` +
    `Pengeluaran terfilter: <b class="neg">−${rupiah(outSum)}</b><br>` +
    `Selisih: <b>${rupiah(inSum - outSum)}</b></p>` +
    `<p class="hint">Tip: ketik “pasar” di kolom cari untuk melihat semua belanja pasar bulan ini.</p></section></div>` +
    `<section class="card" style="margin-top:1rem"><h3>Daftar transaksi</h3>` +
    `<div class="filters"><label>Kategori<br><select id="filterCat">${opts}</select></label>` +
    `<label>Jenis<br><select id="filterType"><option value="all" ${S.filterType === "all" ? "selected" : ""}>Semua</option>` +
    `<option value="in" ${S.filterType === "in" ? "selected" : ""}>Pemasukan</option>` +
    `<option value="out" ${S.filterType === "out" ? "selected" : ""}>Pengeluaran</option></select></label>` +
    `<label>Cari<br><input id="filterText" type="search" placeholder="Cari keterangan…" value="${esc(S.filterText)}"></label></div>` +
    txTable(filtered, true) + `</section>`;
}

export function viewBudget(S, M) {
  const needsIds = ["belanja", "rumah", "transport", "sekolah", "kesehatan"];
  const wantsIds = ["makan", "hiburan", "pakaian", "sosial"];
  const byId = Object.fromEntries(M.byCat.map((x) => [x.cat.id, x.spent]));
  const needs = needsIds.reduce((s, id) => s + (byId[id] || 0), 0);
  const wants = wantsIds.reduce((s, id) => s + (byId[id] || 0), 0);
  const saved = Math.max(0, M.remaining);
  const total = M.income || 1;
  const totalBudget = CATEGORIES.reduce((s, c) => s + S.budgets[c.id], 0);
  const rows = M.byCat.map(({ cat, spent }) => {
    const budget = S.budgets[cat.id];
    const ratio = budget ? spent / budget : 0;
    const cls = ratio > 1 ? "over" : ratio > 0.85 ? "near" : "";
    return `<div class="budget-row"><span class="cat">${esc(cat.name)}</span>` +
      `<span class="nums"><b>${rupiah(spent)}</b> / <input type="number" min="0" step="50000" value="${budget}" ` +
      `data-action="edit-budget" data-id="${cat.id}" aria-label="Anggaran ${esc(cat.name)}" style="width:7.5rem;padding:.2rem .4rem;border:1px solid var(--line);border-radius:6px;text-align:right"></span>` +
      `<span class="bar-track"><span class="bar-fill ${cls}" style="display:block;width:${Math.min(100, Math.round(ratio * 100))}%"></span></span>` +
      `<span class="hint">${pct(spent, budget)} terpakai · ${budget - spent >= 0 ? `sisa ${rupiah(budget - spent)}` : `lewat ${rupiah(spent - budget)}`}</span></div>`;
  }).join("");
  return `<div class="page-head"><h2>Anggaran ${esc(S.monthLabel)}</h2>` +
    `<p>Atur batas belanja tiap kategori — ketik angka baru di kolom anggaran dan halaman langsung ` +
    `menghitung ulang. Total anggaran keluarga: <b>${rupiah(totalBudget)}</b> dari pemasukan <b>${rupiah(M.income)}</b>.</p></div>` +
    `<section class="card"><h3>Kalkulator 50/30/20</h3>` +
    `<p class="rule-note">Aturan praktis: 50% kebutuhan, 30% keinginan, 20% tabungan. Ini posisi keluarga bulan ini:</p>` +
    `<div class="split" style="margin-top:.7rem">` +
    `<div class="needs"><div class="pct">${pct(needs, total)}</div><b>Kebutuhan</b><div>${rupiah(needs)}</div><div class="hint">target 50% · ${rupiah(total * 0.5)}</div></div>` +
    `<div class="wants"><div class="pct">${pct(wants, total)}</div><b>Keinginan</b><div>${rupiah(wants)}</div><div class="hint">target 30% · ${rupiah(total * 0.3)}</div></div>` +
    `<div class="saves"><div class="pct">${pct(saved, total)}</div><b>Tabungan</b><div>${rupiah(saved)}</div><div class="hint">target 20% · ${rupiah(total * 0.2)}</div></div>` +
    `</div>` +
    `<p class="rule-note" style="margin-top:.7rem">${saved >= total * 0.2
      ? "Keluarga sudah menabung di atas target 20% — pertahankan, dan alihkan sisa ke dana darurat."
      : "Tabungan masih di bawah target 20%. Coba potong Rp 200.000 dari makan di luar bulan depan."}</p></section>` +
    `<section class="card" style="margin-top:1rem"><h3>Anggaran per kategori</h3>${rows}</section>`;
}

export function viewBills(S, M) {
  const unpaid = M.bills.filter((b) => !b.paid);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const paidTotal = M.bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
  const rows = M.bills.map((b) => {
    const today = 29; // "today" inside the demo month, for due labels
    const pill = b.paid ? `<span class="pill paid">Lunas</span>`
      : b.dueDay < today ? `<span class="pill overdue">Jatuh tempo</span>`
      : `<span class="pill due-soon">Jatuh tempo ${b.dueDay} Nov</span>`;
    return `<div class="bill-row"><div class="grow"><b>${esc(b.name)}</b>` +
      `<div class="due">${b.auto ? "Autodebet" : "Bayar manual"} · jatuh tempo tiap tanggal ${b.dueDay}</div></div>` +
      `<span class="amount">${rupiah(b.amount)}</span>${pill}` +
      `<button type="button" class="btn ${b.paid ? "ghost" : ""} small" data-action="toggle-bill" data-id="${b.id}">` +
      `${b.paid ? "Batalkan lunas" : "Tandai lunas"}</button></div>`;
  }).join("");
  return `<div class="page-head"><h2>Tagihan &amp; langganan</h2>` +
    `<p>Tagihan rutin keluarga Wijaya. Tandai lunas saat sudah dibayar — total di bawah langsung berubah.</p></div>` +
    `<div class="grid grid-3">` +
    statCard("Belum dibayar", rupiah(unpaidTotal), `${unpaid.length} tagihan menunggu`) +
    statCard("Sudah dibayar", rupiah(paidTotal), `${M.bills.length - unpaid.length} dari ${M.bills.length} tagihan`, "good") +
    statCard("Total tagihan / bulan", rupiah(unpaidTotal + paidTotal), `${pct(unpaidTotal + paidTotal, M.income)} dari pemasukan`) +
    `</div>` +
    `<section class="card" style="margin-top:1rem"><h3>Daftar tagihan — November 2026</h3>${rows}` +
    `<p class="hint" style="margin-top:.6rem">Tagihan autodebet (PLN, IndiHome, SPP, BPJS, Netflix, Spotify) ` +
    `dipotong otomatis dari rekening — pastikan saldo cukup sebelum tanggal jatuh tempo.</p></section>`;
}

export function viewGoals(S, M) {
  const totalSaved = S.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = S.goals.reduce((s, g) => s + g.target, 0);
  const cards = S.goals.map((g) => {
    const ratio = g.saved / g.target;
    const remain = g.target - g.saved;
    return `<section class="card"><div class="goal-head"><h3>${esc(g.name)}</h3>` +
      `<span class="target">${pct(g.saved, g.target)} tercapai</span></div>` +
      `<p class="hint">${esc(g.note)}</p>` +
      `<p><span class="goal-amount">${rupiah(g.saved)}</span> <span class="goal-pct">dari ${rupiah(g.target)}</span></p>` +
      `<div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, Math.round(ratio * 100))}%"></div></div>` +
      `<p class="hint">${remain > 0 ? `Kurang ${rupiah(remain)} lagi.` : "Tujuan tercapai! 🎉"}</p>` +
      `<div class="btn-row">` +
      `<button type="button" class="btn small" data-action="contribute" data-id="${g.id}" data-amount="100000">+ Rp 100 rb</button>` +
      `<button type="button" class="btn small" data-action="contribute" data-id="${g.id}" data-amount="500000">+ Rp 500 rb</button>` +
      `<button type="button" class="btn small ghost" data-action="contribute" data-id="${g.id}" data-amount="1000000">+ Rp 1 jt</button>` +
      `</div></section>`;
  }).join("");
  return `<div class="page-head"><h2>Tabungan keluarga</h2>` +
    `<p>Empat tujuan yang sedang dikejar bersama. Total terkumpul <b>${rupiah(totalSaved)}</b> ` +
    `dari target <b>${rupiah(totalTarget)}</b> (${pct(totalSaved, totalTarget)}). ` +
    `Klik tombol tambah untuk menyetor — saldo langsung bertambah.</p></div>` +
    `<div class="grid grid-2">${cards}</div>` +
    `<section class="card" style="margin-top:1rem"><h3>Tambah tujuan baru</h3>` +
    `<form id="addGoalForm" class="form-grid">` +
    `<label>Nama tujuan<input type="text" name="name" placeholder="cth. Dana pendidikan Dita" required maxlength="60"></label>` +
    `<label>Target (Rp)<input type="number" name="target" min="100000" step="100000" placeholder="10000000" required></label>` +
    `<label>Catatan<input type="text" name="note" placeholder="cth. Untuk tahun ajaran baru" maxlength="80"></label>` +
    `<span></span><span><button class="btn" type="submit">Buat tujuan tabungan</button></span>` +
    `</form></section>`;
}

export function viewReports(S, M) {
  const history = HISTORY.map((h) => ({
    ...h,
    spent: h.month === S.month ? M.spent : h.spent,
    label: (MONTHS.find((m) => m.id === h.month) || { label: h.month }).label.split(" ")[0],
  }));
  const avgSpent = Math.round(history.reduce((s, h) => s + h.spent, 0) / history.length);
  const topCat = [...M.byCat].sort((a, b) => b.spent - a.spent)[0];
  const prev = history[history.length - 2];
  const change = prev ? M.spent - prev.spent : 0;
  const catRows = [...M.byCat].sort((a, b) => b.spent - a.spent).map(({ cat, spent, budget }) =>
    `<tr><td>${esc(cat.name)}</td><td class="num">${rupiah(spent)}</td>` +
    `<td class="num">${rupiah(budget)}</td><td class="num">${pct(spent, M.spent)} dari total</td>` +
    `<td class="num ${spent > budget ? "neg" : "pos"}">${spent > budget ? `lewat ${rupiah(spent - budget)}` : `sisa ${rupiah(budget - spent)}`}</td></tr>`).join("");
  return `<div class="page-head"><h2>Laporan ${esc(S.monthLabel)}</h2>` +
    `<p>Enam bulan terakhir dalam satu pandangan: pemasukan stabil, pengeluaran bergerak. ` +
    `Agustus paling tinggi karena awal tahun ajaran — SPP, seragam, dan buku.</p></div>` +
    `<div class="grid grid-4">` +
    statCard("Rata-rata belanja / bulan", rupiah(avgSpent), "6 bulan terakhir") +
    statCard("Kategori terbesar", rupiah(topCat.spent), topCat.cat.name, "warn") +
    statCard("vs Oktober", (change >= 0 ? "+" : "−") + rupiah(Math.abs(change)), change >= 0 ? "lebih boros dari bulan lalu" : "lebih hemat dari bulan lalu", change >= 0 ? "warn" : "good") +
    statCard("Tabungan 6 bulan", rupiah(history.reduce((s, h) => s + (h.income - h.spent), 0)), "pemasukan dikurangi belanja") +
    `</div>` +
    `<section class="card" style="margin-top:1rem"><h3>Pemasukan vs pengeluaran — Juni s.d. November 2026</h3>` +
    barChart(history.map((h) => ({ label: h.label, income: h.income, spent: h.spent }))) +
    `<p class="hint">November dihitung dari buku kas (bukan perkiraan): ${rupiahShort(M.spent)} dari ${history.length} transaksi.</p></section>` +
    `<section class="card" style="margin-top:1rem"><h3>Belanja per kategori — ${esc(S.monthLabel)}</h3>` +
    `<table><thead><tr><th>Kategori</th><th class="num">Terpakai</th><th class="num">Anggaran</th>` +
    `<th class="num">Bagian</th><th class="num">Status</th></tr></thead><tbody>${catRows}</tbody></table></section>` +
    `<section class="card" style="margin-top:1rem"><h3>Yang bisa dilakukan bulan depan</h3>` +
    `<ul><li><b>${esc(topCat.cat.name)}</b> adalah pos terbesar (${rupiah(topCat.spent)}). ` +
    `Belanja pasar dua kali seminggu dengan daftar belanja bisa memangkas sekitar Rp 200.000.</li>` +
    `<li>Makan di luar ${rupiah(M.byCat.find((x) => x.cat.id === "makan").spent)} — masak di rumah ` +
    `dua malam ekstra per minggu menghemat sekitar Rp 150.000.</li>` +
    `<li>Dengan sisa ${rupiah(M.remaining)}, pindahkan Rp 1.000.000 ke dana darurat begitu gajian tiba, ` +
    `sebelum uangnya terpakai untuk hal lain.</li></ul></section>`;
}
