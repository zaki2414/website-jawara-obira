import { ListingSkeleton } from "@/components/shared/PageSkeleton";

export default function Loading() {
  return (
    <ListingSkeleton
      heroField="bg-on-surface"
      ground="bg-natural-paper"
      cards={6}
      filter="chips"
      stats={2}
    />
  );
}
