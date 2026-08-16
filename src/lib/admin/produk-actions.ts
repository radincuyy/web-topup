"use server";

import { updateTag } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { KATALOG_CACHE_TAG } from "@/lib/catalog/get-katalog";
import { produkCacheTag } from "@/lib/catalog/get-produk";
import { DESTINATION_FIELD_TYPES } from "@/lib/orders/destination";
import { slugSchema } from "@/lib/admin/slug";
import { createClient } from "@/lib/supabase/server";

const nominalSchema = z.object({
  produkId: z.uuid(),
  produkSlug: z.string().min(1),
  nama: z.string().min(1, "Nama nominal wajib diisi"),
  harga: z.coerce.number().int().positive("Harga harus lebih dari 0"),
  urutan: z.coerce.number().int().min(0),
});

export async function createNominal(input: {
  produkId: string;
  produkSlug: string;
  nama: string;
  harga: number;
  urutan: number;
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
    urutan: parsed.data.urutan,
  });

  if (error) {
    return { error: "Gagal menambah nominal." };
  }

  updateTag(produkCacheTag(parsed.data.produkSlug));
  return { ok: true };
}

export async function updateNominal(input: {
  nominalId: string;
  produkSlug: string;
  nama: string;
  harga: number;
  urutan: number;
}) {
  await requireAdmin();
  const schema = nominalSchema
    .omit({ produkId: true })
    .extend({ nominalId: z.uuid() });
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("nominal")
    .update({
      nama: parsed.data.nama,
      harga: parsed.data.harga,
      urutan: parsed.data.urutan,
    })
    .eq("id", parsed.data.nominalId);

  if (error) {
    return { error: "Gagal mengubah nominal." };
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

export async function deleteNominal(input: {
  nominalId: string;
  produkSlug: string;
}) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("nominal")
    .delete()
    .eq("id", input.nominalId);

  if (error) {
    if (error.code === "23503") {
      return {
        error: "Nominal ini sudah punya pesanan, nonaktifkan saja lewat toggle Tersedia.",
      };
    }
    return { error: "Gagal menghapus nominal." };
  }

  updateTag(produkCacheTag(input.produkSlug));
  return { ok: true };
}

const produkSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  slug: slugSchema,
  kategoriId: z.uuid(),
  destinationFieldType: z.enum(DESTINATION_FIELD_TYPES),
  urutan: z.coerce.number().int().min(0),
});

export async function createProduk(
  input: z.input<typeof produkSchema>,
) {
  await requireAdmin();
  const parsed = produkSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("produk").insert({
    nama: parsed.data.nama,
    slug: parsed.data.slug,
    kategori_id: parsed.data.kategoriId,
    destination_field_type: parsed.data.destinationFieldType,
    urutan: parsed.data.urutan,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Slug sudah dipakai produk lain." };
    }
    return { error: "Gagal menambah produk." };
  }

  updateTag(KATALOG_CACHE_TAG);
  return { ok: true };
}

export async function updateProduk(
  input: z.input<typeof produkSchema> & { id: string },
) {
  await requireAdmin();
  const schema = produkSchema.extend({ id: z.uuid() });
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const supabase = await createClient();
  const { id, kategoriId, destinationFieldType, ...rest } = parsed.data;
  const { error } = await supabase
    .from("produk")
    .update({
      ...rest,
      kategori_id: kategoriId,
      destination_field_type: destinationFieldType,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Slug sudah dipakai produk lain." };
    }
    return { error: "Gagal mengubah produk." };
  }

  updateTag(produkCacheTag(parsed.data.slug));
  updateTag(KATALOG_CACHE_TAG);
  return { ok: true };
}

export async function setProdukAktif(input: {
  id: string;
  slug: string;
  aktif: boolean;
}) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("produk")
    .update({ aktif: input.aktif })
    .eq("id", input.id);

  if (error) {
    return { error: "Gagal mengubah status produk." };
  }

  updateTag(produkCacheTag(input.slug));
  updateTag(KATALOG_CACHE_TAG);
  return { ok: true };
}

export async function deleteProduk(input: { id: string; slug: string }) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("produk").delete().eq("id", input.id);

  if (error) {
    if (error.code === "23503") {
      return {
        error:
          "Produk ini masih punya nominal atau pesanan, nonaktifkan saja alih-alih dihapus.",
      };
    }
    return { error: "Gagal menghapus produk." };
  }

  updateTag(produkCacheTag(input.slug));
  updateTag(KATALOG_CACHE_TAG);
  return { ok: true };
}
