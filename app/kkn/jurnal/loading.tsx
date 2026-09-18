import { ListingSkeleton } from "@/components/shared/PageSkeleton";

export default function Loading() {
  return (
    <ListingSkeleton
      heroField="bg-tertiary-container"
      ground="bg-cream-container/45"
      cards={6}
      filter="none"
      stats={1}
    />
  );
}
