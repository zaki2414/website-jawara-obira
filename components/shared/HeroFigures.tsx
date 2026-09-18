import Image from "next/image";
import { MouseDrift } from "@/components/shared/MouseDrift";
import { ScrollSpin } from "@/components/shared/ScrollSpin";

/**
 * FIGUR HERO PER HALAMAN.
 *
 * Mengikuti pola kompas di hero /profil: sebuah instrumen visual yang
 * MENJELASKAN ISI HALAMANNYA, bukan hiasan yang bisa ditukar antar halaman.
 *
 * Semuanya dibangun dari ornamen Hiasan*.svg, dan geraknya digerakkan
 * JavaScript (ScrollSpin / MouseDrift) — BUKAN CSS scroll-driven animation.
 * Percobaan sebelumnya memakai `animation-timeline: scroll()`, yang hanya
 * bekerja di keluarga Chromium; di Safari dan Firefox deklarasinya diabaikan
 * tanpa error sehingga figurnya diam total.
 */

type FigureProps = { className?: string };

// FULL lebar section (inset-0) buat semua figur — sebelumnya FRAME cuma
// w-[38%] right-anchored, kotak sempit dengan overflow-hidden-nya SENDIRI
// (di luar overflow-hidden section pembungkus di PageHero.tsx). Ornamen yang
// posisinya dekat tepi kotak sempit itu gampang kepotong tiap kali digeser
// manual (lihat riwayat kasus di BudayaFigure). Section pembungkus sudah
// overflow-hidden sendiri, jadi overflow-hidden di sini cuma lapisan aman
// kedua, bukan lagi kotak sempit yang jadi biang potongnya.
//
// Konsekuensinya: SEMUA posisi persen (right/left/w di tiap figur di bawah)
// dulu dihitung relatif ke kotak 38%-lebar itu, sekarang relatif ke section
// penuh — nilai lama akan resolve ke tempat lain (biasanya jatuh jauh lebih
// ke kiri). Tiap figur di bawah sudah diskalakan ulang (kira-kira ×0.38,
// rasio lebar lama/baru) supaya start dari posisi kanan yang mirip sebelum
// disesuaikan manual — bukan nilai final, cuma titik awal.
const FRAME =
  "pointer-events-none absolute inset-0 z-0 hidden lg:block overflow-hidden";

/**
 * BUDAYA — "Cakram Tenun".
 *
 * Tiga cincin ornamen sepusat yang berputar dengan kecepatan dan arah
 * BERBEDA saat digulir: cincin luar pelan searah jarum jam, cincin tengah
 * lebih cepat berlawanan, cincin dalam paling cepat searah lagi. Susunan itu
 * meniru cara pola tenun terbentuk — beberapa lapis benang bergerak dengan
 * irama berbeda, dan pertemuan iramanya yang menghasilkan motif. Karena tiap
 * cincin berputar beda laju, bentuk yang terlihat tidak pernah berulang
 * persis selama pembaca menggulir.
 */
