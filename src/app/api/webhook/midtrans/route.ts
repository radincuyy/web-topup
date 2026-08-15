import { NextResponse } from "next/server";

import { verifyMidtransSignature } from "@/lib/midtrans/verify";
import {
  TransisiTidakValidError,
  transisiStatusPesanan,
  type MidtransTransactionStatus,
  type StatusPesanan,
} from "@/lib/orders/status";
import { createServiceClient } from "@/lib/supabase/service";

const RECOGNIZED_STATUSES = new Set<MidtransTransactionStatus>([
  "pending",
  "settlement",
  "capture",
  "deny",
  "cancel",
  "expire",
]);

export async function POST(request: Request) {
  const payload = await request.json();

  const orderId = String(payload.order_id ?? "");
  const statusCode = String(payload.status_code ?? "");
  const grossAmount = String(payload.gross_amount ?? "");
  const signatureKey = String(payload.signature_key ?? "");
  const transactionStatusRaw = String(payload.transaction_status ?? "");
  const fraudStatus = payload.fraud_status
    ? String(payload.fraud_status)
    : null;
  const paymentType = payload.payment_type
    ? String(payload.payment_type)
    : null;
  const transactionId = payload.transaction_id
    ? String(payload.transaction_id)
    : null;

  if (!orderId || !signatureKey) {
    return NextResponse.json(
      { error: "Payload tidak lengkap" },
      { status: 400 },
    );
  }

  const validSignature = verifyMidtransSignature({
    order_id: orderId,
    status_code: statusCode,
    gross_amount: grossAmount,
    signature_key: signatureKey,
  });

  if (!validSignature) {
    return NextResponse.json(
      { error: "Signature tidak valid" },
      { status: 401 },
    );
  }

  // A credit card "capture" still needs fraud review before it counts as paid.
  let effectiveStatus = transactionStatusRaw;
  if (
    transactionStatusRaw === "capture" &&
    fraudStatus &&
    fraudStatus !== "accept"
  ) {
    effectiveStatus = "pending";
  }

  if (!RECOGNIZED_STATUSES.has(effectiveStatus as MidtransTransactionStatus)) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createServiceClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, status")
    .eq("midtrans_order_id", orderId)
    .maybeSingle();

  if (!order) {
    return NextResponse.json(
      { error: "Order tidak ditemukan" },
      { status: 404 },
    );
  }

  let nextStatus: StatusPesanan;
  try {
    nextStatus = transisiStatusPesanan(order.status as StatusPesanan, {
      type: "notifikasi_midtrans",
      transactionStatus: effectiveStatus as MidtransTransactionStatus,
    });
  } catch (e) {
    if (e instanceof TransisiTidakValidError) {
      return NextResponse.json({ ok: true, note: e.message });
    }
    throw e;
  }

  await supabase
    .from("orders")
    .update({
      status: nextStatus,
      midtrans_transaction_id: transactionId,
      metode_pembayaran: paymentType,
      gagal_reason: nextStatus === "gagal" ? effectiveStatus : undefined,
    })
    .eq("id", order.id);

  if (nextStatus === "dibayar") {
    const diprosesStatus = transisiStatusPesanan("dibayar", {
      type: "mulai_proses",
    });
    await supabase
      .from("orders")
      .update({ status: diprosesStatus })
      .eq("id", order.id);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const selesaiStatus = transisiStatusPesanan(diprosesStatus, {
      type: "kredit_terkirim",
    });
    await supabase
      .from("orders")
      .update({ status: selesaiStatus })
      .eq("id", order.id);
  }

  return NextResponse.json({ ok: true });
}
