@AGENTS.md

# Jawara Obira — Panduan Proyek

Website profil desa/KKN "Jawara Obira". Stack: **Next.js 16 (App Router) + React 19 + TypeScript strict + Tailwind v4 + shadcn/ui (radix-sera) + Supabase + Framer Motion**.

Tema visual: **"Retro Heritage / Neobrutalist Archive"** — kertas arsip lama (aged paper), palet oseanik-tropis, tipografi serif heading + sans body, dan aksen *hard-shadow* brutalist. Dokumen ini adalah sumber kebenaran untuk arsitektur, design system, dan standar UI/UX proyek. **Ikuti ini untuk semua kode baru maupun refactor**, bukan hanya untuk fitur baru.

> Bagian bertanda **⚠ Utang Teknis** mendeskripsikan inkonsistensi yang sudah ada di kode saat ini (hasil audit — belum diperbaiki). Jangan tambah instance baru dari pola tersebut; kalau menyentuh file terkait, perbaiki sekalian ke arah aturan di bawah.

---

## 1. Arsitektur & Struktur Folder

### 1.1 App Router — pola wajib per route

Setiap route yang fetch data harus mengikuti pola **server-fetch + client-wrapper** yang sudah benar di `app/budaya/[slug]/page.tsx` → `CultureDetailClient.tsx` dan `app/umkm/[slug]/page.tsx` → `UMKMDetailClient.tsx`:

- `page.tsx` = **Server Component async**, `await params`/`searchParams`, fetch via helper di `lib/supabase/queries.ts`, panggil `notFound()` bila data kosong.
- Interaktivitas (state, event handler, animasi) dipindah ke child `"use client"` bernama `XxxClient.tsx` di folder yang sama atau di `components/<fitur>/`.
- **Jangan** taruh `"use client"` di level `page.tsx` kecuali halaman itu memang 100% interaktif tanpa data server (mis. form login).

⚠ **Utang Teknis**: `app/page.tsx`, `app/budaya/page.tsx`, `app/fauna-obi/page.tsx`, `app/toga/page.tsx`, `app/profil/page.tsx` masih full `"use client"`. Khusus `fauna-obi/page.tsx` dan `toga/page.tsx` melakukan fetch Supabase langsung di `useEffect` client-side — ini menghilangkan caching/SSR yang didapat rute lain lewat `revalidate`. Saat menyentuh halaman ini, migrasikan ke pola server-fetch + client-wrapper.

### 1.2 File convention wajib per route data

Next.js 16 mendukung `loading.tsx` dan `error.tsx` per-segment (lihat `node_modules/next/dist/docs/01-app`; `error.tsx` juga bisa menerima `unstable_retry()` selain `reset()`). Setiap folder route yang fetch data **wajib** punya:

- `loading.tsx` — skeleton, bukan spinner polos. Reuse `components/ui/skeleton.tsx`.
- `error.tsx` — boundary standar, bukan kartu error inline yang ditulis ulang di tiap page.
- `notFound()` dari `next/navigation` untuk data yang tidak ditemukan (sudah benar di beberapa `[slug]/page.tsx`, pertahankan).

⚠ **Utang Teknis**: hanya ada `loading.tsx` & `not-found.tsx` di root `app/`. Tidak ada satupun `loading.tsx`/`error.tsx` nested. `app/kkn/proker/page.tsx`, `app/kkn/tim/page.tsx`, `app/kkn/jurnal/page.tsx` masing-masing menulis ulang kartu error yang sama (`border-2 border-error rounded-xl ... hard-shadow-sm`, teks "Gagal Memuat …"). Saat menambah/mengubah route data, tambahkan `error.tsx`+`loading.tsx` alih-alih copy-paste kartu error.

### 1.3 Data fetching — satu jalur, bukan tiga

Semua query Supabase untuk Server Component **wajib** lewat helper di `lib/supabase/queries.ts` (bukan `createClient()` langsung di page). Untuk Client Component yang butuh data, buat/reuse custom hook di `hooks/` dengan bentuk seragam (lihat §4.2) — jangan `useEffect` + `createClient()` ad-hoc di dalam page.