export function BudayaFigure({ className }: FigureProps) {
  // Radius dalam REM, bukan persen. translateY(-46%) akan dihitung terhadap
  // ukuran ornamennya sendiri (beberapa puluh piksel), bukan terhadap radius
  // cakram — akibatnya ketiga cincin runtuh menumpuk di satu titik.
  const rings = [
    { count: 12, radius: "13rem", size: "size-16", motif: 4, deg: 90, op: 0.3 },
    { count: 10, radius: "8.5rem", size: "size-12", motif: 2, deg: -170, op: 0.24 },
    { count: 6, radius: "4.5rem", size: "size-9", motif: 4, deg: 280, op: 0.16 },
  ];

  return (
    <div className={`${FRAME} ${className ?? ""}`} aria-hidden="true">
      {/* right/w di sini bebas disetel manual — FRAME sekarang full lebar
          section, jadi menggeser cakram ke posisi manapun tidak akan
          kepotong sebelum benar-benar keluar dari section hero. */}
      <div className="absolute right-[-40%] top-1/2 aspect-square w-[130%] -translate-y-1/2">
        {rings.map((ring, r) => (
          <ScrollSpin
            key={r}
            degreesPer1000px={ring.deg}
            className="absolute inset-0"
          >
            {Array.from({ length: ring.count }).map((_, i) => {
              const angle = (360 / ring.count) * i;
              return (
                <div
                  key={i}
                  // size-0 SENGAJA — tanpa ini, div ini shrink-wrap ke ukuran
                  // ring.size (beda-beda tiap cincin: 16/12/9), dan
                  // rotate(...) di bawah berputar mengelilingi PUSAT KOTAK ITU
                  // SENDIRI (default transform-origin 50% 50%), bukan titik
                  // jangkar left-1/2 top-1/2 — jadi tiap cincin punya sumbu
                  // poros yang bergeser beda jumlah (setengah ukurannya
                  // masing-masing). size-0 membuat pusat kotak persis di titik
                  // jangkar, menyamakan sumbu ketiga cincin tanpa mengubah
                  // tampilan (anak di dalamnya tetap direcenter sendiri lewat
                  // -translate-x/y-1/2).
                  className="absolute left-1/2 top-1/2 size-0"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-${ring.radius})`,
                  }}
                >
                  <div
                    className={`relative ${ring.size} -translate-x-1/2 -translate-y-1/2`}
                    style={{ opacity: ring.op }}
                  >
                    <Image
                      src={`/Hiasan ${ring.motif}.svg`}
                      alt=""
                      fill
                      className="object-contain"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              );
            })}
          </ScrollSpin>
        ))}
      </div>
    </div>
  );
}

/**
 * FAUNA — "Lintasan Terbang".
 *
 * Dua percobaan sebelumnya gagal karena alasan yang sama, dan baru terlihat
 * setelah ketiga figur disandingkan: kawanan titik-titik dan gugus mengorbit
 * SAMA-SAMA MELINGKAR, persis seperti cakram tenun di halaman Budaya. Tiga
 * halaman berbeda jadi memakai bentuk dasar yang sama, dan ornamen Hiasan yang
 * memang menyerupai bunga membuat susunan melingkar apa pun berakhir sebagai
 * "bunga dari bunga-bunga".
 *
 * Jadi bentuknya sekarang sengaja BUKAN lingkaran: satu lintasan menanjak dari
 * bawah-kiri ke atas-kanan. Ornamen mengecil dan memudar ke arah ujung
 * lintasan sehingga terbaca menjauh, dengan garis bidik putus-putus sebagai
 * jejaknya. Burung yang berpindah bergerak dalam lintasan, bukan dalam
 * lingkaran — dan sebelas dari lima belas spesies di halaman ini burung.
 *
 * Tiap ornamen berputar dengan laju berbeda saat digulir, makin jauh makin
 * cepat, supaya lintasannya terasa punya kedalaman.
 */
export function FaunaFigure({ className }: FigureProps) {
  // x/y dalam persen bidang figur. Menanjak dari bawah-kiri ke atas-kanan.
  // x diskalakan ke rentang 64-96% (dari 4-90%) — lihat catatan skala di
  // FRAME di atas, titik awal sebelum disesuaikan manual.
  const path = [
    { x: 64, y: 84, size: "size-32", motif: 2, deg: 30, op: 0.2 },
    { x: 72, y: 66, size: "size-24", motif: 4, deg: 110, op: 0.2 },
    { x: 80, y: 48, size: "size-20", motif: 3, deg: -150, op: 0.2 },
    { x: 86, y: 32, size: "size-14", motif: 1, deg: 190, op: 0.2 },
    { x: 92, y: 19, size: "size-10", motif: 4, deg: -240, op: 0.2 },
    { x: 96, y: 9, size: "size-7", motif: 2, deg: 300, op: 0.2 },
  ];

  return (
    <div className={`${FRAME} ${className ?? ""}`} aria-hidden="true">
      {/* Jejak lintasan — garis putus yang menghubungkan titik-titiknya,
          supaya deretan ornamen terbaca sebagai SATU gerak, bukan enam benda
          yang kebetulan berbaris. */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full opacity-[0.09]"
      >
        <polyline
          points={path.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          strokeDasharray="2 2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <MouseDrift strength={16} rotate={3} className="absolute inset-0">
        {path.map((p, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <ScrollSpin
              degreesPer1000px={p.deg}
              className={`${p.size} -translate-x-1/2 -translate-y-1/2`}
            >
              <div className="relative size-full" style={{ opacity: p.op }}>
                <Image
                  src={`/Hiasan ${p.motif}.svg`}
                  alt=""
                  fill
                  className="object-contain"
                  aria-hidden="true"
                />
              </div>
            </ScrollSpin>
          </div>
        ))}
      </MouseDrift>
    </div>
  );
}

/**
 * UMKM — "Kios Pasar".
 *
 * Ganti dari "Roda Bergigi": gigi roda itu cuma motif Hiasan*.svg (bentuk
 * bunga/kupu-kupu) dibungkus cincin putus-putus tipis — tidak pernah benar-
 * benar terbaca sebagai roda gigi (tidak ada gerigi, tidak ada yang
 * bersinggungan), jadi cuma kelihatan seperti bunga nyasar di dalam
 * lingkaran, bukan mesin.
 *
 * Bentuk barunya justru harfiah ke isi halamannya: deretan kios kecil
 * (garis besar rumah panggung/lapak) berjajar di sepanjang "jalan" yang
 * sedikit naik-turun — bukan mesin abstrak, tapi gambaran langsung dari
 * "Direktori Usaha Warga". Tiap kios diam di tempat (kiosnya sendiri tidak
 * berputar — bangunan tidak berputar), tapi papan nama di dalamnya (motif
 * Hiasan) berputar pelan saat digulir, seperti papan gantung yang bergoyang.
 */
export function UMKMFigure({ className }: FigureProps) {
  // motif SENGAJA tidak pernah 2 — Hiasan 2.svg pakai stroke="#006689",
  // warna yang sama persis dengan bg-primary (lihat TONE.umkm di
  // PageHero.tsx). Itu bukan bug render, tapi ornamennya benar-benar
  // sewarna dengan latarnya sendiri — jadi tidak terlihat SAMA SEKALI di
  // halaman ini, bukan cuma redup. Dikonfirmasi dengan merender kelima
  // Hiasan*.svg berdampingan: motif 2 satu-satunya yang lenyap total.
  const stalls = [
    { x: 64, y: 74, w: "w-40", h: "h-48", motif: 4, deg: 110, op: 0.22, rot: -4 },
    { x: 79, y: 64, w: "w-40", h: "h-48", motif: 4, deg: -170, op: 0.24, rot: 3 },
    { x: 93, y: 78, w: "w-40", h: "h-48", motif: 4, deg: 230, op: 0.2, rot: -6 },
  ];

  return (
    <div className={`${FRAME} ${className ?? ""}`} aria-hidden="true">
      {/* Garis jalan — menghubungkan dasar tiap kios jadi satu deretan,
          senada dengan garis bidik putus-putus di FaunaFigure. */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full opacity-[0.1]"
      >
        <polyline
          points={stalls.map((s) => `${s.x},${s.y}`).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          strokeDasharray="2 2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {stalls.map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: `translate(-50%, -100%) rotate(${s.rot}deg)`,
          }}
        >
          {/* Garis besar kios: atap + tirai berumbai di tepi atap + badan +
              meja loket + barang dagangan di meja + dua tiang panggung di
              bawah — supaya terbaca sebagai lapak pasar sungguhan, bukan
              cuma pentagon polos. Semua satu outline (bukan border kotak). */}
          <svg
            viewBox="0 0 100 120"
            className={`${s.w} ${s.h}`}
            style={{ opacity: s.op }}
          >
            {/* Tiang bendera kecil di puncak atap. */}
            <line x1="50" y1="10" x2="50" y2="2" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <polygon points="50,2 61,5.5 50,9" fill="currentColor" opacity="0.7" />

            {/* Atap + badan kios. */}
            <polygon
              points="8,100 92,100 92,48 50,10 8,48"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />

            {/* Tirai berumbai di tepi atap — detail lapak pasar klasik. */}
            <path
              d="M8,48 a6,6 0 0 1 12,0 a6,6 0 0 1 12,0 a6,6 0 0 1 12,0 a6,6 0 0 1 12,0 a6,6 0 0 1 12,0 a6,6 0 0 1 12,0 a6,6 0 0 1 12,0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              opacity="0.7"
            />

            {/* Meja/loket. */}
            <line
              x1="8"
              y1="78"
              x2="92"
              y2="78"
              stroke="currentColor"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              opacity="0.6"
            />
            {/* Barang dagangan di atas meja. */}
            <circle cx="32" cy="72" r="3.5" fill="currentColor" opacity="0.5" />
            <circle cx="68" cy="72" r="3.5" fill="currentColor" opacity="0.5" />

            {/* Dua tiang panggung — kios berdiri di atas tanah, bukan
                mengambang. */}
            <line x1="25" y1="100" x2="25" y2="116" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" opacity="0.6" />
            <line x1="75" y1="100" x2="75" y2="116" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" opacity="0.6" />
          </svg>

          {/* Papan nama di dalam kios — ini yang berputar pelan saat
              digulir, kiosnya sendiri tetap diam. */}
          <ScrollSpin
            degreesPer1000px={s.deg}
            className="absolute left-1/2 top-[32%] size-7 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative size-full" style={{ opacity: s.op * 2.4 }}>
              <Image
                src={`/Hiasan ${s.motif}.svg`}
                alt=""
                fill
                className="object-contain"
                aria-hidden="true"
              />
            </div>
          </ScrollSpin>
        </div>
      ))}
    </div>
  );
}

/**
 * TOGA — "Lembar Herbarium".
 *
 * Seperti Fauna, dua percobaan sebelumnya (sulur & roset) sama-sama berakhir
 * melingkar dan karenanya menyerupai figur halaman lain. Bentuk kali ini
 * sengaja PERSEGI: tiga lembar spesimen bertumpuk dan sedikit terkipas, tiap
 * lembar bertepi tebal dengan label kecil di sudut — persis lembar herbarium,
 * cara tanaman obat diarsipkan sejak dulu: dikeringkan, ditekan, ditempel di
 * kertas, lalu diberi keterangan.
 *
 * Ini juga bentuk yang paling jujur untuk halamannya: /toga memang arsip
 * spesimen, bukan taman.
 *
 * Saat digulir, spesimen di dalam tiap lembar berputar dengan laju berbeda —
 * lembarnya sendiri tetap diam supaya tumpukannya tidak kehilangan bentuk.
 */
export function TogaFigure({ className }: FigureProps) {
  // x diskalakan ke 64/72/80% (dari 6/26/48%) — lihat catatan skala di FRAME
  // di atas, titik awal sebelum disesuaikan manual.
  const sheets = [
    { rot: -11, x: "64%", y: "16%", w: "w-52", h: "h-64", motif: 3, deg: 120, op: 0.16 },
    { rot: 17, x: "80%", y: "14%", w: "w-48", h: "h-60", motif: 3, deg: 210, op: 0.13 },
    { rot: 6, x: "72%", y: "26%", w: "w-56", h: "h-72", motif: 3, deg: -170, op: 0.15 },
  ];

  return (
    <div className={`${FRAME} ${className ?? ""}`} aria-hidden="true">
      {sheets.map((sh, i) => (
        <div
          key={i}
          className={`absolute ${sh.w} ${sh.h} rounded-lg border-2 border-current/50 bg-herbal`}
          style={{
            left: sh.x,
            top: sh.y,
            transform: `rotate(${sh.rot}deg)`,
            opacity: 1,
          }}
        >
          {/* Garis tepi dalam — kertas arsip biasanya punya bingkai cetak. */}
          <div className="absolute inset-2 rounded border border-dashed border-current opacity-50" />

          {/* Spesimen yang ditekan di tengah lembar. */}
          <ScrollSpin
            degreesPer1000px={sh.deg}
            className="absolute left-1/2 top-[42%] size-28 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative size-full" style={{ opacity: sh.op * 3 }}>
              <Image
                src={`/Hiasan ${sh.motif}.svg`}
                alt=""
                fill
                className="object-contain"
                aria-hidden="true"
              />
            </div>
          </ScrollSpin>

          {/* Label spesimen di kaki lembar — dua garis, meniru kolom nama &
              nama ilmiah pada kartu herbarium. */}
          <div className="absolute inset-x-4 bottom-5 space-y-1.5">
            <div className="h-1 w-3/5 rounded-full bg-current opacity-60" />
            <div className="h-1 w-2/5 rounded-full bg-current opacity-40" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * GALERI — "Diafragma".
 *
 * Delapan bilah ornamen tersusun melingkar. Saat digulir, seluruh rangkaian
 * berputar sekaligus TIAP bilah berputar sendiri ke arah berlawanan — gerak
 * ganda yang membuat lubang di tengahnya seperti mengatup dan membuka, cara
 * diafragma lensa bekerja. Halaman ini arsip foto, dan diafragma adalah bagian
 * kamera yang menentukan berapa banyak yang terekam.
 */
export function GaleriFigure({ className }: FigureProps) {
  const blades = Array.from({ length: 8 }, (_, i) => i * 45);

  return (
    <div className={`${FRAME} ${className ?? ""}`} aria-hidden="true">
      {/* right & w diskalakan bersama (dari -12%/120%) — lihat catatan skala
          di FRAME di atas. Blade di bawah diposisikan dalam persen relatif
          ke kotak ini, jadi w ikut diskalakan supaya ukuran visualnya sama,
          bukan cuma posisinya. Titik awal sebelum disesuaikan manual. */}
      <div className="absolute right-[-5%] top-1/2 aspect-square w-[46%] -translate-y-1/2">
        {/* Rangkaian berputar sebagai satu kesatuan. */}
        <ScrollSpin degreesPer1000px={70} className="absolute inset-0">
          {blades.map((deg) => (
            <div
              key={deg}
              className="absolute inset-0"
              style={{ transform: `rotate(${deg}deg)` }}
            >
              {/* Tiap bilah berputar balik pada sumbunya sendiri. */}
              <ScrollSpin
                degreesPer1000px={-150}
                className="absolute left-1/2 top-[12%] size-24 -translate-x-1/2"
              >
                <div className="relative size-full opacity-[0.14]">
                  <Image
                    src="/Hiasan 5.svg"
                    alt=""
                    fill
                    className="object-contain"
                    aria-hidden="true"
                  />
                </div>
              </ScrollSpin>
            </div>
          ))}
        </ScrollSpin>

        {/* Cincin barrel lensa — diam, jadi patokan bahwa yang bergerak adalah
            bilahnya, bukan seluruh gambar. */}
        <div className="absolute inset-[16%] rounded-full border-2 border-current opacity-[0.0]" />
        <div className="absolute inset-[30%] rounded-full border border-dashed border-current opacity-[0.0]" />
      </div>
    </div>
  );
}
