import { defineConfig, devices } from "@playwright/test";

// Konfigurasi minimal, sengaja. Yang dibutuhkan situs ini bukan piramida tes,
// tapi SATU jaring pengaman: memastikan setiap halaman publik benar-benar
// membalas 200 dan merender isinya. Kelas bug yang paling sering muncul di
// proyek ini adalah query yang gagal diam-diam — halaman tetap 200, tapi
// seksinya hilang tanpa error (lihat TODO & CLAUDE.md §6). Tes di bawah
// menangkap persis itu.
const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3100);

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  // Dijalankan di mode PRODUKSI, bukan dev, karena dua alasan:
  //
  // 1. Next 16 menolak menyalakan dev server kedua untuk direktori yang sama
  //    ("Another next dev server is already running"). Dengan `next dev`,
  //    `npm test` jadi gagal setiap kali kamu kebetulan sedang `npm run dev` —
  //    persis kondisi paling normal saat orang ingin menjalankan tes.
  // 2. Yang ingin dijamin tes ini adalah perilaku yang benar-benar ter-deploy:
  //    ISR, security header, dan sanitasi berjalan di jalur produksi.
  //
  // Port 3100 dipakai supaya tidak bentrok dengan dev server di 3000/3001,
  // maupun dengan project lain yang kebetulan memakai port itu.
  webServer: {
    command: `npm run build && npx next start --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
