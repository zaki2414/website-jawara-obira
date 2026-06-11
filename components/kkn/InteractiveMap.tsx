// components/kkn/InteractiveMap.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { MapPin, Users, Maximize2 } from "lucide-react";

interface VillageData {
  id: string;
  name: string;
  slug: string;
  description: string;
  population: string;
  area: string;
  highlight: string;
  badgeColor: string;
}

// Warna HEX diselaraskan dengan variabel tema di globals.css
const COLOR_DEFAULT = "#ece7e1"; // surface-container-high
const COLOR_HOVER = "#51b8ea";   // primary-container
const COLOR_ACTIVE = "#006689";  // primary
const COLOR_STROKE = "#1d1c18";  // on-surface

const villagesData: Record<string, VillageData> = {
  kawasi: {
    id: "kawasi",
    name: "Desa Kawasi",
    slug: "kawasi",
    description:
      "Desa pesisir dengan kekayaan laut dan tradisi gotong royong yang kuat. Merupakan pusat kegiatan pemberdayaan UMKM kerajinan serta pelestarian budaya maritim di Pulau Obi.",
    population: "± 1.250 Jiwa",
    area: "15.4 km²",
    highlight: "Potensi Perikanan & Maritim",
    badgeColor: "bg-ocean-100 text-ocean-700 border-ocean-700",
  },
  soligi: {
    id: "soligi",
    name: "Desa Soligi",
    slug: "soligi",
    description:
      "Desa pedalaman dengan bentang hutan tropis yang masih sangat asri. Kaya akan biodiversitas flora-fauna endemik, serta pemanfaatan Tanaman Obat Keluarga (TOGA).",
    population: "± 980 Jiwa",
    area: "12.8 km²",
    highlight: "Hutan Tropis & TOGA",
    badgeColor: "bg-tropic-100 text-tropic-700 border-tropic-700",
  },
};

