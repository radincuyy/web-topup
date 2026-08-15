import { NextResponse } from "next/server";

import {
  RECOGNIZED_MIDTRANS_STATUSES,
  applyMidtransStatus,
} from "@/lib/orders/apply-midtrans-status";
import { verifyMidtransSignature } from "@/lib/midtrans/verify";
import type { MidtransTransactionStatus } from "@/lib/orders/status";
import { createServiceClient } from "@/lib/supabase/service";

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

  if (
    !RECOGNIZED_MIDTRANS_STATUSES.has(
      effectiveStatus as MidtransTransactionStatus,
    )
  ) {
    // Nothing we act on (e.g. refund) — acknowledge so Midtrans stops retrying.
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

  const result = await applyMidtransStatus(
    supabase,
    order,
    effectiveStatus as MidtransTransactionStatus,
    { transactionId, paymentType },
  );

  if (!result.applied) {
    // Order already moved on (duplicate/late webhook) — acknowledge, don't retry.
    return NextResponse.json({ ok: true, note: result.note });
  }

  return NextResponse.json({ ok: true });
}
