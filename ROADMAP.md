# 🗺️ ROADMAP PENGEMBANGAN PROYEK KKN — DESA KAWASI & SOLIGI

> **Prinsip:** One step at a time. Page by page. Fitur by fitur. Backend dulu → Test → Security → Frontend.

---

## FASE 0: SETUP & KONFIGURASI AWAL ✅

- [x] **0.1** Init project Next.js (sudah selesai)
- [ ] **0.2** Install dependencies tambahan (Supabase, Slugify, dll)
- [ ] **0.3** Setup environment variables (.env.local)
- [ ] **0.4** Setup Supabase project & credentials
- [ ] **0.5** Konfigurasi Tailwind theme (warna, font)
- [ ] **0.6** Setup folder structure sesuai context.txt

---

## FASE 1: DATABASE & BACKEND (SUPABASE)

### 1. SETUP DATABASE SUPABASE
- [ ] **1.1** Buat project Supabase baru
- [ ] **1.2** Jalankan SQL migration — tabel `villages`
- [ ] **1.3** Jalankan SQL migration — tabel `village_statistics`
- [ ] **1.4** Jalankan SQL migration — tabel `news`
- [ ] **1.5** Jalankan SQL migration — tabel `culture_articles`
- [ ] **1.6** Jalankan SQL migration — tabel `galleries`
- [ ] **1.7** Jalankan SQL migration — tabel `kkn_members`
- [ ] **1.8** Jalankan SQL migration — tabel `kkn_journals`
- [ ] **1.9** Jalankan SQL migration — tabel `kkn_journal_images`
- [ ] **1.10** Jalankan SQL migration — tabel `kkn_documentations`
- [ ] **1.11** Jalankan SQL migration — tabel `users`

### 2. SEED DATA (DATA AWAL)
- [ ] **2.1** Insert data desa: Kawasi & Soligi
- [ ] **2.2** Insert statistik desa (dummy dulu)

### 3. ROW LEVEL SECURITY (RLS)
- [ ] **3.1** Enable RLS di semua tabel
- [ ] **3.2** Policy: Public SELECT (read-only) — semua tabel
- [ ] **3.3** Policy: Authenticated + admin role → INSERT/UPDATE/DELETE
- [ ] **3.4** Test RLS policies (via Supabase SQL editor)
- [ ] **3.5** Test akses public (harus bisa read)
- [ ] **3.6** Test akses tanpa auth (harus gagal write)

### 4. BACKEND API ROUTES (NEXT.JS API)
- [ ] **4.1** Setup Supabase client (server & browser)
- [ ] **4.2** API Route: GET `/api/villages` — ambil semua desa
- [ ] **4.3** API Route: GET `/api/villages/:slug` — ambil 1 desa
- [ ] **4.4** API Route: GET `/api/news` — ambil semua berita
- [ ] **4.5** API Route: GET `/api/news/:desa` — berita per desa
- [ ] **4.6** API Route: GET `/api/news/:desa/:slug` — detail berita
- [ ] **4.7** API Route: GET `/api/culture` — ambil semua artikel budaya
- [ ] **4.8** API Route: GET `/api/culture/:slug` — detail budaya
- [ ] **4.9** API Route: GET `/api/gallery` — ambil semua galeri
- [ ] **4.10** API Route: GET `/api/kkn/members` — profil anggota
- [ ] **4.11** API Route: GET `/api/kkn/journals` — jurnal KKN
- [ ] **4.12** API Route: GET `/api/kkn/journals/:slug` — detail jurnal
- [ ] **4.13** API Route: GET `/api/kkn/documentations` — dokumentasi KKN
- [ ] **4.14** CORS & Error Handling di semua API

---

## FASE 2: BACKEND — ADMIN CRUD & AUTH 🔐

### 1. SUPABASE AUTH
- [ ] **2.1** Setup Auth project di Supabase Dashboard
- [ ] **2.2** Enable Google OAuth Provider
- [ ] **2.3** Setup middleware auth Next.js (middleware.ts)
- [ ] **2.4** Test login via Google
- [ ] **2.5** Test session management (SSR)
- [ ] **2.6** Test role checking (admin vs viewer)

### 2. ADMIN CRUD API (Protected)
- [ ] **2.7** API Route: POST `/api/admin/news` — buat berita
- [ ] **2.8** API Route: PUT `/api/admin/news/:id` — edit berita
- [ ] **2.9** API Route: DELETE `/api/admin/news/:id` — hapus berita
- [ ] **2.10** API Route: POST `/api/admin/culture` — buat artikel budaya
- [ ] **2.11** API Route: PUT `/api/admin/culture/:id` — edit budaya
- [ ] **2.12** API Route: DELETE `/api/admin/culture/:id` — hapus budaya
- [ ] **2.13** API Route: POST `/api/admin/gallery` — upload galeri
- [ ] **2.14** API Route: DELETE `/api/admin/gallery/:id` — hapus galeri
- [ ] **2.15** API Route: POST `/api/admin/kkn/journal` — buat jurnal
- [ ] **2.16** API Route: PUT `/api/admin/kkn/journal/:id` — edit jurnal
- [ ] **2.17** API Route: DELETE `/api/admin/kkn/journal/:id` — hapus jurnal
- [ ] **2.18** API Route: POST `/api/admin/kkn/documentation` — upload dokumentasi

### 3. FILE UPLOAD (STORAGE)
- [ ] **2.19** Setup Supabase Storage buckets (news, culture, gallery, kkn)
- [ ] **2.20** API Route: POST `/api/upload` — upload file ke Storage
- [ ] **2.21** Validasi ukuran file (max 1.5MB) di backend
- [ ] **2.22** Validasi tipe file (hanya image: jpg, png, webp)
- [ ] **2.23** Test upload & akses file publik

