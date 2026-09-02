"use client";

import { EntityEmptyState } from "@/components/shared/EntityEmptyState";
import { FAUNA_CONTENT, FAUNA_ICONS } from "@/constants/fauna";

export function FaunaEmptyState() {
  return (
    <EntityEmptyState
      icon={FAUNA_ICONS.Bird}
      title={FAUNA_CONTENT.emptyTitle}
      description={FAUNA_CONTENT.emptyDescription}
      suggestion={FAUNA_CONTENT.emptySuggestion}
    />
  );
}
