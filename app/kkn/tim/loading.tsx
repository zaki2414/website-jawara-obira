import { ListingSkeleton } from "@/components/shared/PageSkeleton";

export default function Loading() {
  return (
    <ListingSkeleton
      heroField="bg-cream-container"
      ground="bg-cream-container/45"
      cards={8}
      filter="none"
      stats={2}
    />
  );
}
