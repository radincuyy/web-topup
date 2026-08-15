const MIDTRANS_SNAP_BASE = "https://app.sandbox.midtrans.com/snap/v1";
const MIDTRANS_CORE_API_BASE = "https://api.sandbox.midtrans.com/v2";

function authHeader() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    throw new Error("MIDTRANS_SERVER_KEY is not set");
  }
  return "Basic " + Buffer.from(`${serverKey}:`).toString("base64");
}

export async function createSnapTransaction(input: {
  orderId: string;
  grossAmount: number;
  customerEmail: string;
  itemName: string;
}): Promise<{ token: string; redirect_url: string }> {
  const res = await fetch(`${MIDTRANS_SNAP_BASE}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: input.orderId,
        gross_amount: input.grossAmount,
      },
      customer_details: {
        email: input.customerEmail,
      },
      item_details: [
        {
          id: input.orderId,
          price: input.grossAmount,
          quantity: 1,
          name: input.itemName.slice(0, 50),
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Midtrans error ${res.status}: ${body}`);
  }

  return res.json();
}

/**
 * Core API status check — the Admin "Sinkronisasi Status" fallback for when
 * a Notifikasi Midtrans webhook is missed or delayed.
 */
export async function getTransactionStatus(orderId: string): Promise<{
  order_id: string;
  status_code: string;
  gross_amount: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
  transaction_id?: string;
}> {
  const res = await fetch(`${MIDTRANS_CORE_API_BASE}/${orderId}/status`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: authHeader(),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Midtrans error ${res.status}: ${body}`);
  }

  return res.json();
}
