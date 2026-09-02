import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"
import slugify from "slugify"

// twMerge stock config tidak tahu soal token custom di app/globals.css
// (@theme) — tanpa ini, class warna custom (text-on-primary, text-on-tertiary,
// dst.) dan class ukuran font custom (text-label-md, text-headline-lg, dst.)
// dianggap "konflik" yang sama (sama-sama berprefix text-*), lalu yang lebih
// awal ditulis di string DIAM-DIAM DIBUANG, menyisakan cuma salah satunya.
// Bug nyata: <Button variant="primary"> kehilangan text-on-primary karena
// "keok" oleh text-label-md yang ditulis belakangan di buttonVariants(). Daftar
// di bawah harus disinkronkan manual kalau nambah token --color-*/--text-* baru.
const customColors = [
  "background", "surface", "surface-container-low", "surface-container",
  "surface-container-high", "surface-container-highest", "surface-dim",
  "primary", "primary-container", "primary-fixed", "on-primary", "on-primary-container",
  "secondary", "secondary-container",
  "tertiary", "tertiary-container", "tertiary-fixed", "on-tertiary",
  "cream", "cream-container", "on-cream",
  "on-surface", "on-surface-variant", "outline", "outline-variant",
  "error", "error-container", "on-error",
  "status-safe", "status-caution", "status-warning", "status-danger", "status-critical",
  "success", "on-success",
  "ocean", "sand", "tropic", "aged-paper",
]
const customTextSizes = [
  "display-lg", "headline-lg", "headline-md", "body-lg", "body-md", "label-md", "label-sm",
]

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: customColors,
      text: customTextSizes,
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, trim: true })
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const HEIC_MIME_TYPES = ["image/heic", "image/heif"]
const HEIC_EXTENSION = /\.(heic|heif)$/i
const MAX_IMAGE_SIZE_MB = 5

// Browser/OS SERING tidak mengisi file.type sama sekali untuk HEIC/HEIF
// (kosong string, bukan "image/heic") — jadi deteksinya wajib fallback ke
// ekstensi nama file, tidak bisa andalkan MIME type saja. Dipakai
// validateImageFile di bawah DAN hooks/useCroppedImageUpload.ts (buat
// tahu kapan perlu konversi ke JPEG dulu sebelum di-crop, lihat lib/heic.ts).
export function isHeicFile(file: File): boolean {
  return HEIC_MIME_TYPES.includes(file.type) || HEIC_EXTENSION.test(file.name)
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type) && !isHeicFile(file)) {
    return { valid: false, error: "File harus berupa gambar (JPEG, PNG, WebP, atau HEIC/HEIF)" }
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `Ukuran gambar maksimal ${MAX_IMAGE_SIZE_MB}MB` }
  }
  return { valid: true }
}

// Default "long" (mis. "20 Juli 2026") dipakai halaman publik; admin pakai { month: "short" }.
export function formatDate(date: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  })
}

// Admin cukup tempel link share Google Maps ATAU "lat, lng" polos ke satu
// input teks (lihat UMKMForm.tsx) — tidak perlu Google Maps API key sama
// sekali, cukup ekstrak koordinat dari beberapa pola URL yang umum dipakai
// Google Maps saat "Bagikan"/"Salin link":
//   1. .../place/.../data=!3d<lat>!4d<lng>...  (link "Bagikan" dari app)
//   2. .../@<lat>,<lng>,17z/...                (URL saat menggeser peta)
//   3. ...?q=<lat>,<lng>  atau  &q=<lat>,<lng> (link pin sederhana)
//   4. "<lat>, <lng>"                          (koordinat mentah, mis. hasil klik-kanan "Ada apa di sini?")
export function parseGmapsLocation(input: string): { lat: number; lng: number } | null {
  const text = input.trim()
  if (!text) return null

  const patterns = [/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, /@(-?\d+\.\d+),(-?\d+\.\d+)/, /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/, /^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (!match) continue
    const lat = parseFloat(match[1])
    const lng = parseFloat(match[2])
    if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return { lat, lng }
    }
  }
  return null
}
