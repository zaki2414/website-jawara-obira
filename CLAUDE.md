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

Semua halaman publik sudah mengikuti pola ini. Satu-satunya `page.tsx` yang masih `"use client"` adalah `app/login/page.tsx`, dan itu memang form murni tanpa data server — biarkan.

### 1.2 File convention wajib per route data

Next.js 16 mendukung `loading.tsx` dan `error.tsx` per-segment (lihat `node_modules/next/dist/docs/01-app`; `error.tsx` juga bisa menerima `unstable_retry()` selain `reset()`). Setiap folder route yang fetch data **wajib** punya:

- `loading.tsx` — skeleton, bukan spinner polos. Reuse `components/ui/skeleton.tsx`.
- `error.tsx` — boundary standar, bukan kartu error inline yang ditulis ulang di tiap page.
- `notFound()` dari `next/navigation` untuk data yang tidak ditemukan (sudah benar di beberapa `[slug]/page.tsx`, pertahankan).

⚠ **Utang Teknis**: `loading.tsx` nested sudah ada di hampir semua route data (33 file), `error.tsx` di 21 route. Yang belum: `app/kkn/proker/`, `app/kkn/tim/`, `app/kkn/jurnal/` tidak punya `error.tsx` sama sekali dan masih menulis ulang kartu error yang sama di dalam `page.tsx` (`border-2 border-error ... hard-shadow-sm`, teks "Gagal Memuat …"). Saat menyentuh ketiganya, tambahkan `error.tsx` dan hapus kartu inline-nya.

### 1.3 Data fetching — satu jalur, bukan tiga

Semua query Supabase untuk Server Component **wajib** lewat helper di `lib/supabase/queries.ts` (bukan `createClient()` langsung di page). Untuk Client Component yang butuh data, buat/reuse custom hook di `hooks/` dengan bentuk seragam (lihat §4.2) — jangan `useEffect` + `createClient()` ad-hoc di dalam page.

Sekarang tinggal dua jalur, dan keduanya benar: Server Component lewat `queries.ts`, plus `app/login/page.tsx` yang memang form client. Ketiga hook fetch lama (`useHomePageData`, `useFaunaData`, `useCultureData`) sudah dihapus; `hooks/` hanya menyisakan `useCroppedImageUpload.ts`.

⚠ **Utang Teknis**: `lib/supabase/queries.ts` (1494 baris, 66 fungsi) mengulang boilerplate `try { const supabase = await createClient(); ... } catch { return { data: null, error: err } }` di setiap fungsi. Kalau menambah query baru, pertimbangkan wrapper generik `safeQuery<T>()` alih-alih menyalin blok try/catch lagi.

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

Konsolidasi ini **sudah dikerjakan**: `components/shared/` kini berisi 16 file (`AnimatedBackground`, `EntityCardShell`, `EntityEmptyState`, `EntitySearchForm`, `PageHero`, `PageFilterBar`, `PageOrnament`, `PageSkeleton`, `ScrollSpin`, `MouseDrift`, `Reveal`, dst), dan `FaunaEmptyState`/`UMKMEmptyState`/`UMKMSearchForm` tinggal adapter ~15 baris di atas komponen bersama itu — pola yang benar untuk copy/ikon yang beda per domain.

**Aturan ke depan tetap berlaku**: kalau sebuah komponen dipakai identik (atau nyaris identik) di 2+ folder fitur, tempatnya di `components/shared/` dengan props varian, bukan diduplikasi.

### 1.5 Konstanta — satu sumber kebenaran

Nav links, social links, dan data statis lain **wajib** hidup di `constants/`, diimpor oleh komponen — bukan hardcode di dalam komponen.