⚠ **Utang Teknis**: ada 3 pola berbeda hidup berdampingan — (a) server + `queries.ts`, (b) custom hook (`useHomePageData`, `useCultureData`), (c) `useEffect` + `createClient()` inline (`app/fauna-obi/page.tsx`, `app/toga/page.tsx`, `app/login/page.tsx`). `hooks/useFaunaData.ts` sudah ada tapi **tidak pernah dipakai** — `fauna-obi/page.tsx` reimplementasi fetch yang sama secara manual. Saat memperbaiki halaman ini, pakai hook yang sudah ada, jangan bikin fetch baru.

`lib/supabase/queries.ts` (1019 baris, ~50 fungsi) mengulang boilerplate `try { const supabase = await createClient(); ... } catch { return { data: null, error: err } }` di setiap fungsi. Kalau menambah query baru, pertimbangkan wrapper generik (`safeQuery<T>()`) alih-alih copy blok try/catch lagi.

### 1.4 Struktur folder (state saat ini — pertahankan)

```
app/<route>/page.tsx        → Server Component, fetch via lib/supabase/queries.ts
app/<route>/XxxClient.tsx    → Client Component untuk interaktivitas
components/ui/               → primitif shadcn (server component kalau memungkinkan)
components/shared/           → benar-benar dipakai lintas fitur (background ornaments, dll)
components/<fitur>/          → komponen spesifik satu domain (budaya, umkm, fauna-obi, kkn, admin, profil, home, layout)
lib/supabase/{client,server}.ts → factory Supabase, JANGAN buat instance baru di tempat lain
lib/supabase/queries.ts      → satu-satunya tempat query Server Component
lib/auth.ts                  → getAdminUser() untuk guard admin
lib/animations.ts            → Framer Motion variants bersama
hooks/                        → custom hook fetch data untuk Client Component
constants/<domain>.ts         → data statis & types per domain (budaya, umkm, fauna, home, profil)
```

⚠ **Utang Teknis — komponen "shared" yang tidak shared**: `components/shared/` cuma berisi 1 file (`BackgroundOrnaments.tsx`), sementara ada **5 implementasi `AnimatedBackground` yang hampir identik** tersebar sendiri-sendiri di `components/budaya/`, `components/fauna-obi/`, `components/umkm/`, `components/umkm/detail/`, `components/home/` (pola blob-gradient sama, beda opacity/jumlah partikel). Begitu juga `FaunaCard`/`UMKMCard`, `FaunaEmptyState`/`UMKMEmptyState`, `FaunaSearchForm`/`UMKMSearchForm` — pasangan file yang isinya nyaris sama persis, beda ikon/copy. **Aturan ke depan**: kalau sebuah komponen dipakai identik (atau nyaris identik) di 2+ folder fitur, tempatnya di `components/shared/`, bukan diduplikasi. Konsolidasikan `AnimatedBackground` → satu `components/shared/AnimatedBackground.tsx` dengan props varian; konsolidasikan Card/EmptyState/SearchForm → `EntityCard`, `EntityEmptyState`, `EntitySearchForm` generik.

### 1.5 Konstanta — satu sumber kebenaran

Nav links, social links, dan data statis lain **wajib** hidup di `constants/`, diimpor oleh komponen — bukan hardcode di dalam komponen.

⚠ **Utang Teknis**: `components/layout/Navbar.tsx` (baris ~11–18) dan `components/layout/Footer.tsx` (baris ~40–43) masing-masing hardcode array link sendiri-sendiri, dan **daftarnya berbeda** meski sebagian overlap (`/budaya`, `/galeri`, `/kkn`). Tidak ada `constants/nav.ts`. Perbaikan: buat `constants/nav.ts` dengan satu `NAV_LINKS` (dan `FOOTER_LINKS` bila memang perlu subset berbeda), import di kedua tempat.

---

## 2. Design System

