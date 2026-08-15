import crypto from "node:crypto";

export function verifyMidtransSignature(payload: {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
}): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    throw new Error("MIDTRANS_SERVER_KEY is not set");
  }

  const expected = crypto
    .createHash("sha512")
    .update(
      `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`,
    )
    .digest("hex");

  return expected === payload.signature_key;
}