`constants/nav.ts` sudah jadi satu-satunya sumber `NAV_LINKS` dan `FOOTER_LINKS`, diimpor oleh `Navbar.tsx` dan `Footer.tsx`. Jangan hardcode array link baru di dalam komponen.

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
| `--color-herbal` / `--color-herbal-container` / `--color-on-herbal` | `#2f6b4f` / `#cfe4d5` / `#fef9f2` | Aksen domain TOGA (tanaman obat) |
| `--color-on-surface` | `#1d1c18` | Teks utama |
| `--color-on-surface-variant` | `#3e484e` | Teks sekunder |
| `--color-outline` / `--color-outline-variant` | `#6f787f` / `#bec8d0` | Border default |
| `--color-error` | `#ba1a1a` | Error state |

**Aturan**: pakai token semantik (`bg-primary`, `text-on-surface`, `border-error`) — **jangan** hex arbitrary (`bg-[#ef4444]`) atau skala legacy `ocean-*`/`sand-*`/`tropic-*` di kode baru (skala itu dipertahankan untuk backward-compat lama saja).

Warna per-domain halaman publik hidup di `constants/domainAccent.ts` (`DOMAIN_ACCENT`) — halaman listing mengambil aksennya dari sana, bukan memilih warna sendiri di dalam JSX. Aksen datang dari **bidang warna rata bertepi keras** (band/panel), bukan dari gradien wash beralpha rendah: biru dingin di atas kertas hangat `#fef9f2` menghasilkan abu keruh, dan gradien lembut bertentangan dengan dunia neobrutalist ini.

⚠ **Utang Teknis**: `Footer.tsx` masih memakai skala legacy `text-sand-500`/`text-tropic-500` di dua ikon. Selebihnya sudah bersih — badge admin sudah pakai `--color-error`, dan `components/admin/**` sudah memakai token yang sama dengan halaman publik (tidak ada lagi `bg-white`/`bg-green-600`/`bg-red-600`).

### 2.2 Tipografi

- Heading (`--font-heading` / `--font-serif`): **Abril Fatface** (display serif, **hanya bobot 400**) — dipakai otomatis oleh semua `h1`–`h6` lewat `@layer base`. Bobot tunggalnya memang sudah sangat berat; `globals.css` memasang `font-synthesis-weight: none` supaya `font-black` di markup tidak memicu penebalan sintetis yang menutup kontur huruf. Jadi `font-bold`/`font-black` pada heading **tidak** mengubah bentuknya — itu disengaja, jangan "diperbaiki".
- Body (`--font-sans`): **Plus Jakarta Sans** (400/500/600/700) — default `body`/`html`.
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

`text-[10px]`/`text-[11px]` arbitrary sudah **tidak ada lagi** di `app/` maupun `components/` — semua label memakai `text-label-md`. Jangan memperkenalkannya kembali.

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

Warna bayangannya **bukan hitam murni**: semua utility di atas memakai `--shadow-hard-rgb: 29 28 24` — tinta yang sama dengan `--color-on-surface`. Hitam pekat di sebelah kertas `#fef9f2` terbaca sebagai benda asing yang dingin. Kalau menulis bayangan baru, pakai `rgb(var(--shadow-hard-rgb) / …)`, jangan `rgb(0 0 0 / …)`.

**Keputusan sadar soal panel admin**: `components/admin/**` memakai token warna yang sama dengan halaman publik, tapi radius lebih lembut (`rounded-xl`/`rounded-2xl`). Itu disengaja — admin adalah alat kerja, bukan etalase. Jangan "menyeragamkannya" jadi identik dengan halaman publik.

### 2.5 Tekstur & motif arsip

`.bg-aged-paper`, `.bg-natural-paper` (tekstur kertas), `Hiasan 1–5.svg` (ornamen dekoratif di `public/`) dipakai sebagai elemen dekoratif bertema arsip/heritage. Pertahankan pola ini untuk section hero/showcase; jangan ganti dengan gradient generik (lihat anti-pattern §3.4 — "generic gradient blur" bertentangan dengan identitas archive/heritage proyek ini).

---

## 3. UI/UX Guidelines

