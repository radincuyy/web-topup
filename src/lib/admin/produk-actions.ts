"use server";

import { updateTag } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { produkCacheTag } from "@/lib/catalog/get-produk";
import { createClient } from "@/lib/supabase/server";

const nominalSchema = z.object({
  produkId: z.uuid(),
  produkSlug: z.string().min(1),
  nama: z.string().min(1, "Nama nominal wajib diisi"),
  harga: z.coerce.number().int().positive("Harga harus lebih dari 0"),
});

export async function createNominal(input: {
  produkId: string;
  produkSlug: string;
  nama: string;
  harga: number;
}) {
  await requireAdmin();
  const parsed = nominalSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("nominal").insert({
    produk_id: parsed.data.produkId,
    nama: parsed.data.nama,
    harga: parsed.data.harga,
  });

  if (error) {
    return { error: "Gagal menambah nominal." };
  }

  updateTag(produkCacheTag(parsed.data.produkSlug));
  return { ok: true };
}

export async function updateNominalHarga(input: {
  nominalId: string;
  produkSlug: string;
  harga: number;
}) {
  await requireAdmin();
  const schema = z.object({
    nominalId: z.uuid(),
    produkSlug: z.string().min(1),
    harga: z.coerce.number().int().positive("Harga harus lebih dari 0"),
  });
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("nominal")
    .update({ harga: parsed.data.harga })
    .eq("id", parsed.data.nominalId);

  if (error) {
    return { error: "Gagal mengubah harga." };
  }

  updateTag(produkCacheTag(parsed.data.produkSlug));
  return { ok: true };
}

export async function setNominalTersedia(input: {
  nominalId: string;
  produkSlug: string;
  tersedia: boolean;
}) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("nominal")
    .update({ tersedia: input.tersedia })
    .eq("id", input.nominalId);

  if (error) {
    return { error: "Gagal mengubah ketersediaan." };
  }

  updateTag(produkCacheTag(input.produkSlug));
  return { ok: true };
}