### 4. BACKEND TESTING & SECURITY
- [ ] **2.24** Test semua API routes dengan Postman/Insomnia/curl
- [ ] **2.25** Test auth: unauthenticated user tidak bisa akses /api/admin/*
- [ ] **2.26** Test RLS: langsung bypass API → tetap tidak bisa write tanpa auth
- [ ] **2.27** Test file upload: file > 1.5MB ditolak
- [ ] **2.28** Test file upload: file bukan image ditolak
- [ ] **2.29** Test XSS: input content berita dengan script tag → aman?
- [ ] **2.30** Test SQL injection: input aneh di form → aman? (Supabase parameterized, seharusnya aman)

---

## FASE 3: FRONTEND — LAYOUT & KOMPONEN REUSABLE

### 1. GLOBAL LAYOUT
- [ ] **3.1** Setup font (Inter/Playfair Display)
- [ ] **3.2** Konfigurasi Tailwind theme (warna tropical coastal)
- [ ] **3.3** Buat komponen Navbar/Header
- [ ] **3.4** Buat komponen Footer
- [ ] **3.5** Integrasikan ke layout.tsx

### 2. KOMPONEN REUSABLE
- [ ] **3.6** Skeleton Loader (loading.tsx)
- [ ] **3.7** Card component (berita, budaya, galeri)
- [ ] **3.8** Badge/Label component (label desa)
- [ ] **3.9** Button component (primary, secondary, danger)
- [ ] **3.10** Input/Form component
- [ ] **3.11** Image component dengan next/image

---

## FASE 4: FRONTEND — PUBLIC PAGES

### 1. BERANDA
- [ ] **4.1** `/` — Hero cinematic + preview sections

### 2. PROFIL DESA
- [ ] **4.2** `/profil/kawasi` — halaman profil Kawasi
- [ ] **4.3** `/profil/soligi` — halaman profil Soligi

### 3. BERITA
- [ ] **4.4** `/berita` — feed gabungan berita kedua desa
- [ ] **4.5** `/berita/kawasi` — berita khusus Kawasi
- [ ] **4.6** `/berita/soligi` — berita khusus Soligi
- [ ] **4.7** `/berita/kawasi/[slug]` — detail baca berita
- [ ] **4.8** `/berita/soligi/[slug]` — detail baca berita

### 4. BUDAYA
- [ ] **4.9** `/budaya` — katalog budaya Obi (filter kategori)
- [ ] **4.10** `/budaya/[slug]` — detail artikel budaya

### 5. GALERI
- [ ] **4.11** `/galeri` — masonry grid foto

### 6. PETA (PLACEHOLDER)
- [ ] **4.12** `/peta` — page kosong, komen "react-leaflet nanti"

### 7. FLORA & FAUNA
- [ ] **4.13** `/flora-fauna` — katalog visual kekayaan alam Obi

### 8. KAMUS OBI
- [ ] **4.14** `/kamus-obi` — kamus interaktif penerjemah

### 9. KKN HUB
- [ ] **4.15** `/kkn/profile` — profil anggota tim KKN
- [ ] **4.16** `/kkn/jurnal` — timeline blog diari
- [ ] **4.17** `/kkn/jurnal/[slug]` — detail jurnal + carousel foto
- [ ] **4.18** `/kkn/dokumentasi` — pusat foto operasional
- [ ] **4.19** `/kkn/hasil-proker` — etalase laporan capaian

---

## FASE 5: FRONTEND — ADMIN DASHBOARD

### 1. ADMIN LAYOUT
- [ ] **5.1** `/admin` — dashboard overview
- [ ] **5.2** Admin layout dengan sidebar navigasi
- [ ] **5.3** Protected route (redirect ke login jika belum auth)

### 2. ADMIN CRUD PAGES
- [ ] **5.4** `/admin/berita` — list + form input berita
- [ ] **5.5** `/admin/budaya` — list + form input budaya
- [ ] **5.6** `/admin/galeri` — list + upload foto
- [ ] **5.7** `/admin/kkn` — list + form jurnal & dokumentasi

### 3. ADMIN UX
- [ ] **5.8** Validasi form frontend
- [ ] **5.9** File size check sebelum upload (≤ 1.5MB)
- [ ] **5.10** Loading state, error state, success state
- [ ] **5.11** Konfirmasi delete
- [ ] **5.12** Image preview sebelum upload

---

## FASE 6: OPTIMASI & FINALISASI

- [ ] **6.1** ISR/Revalidation setup (`revalidate: 3600`)
- [ ] **6.2** SEO metadata tiap halaman
- [ ] **6.3** OpenGraph tags (thumbnail, judul, deskripsi)
- [ ] **6.4** Sitemap & robots.txt
- [ ] **6.5** Testing responsive (mobile, tablet, desktop)
- [ ] **6.6** Testing aksesibilitas (alt text, contrast, keyboard nav)
- [ ] **6.7** Final security review
- [ ] **6.8** Deploy (Vercel)

---

## 📋 STATUS PROGRESS

| Fase | Progress | Keterangan |
|------|----------|------------|
| 0. Setup | 🟡 In Progress | Init project selesai |
| 1. Database | ⬜ Belum | - |
| 2. Backend/Auth | ⬜ Belum | - |
| 3. Layout | ⬜ Belum | - |
| 4. Frontend Pages | ⬜ Belum | - |
| 5. Admin Dashboard | ⬜ Belum | - |
| 6. Optimasi | ⬜ Belum | - |

---

> 💡 **Cara Pakai:** Kita kerjakan satu per satu. Setiap step selesai → test → commit → lanjut step berikutnya.
> 
> Kalau ada yang mau diubah atau skip, bilang saja. Kita selalu update file ini.