Prioritas mengikuti standar `ui-ux-pro-max`: **Accessibility > Touch/Interaction > Performance > Style Consistency > Responsive Layout > Typography/Color > Animation > Forms > Navigation**.

### 3.1 Komponen dasar — reuse, jangan reimplement

`components/ui/` adalah lapisan primitif shadcn (`card.tsx`, `badge.tsx`, `skeleton.tsx`, `MotionCard.tsx`, `FloatingCard.tsx`, `AnimatedBadge.tsx`). Komponen fitur **wajib compose dari sini**, bukan menulis ulang markup kartu/badge dari nol.

⚠ **Utang Teknis**: `components/ui/card.tsx` **masih tidak pernah diimpor di manapun** — `CultureCard`/`FaunaCard`/`UMKMCard`/`TogaCard` sekarang compose dari `components/shared/EntityCardShell.tsx`, bukan dari primitif shadcn itu. Putuskan: sambungkan `EntityCardShell` ke `ui/card.tsx`, atau hapus `card.tsx` supaya tidak jadi kode mati.

Tiga utang lama di blok ini sudah lunas: `components/ui/button.tsx` sudah ada, `ui/badge.tsx` dipakai di 26 file, dan toast sudah diekstrak ke `components/ui/Toast.tsx` (dipakai 10 file) — jangan menulis ulang toast `fixed bottom-6 right-6` manual di form admin baru.

Toast/notifikasi sukses juga terduplikasi verbatim di 6 file admin form (`fixed bottom-6 right-6 bg-green-600 ... shadow-lg`) — ekstrak jadi `components/ui/Toast.tsx` atau adopsi library toast (mis. `sonner`, sudah lazim dipakai dengan shadcn).

### 3.2 Aksesibilitas & Touch (prioritas tertinggi)

- Semua kontrol interaktif **wajib** elemen semantik (`<button>`, `<a>`) — **bukan** `<div onClick>`. Kalau terpaksa pakai div (drag-drop, dsb), wajib `role="button"`, `tabIndex={0}`, dan handler `onKeyDown` untuk Enter/Space.
- Semua icon-only button wajib `aria-label` deskriptif (pola benar sudah ada: `Navbar.tsx` mobile-menu toggle).
- Gambar dekoratif murni: `alt=""` **dan** `aria-hidden="true"` berpasangan (pola benar: `umkm/detail/BrandIdentityBackground.tsx`) — jangan `alt=""` tanpa `aria-hidden`.
- Target sentuh minimal **44×44px**, jarak antar-target minimal **8px** (Tailwind `gap-2`+).
- Focus ring wajib terlihat (`focus:ring-2 focus:ring-primary` atau setara) — jangan `outline-none` tanpa pengganti.
- Kontras teks minimal 4.5:1 terhadap background.

⚠ **Utang Teknis**: tinggal 6 gambar dekoratif yang `alt=""` tanpa `aria-hidden="true"` — `home/StatsSection.tsx`, `budaya/CultureLeadEntry.tsx`, `admin/AdminOrnaments.tsx`, `admin/kkn/KKNJournalCalendar.tsx`, `shared/EntityCardShell.tsx`, `app/kkn/jurnal/page.tsx`. Selebihnya sudah beres: file-picker admin (`ImageUploader`/`ExtraImageUploader`) dan sel kalender sudah memakai `<button>` sungguhan, dan `badge.tsx` sudah naik ke `text-label-md`.

### 3.3 Layout & Responsive

