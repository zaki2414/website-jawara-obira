import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";

// .env.local dibaca supaya tes tahu flag seperti DISABLE_ADMIN_AUTH — tanpa
// ini tes guard /admin gagal karena alasan yang salah di mesin yang memakai
// bypass dev.
loadEnv({ path: ".env.local", quiet: true });

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

  // Server-nya dinyalakan Playwright sendiri di port terpisah (3100), supaya
  // tidak bentrok dengan `npm run dev` yang mungkin sedang jalan di 3000 —
  // atau dengan project LAIN yang kebetulan memakai 3000.
  webServer: {
    command: `npx next dev --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
