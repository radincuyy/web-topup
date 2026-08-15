const MIDTRANS_SNAP_BASE = "https://app.sandbox.midtrans.com/snap/v1";

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
