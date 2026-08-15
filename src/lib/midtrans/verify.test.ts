import crypto from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { verifyMidtransSignature } from "./verify";

const ORIGINAL_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

function sign(orderId: string, statusCode: string, grossAmount: string, serverKey: string) {
  return crypto
    .createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest("hex");
}

describe("verifyMidtransSignature", () => {
  beforeEach(() => {
    process.env.MIDTRANS_SERVER_KEY = "SB-Mid-server-test-key";
  });

  afterEach(() => {
    process.env.MIDTRANS_SERVER_KEY = ORIGINAL_SERVER_KEY;
  });

  it("accepts a correctly computed signature", () => {
    const payload = {
      order_id: "ORDER-abc-123",
      status_code: "200",
      gross_amount: "40000.00",
    };
    const signature_key = sign(
      payload.order_id,
      payload.status_code,
      payload.gross_amount,
      "SB-Mid-server-test-key",
    );

    expect(verifyMidtransSignature({ ...payload, signature_key })).toBe(true);
  });

  it("rejects a tampered gross_amount", () => {
    const signature_key = sign(
      "ORDER-abc-123",
      "200",
      "40000.00",
      "SB-Mid-server-test-key",
    );

    expect(
      verifyMidtransSignature({
        order_id: "ORDER-abc-123",
        status_code: "200",
        gross_amount: "1.00",
        signature_key,
      }),
    ).toBe(false);
  });

  it("rejects a signature computed with the wrong server key", () => {
    const signature_key = sign(
      "ORDER-abc-123",
      "200",
      "40000.00",
      "some-other-key",
    );

    expect(
      verifyMidtransSignature({
        order_id: "ORDER-abc-123",
        status_code: "200",
        gross_amount: "40000.00",
        signature_key,
      }),
    ).toBe(false);
  });
});
