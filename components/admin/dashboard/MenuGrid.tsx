import type { AdminMenuItem } from "@/constants/admin";
import { MenuCard } from "./MenuCard";

// Grid bento: dasar 1 kolom (mobile, semua tile 1x1 supaya tidak overflow),
// lalu jadi mosaic 2/4 kolom dengan tinggi baris tetap dari sm: ke atas —
// lihat SIZE_SPAN di MenuCard.tsx untuk span per ukuran tile.
//
// TANPA animasi masuk, dan itu keputusan sadar — bukan fitur yang hilang.
//
// Versi sebelumnya menganimasikan tiap tile (scaleIn 0.6s, stagger 0.1s,
// delayChildren 0.2s) dan punya dua cacat sekaligus:
//
//  1. Untuk pengguna prefers-reduced-motion, SELURUH menu admin tidak pernah
//     terlihat. Grid mematikan orkestrasinya sendiri saat reduced-motion,
//     tapi tiap tile tetap membawa `variants`, jadi Framer Motion menahan
//     anak di key variant pertama (`hidden` = opacity 0) selamanya. SSR pun
//     sudah menulis `opacity:0` inline ke HTML, sehingga begitu komponen
//     berhenti dikelola Framer di klien, gaya itu tidak pernah dibersihkan —
//     sekaligus sumber hydration mismatch di /admin.
//  2. Bahkan saat berjalan normal, ~1 detik menonton delapan kartu terbang
//     masuk adalah biaya yang dibayar tiap kali dashboard dibuka. Ini
//     permukaan kerja: yang dituju admin adalah tautannya, bukan
//     pertunjukannya.
//
// Gerak di panel ini sekarang hidup di tempat yang memang menyampaikan
// keadaan — hover, press, dan focus ring pada tiap tile — bukan di
// koreografi muat halaman. Efek sampingnya, grid & kartu kembali jadi
// Server Component (nol JS ke klien untuk bagian ini).
export function MenuGrid({ items }: { items: AdminMenuItem[] }) {
  return (
    // sm:grid-flow-dense: di 2 kolom, tile `wide` (col-span-2) yang tidak muat
    // di sisa baris akan turun penuh dan meninggalkan sel kosong — dense
    // menarik tile 1x1 berikutnya mengisi lubang itu.
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:auto-rows-[minmax(150px,auto)] sm:grid-flow-dense lg:grid-cols-4">
      {items.map((item) => (
        <MenuCard key={item.href} item={item} />
      ))}
    </div>
  );
}