Semua token berikut **sudah didefinisikan** di [`app/globals.css`](app/globals.css) lewat `@theme` (Tailwind v4 CSS-first config — proyek ini **tidak** punya `tailwind.config.ts`, itu memang benar untuk Tailwind v4). Jangan buat token baru yang duplikatif; kalau butuh warna/ukuran baru, tambahkan di `@theme` blok ini, lalu pakai sebagai class Tailwind (`bg-primary`, `text-body-lg`, dst).

### 2.1 Warna — Retro Heritage (Oceanic)

| Token | Hex | Pemakaian |
|---|---|---|
| `--color-background` / `--color-surface` | `#fef9f2` | Latar utama (kertas krem) |
| `--color-primary` | `#006689` | Aksi utama, link, ring |
| `--color-primary-container` | `#51b8ea` | Aksen sekunder, dark-mode primary |
| `--color-on-primary` | `#fef9f2` | Teks di atas primary |
| `--color-secondary` | `#5e5e5e` | Teks sekunder, ikon netral |
| `--color-tertiary` | `#FEBE00` | Aksen kuning/emas, badge, highlight |
| `--color-cream` | `#E6D2B1` | Elemen dekoratif arsip |
| `--color-on-surface` | `#1d1c18` | Teks utama |
| `--color-on-surface-variant` | `#3e484e` | Teks sekunder |
| `--color-outline` / `--color-outline-variant` | `#6f787f` / `#bec8d0` | Border default |
| `--color-error` | `#ba1a1a` | Error state |

**Aturan**: pakai token semantik (`bg-primary`, `text-on-surface`, `border-error`) — **jangan** hex arbitrary (`bg-[#ef4444]`) atau skala legacy `ocean-*`/`sand-*`/`tropic-*` di kode baru (skala itu dipertahankan untuk backward-compat lama saja).

⚠ **Utang Teknis**: `Navbar.tsx` & `Footer.tsx` pakai `bg-[#ef4444]`/`text-[#ef4444]` (merah admin badge) alih-alih `--color-error`. `CalendarGrid.tsx` masih pakai `ocean-100/800`. Komponen di `components/admin/**` sama sekali di luar sistem token ini — pakai `bg-white`, `bg-green-600`, `bg-red-600`, `shadow-sm/lg`, `rounded-xl` polos Tailwind default. **Panel admin butuh unifikasi ke token di atas** sebagai pekerjaan terpisah (bukan bagian dari perbaikan halaman publik).

### 2.2 Tipografi

- Heading (`--font-heading` / `--font-serif`): **Libre Caslon Text** (serif, 400/700) — dipakai otomatis oleh semua `h1`–`h6` lewat `@layer base`.
- Body (`--font-sans`): **Work Sans** (400/500/600/700) — default `body`/`html`.
- Skala semantik (pakai sebagai `text-display-lg`, `text-headline-lg`, dst — bukan `text-4xl` arbitrary):

| Token | Ukuran | Weight | Penggunaan |
|---|---|---|---|
| `text-display-lg` | 48px / lh 1.1 | 700 | Hero headline |
| `text-headline-lg` | 32px / lh 1.2 | 700 | Judul section |
| `text-headline-md` | 24px / lh 1.3 | 600 | Sub-judul, judul kartu besar |
| `text-body-lg` | 18px / lh 1.6 | 400 | Lead paragraph |
| `text-body-md` | 16px / lh 1.6 | 400 | Body text (baseline, jangan lebih kecil dari ini untuk paragraf) |
| `text-label-md` | 14px / lh 1.2, tracking 0.05em | 600 | Label, badge, meta info |

**Aturan**: jangan pakai `text-[10px]`/`text-[11px]` arbitrary untuk label/badge — itu di bawah ambang keterbacaan (min. 12px untuk teks non-dekoratif, idealnya pakai `text-label-md` 14px). Body text minimal `text-body-md` (16px) sesuai baseline aksesibilitas.

