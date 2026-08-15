"use server";

import { createClient } from "@/lib/supabase/server";
import { createSnapTransaction } from "@/lib/midtrans/client";
import {
  destinationSchemas,
  type DestinationFieldType,
} from "@/lib/orders/destination";

type CreateOrderInput = {
  produkId: string;
  nominalId: string;
  destinationData: Record<string, string>;
};

type CreateOrderResult =
  | { error: string; orderId?: string }
  | { orderId: string; snapToken: string };

export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const user = auth?.claims;

  if (!user) {
    return { error: "Anda harus masuk untuk membeli." };
  }

  const { data: produk } = await supabase
    .from("produk")
    .select("id, nama, destination_field_type")
    .eq("id", input.produkId)
    .maybeSingle();

  if (!produk) {
    return { error: "Produk tidak ditemukan." };
  }

  const { data: nominal } = await supabase
    .from("nominal")
    .select("id, nama, harga, tersedia, produk_id")
    .eq("id", input.nominalId)
    .maybeSingle();

  if (!nominal || nominal.produk_id !== produk.id || !nominal.tersedia) {
    return { error: "Nominal tidak tersedia." };
  }

  const schema =
    destinationSchemas[produk.destination_field_type as DestinationFieldType];
  const parsedDestination = schema.safeParse(input.destinationData);

  if (!parsedDestination.success) {
    return { error: "Data tujuan tidak valid." };
  }

  const midtransOrderId = `ORDER-${crypto.randomUUID()}`;

  const { data: order, error: insertError } = await supabase
    .from("orders")
    .insert({
      customer_id: user.sub as string,
      produk_id: produk.id,
      nominal_id: nominal.id,
      nominal_nama: nominal.nama,
      harga: nominal.harga,
      destination_data: parsedDestination.data,
      midtrans_order_id: midtransOrderId,
    })
    .select("id")
    .single();

  if (insertError || !order) {
    return { error: "Gagal membuat pesanan. Coba lagi." };
  }

  try {
    const snap = await createSnapTransaction({
      orderId: midtransOrderId,
      grossAmount: nominal.harga,
      customerEmail: user.email as string,
      itemName: `${produk.nama} - ${nominal.nama}`,
    });

    return { orderId: order.id, snapToken: snap.token };
  } catch {
    return {
      orderId: order.id,
      error:
        "Pesanan tersimpan tapi gagal menghubungi payment gateway. Coba bayar lagi dari halaman pesanan.",
    };
  }
}
