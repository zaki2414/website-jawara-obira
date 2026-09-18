type TogaAlphabetRailProps = {
  /** Huruf awal yang benar-benar ada di koleksi, beserta jumlahnya. */
  letters: { letter: string; count: number }[];
  totalCount: number;
};

/**
 * RAIL INDEKS ALFABET.
 *
 * Ensiklopedia tanaman obat dicari, bukan dijelajahi: orang datang membawa
 * nama ("apa khasiat kencur?"). Karena itu jalur navigasinya huruf awal,
 * persis daftar isi farmakope — bukan filter kategori seperti halaman lain
 * (kolom `category` dan `family` di tabel ini memang kosong seluruhnya, jadi
 * taksonomi bukan pilihan yang tersedia maupun jujur).
 *
 * Tautannya anchor ke id kelompok, jadi berfungsi tanpa JavaScript dan posisi
 * gulirnya bisa dibagikan lewat URL.
 */
export function TogaAlphabetRail({ letters, totalCount }: TogaAlphabetRailProps) {
  return (
    <div className="lg:sticky lg:top-28 lg:self-start min-w-0 max-w-full">
      <nav aria-label="Lompat ke huruf">
        <p className="hidden lg:block text-label-sm font-black uppercase tracking-[0.16em] text-on-surface-variant mb-3">
          Indeks
        </p>

        {/* Layar lebar: daftar huruf vertikal */}
        <ul className="hidden lg:block border-t-2 border-on-surface">
          {letters.map(({ letter, count }) => (
            <li key={letter} className="border-b-2 border-outline-variant">
              <a
                href={`#huruf-${letter}`}
                className="flex items-center gap-3 py-2.5 px-2 rounded-md transition-colors duration-150 hover:bg-surface-container-low"
              >
                <span className="font-serif text-xl font-black text-herbal w-5 text-center">
                  {letter}
                </span>
                <span className="flex-1 text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                  {count} tanaman
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="hidden lg:block mt-4 text-label-sm font-bold text-on-surface-variant/70">
          <span className="tabular font-black text-on-surface">{totalCount}</span> spesimen
          terdokumentasi
        </p>

        {/* Layar sempit: deretan huruf mendatar */}
        <div className="lg:hidden min-w-0 max-w-full -mx-4 px-4 sm:-mx-6 sm:px-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {letters.map(({ letter, count }) => (
              <a
                key={letter}
                href={`#huruf-${letter}`}
                className="shrink-0 inline-flex items-center gap-2 px-3.5 h-11 rounded-full border-2 border-on-surface bg-background text-on-surface transition-all duration-150 press-effect"
              >
                <span className="font-serif text-base font-black text-herbal">{letter}</span>
                <span className="text-label-sm font-black tabular opacity-70">{count}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