⚠ **Utang Teknis**: `text-[10px]`/`text-[11px]` arbitrary tersebar di `HeroSection.tsx`, `KKNSection.tsx`, `CategoryFilterBar.tsx`, `HeaderSection.tsx`, `FaunaCard.tsx`, `UMKMCard.tsx` — konsolidasikan ke `text-label-md` atau tambahkan token `text-label-sm` resmi di `@theme` kalau ukuran itu memang perlu dipertahankan secara sengaja.

### 2.3 Spacing & Radius

- `--spacing-margin: 32px` (margin section), `--spacing-gutter: 24px` (gap grid/kartu) — pakai untuk konsistensi jarak antar-section, jangan angka acak per halaman.
- `--radius-xl: 0.75rem` untuk kartu besar; shadcn `--radius: 0.625rem` untuk primitif standar (button, input).
- Grid gap sebaiknya kelipatan 8px (Tailwind default scale) mengikuti guideline touch-spacing (§3.2).

### 2.4 Brutalist "Hard Shadow" system

Ini identitas visual inti proyek — **selalu pakai utility ini**, bukan `shadow-sm`/`shadow-md`/`shadow-lg` bawaan Tailwind, untuk semua kartu/panel bergaya arsip:

```css
.hard-shadow      /* 4px 4px 0px rgba(0,0,0,.9)  — default kartu */
.hard-shadow-sm   /* 2px 2px 0px rgba(0,0,0,.8)  — elemen kecil (badge, chip) */
.hard-shadow-md   /* 6px 6px 0px rgba(0,0,0,.9)  — kartu besar */
.hard-shadow-lg   /* 8px 8px 0px rgba(0,0,0,.95) — hero panel */
.hard-shadow-xl   /* 12px 12px 0px rgba(0,0,0,1) — showcase/feature utama */
.hard-shadow-primary /* 6px 6px 0px primary — varian aksen warna */
.hard-shadow-hover:hover  /* translate(-2px,-2px) + shadow lebih besar, transition 0.2s */
.press-effect:active      /* translate(2px,2px), shadow hilang — efek "ditekan" mekanis */
```

Border pendamping: `border-2` (kartu kecil/badge) atau `border-4` (kartu utama, panel hero) dengan `border-on-surface` atau `border-outline-variant` — **jangan campur `border` 1px polos** di komponen bergaya brutalist ini; itu melemahkan identitas visual.

⚠ **Utang Teknis**: `CultureCard.tsx` pakai `shadow-sm` polos padahal seharusnya `hard-shadow-sm`. Seluruh `components/admin/**` pakai `shadow-sm`/`shadow-lg` + `rounded-xl`/`rounded-lg` standar shadcn, bukan hard-shadow — ini kemungkinan **disengaja** (panel admin = utilitarian, bukan showcase publik), tapi perlu didokumentasikan sebagai keputusan sadar, bukan inkonsistensi tak sengaja. Kalau memang disengaja, catat di README admin folder; kalau tidak, unifikasi.

### 2.5 Tekstur & motif arsip

`.bg-aged-paper`, `.bg-natural-paper` (tekstur kertas), `Hiasan 1–5.svg` (ornamen dekoratif di `public/`) dipakai sebagai elemen dekoratif bertema arsip/heritage. Pertahankan pola ini untuk section hero/showcase; jangan ganti dengan gradient generik (lihat anti-pattern §3.4 — "generic gradient blur" bertentangan dengan identitas archive/heritage proyek ini).

---

## 3. UI/UX Guidelines

Prioritas mengikuti standar `ui-ux-pro-max`: **Accessibility > Touch/Interaction > Performance > Style Consistency > Responsive Layout > Typography/Color > Animation > Forms > Navigation**.

### 3.1 Komponen dasar — reuse, jangan reimplement

`components/ui/` adalah lapisan primitif shadcn (`card.tsx`, `badge.tsx`, `skeleton.tsx`, `MotionCard.tsx`, `FloatingCard.tsx`, `AnimatedBadge.tsx`). Komponen fitur **wajib compose dari sini**, bukan menulis ulang markup kartu/badge dari nol.

