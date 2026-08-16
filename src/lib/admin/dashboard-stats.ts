import type { Database } from "@/lib/supabase/types";

type PesananAdmin =
  Database["public"]["Functions"]["admin_list_orders"]["Returns"][number];

const STATUS_SUDAH_DIBAYAR = new Set(["dibayar", "diproses", "selesai"]);

export function computeDashboardStats(pesanan: PesananAdmin[]) {
  let pendapatan = 0;
  let menungguPembayaran = 0;
  let diproses = 0;
  let selesai = 0;

  for (const p of pesanan) {
    if (STATUS_SUDAH_DIBAYAR.has(p.status)) pendapatan += p.harga;
    if (p.status === "menunggu_pembayaran") menungguPembayaran++;
    if (p.status === "diproses") diproses++;
    if (p.status === "selesai") selesai++;
  }

  return { pendapatan, menungguPembayaran, diproses, selesai };
}

/** Daily order counts for the trailing `days` days (today inclusive), oldest first. */
export function groupPesananByDay(pesanan: PesananAdmin[], days: number) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }

  for (const p of pesanan) {
    const key = p.created_at.slice(0, 10);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  return Array.from(buckets.entries()).map(([date, jumlah]) => ({
    date,
    jumlah,
  }));
}

/** Orders awaiting fulfillment, oldest-waiting first — the actual queue an Admin works through. */
export function getPerluTindakan(pesanan: PesananAdmin[], limit = 5) {
  return [...pesanan]
    .filter((p) => p.status === "diproses")
    .sort(
      (a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
    )
    .slice(0, limit);
}
