// Lumbung data: the Wijaya household ledger.
// Every figure on the site is computed from this file — no totals are typed twice.
// Household: Budi (ayah, guru) + Sari (ibu, perawat) + Dita (12) + Raka (8), Bandung.
// Month shown: November 2026. All amounts in Indonesian Rupiah.

export const HOUSEHOLD = {
  name: "Keluarga Wijaya",
  city: "Bandung",
  members: [
    { name: "Budi Wijaya", role: "Ayah · guru SMA" },
    { name: "Sari Wijaya", role: "Ibu · perawat" },
    { name: "Dita", role: "Anak · 12 tahun" },
    { name: "Raka", role: "Anak · 8 tahun" },
  ],
};

export const MONTHS = [
  { id: "2026-06", label: "Juni 2026" },
  { id: "2026-07", label: "Juli 2026" },
  { id: "2026-08", label: "Agustus 2026" },
  { id: "2026-09", label: "September 2026" },
  { id: "2026-10", label: "Oktober 2026" },
  { id: "2026-11", label: "November 2026" },
];

// Monthly income: two salaries + a small side income, steady all six months.
export const INCOME = [
  { label: "Gaji Budi (guru SMA)", amount: 8500000 },
  { label: "Gaji Sari (perawat)", amount: 7800000 },
  { label: "Les privat Budi (2 murid)", amount: 2200000 },
];

export const CATEGORIES = [
  { id: "belanja", name: "Belanja harian", color: "#357a52", budget: 3200000 },
  { id: "makan", name: "Makan di luar", color: "#c05b2e", budget: 900000 },
  { id: "transport", name: "Transport", color: "#3d7ea6", budget: 1100000 },
  { id: "rumah", name: "Rumah & listrik", color: "#7a5c08", budget: 1400000 },
  { id: "sekolah", name: "Sekolah anak", color: "#6a4fa3", budget: 1500000 },
  { id: "kesehatan", name: "Kesehatan", color: "#a83226", budget: 600000 },
  { id: "hiburan", name: "Hiburan", color: "#c98a2e", budget: 500000 },
  { id: "pakaian", name: "Pakaian", color: "#4f7a6a", budget: 400000 },
  { id: "sosial", name: "Sosial & hadiah", color: "#8a5a7a", budget: 400000 },
  { id: "lain", name: "Lain-lain", color: "#5d665c", budget: 300000 },
];

// Six months of history: income steady, spending varies (August: school year start).
export const HISTORY = [
  { month: "2026-06", income: 18500000, spent: 12840000 },
  { month: "2026-07", income: 18500000, spent: 13470000 },
  { month: "2026-08", income: 18500000, spent: 15230000 },
  { month: "2026-09", income: 18500000, spent: 12980000 },
  { month: "2026-10", income: 18500000, spent: 13120000 },
  { month: "2026-11", income: 18500000, spent: 0 }, // filled in from the ledger below
];

