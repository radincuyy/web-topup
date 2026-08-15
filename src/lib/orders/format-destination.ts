import {
  destinationFieldLabels,
  type DestinationFieldType,
} from "@/lib/orders/destination";

export function formatDestinationData(
  destinationFieldType: string,
  destinationData: unknown,
): string {
  const fields =
    destinationFieldLabels[destinationFieldType as DestinationFieldType];
  const data = destinationData as Record<string, string> | null;

  if (!fields || !data) {
    return "-";
  }

  return fields.map((f) => `${f.label}: ${data[f.field] ?? "-"}`).join(", ");
}
