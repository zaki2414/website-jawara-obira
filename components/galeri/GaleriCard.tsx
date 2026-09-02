import Image from "next/image";
import { GALERI_ICONS, getGaleriCategoryAccent, GALERI_CATEGORY_ACCENT_STYLES, type GalleryItem } from "@/constants/galeri";

type GaleriCardProps = {
  item: GalleryItem;
  onOpen?: (item: GalleryItem) => void;
};

export function GaleriCard({ item, onOpen }: GaleriCardProps) {
  const { ImageIcon } = GALERI_ICONS;
  const accent = getGaleriCategoryAccent(item.category);
  const styles = GALERI_CATEGORY_ACCENT_STYLES[accent];

  return (
    <button
      type="button"
      onClick={() => onOpen?.(item)}
      aria-label={item.title ? `Perbesar foto: ${item.title}` : "Perbesar foto"}
      className="block w-full text-left bg-background border-2 border-on-surface rounded-xl overflow-hidden hard-shadow hard-shadow-hover transition-all group cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div
        className="relative w-full bg-surface-container-high border-b-2 border-on-surface"
        style={{ paddingBottom: `${(400 / 600) * 100}%` }}
      >
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.title || "Galeri Obi"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant/30">
            <ImageIcon className="w-12 h-12" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="p-5 space-y-2.5">
        <span
          className={`inline-block px-2.5 py-1 border-2 border-on-surface text-label-sm font-black uppercase tracking-wider rounded-md hard-shadow-sm ${styles.badge}`}
        >
          {item.category}
        </span>

        {item.title && (
          <h3 className="font-serif text-lg font-bold text-on-surface leading-tight">{item.title}</h3>
        )}

        {item.description && (
          <p className="text-sm font-sans text-on-surface-variant leading-relaxed line-clamp-3">
            {item.description}
          </p>
        )}
      </div>
    </button>
  );
}
