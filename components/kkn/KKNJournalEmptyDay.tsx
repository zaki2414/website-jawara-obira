// components/kkn/KKNJournalEmptyDay.tsx

type KKNJournalEmptyDayProps = {
  day: number;
};

/**
 * Sel kalender untuk hari tanpa entri jurnal.
 *
 * Versi sebelumnya menggambar kotak setinggi penuh dengan garis putus-putus,
 * latar terang, DAN tulisan "KOSONG" di tiap selnya. Pada bulan yang baru
 * berisi satu entri, hasilnya dua puluh sembilan kotak putih bertuliskan
 * "kosong" mengelilingi satu entri — halaman jadi didominasi pengumuman
 * ketiadaan, bukan isinya.
 *
 * Sekarang hari kosong dibiarkan diam: hanya angka tanggal beropasitas rendah
 * di atas permukaan tipis, tanpa bingkai dan tanpa label. Hari yang PUNYA
 * entri jadi satu-satunya sel bergambar dan bertepi tebal, sehingga langsung
 * menonjol tanpa perlu bersaing dengan dua puluh sembilan kotak lain.
 */
export default function KKNJournalEmptyDay({ day }: KKNJournalEmptyDayProps) {
  return (
    <div className="flex h-20 items-start justify-start rounded-lg bg-on-surface/[0.035] p-2 sm:h-28 sm:rounded-xl sm:p-3">
      <span className="text-sm font-black tabular text-on-surface/25">{day}</span>
    </div>
  );
}
