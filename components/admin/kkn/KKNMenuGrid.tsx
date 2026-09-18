import type { KKNHubMenuItem } from "@/constants/kknAdmin";
import { KKNMenuCard } from "./KKNMenuCard";

// Tanpa animasi masuk — alasan sama persis dengan MenuGrid dashboard: grid ini
// dulu mematikan orkestrasinya sendiri saat prefers-reduced-motion aktif
// sementara tiap kartu tetap membawa `variants`, sehingga seluruh menu KKN
// tertahan di opacity 0 dan tidak pernah terlihat. Gerak sekarang hidup di
// hover/press/focus tiap kartu, bukan di koreografi muat halaman.
export function KKNMenuGrid({ items }: { items: KKNHubMenuItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {items.map((item) => (
        <KKNMenuCard key={item.href} item={item} />
      ))}
    </div>
  );
}
