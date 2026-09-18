import { ListingSkeleton } from "@/components/shared/PageSkeleton";

export default function Loading() {
  return (
    <ListingSkeleton
      heroField="bg-primary"
      ground="bg-primary-container/15"
      cards={3}
      filter="none"
      stats={2}
    />
  );
}
