export type AgingLevel = "normal" | "warning" | "critical";

const WARNING_HOURS = 2;
const CRITICAL_HOURS = 6;

/**
 * How long an Order has sat in Diproses, off `updated_at` (the timestamp
 * moves whenever status changes, so for a Diproses Order it marks the
 * moment it entered that state). Thresholds are a starting guess — this
 * project has no real fulfillment-time data to derive them from.
 */
export function getAgingLevel(updatedAt: string): AgingLevel {
  const hours = (Date.now() - new Date(updatedAt).getTime()) / 3_600_000;
  if (hours >= CRITICAL_HOURS) return "critical";
  if (hours >= WARNING_HOURS) return "warning";
  return "normal";
}

export const AGING_LEVEL_CLASS: Record<AgingLevel, string> = {
  normal: "text-muted-foreground",
  warning: "text-warning",
  critical: "text-destructive",
};