// November 2026 transactions. Positive = pemasukan, negative = pengeluaran.
// id, date (2026-11-DD), description, category, amount.
export const TRANSACTIONS = [
  { id: "t01", date: "2026-11-01", desc: "Gaji Budi (guru SMA)", cat: "gaji", amount: 8500000 },
  { id: "t02", date: "2026-11-01", desc: "Gaji Sari (perawat)", cat: "gaji", amount: 7800000 },
  { id: "t03", date: "2026-11-01", desc: "Les privat Budi — murid 1", cat: "gaji", amount: 1100000 },
  { id: "t04", date: "2026-11-02", desc: "Belanja pasar Cihapit (sayur, ayam, telur)", cat: "belanja", amount: -412000 },
  { id: "t05", date: "2026-11-02", desc: "Listrik PLN (token)", cat: "rumah", amount: -350000 },
  { id: "t06", date: "2026-11-03", desc: "Bensin motor (Pertalite 12 L)", cat: "transport", amount: -124000 },
  { id: "t07", date: "2026-11-03", desc: "SPP Dita — November", cat: "sekolah", amount: -650000 },
  { id: "t08", date: "2026-11-03", desc: "SPP Raka — November", cat: "sekolah", amount: -450000 },
  { id: "t09", date: "2026-11-04", desc: "Belanja mingguan Super Indo", cat: "belanja", amount: -538000 },
  { id: "t10", date: "2026-11-05", desc: "Makan malam keluarga — Warung Sunda", cat: "makan", amount: -187000 },
  { id: "t11", date: "2026-11-06", desc: "Ojek online ke sekolah (4x)", cat: "transport", amount: -96000 },
  { id: "t12", date: "2026-11-07", desc: "Internet IndiHome", cat: "rumah", amount: -315000 },
  { id: "t13", date: "2026-11-07", desc: "Les privat Budi — murid 2", cat: "gaji", amount: 1100000 },
  { id: "t14", date: "2026-11-08", desc: "Belanja pasar Cihapit (buah, ikan)", cat: "belanja", amount: -376000 },
  { id: "t15", date: "2026-11-09", desc: "Buku latihan & alat tulis Dita", cat: "sekolah", amount: -214000 },
  { id: "t16", date: "2026-11-09", desc: "Air PDAM", cat: "rumah", amount: -128000 },
  { id: "t17", date: "2026-11-10", desc: "Nonton bioskop (4 tiket)", cat: "hiburan", amount: -220000 },
  { id: "t18", date: "2026-11-11", desc: "Belanja mingguan Super Indo", cat: "belanja", amount: -461000 },
  { id: "t19", date: "2026-11-12", desc: "Kontrol gigi Raka", cat: "kesehatan", amount: -185000 },
  { id: "t20", date: "2026-11-13", desc: "Bensin motor (Pertalite 12 L)", cat: "transport", amount: -124000 },
  { id: "t21", date: "2026-11-14", desc: "Hadiah ulang tahun Nenek", cat: "sosial", amount: -250000 },
  { id: "t22", date: "2026-11-15", desc: "Belanja pasar Cihapit (daging, bumbu)", cat: "belanja", amount: -398000 },
  { id: "t23", date: "2026-11-15", desc: "Langganan Netflix (keluarga)", cat: "hiburan", amount: -186000 },
  { id: "t24", date: "2026-11-16", desc: "Makan siang — Soto Bandung", cat: "makan", amount: -94000 },
  { id: "t25", date: "2026-11-17", desc: "Servis motor (oli + kampas rem)", cat: "transport", amount: -287000 },
  { id: "t26", date: "2026-11-18", desc: "Belanja mingguan Super Indo", cat: "belanja", amount: -502000 },
  { id: "t27", date: "2026-11-18", desc: "Obat flu & vitamin keluarga", cat: "kesehatan", amount: -132000 },
  { id: "t28", date: "2026-11-19", desc: "Seragam olahraga Raka", cat: "pakaian", amount: -175000 },
  { id: "t29", date: "2026-11-20", desc: "Makan malam — Ayam Goreng Suharti", cat: "makan", amount: -164000 },
  { id: "t30", date: "2026-11-21", desc: "Belanja pasar Cihapit (sayur, tempe)", cat: "belanja", amount: -289000 },
  { id: "t31", date: "2026-11-22", desc: "Iuran arisan RT", cat: "sosial", amount: -100000 },
  { id: "t32", date: "2026-11-23", desc: "Bensin motor (Pertalite 12 L)", cat: "transport", amount: -124000 },
  { id: "t33", date: "2026-11-24", desc: "Les renang Dita (bulanan)", cat: "sekolah", amount: -300000 },
  { id: "t34", date: "2026-11-25", desc: "Belanja mingguan Super Indo", cat: "belanja", amount: -445000 },
  { id: "t35", date: "2026-11-25", desc: "Pulsa & paket data (2 nomor)", cat: "rumah", amount: -220000 },
  { id: "t36", date: "2026-11-26", desc: "Kue ulang tahun Raka (pesan)", cat: "sosial", amount: -185000 },
  { id: "t37", date: "2026-11-26", desc: "Makan malam — Mie Kocok", cat: "makan", amount: -128000 },
  { id: "t38", date: "2026-11-27", desc: "Sepatu sekolah Dita", cat: "pakaian", amount: -260000 },
  { id: "t39", date: "2026-11-27", desc: "Tiket kereta — kunjungan ke Garut", cat: "transport", amount: -156000 },
  { id: "t40", date: "2026-11-28", desc: "Belanja pasar Cihapit (mingguan)", cat: "belanja", amount: -341000 },
  { id: "t41", date: "2026-11-28", desc: "Langganan Spotify keluarga", cat: "hiburan", amount: -79000 },
  { id: "t42", date: "2026-11-29", desc: "Donasi masjid (Jumat)", cat: "sosial", amount: -50000 },
];

// Recurring bills & subscriptions. dueDay = day of month; paid = already paid this month.
export const BILLS = [
  { id: "b1", name: "Listrik PLN", amount: 350000, dueDay: 5, paid: true, auto: true },
  { id: "b2", name: "Internet IndiHome", amount: 315000, dueDay: 7, paid: true, auto: true },
  { id: "b3", name: "Air PDAM", amount: 128000, dueDay: 10, paid: true, auto: false },
  { id: "b4", name: "SPP Dita + Raka", amount: 1100000, dueDay: 3, paid: true, auto: true },
  { id: "b5", name: "BPJS Kesehatan (4 jiwa)", amount: 140000, dueDay: 10, paid: false, auto: true },
  { id: "b6", name: "Netflix keluarga", amount: 186000, dueDay: 15, paid: true, auto: true },
  { id: "b7", name: "Spotify keluarga", amount: 79000, dueDay: 28, paid: true, auto: true },
  { id: "b8", name: "Iuran RT & kebersihan", amount: 75000, dueDay: 20, paid: false, auto: false },
];

// Savings goals. saved = already saved, target = goal.
export const GOALS = [
  { id: "g1", name: "Dana darurat", saved: 12500000, target: 20000000, note: "6 bulan pengeluaran pokok" },
  { id: "g2", name: "Liburan keluarga — Yogyakarta", saved: 2400000, target: 5000000, note: "Berangkat Juni 2027" },
  { id: "g3", name: "Laptop baru Dita", saved: 1800000, target: 6500000, note: "Untuk belajar & tugas sekolah" },
  { id: "g4", name: "Renovasi dapur", saved: 900000, target: 8000000, note: "Ganti kompor & wastafel" },
];