⚠ **Utang Teknis kritis**: `components/ui/card.tsx` dan `components/ui/badge.tsx` **tidak pernah diimpor di manapun** — `CultureCard.tsx`, `FaunaCard.tsx`, `UMKMCard.tsx` masing-masing reimplement kartu (`border-2 border-on-surface rounded-2xl hard-shadow`) dari nol secara independen. Juga **tidak ada `components/ui/button.tsx`** — setiap fitur menulis `<button className="...">` manual. **Prioritas perbaikan #1**: buat `components/ui/button.tsx` (varian primary/secondary/ghost, ukuran, disabled/loading state, hard-shadow + press-effect bawaan) dan migrasikan pemakaian tombol bertahap; sambungkan `CultureCard`/`FaunaCard`/`UMKMCard` ke `ui/card.tsx` + `ui/badge.tsx` yang sudah ada supaya tidak jadi kode mati.

Toast/notifikasi sukses juga terduplikasi verbatim di 6 file admin form (`fixed bottom-6 right-6 bg-green-600 ... shadow-lg`) — ekstrak jadi `components/ui/Toast.tsx` atau adopsi library toast (mis. `sonner`, sudah lazim dipakai dengan shadcn).

### 3.2 Aksesibilitas & Touch (prioritas tertinggi)

- Semua kontrol interaktif **wajib** elemen semantik (`<button>`, `<a>`) — **bukan** `<div onClick>`. Kalau terpaksa pakai div (drag-drop, dsb), wajib `role="button"`, `tabIndex={0}`, dan handler `onKeyDown` untuk Enter/Space.
- Semua icon-only button wajib `aria-label` deskriptif (pola benar sudah ada: `Navbar.tsx` mobile-menu toggle).
- Gambar dekoratif murni: `alt=""` **dan** `aria-hidden="true"` berpasangan (pola benar: `umkm/detail/BrandIdentityBackground.tsx`) — jangan `alt=""` tanpa `aria-hidden`.
- Target sentuh minimal **44×44px**, jarak antar-target minimal **8px** (Tailwind `gap-2`+).
- Focus ring wajib terlihat (`focus:ring-2 focus:ring-primary` atau setara) — jangan `outline-none` tanpa pengganti.
- Kontras teks minimal 4.5:1 terhadap background.

⚠ **Utang Teknis**: `ImageUploader.tsx`, `ExtraImageUploader.tsx` (admin) pakai `<div onClick>` sebagai file-picker trigger tanpa `role`/`tabIndex`/keyboard handler — tidak bisa diakses via keyboard. `CalendarGrid.tsx` sama untuk sel tanggal & tombol tutup modal. `profil/HeroSection.tsx` dan `AtlasBackground.tsx` punya `alt=""` tanpa `aria-hidden="true"` yang konsisten. `badge.tsx` pakai `text-[0.625rem]` (10px) — di bawah batas keterbacaan.

### 3.3 Layout & Responsive

