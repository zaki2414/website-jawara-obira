import { MouseDrift } from "@/components/shared/MouseDrift";

export type OrnamentMotif = 1 | 2 | 3 | 4 | 5;
export type OrnamentPlacement =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "right-center"
  | "left-center";

type PageOrnamentProps = {
  /** Nomor file "Hiasan {n}.svg" — identitas motif per halaman. */
  motif: OrnamentMotif;
  /** Sudut tanda pertama. Menentukan sisi mana yang dimulai saat marks > 1. */
  placement?: OrnamentPlacement;
  size?: "md" | "lg" | "xl";
  /** Kepekatan tanda pertama. Default 0.07. */
  opacity?: number;
  /**
   * Berapa tanda disebar menurun sepanjang section. Default 1.
   *
   * Ini parameter terpenting di sini. Section daftar bisa setinggi 3000px;
   * satu tanda di satu sudut berarti hampir semua posisi gulir tidak melihat
   * apa pun dan halaman terasa kosong, sementara menaruh banyak tanda di satu
   * layar membuatnya ramai. Aturannya: kira-kira SATU tanda per tinggi layar.
   * Untuk section ~2500–3500px, 3 tanda pas.
   */
  marks?: number;
  /** Motif kedua yang diselang-seling dengan motif utama saat marks > 1. */
  counterMotif?: OrnamentMotif;
};

const SIZE: Record<NonNullable<PageOrnamentProps["size"]>, string> = {
  md: "w-72 h-72",
  lg: "w-[26rem] h-[26rem]",
  xl: "w-[34rem] h-[34rem]",
};

const STARTS_RIGHT: Record<OrnamentPlacement, boolean> = {
  "top-left": false,
  "top-right": true,
  "bottom-left": false,
  "bottom-right": true,
  "right-center": true,
  "left-center": false,
};

// Posisi vertikal (persen tinggi section) untuk tiap jumlah tanda. Tidak
// pernah 0% atau 100% supaya tanda tidak menumpuk tepat di batas section,
// tempat border tebal dan judul kelompok sudah ramai.
const DISTRIBUTION: Record<number, number[]> = {
  1: [72],
  2: [18, 74],
  3: [12, 46, 82],
  4: [10, 36, 62, 88],
};

/**
 * ORNAMEN HALAMAN — cap arsip yang ditempatkan dengan sengaja.
 *
 * Menggantikan lapisan ornamen lama yang menaruh EMPAT motif sekaligus di tiap
 * halaman pada opacity 0.16–0.30, masing-masing berputar & berdenyut tanpa
 * henti. Tiga masalahnya:
 *
 * 1. Ramai. Empat objek bergerak di belakang teks membuat halaman tidak pernah
 *    diam, dan pada 0.30 ornamen bersaing dengan konten alih-alih menopang.
 * 2. Gerak tanpa alasan. Motif kompas pada arsip cetak tidak berputar; rotasi
 *    abadi justru menghapus kesan "tercetak" yang ingin dibangun.
 * 3. Mahal. Empat animasi framer-motion abadi per halaman terus berjalan meski
 *    di luar viewport, dan memaksa seluruh lapisan jadi Client Component.
 *
 * Sekarang: Server Component murni, tanpa animasi, tanda disebar menurun
 * kira-kira satu per tinggi layar, dan SELALU menggantung keluar tepi kiri
 * atau kanan sehingga terpotong — tanda yang terpotong terbaca sebagai cap
 * yang tercetak pada kertas, sementara motif utuh yang mengambang di tengah
 * bidang terbaca sebagai stiker yang ditempel.
 */
export function PageOrnament({
  motif,
  placement = "bottom-right",
  size = "lg",
  opacity = 0.07,
  marks = 1,
  counterMotif,
}: PageOrnamentProps) {
  const count = Math.min(Math.max(marks, 1), 4);
  const positions = DISTRIBUTION[count];
  const startsRight = STARTS_RIGHT[placement];

  return (
    <MouseDrift
      strength={22}
      rotate={5}
      className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0"
    >
      {positions.map((topPercent, i) => {
        const onRight = i % 2 === 0 ? startsRight : !startsRight;
        const markMotif = counterMotif && i % 2 === 1 ? counterMotif : motif;
        // Tanda selain yang pertama sedikit lebih pucat & kecil, supaya ada
        // hierarki alih-alih deretan benda yang sama-sama menuntut perhatian.
        const scale = i === 0 ? 1 : 0.82;
        const markOpacity = i === 0 ? opacity : opacity * 0.75;
        // Kemiringan dasar berbeda per tanda supaya tidak ada dua ornamen yang
        // duduk pada sudut sama, dan tidak ada satu pun yang sejajar sumbu.
        const baseTilt = [-14, 9, -21, 17][i % 4];

        return (
          /* DUA lapis div, dan pemisahan ini penting: lapis luar memegang
             POSISI (top/left/right + translateY untuk menengahkan), lapis
             dalam memegang GERAK (animasi hanyut bertimeline gulir). Kalau
             keduanya digabung, animasi transform akan menimpa translateY
             penengah dan ornamennya melompat saat animasi mulai. */
          <div
            key={`${markMotif}-${topPercent}`}
            className={`absolute ${SIZE[size]} ${onRight ? "-right-32" : "-left-32"}`}
            style={{ top: `${topPercent}%`, transform: "translateY(-50%)" }}
          >
            {/* TIGA lapis, masing-masing memegang satu transform sendiri —
                kalau digabung, animasi yang satu menimpa yang lain:
                  luar  = posisi (top/left/right + translateY penengah)
                  drift = hanyut mengikuti gulir
                  float = gerak abadi pelan + kemiringan dasar

                Kemiringan dasar (baseTilt) penting terpisah dari animasi:
                ornamen tidak pernah sejajar sumbu, jadi meski suatu saat
                animasinya tidak jalan (browser lama, reduced-motion), ia tetap
                terbaca sebagai cap yang ditempelkan miring, bukan gambar yang
                diletakkan lurus. */}
            <div
              className={`w-full h-full ${
                onRight ? "ornament-drift" : "ornament-drift-reverse"
              }`}
            >
              {/* Digambar sebagai background-image CSS, BUKAN <Image>
                  next/image: untuk SVG statis tidak ada penskalaan atau
                  konversi format yang bisa dilakukan, tapi lazy-loading-nya
                  sempat membuat ornamen ini terdeteksi sebagai Largest
                  Contentful Paint di /toga dan /profil. Elemen terbesar yang
                  dilukis halaman seharusnya kontennya, bukan hiasan. */}
              <div
                className={`w-full h-full bg-contain bg-no-repeat bg-center ${
                  onRight ? "ornament-float" : "ornament-float-reverse"
                }`}
                style={{
                  opacity: markOpacity,
                  backgroundImage: `url("/Hiasan ${markMotif}.svg")`,
                  rotate: `${baseTilt}deg`,
                  zoom: scale !== 1 ? scale : undefined,
                }}
              />
            </div>
          </div>
        );
      })}
    </MouseDrift>
  );
}

/**
 * Raster titik cetak — tekstur dasar bersama, dipisah dari ornamen karena
 * keduanya menjawab kebutuhan berbeda: raster memberi PERMUKAAN, ornamen
 * memberi TANDA. Sebelumnya markup radial-gradient ini disalin verbatim di
 * enam tempat.
 */
export function PaperTexture({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(29_28_24)_1.5px,transparent_1.5px)] bg-size-[22px_22px] z-0"
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