- Mobile-first: desain dari breakpoint terkecil ke atas, uji minimal di **375px, 768px, 1024px, 1440px**.
- Tidak boleh ada horizontal scroll tak sengaja — semua container lebar (tabel, galeri) pakai `overflow-x-auto` sendiri, bukan bikin body melebar.
- Grid kartu: konsisten `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (atau sejenis) — kalau pola ini terulang di 3+ halaman, ekstrak jadi `components/shared/CardGrid.tsx`.

⚠ **Utang Teknis**: tidak ada komponen `Pagination` di manapun — semua listing merender seluruh hasil sekaligus. Untuk data yang akan terus bertambah (jurnal KKN terutama), pertimbangkan pagination atau infinite-scroll saat listing mulai panjang. Grid/hero-nya sendiri sudah tidak diduplikasi lagi: halaman listing memakai `PageHero` + `PageFilterBar` + baris indeks bersama.

### 3.4 Visual Hierarchy & Style Consistency

- Header/hero section per halaman listing **wajib** lewat `components/shared/PageHero.tsx` + `PageFilterBar.tsx` (tone/aksen dari `DOMAIN_ACCENT`) — jangan hand-roll `font-serif text-4xl ... border-b-4` ulang per halaman.
- Ikon: pakai SVG (`lucide-react`, sudah jadi dependency) — **jangan emoji sebagai ikon fungsional** (emoji 💡 di empty-state boleh sebagai elemen dekoratif/playful, tapi bukan pengganti ikon navigasi/status).
- Satu section = maksimal 1–2 elemen beranimasi utama; jangan animasikan semua elemen sekaligus (lihat §3.5).

### 3.5 Micro-interactions / Framer Motion

**Dua bahasa gerak, dua tugas berbeda — jangan tertukar:**

- **Entrance saat di-scroll** = GSAP ScrollTrigger lewat `<Reveal kind="rise|stagger|panel">` (`components/shared/Reveal.tsx` → `applyReveal()` di `lib/scrollReveal.ts`). Dipakai `gsap.from()` **dengan sengaja**, supaya konten tetap terbaca kalau JS gagal dimuat atau `prefers-reduced-motion` aktif — elemen sudah ada di DOM pada state akhirnya, animasi hanya menariknya dari state awal.
- **Micro-interaction (hover/tap/press)** = Framer Motion + `lib/animations.ts`. Jangan pakai Framer untuk entrance scroll, dan jangan pakai GSAP untuk hover.

`lib/animations.ts` sudah menyediakan variants bersama (`fadeInUp`, `fadeIn`, `staggerContainer`, `scaleIn`, `wordByWord`, `floatAnimation`, `pulseAnimation`) — **selalu reuse dari sini**, jangan definisikan inline `variants={{ ... }}` baru per komponen kecuali kasusnya benar-benar unik.

- Durasi transisi: 150–300ms untuk interaksi (hover, tap), lebih panjang (400–800ms) hanya untuk entrance animation besar (hero, section reveal).
- Easing: `ease-out` untuk elemen masuk, `ease-in` untuk elemen keluar — hindari `linear` untuk transisi UI.
- **Wajib** hormati `prefers-reduced-motion` — Framer Motion punya `useReducedMotion()` hook bawaan; pakai untuk menonaktifkan/mengurangi animasi dekoratif (background blobs, parallax) saat user mengaktifkan preferensi ini di OS.
- Animasi infinite (`animate-pulse`, `animate-spin`) hanya untuk loading indicator, bukan elemen dekoratif.
- Hover/press: pertahankan pola `hard-shadow-hover` + `press-effect` yang sudah konsisten dipakai — ini bagian dari identitas brutalist, bukan sekadar micro-interaction generik.

`useReducedMotion()`/`prefers-reduced-motion` kini dipakai di 21 file (termasuk `ScrollSpin`, `MouseDrift`, `Reveal`, `AdminOrnaments`, `EntityCardShell`). Pertahankan: setiap komponen gerak baru wajib punya guard ini.

⚠ **Pelajaran dari kasus nyata** (menu admin pernah hilang total): jangan menulis guard yang membuat elemen ikut dirender `opacity: 0` saat reduced-motion aktif — itu bukan "tanpa animasi", itu konten yang lenyap. `useReducedMotion()` juga berbeda nilainya antara SSR dan client, jadi mem-branch `variants` berdasarkan hook itu bisa memicu hydration mismatch. Untuk animasi masuk/muncul, cara paling aman adalah **menghapus** animasinya, bukan mem-branch variant-nya.

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

Codebase ini **nol `any`** per 18 Sep 2026 — `catch` memakai `unknown` + narrowing, dan tipe data Supabase diambil dari `constants/<domain>.ts`. Jangan memperkenalkannya kembali.

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

Ketiga hook fetch lama sudah dihapus dan datanya diambil Server Component lewat `queries.ts`; `hooks/` kini hanya berisi `useCroppedImageUpload.ts`, yang bukan hook fetch. Bentuk di atas berlaku kalau nanti benar-benar butuh hook fetch baru — `error` state tidak boleh di-skip.

### 4.3 Komponen modular

- Satu file = satu komponen bertanggung jawab tunggal. Kalau sebuah `page.tsx` sudah >150 baris campur data-fetch + markup kompleks, pecah markup ke `components/<fitur>/`.
- `"use client"` hanya di titik paling bawah pohon komponen yang benar-benar butuh interaktivitas/hook browser — biarkan parent tetap Server Component kalau bisa.
- Props wajib bertipe eksplisit (interface/type), tidak inferred dari default value saja.

### 4.4 Metadata / SEO

Setiap `page.tsx` yang render konten publik unik (detail budaya, UMKM, fauna, TOGA, proker & jurnal KKN) **wajib** export `generateMetadata()` dengan title/description sesuai kontennya.

⚠ **Utang Teknis**: 12 dari 17 halaman publik sudah punya metadata. Yang belum: `app/(home)/page.tsx`, `app/profil/page.tsx`, `app/kkn/tim/page.tsx`, `app/kkn/proker/page.tsx`, `app/kkn/jurnal/page.tsx` — semuanya halaman listing/statis, jadi cukup `export const metadata`, tidak perlu `generateMetadata`.

### 4.5 Supabase

- Server Component/Route Handler: `createClient()` dari `lib/supabase/server.ts`, **lewat** `lib/supabase/queries.ts` — jangan panggil `createClient()` langsung di dalam `page.tsx` kalau query yang sama sudah ada di `queries.ts`.
- Client Component: `createClient()` dari `lib/supabase/client.ts`, idealnya dibungkus custom hook (§4.2), bukan inline di komponen.
- `lib/auth.ts` (`getAdminUser()`) adalah satu-satunya cara guard halaman admin — jangan reimplement cek role di tempat lain.
- **`getUser()` vs `getSession()` — perbedaannya disengaja.** `proxy.ts` dan `lib/auth.ts` memakai `supabase.auth.getUser()` (tervalidasi ke server) karena itu gerbang keamanan sungguhan. `Navbar.tsx` memakai `getSession()` (baca cookie lokal, tanpa network call) karena badge admin di navbar publik cuma petunjuk UI — kalau ia ikut `getUser()`, setiap kunjungan halaman publik menambah satu round-trip ke Supabase Auth dan ikut menyumbang ke rate limit (lihat §6). Jangan "menyeragamkan" keduanya.
- **Rahasia jangan pernah ber-prefix `NEXT_PUBLIC_`.** Apa pun yang berprefix itu di-inline ke bundle browser oleh Next begitu ada kode yang merujuknya. Lihat §6 untuk status variabel yang saat ini salah prefix.
- **`village_id` NULL artinya "kedua desa", bukan "belum diisi".** Berlaku di `kkn_journals` dan `kkn_prokers`. Di hari ketika kedua tim bergerak bersama dan ceritanya sama, jurnalnya diisi SATU entri dengan opsi "Umum / Kedua Desa" di form admin — bukan dua entri kembar dengan foto yang sama diunggah dua kali. Query listing sudah menanganinya: filter per-desa memakai `.or("village_id.eq.<id>,village_id.is.null")`, jadi entri gabungan muncul di filter Kawasi MAUPUN Soligi. Di halaman publik, entri seperti ini diberi label eksplisit (`"Kedua Desa"` untuk jurnal, `"Lintas Desa"` untuk proker) — jangan biarkan badge-nya sekadar hilang, karena pembaca tidak bisa membedakan "kegiatan gabungan" dari "datanya lupa diisi".
- **Sebelum insert/update data ke tabel `kkn_prokers`** (lewat SQL manual maupun kode) — baca [`KKN_PROKER_CONTENT_GUIDE.md`](KKN_PROKER_CONTENT_GUIDE.md) dulu. Tabel ini pernah diisi tanpa panduan dan hasilnya fakta yang sama (waktu, pelaksana, angka pencapaian) ditulis ulang di beberapa kolom berbeda, dua di antaranya tidak pernah tampil ke publik. Dokumen itu berisi tabel kolom-per-kolom: untuk apa, dan bentuk data yang benar.

### 4.6 Peta endpoint & tabel (rujukan cepat)

Route Handler yang ada — tambah yang baru mengikuti pola yang sama, dan guard dengan `getAdminUser()` kalau butuh admin:

| Endpoint | File | Guard |
|---|---|---|
| `POST /api/auth/login` | `app/api/auth/login/route.ts` | — |
| `POST /api/auth/logout` | `app/api/auth/logout/route.ts` | — |
| `POST /api/cloudinary/sign` | `app/api/cloudinary/sign/route.ts` | `getAdminUser()` |
| `POST /api/gmaps/resolve` | `app/api/gmaps/resolve/route.ts` | `getAdminUser()` |
| `GET /api/toga/plants` | `app/api/toga/plants/route.ts` | — |
| `GET /auth/callback` | `app/auth/callback/route.ts` | — (`exchangeCodeForSession`) |

Tabel Supabase yang benar-benar dibaca `lib/supabase/queries.ts`: `villages`, `culture_articles`, `umkm` (+ `umkm_category_items`, `umkm_features`, `umkm_gallery`, `umkm_products`), `toga_plants`, `fauna_obi`, `galleries`, `kkn_members`, `kkn_journals`, `kkn_journal_images`, `kkn_prokers`, `map_buildings`, `map_facilities`, `admin_users`.

Data peta: `public/data/*.geojson` **wajib ikut deploy** — dibaca dua arah, client (fetch URL dari `constants/peta.ts`) dan server (`readFile` dari disk di `queries.ts`). Shapefile sumbernya ada di `data-sources/` (di luar `public/`, tidak tersaji ke publik) bersama `data-sources/convert-shp.mjs` yang membangkitkan geojson itu.

---

## 5. Urutan Prioritas Perbaikan (kalau mulai refactor bertahap)

1. `export const metadata` di 5 halaman listing yang belum punya (§4.4) — sekarang lebih mendesak karena `app/sitemap.ts` sudah mendaftarkan halaman-halaman itu ke mesin pencari.
2. Tambah `error.tsx` di `app/kkn/proker`, `app/kkn/tim`, `app/kkn/jurnal` + hapus kartu error inline-nya (§1.2).
3. Hapus `components/ui/card.tsx` atau sambungkan `EntityCardShell` ke primitif itu (§3.1) — sekarang ia kode mati.
4. Tambah `aria-hidden="true"` di 6 gambar dekoratif yang belum punya (§3.2).
5. Ganti `text-sand-500`/`text-tropic-500` di `Footer.tsx` ke token semantik (§2.1).
6. `Pagination`/infinite-scroll untuk listing yang akan panjang, terutama jurnal KKN (§3.3).
7. Wrapper `safeQuery<T>()` untuk `lib/supabase/queries.ts` yang sudah 1500+ baris (§1.3).
8. Lunasi 12 error lint lama (aturan React Compiler di form admin & `not-found.tsx`), lalu naikkan step Lint di `.github/workflows/ci.yml` jadi blocking.

Jangan kerjakan semua sekaligus dalam satu PR besar — tiap poin di atas independen dan bisa jadi PR/commit terpisah.

---

## 6. Catatan Operasional & Riwayat Keputusan

Bagian ini merekam hal-hal yang **tidak terbaca dari kode** — kenapa sesuatu dibuat begitu, dan jebakan yang sudah pernah memakan waktu. Baca sebelum mendiagnosis masalah yang mirip.

### 6.1 Rate-limit Supabase Auth & "infinite reload" (insiden 2–3 Sep 2026)

Project Supabase free-tier auto-pause setelah 7 hari tanpa aktivitas DB → DNS project NXDOMAIN → setelah restore muncul `AuthApiError: over_request_rate_limit` (429) berulang. Terpisah dari itu, browser sempat infinite-reload dengan **tiga penyebab berbeda** yang semuanya BUKAN bug kode:

1. Cache Turbopack (`.next/`) korup karena build berulang kali ke-interrupt — `rm -rf .next` lalu `npm run dev` ulang. Ini penyebab paling sering.
2. Tab browser lama memegang hash chunk dari proses dev server sebelumnya (Turbopack ganti hash tiap restart) — tutup tab lama, buka tab baru.
3. Dev server mati sendiri tanpa disadari. Kalau tidak ada yang listen di port 3000, sebagian browser retry terus dan tampak seperti infinite-reload. **Selalu cek `lsof -iTCP -sTCP:LISTEN | grep 3000` dulu** sebelum mencurigai kode frontend — dan pastikan yang listen memang project ini, bukan project lain.

Sumber beban rate-limit yang sebenarnya: `Navbar.tsx` memanggil `getUser()` di setiap halaman publik. Sudah diperbaiki (§4.5), ditambah `getAdminUser()` yang kini di-`cache()` supaya layout + page tidak dua kali round-trip per navigasi admin, dan `proxy.ts` yang membungkus `getUser()` dalam try/catch karena pada 429 ia **melempar**, bukan mengisi field `error` — tanpa itu setiap request ke `/admin` mati dengan stack trace mentah.

Terbukti BUKAN penyebabnya (sudah diperiksa satu per satu): `useEffect` tanpa dependency array, dan `onAuthStateChange` — nol hasil di seluruh codebase.

Mitigasi jangka panjang: `.github/workflows/supabase-keepalive.yml` — ping REST ke `villages` 2× seminggu supaya project tidak ke-pause lagi.

### 6.2 Bypass auth `/admin` untuk dev lokal

`DISABLE_ADMIN_AUTH=true` di `.env.local` membuka `/admin` tanpa login, supaya UI tetap bisa dikerjakan saat Supabase Auth bermasalah. Di-gate **ganda** (`NODE_ENV === "development"` DAN flag itu) di dua tempat, jadi mustahil aktif di production:

- `proxy.ts` → return lebih awal, sebelum sempat memanggil `getUser()`.
- `lib/auth.ts` → `getAdminUser()` mengembalikan `User` palsu (`id: "dev-bypass"`).

`.env.local` tidak ikut ter-commit, jadi setelah clone ulang baris itu harus ditambahkan manual. Untuk kembali normal: hapus barisnya, restart dev server. Kode bypass-nya aman dibiarkan permanen.

### 6.3 Rahasia dan variabel lingkungan

`.env.local` dulu memuat `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` berisi kunci `sb_secret_…` — kunci yang **melewati seluruh RLS**. Prefix `NEXT_PUBLIC_` berarti Next meng-inline nilainya ke bundle browser begitu ada satu baris kode yang merujuknya. Diverifikasi tidak pernah benar-benar bocor (tidak ada yang merujuknya; nilainya nol hasil di `.next/static` dan `.next/server`), lalu **di-rename jadi `SUPABASE_SECRET_KEY`** pada 18 Sep 2026.

**Aturannya sekarang: tidak ada rahasia yang boleh ber-prefix `NEXT_PUBLIC_`.** Yang boleh berprefix itu hanya nilai yang memang aman dilihat publik — URL Supabase, publishable/anon key, nama cloud Cloudinary.

Variabel yang dipakai: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (publik); `SUPABASE_SECRET_KEY`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (server saja); `DISABLE_ADMIN_AUTH` (§6.2); `NEXT_PUBLIC_SITE_URL` (opsional, untuk sitemap/robots — lihat `lib/siteUrl.ts`).

### 6.4 Theming panel admin

8 domain admin (KKN, Budaya, UMKM, Galeri/Foto, Peta Fasilitas, Fauna, Toga, Profil Desa) **sengaja** meniru warna tile dashboard masing-masing, dengan pola diagonal 3 warna (primary/tertiary/cream). Lihat komentar di `components/admin/AdminOrnaments.tsx`. Ini keputusan sadar, bukan inkonsistensi — jangan diseragamkan.

### 6.5 Upload gambar

`ImageUploader.tsx` / `ExtraImageUploader.tsx` → Cloudinary lewat `POST /api/cloudinary/sign` (signed upload, guard `getAdminUser()`). Kredensial Cloudinary yang rahasia (`CLOUDINARY_API_SECRET`) hanya hidup di server route itu; browser tidak pernah melihatnya.

### 6.6 Security header & CSP

`next.config.ts` memasang `headers()` untuk semua rute: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS (production saja), dan **Content-Security-Policy**.

**Konsekuensi praktis yang harus diingat:** CSP-nya memakai allowlist host. Kalau menambah gambar/font/API dari host baru, situs akan diam-diam gagal memuatnya sampai host itu ditambahkan ke direktif yang tepat di `next.config.ts` — persis yang terjadi saat tekstur kertas masih diambil dari `transparenttextures.com`. Aset baru sebaiknya **self-hosted di `public/`** supaya tidak perlu melonggarkan CSP sama sekali.

`script-src` masih memakai `'unsafe-inline' 'unsafe-eval'` dan itu keputusan sadar: Next menyuntikkan script inline untuk hydration/RSC, dan menggantinya dengan nonce mewajibkan nonce per-request dari `proxy.ts` — yang memaksa SETIAP halaman jadi dinamis dan menghapus ISR yang jadi alasan halaman publik ini cepat.

### 6.7 Sanitasi rich text

HTML dari editor TipTap **wajib** lewat `sanitizeRichText()` (`lib/sanitizeHtml.ts`) di sisi server sebelum dioper ke Client Component yang me-render `dangerouslySetInnerHTML`. Sudah dipasang di tiga tempat: detail budaya, detail jurnal KKN, detail proker KKN.

Kalau menambah `dangerouslySetInnerHTML` baru, saring di `page.tsx` (server), **bukan** di komponen client — di client, markupnya sudah terlanjur dikirim ke browser.

### 6.8 Tes & CI

`npm test` menjalankan smoke test Playwright (`tests/smoke.spec.ts`) yang menyalakan dev server sendiri di port 3100 supaya tidak bentrok dengan `npm run dev`. Yang diuji: setiap halaman publik membalas 200, `<h1>`-nya terlihat, isinya memuat penanda yang benar, tidak ada scroll horizontal (desktop & 375px), tidak ada error konsol, plus robots/sitemap dan security header.

Penanda isi itu bukan formalitas: hampir semua seksi di situs ini digerbangi `{data.length > 0 && …}`, jadi **query yang gagal menghasilkan halaman 200 dengan seksi yang lenyap tanpa error** — kelas bug yang paling sering muncul di proyek ini. Tes itu yang menangkapnya.

`.github/workflows/ci.yml` menjalankan typecheck + build pada setiap PR ke `master`. Step lint sengaja `continue-on-error` selama 12 error lint lama belum lunas (§5 no. 8).