- Mobile-first: desain dari breakpoint terkecil ke atas, uji minimal di **375px, 768px, 1024px, 1440px**.
- Tidak boleh ada horizontal scroll tak sengaja — semua container lebar (tabel, galeri) pakai `overflow-x-auto` sendiri, bukan bikin body melebar.
- Grid kartu: konsisten `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (atau sejenis) — kalau pola ini terulang di 3+ halaman, ekstrak jadi `components/shared/CardGrid.tsx`.

⚠ **Utang Teknis**: grid kartu diimplementasi ulang manual di `kkn/proker/page.tsx`, `kkn/tim/page.tsx`, `toga/page.tsx`, `fauna-obi/page.tsx`. Tidak ada komponen `Pagination` di manapun — semua listing render full result set; untuk data yang akan bertambah banyak (berita, jurnal KKN), ini akan jadi masalah performa/UX, pertimbangkan infinite-scroll atau pagination saat listing mulai panjang.

### 3.4 Visual Hierarchy & Style Consistency

- Header/hero section per halaman listing sebaiknya konsisten lewat komponen bersama (`HeaderSection` di `components/budaya` sudah pola yang benar) — jangan hand-roll `font-serif text-4xl ... border-b-4` ulang per halaman seperti di `kkn/proker`, `berita`, `kkn/tim`.
- Ikon: pakai SVG (`lucide-react`, sudah jadi dependency) — **jangan emoji sebagai ikon fungsional** (emoji 💡 di empty-state boleh sebagai elemen dekoratif/playful, tapi bukan pengganti ikon navigasi/status).
- Satu section = maksimal 1–2 elemen beranimasi utama; jangan animasikan semua elemen sekaligus (lihat §3.5).

### 3.5 Micro-interactions / Framer Motion

`lib/animations.ts` sudah menyediakan variants bersama (`fadeInUp`, `fadeIn`, `staggerContainer`, `scaleIn`, `wordByWord`, `floatAnimation`, `pulseAnimation`) — **selalu reuse dari sini**, jangan definisikan inline `variants={{ ... }}` baru per komponen kecuali kasusnya benar-benar unik.

- Durasi transisi: 150–300ms untuk interaksi (hover, tap), lebih panjang (400–800ms) hanya untuk entrance animation besar (hero, section reveal).
- Easing: `ease-out` untuk elemen masuk, `ease-in` untuk elemen keluar — hindari `linear` untuk transisi UI.
- **Wajib** hormati `prefers-reduced-motion` — Framer Motion punya `useReducedMotion()` hook bawaan; pakai untuk menonaktifkan/mengurangi animasi dekoratif (background blobs, parallax) saat user mengaktifkan preferensi ini di OS.
- Animasi infinite (`animate-pulse`, `animate-spin`) hanya untuk loading indicator, bukan elemen dekoratif.
- Hover/press: pertahankan pola `hard-shadow-hover` + `press-effect` yang sudah konsisten dipakai — ini bagian dari identitas brutalist, bukan sekadar micro-interaction generik.

⚠ **Utang Teknis**: belum ditemukan penggunaan `useReducedMotion()`/`prefers-reduced-motion` di manapun di codebase — 65 dari ~69 file di `components/` adalah `"use client"` dengan Framer Motion. Tambahkan guard ini terutama di komponen `AnimatedBackground` (blob animation kontinu) yang paling berisiko untuk motion sensitivity.

### 3.6 Loading & Empty States

- Loading: pakai `components/ui/skeleton.tsx` yang match bentuk konten asli (bukan spinner generik) untuk konten utama; spinner boleh untuk aksi singkat (submit form).
- Empty state: ikon/ilustrasi + pesan jelas + (opsional) CTA/saran — pola di `FaunaEmptyState.tsx`/`UMKMEmptyState.tsx` sudah bagus secara desain, tinggal dikonsolidasi jadi satu komponen generik (lihat §1.4).
- Error state: pesan actionable ("Gagal memuat data, coba lagi") + tombol retry, bukan sekadar teks statis — idealnya via `error.tsx` dengan `reset()`/`unstable_retry()` (§1.2), bukan kartu inline.

---

## 4. Aturan Coding

### 4.1 TypeScript

`tsconfig.json` sudah `"strict": true` — pertahankan. Aturan tambahan:

- **Jangan** pakai `any` untuk parameter/return type. Untuk `catch (err)`, tipe defaultnya `unknown` — narrow dengan `err instanceof Error` sebelum akses `.message`, jangan `catch (err: any)`.
- Untuk data dari Supabase, define/​reuse type di `constants/<domain>.ts` (pola yang sudah ada) atau generate type dari schema Supabase — jangan `any` sebagai jalan pintas.

⚠ **Utang Teknis**: 35 pemakaian `: any`/`<any>`/`as any` ditemukan di `lib/`, `hooks/`, `components/` — termasuk semua `catch (err: any)` di `hooks/useFaunaData.ts`, `hooks/useCultureData.ts`, `lib/supabase/queries.ts`, dan `parseJsonField(value: any): any[]` di `KKNSection.tsx`. Prioritaskan mengganti `catch (err: any)` → `catch (err: unknown)` dengan narrowing saat menyentuh file-file ini.

### 4.2 Custom hooks — bentuk seragam

Hook fetch data di `hooks/` wajib mengikuti bentuk yang sama:

```ts
function useXxxData(...) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // wajib, jangan di-skip
  // fetch di useEffect, createClient() dari @/lib/supabase/client
  // return { data, loading, error }
}
```

⚠ **Utang Teknis**: `useHomePageData.ts` tidak punya `error` state sama sekali — error hanya `console.error` dan ditelan, caller tidak tahu fetch gagal. `useFaunaData.ts` filter data di dalam effect fetch; `useCultureData.ts` filter di effect terpisah. Ketiganya reimplementasi scaffolding `loading`/`useEffect`/`createClient()` yang sama. Kalau menambah hook baru atau menyentuh salah satu dari tiga ini, pertimbangkan ekstrak `useSupabaseQuery<T>()` generik dan pastikan `error` state selalu ada.

### 4.3 Komponen modular

- Satu file = satu komponen bertanggung jawab tunggal. Kalau sebuah `page.tsx` sudah >150 baris campur data-fetch + markup kompleks, pecah markup ke `components/<fitur>/`.
- `"use client"` hanya di titik paling bawah pohon komponen yang benar-benar butuh interaktivitas/hook browser — biarkan parent tetap Server Component kalau bisa.
- Props wajib bertipe eksplisit (interface/type), tidak inferred dari default value saja.

### 4.4 Metadata / SEO

Setiap `page.tsx` yang render konten publik unik (detail budaya, UMKM, fauna, berita, jurnal KKN) **wajib** export `generateMetadata()` dengan title/description sesuai kontennya.

⚠ **Utang Teknis**: saat ini **nol** halaman (selain root `layout.tsx`) yang punya metadata — semua route dinamis berbagi title/description statis dari layout. Ini gap SEO signifikan untuk situs konten publik; tambahkan `generateMetadata` saat menyentuh halaman detail manapun.

### 4.5 Supabase

- Server Component/Route Handler: `createClient()` dari `lib/supabase/server.ts`, **lewat** `lib/supabase/queries.ts` — jangan panggil `createClient()` langsung di dalam `page.tsx` kalau query yang sama sudah ada di `queries.ts`.
- Client Component: `createClient()` dari `lib/supabase/client.ts`, idealnya dibungkus custom hook (§4.2), bukan inline di komponen.
- `lib/auth.ts` (`getAdminUser()`) adalah satu-satunya cara guard halaman admin — jangan reimplement cek role di tempat lain.

---

## 5. Urutan Prioritas Perbaikan (kalau mulai refactor bertahap)

1. Buat `components/ui/button.tsx` + sambungkan `ui/card.tsx`/`ui/badge.tsx` ke `CultureCard`/`FaunaCard`/`UMKMCard` (§3.1) — dampak visual & maintainability terbesar.
2. Konsolidasi `AnimatedBackground` × 5, `EmptyState` × 2, `SearchForm` × 2 ke `components/shared/` (§1.4).
3. `constants/nav.ts` untuk `Navbar`/`Footer` (§1.5) — kecil tapi mencegah link menyimpang lebih jauh.
4. Tambah `loading.tsx`+`error.tsx` per route data, hapus kartu error inline yang diduplikasi (§1.2).
5. Tambah `generateMetadata` di semua halaman detail (§4.4).
6. Ganti `catch (err: any)` → `unknown` + narrowing di hooks & `queries.ts` (§4.1).
7. Audit `prefers-reduced-motion` di komponen `AnimatedBackground`/dekoratif (§3.5).
8. Keputusan sadar: unifikasi panel admin ke design token, atau dokumentasikan sebagai sistem terpisah yang disengaja (§2.1, §2.4).

Jangan kerjakan semua sekaligus dalam satu PR besar — tiap poin di atas independen dan bisa jadi PR/commit terpisah.