export default function InteractiveMap() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const mapRef = useRef<SVGSVGElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const regions = ["kawasi", "soligi"];

      regions.forEach((id) => {
        const paths = document.querySelectorAll(`#${id} path`);
        
        paths.forEach((path) => {
          // Hover Enter
          path.addEventListener("mouseenter", () => {
            if (activeRegion !== id) {
              gsap.to(paths, { fill: COLOR_HOVER, duration: 0.2 });
            }
          });

          // Hover Leave
          path.addEventListener("mouseleave", () => {
            if (activeRegion !== id) {
              gsap.to(paths, { fill: COLOR_DEFAULT, duration: 0.2 });
            }
          });
        });
      });
    }, mapRef);

    return () => ctx.revert();
  }, [activeRegion]);

  const handleRegionClick = (regionId: string) => {
    setActiveRegion(regionId);

    gsap.context(() => {
      // Reset area lain ke default
      gsap.to("#kawasi path, #soligi path", {
        fill: COLOR_DEFAULT,
        stroke: COLOR_STROKE,
        strokeWidth: 2,
        duration: 0.3,
      });

      // Beri warna aktif pada area terpilih
      gsap.to(`#${regionId} path`, {
        fill: COLOR_ACTIVE,
        stroke: COLOR_STROKE,
        strokeWidth: 3,
        duration: 0.4,
        ease: "power2.out",
      });

      // Animasi hentakan kartu informasi
      if (infoRef.current) {
        gsap.fromTo(
          infoRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" }
        );
      }
    }, mapRef);
  };

  const selectedData = activeRegion ? villagesData[activeRegion] : null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      {/* AREA PETA SVG */}
      <div className="relative bg-background rounded-xl p-6 md:p-10 border-2 border-on-surface hard-shadow">
        <h3 className="text-center font-serif text-2xl font-bold text-on-surface mb-8">
          Peta Wilayah Interaktif
        </h3>

        <div className="max-w-md mx-auto bg-aged-paper border-2 border-on-surface rounded-xl p-4 md:p-8 shadow-inner">
          <svg
            ref={mapRef}
            viewBox="0 0 499 743"
            className="w-full h-auto max-h-125 drop-shadow-md select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* ===== DESA KAWASI ===== */}
            <g
              id="kawasi"
              onClick={() => handleRegionClick("kawasi")}
              className="cursor-pointer"
            >
              <path
                d="M151.916 83.2295L163.003 76.5771V68.8115L496.921 295.176C497.578 295.622 497.478 296.62 496.745 296.927L413.505 331.711L83.1747 499.61V484.797C80.9572 481.098 76.5223 473.261 76.5223 471.483C76.5223 469.266 76.5223 462.604 67.6524 458.17C62.3287 455.503 61.7991 452.846 61.2694 450.179C60.9103 448.402 60.5601 446.633 58.7826 444.856C55.2364 441.31 54.3477 434.505 54.3477 431.542C55.0838 426.362 57.005 415.571 58.7826 413.793C60.3267 412.249 62.9482 406.387 65.1477 401.476C66.0993 399.339 66.9791 397.391 67.6524 396.045C68.7657 393.827 70.4265 389.94 72.0874 386.062C73.7482 382.183 75.4181 378.296 76.5223 376.078C77.043 375.028 77.6894 373.861 78.3717 372.622C80.5802 368.618 83.1747 363.941 83.1747 360.547C83.1747 356.112 87.6096 351.677 92.0446 347.233C96.4795 342.799 98.697 336.137 98.697 331.702C98.697 329.485 100.358 327.267 102.028 325.05C103.688 322.832 105.349 320.615 105.349 318.397V296.214C105.349 294.436 109.784 286.599 112.002 282.9V238.533C112.002 235.929 112.765 231.054 113.393 227.006C113.842 224.142 114.219 221.7 114.219 220.784C114.219 219.671 113.663 215.793 113.115 211.914C112.558 208.036 112.011 204.149 112.011 203.044C112.011 200.827 107.576 196.392 105.358 194.175C104.335 193.151 102.845 194.013 101.094 195.027C99.0471 196.212 96.659 197.586 94.271 196.392C92.287 195.404 92.0805 193.519 91.856 191.553C91.5867 189.111 91.2904 186.535 87.6186 185.305C82.2949 183.527 82.654 181.759 83.0041 179.981C83.0939 179.541 83.1837 179.092 83.1837 178.652C83.1837 176.435 85.4011 172 87.6186 169.782C88.5343 168.867 89.073 167.942 89.7014 166.865C90.5902 165.339 91.6675 163.507 94.271 160.904C97.2276 157.947 98.7059 154.99 98.7059 152.034C98.7059 147.599 98.7059 145.381 100.923 138.72C102.701 133.396 106.094 130.586 107.576 129.85C108.312 127.633 110.233 122.749 112.011 120.98L123.098 109.884C125.316 107.667 125.315 105.449 125.315 103.232C125.315 102.19 126.779 101.158 128.556 99.8829C130.576 98.4465 133.009 96.7139 134.185 94.3527C135.29 92.1353 136.403 91.0221 137.238 90.1961C138.073 89.3612 138.62 88.8136 138.62 87.7004C138.62 85.4829 138.62 83.2654 143.055 83.2654H151.925L151.916 83.2295Z"
                fill={COLOR_DEFAULT}
                stroke={COLOR_STROKE}
                strokeWidth="2"
                transition-all="true"
              />
              <path
                d="M55.4453 6.65234L57.6631 13.3047V14.3799L59.0205 19.0967L66.5332 26.6094L84.2725 33.2617L90.9248 39.9141L93.1426 48.7842L90.916 55.4727L88.6982 56.7109L84.2637 64.3418C85.745 66.5593 89.1385 71.4433 90.916 73.2119L97.5684 79.8643V88.7344C93.8696 89.4705 86.0414 90.9511 84.2637 90.9512C83.2789 90.9512 81.8448 91.3923 79.9795 91.8809L79.9873 91.9062C77.6623 92.5154 74.6509 93.1963 70.959 93.1963C70.294 93.1963 64.5724 93.4352 66.5234 95.3867C63.8357 98.0745 59.8711 102.42 59.8711 106.51C59.8711 109.471 58.887 111.437 58.8838 114.381C58.8852 115.856 59.1325 117.577 59.8711 119.788C60.1951 120.758 60.331 121.54 60.3184 122.174C60.2881 124.462 58.3531 124.85 56.4238 125.237C55.194 125.48 53.9638 125.731 53.2188 126.467C51.4411 128.244 46.5671 127.203 44.3496 126.467C41.396 124.985 35.0393 122.032 33.2617 122.032H17.7393C13.3047 122.032 10.3484 121.293 8.87012 119.814C6.65266 117.597 4.43459 115.38 4.43457 113.162C4.43457 110.934 0 104.29 0 102.065C0 100.516 1.03584 98.8376 1.65137 97.4697C2.90816 94.6868 4.43441 91.329 4.43457 88.7256V79.8555C4.43457 77.638 6.65267 68.7596 8.87012 66.542C11.0874 64.3247 11.0869 62.107 11.0869 59.8896C11.0869 57.6722 13.305 51.0197 15.5225 44.3584C17.7308 37.6976 15.5227 39.9321 17.749 35.4795C21.1186 28.7403 27.6841 24.4784 31.0537 17.7393C31.7718 16.3067 32.0283 15.3078 32.0322 14.626C32.0282 13.6416 31.4885 13.3312 31.0537 13.3311C33.8957 10.3754 36.9749 7.38288 39.9229 4.43457C41.7003 2.65707 46.5754 0.736224 48.793 0L55.4453 6.65234Z"
                fill={COLOR_DEFAULT}
                stroke={COLOR_STROKE}
                strokeWidth="2"
              />
            </g>

            {/* ===== DESA SOLIGI ===== */}
            <g
              id="soligi"
              onClick={() => handleRegionClick("soligi")}
              className="cursor-pointer"
            >
              <path
                d="M116.438 551.339C114.221 550.603 108.897 548.673 105.351 546.904C102.083 545.271 97.621 540.028 94.6045 536.49C93.5272 535.225 92.6294 534.174 92.0459 533.591C91.1302 532.675 90.5915 530.61 89.9631 528.195C89.0743 524.784 87.997 520.663 85.3935 518.059C82.0628 514.729 82.4848 511.407 82.8977 508.076C83.0324 506.963 83.176 505.859 83.176 504.746V499.593L413.506 331.694L496.974 296.814C497.657 296.529 498.402 297.057 498.358 297.796L472.256 740.318C470.918 741.144 469.347 742.122 466.806 742.122C461.483 742.122 454.238 739.16 451.284 737.678H378.108L373.673 733.243C372.192 730.281 369.238 723.925 369.238 722.147C369.238 719.93 367.021 713.277 364.803 708.833L358.151 695.529C352.234 691.83 337.754 682.215 327.106 673.336C323.219 671.397 320.184 669.449 317.437 667.689C313.918 665.436 310.884 663.487 307.149 662.249C300.497 660.031 293.844 655.587 287.192 651.152C283.87 648.935 280.539 647.822 277.218 646.708C273.896 645.604 270.565 644.5 267.244 642.273C261.875 638.691 255.052 636.555 249.127 634.696H249.091C247.69 634.248 246.335 633.826 245.069 633.395C239.7 631.599 232.886 626.922 226.952 622.846C225.543 621.876 224.169 620.943 222.885 620.081C218.352 617.064 213.827 616.104 205.792 614.398C202.03 613.599 197.497 612.629 191.841 611.211C188.106 609.963 186.463 608.024 184.569 605.771C183.088 604.011 181.454 602.063 178.536 600.124C174.595 597.493 173.769 596.425 172.359 594.593C171.399 593.346 170.16 591.739 167.449 589.027C160.796 582.375 158.579 577.931 158.579 573.496C158.579 571.279 157.475 570.165 156.083 568.783C154.7 567.4 153.031 565.73 151.926 562.409C151.334 560.622 150.741 558.997 150.185 557.498C148.677 553.377 147.491 550.127 147.491 546.887C147.491 543.34 143.057 538.017 140.839 535.79L138.622 540.225L127.534 546.878L116.447 551.313L116.438 551.339Z"
                fill={COLOR_DEFAULT}
                stroke={COLOR_STROKE}
                strokeWidth="2"
              />
            </g>

            {/* Label Teks Peta */}
            <text
              x="250"
              y="280"
              className="text-xl font-serif font-bold pointer-events-none select-none italic"
              fill={activeRegion === "kawasi" ? "#ffffff" : "#1d1c18"}
              textAnchor="middle"
            >
              Desa Kawasi
            </text>
            <text
              x="340"
              y="520"
              className="text-xl font-serif font-bold pointer-events-none select-none italic"
              fill={activeRegion === "soligi" ? "#ffffff" : "#1d1c18"}
              textAnchor="middle"
            >
              Desa Soligi
            </text>
          </svg>
        </div>

        <p className="text-center text-sm font-medium text-on-surface-variant mt-6 flex items-center justify-center gap-1.5">
          <span>💡</span> Ketuk area peta untuk memunculkan detail informasi desa.
        </p>
      </div>

      {/* AREA INFORMASI DI BAWAH PETA */}
      {selectedData && (
        <div
          ref={infoRef}
          className="bg-background border-2 border-on-surface rounded-xl p-8 hard-shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            {/* Blok Nama Desa */}
            <div className="w-full md:w-1/3 shrink-0">
              <div className="bg-aged-paper rounded-xl p-6 text-center h-full flex flex-col justify-center items-center border-2 border-on-surface shadow-inner">
                <span className="text-5xl mb-4 select-none">
                  {selectedData.id === "kawasi" ? "🌊" : "🌳"}
                </span>
                <h2 className="font-serif text-3xl font-bold text-on-surface">
                  {selectedData.name}
                </h2>
                <span
                  className={`inline-block mt-3 px-4 py-1.5 border font-semibold text-xs uppercase tracking-wider rounded-full ${selectedData.badgeColor}`}
                >
                  {selectedData.highlight}
                </span>
              </div>
            </div>

            {/* Detail Informasi */}
            <div className="w-full md:w-2/3 flex flex-col justify-between space-y-6">
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Tentang Wilayah
                </h4>
                <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
                  {selectedData.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t-2 border-dashed border-outline-variant">
                <div className="bg-surface-container-low p-4 rounded-lg border border-on-surface/10">
                  <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Users className="w-4 h-4 text-tertiary" /> Populasi
                  </h4>
                  <p className="font-serif text-xl font-bold text-on-surface">
                    {selectedData.population}
                  </p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg border border-on-surface/10">
                  <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Maximize2 className="w-4 h-4 text-primary" /> Luas Wilayah
                  </h4>
                  <p className="font-serif text-xl font-bold text-on-surface">
                    {selectedData.area}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}