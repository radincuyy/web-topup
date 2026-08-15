import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";
import {
  TransisiTidakValidError,
  transisiStatusPesanan,
  type MidtransTransactionStatus,
  type StatusPesanan,
} from "@/lib/orders/status";

export const RECOGNIZED_MIDTRANS_STATUSES = new Set<MidtransTransactionStatus>([
  "pending",
  "settlement",
  "capture",
  "deny",
  "cancel",
  "expire",
]);

/**
 * Applies a Midtrans transaction status to one Order: computes the next
 * Status Pesanan via the transisiStatusPesanan seam, persists it, and — when
 * the Order just became Dibayar — auto-advances it to Diproses (payment
 * confirmed, delivery now owed). It stops there: Diproses -> Selesai is a
 * separate Admin action (Tandai Terkirim, see pesanan-actions.ts) — only a
 * human who actually delivered the credit can attest that happened. See
 * docs/adr/0005-manual-fulfillment.md. Shared by the webhook route and the
 * Admin Sinkronisasi Status action so this sequencing lives in one place.
 */
export async function applyMidtransStatus(
  supabase: SupabaseClient<Database>,
  order: { id: string; status: string },
  transactionStatus: MidtransTransactionStatus,
  extra: { transactionId: string | null; paymentType: string | null },
): Promise<{ applied: true; nextStatus: StatusPesanan } | { applied: false; note: string }> {
  let nextStatus: StatusPesanan;
  try {
    nextStatus = transisiStatusPesanan(order.status as StatusPesanan, {
      type: "notifikasi_midtrans",
      transactionStatus,
    });
  } catch (e) {
    if (e instanceof TransisiTidakValidError) {
      return { applied: false, note: e.message };
    }
    throw e;
  }

  if (nextStatus === "dibayar") {
    nextStatus = transisiStatusPesanan("dibayar", { type: "mulai_proses" });
  }

  await supabase
    .from("orders")
    .update({
      status: nextStatus,
      midtrans_transaction_id: extra.transactionId ?? undefined,
      metode_pembayaran: extra.paymentType ?? undefined,
      gagal_reason: nextStatus === "gagal" ? transactionStatus : undefined,
    })
    .eq("id", order.id);

  return { applied: true, nextStatus };
}
