import { test, expect, type Page } from "@playwright/test";

// Halaman publik + satu penanda isi yang HARUS ada di masing-masing.
// Penanda-nya sengaja bukan sekadar "ada <body>": tiap seksi utama halaman ini
// digerbangi `{data.length > 0 && ...}`, jadi kalau query-nya gagal, halaman
// tetap 200 tapi seksinya lenyap tanpa jejak. Penanda inilah yang menangkapnya.
const PAGES: Array<{ path: string; heading: RegExp }> = [
  { path: "/", heading: /jawara obira|kawasi|soligi/i },
  { path: "/profil", heading: /profil|desa/i },
  { path: "/budaya", heading: /budaya|kebudayaan/i },
  { path: "/umkm", heading: /umkm|usaha/i },
  { path: "/toga", heading: /toga|tanaman obat/i },
  { path: "/fauna-obi", heading: /fauna/i },
  { path: "/galeri", heading: /galeri/i },
  { path: "/kkn", heading: /kkn/i },
  // \s* karena judulnya dipecah dua elemen ("Program" / "Kerja"), jadi
  // textContent-nya menyatu tanpa spasi.
  { path: "/kkn/proker", heading: /program\s*kerja|proker/i },
  { path: "/kkn/jurnal", heading: /jurnal/i },
  { path: "/kkn/tim", heading: /tim/i },
];

// Error konsol yang TIDAK menandakan kerusakan halaman, jadi diabaikan:
// warning React dev-mode, request gambar pihak ketiga yang lambat, dsb.
const IGNORED_CONSOLE = [
  /Download the React DevTools/i,
  /Warning:.*validateDOMNesting/i,
  /favicon/i,
];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (IGNORED_CONSOLE.some((re) => re.test(text))) return;
    errors.push(text);
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}

for (const { path, heading } of PAGES) {
  test(`halaman publik ${path} tampil utuh`, async ({ page }) => {
    const errors = collectErrors(page);

    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), `${path} harus membalas 200`).toBe(200);

    // Judul halaman terisi — bukan kerangka kosong.
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("body")).toContainText(heading, { timeout: 15_000 });

    // Tidak ada scroll horizontal tak sengaja di lebar desktop.
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflows, `${path} tidak boleh scroll horizontal`).toBe(false);

    expect(errors, `${path} error konsol: ${errors.join(" | ")}`).toHaveLength(0);
  });
}

test("halaman publik juga utuh di lebar ponsel", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const { path } of PAGES) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), `${path} (mobile) harus 200`).toBe(200);
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflows, `${path} scroll horizontal di 375px`).toBe(false);
  }
});

test("/admin menolak pengunjung yang belum login", async ({ page }) => {
  // Tes ini justru SALAH SATU alasan webServer dijalankan di mode produksi:
  // bypass DISABLE_ADMIN_AUTH di-gate ganda ke NODE_ENV === "development"
  // (CLAUDE.md §6.2), jadi di `next start` ia tidak pernah aktif walaupun
  // flag-nya ada di .env.local. Artinya guard yang diuji di sini adalah guard
  // yang benar-benar berlaku di deploy.
  const response = await page.goto("/admin", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBeLessThan(400);
  // proxy.ts harus mengalihkan ke /login, bukan menampilkan dashboard.
  expect(page.url()).toContain("/login");
});

// Penjaga regresi untuk bug off-by-one zona waktu di getKKNJournalsByMonth.
//
// endDate bulan dulu dihitung `new Date(year, month, 0).toISOString()`, yang
// membuat tengah malam waktu LOKAL lalu mengubahnya ke UTC — di UTC+7 itu
// mundur satu hari, jadi HARI TERAKHIR SETIAP BULAN hilang dari kalender tanpa
// error apa pun. Lebih licin lagi: benar di server UTC (Vercel), salah di
// laptop Indonesia, jadi ia tidak akan pernah muncul di CI.
//
// Tes ini bergantung pada adanya entri di 30 Juni 2026 (ada: "Piala Dunia,
// Sunset, dan Nasi Goreng yang Chaotic", Desa Kawasi). Kalau entri itu suatu
// saat dihapus, ganti jangkarnya ke tanggal terakhir bulan lain yang berisi —
// jangan hapus tesnya.
test("kalender jurnal memuat hari TERAKHIR bulan, bukan memotongnya", async ({ page }) => {
  await page.goto("/kkn/jurnal?year=2026&month=6&desa=kawasi", {
    waitUntil: "domcontentloaded",
  });

  const lastDayTile = page.locator('a[href^="/kkn/jurnal/"]').filter({ hasText: "30" });
  await expect(
    lastDayTile.first(),
    "30 Juni harus tampil sebagai entri, bukan sel kosong",
  ).toBeVisible({ timeout: 15_000 });

  await expect(page.locator("body")).toContainText(/piala dunia/i);
});

test("entri gabungan (village_id NULL) muncul di kedua filter desa", async ({ page }) => {
  // Satu entri untuk hari ketika kedua tim bergerak bareng harus terlihat dari
  // sisi Kawasi MAUPUN Soligi — itu seluruh gunanya opsi "Umum / Kedua Desa",
  // supaya foto yang sama tidak perlu diunggah dua kali.
  const slug = "terombang-ambing-di-langit-sulawesi-kawasi";
  for (const desa of ["kawasi", "soligi"]) {
    await page.goto(`/kkn/jurnal?year=2026&month=6&desa=${desa}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.locator(`a[href="/kkn/jurnal/${slug}"]`).first(),
      `entri gabungan harus muncul di filter ${desa}`,
    ).toBeVisible({ timeout: 15_000 });
  }

  // Dan halamannya menandai dirinya sebagai kegiatan gabungan, bukan
  // membiarkan badge desanya kosong.
  await page.goto(`/kkn/jurnal/${slug}`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).toContainText("Kedua Desa");
});

test("robots.txt & sitemap.xml tersedia", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Sitemap:");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("<urlset");
});

test("security header terpasang", async ({ request }) => {
  const res = await request.get("/");
  const headers = res.headers();
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
});
