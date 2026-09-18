import { ListingSkeleton } from "@/components/shared/PageSkeleton";

export default function Loading() {
  return (
    <ListingSkeleton
      heroField="bg-primary"
      ground="bg-natural-paper"
      cards={6}
      filter="search"
      stats={3}
    />
  );
}
