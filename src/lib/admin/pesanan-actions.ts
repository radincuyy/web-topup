"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { getTransactionStatus } from "@/lib/midtrans/client";
import { applyMidtransStatus } from "@/lib/orders/apply-midtrans-status";
import { transisiStatusPesanan, TransisiTidakValidError } from "@/lib/orders/status";
import { createClient } from "@/lib/supabase/server";

export async function cancelOrderAdmin(orderId: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, status")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) {
    return { error: "Pesanan tidak ditemukan." };
  }

  let nextStatus: string;
  try {
    nextStatus = transisiStatusPesanan(order.status as never, {
      type: "dibatalkan",
      oleh: "admin",
    });
  } catch (e) {
    if (e instanceof TransisiTidakValidError) {
      return { error: e.message };
    }
    throw e;
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: nextStatus, dibatalkan_oleh: "admin" })
    .eq("id", orderId);

  if (error) {
    return { error: "Gagal membatalkan pesanan." };
  }

  revalidatePath("/admin/pesanan");
  return { ok: true };
}

export async function syncOrderStatusAdmin(orderId: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, status, midtrans_order_id")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) {
    return { error: "Pesanan tidak ditemukan." };
  }

  let midtransStatus;
  try {
    midtransStatus = await getTransactionStatus(order.midtrans_order_id);
  } catch {
    return { error: "Gagal menghubungi Midtrans." };
  }

  const result = await applyMidtransStatus(
    supabase,
    order,
    midtransStatus.transaction_status as never,
    {
      transactionId: midtransStatus.transaction_id ?? null,
      paymentType: midtransStatus.payment_type ?? null,
    },
  );

  revalidatePath("/admin/pesanan");

  if (!result.applied) {
    return { ok: true, note: result.note };
  }
  return { ok: true, nextStatus: result.nextStatus };
}
