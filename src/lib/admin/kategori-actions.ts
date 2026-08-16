"use server";

import { updateTag } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { KATALOG_CACHE_TAG } from "@/lib/catalog/get-katalog";
import { slugSchema } from "@/lib/admin/slug";
import { createClient } from "@/lib/supabase/server";

const kategoriSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  slug: slugSchema,
  urutan: z.coerce.number().int().min(0),
});

export async function createKategori(input: {
  nama: string;
  slug: string;
  urutan: number;
}) {
  await requireAdmin();
  const parsed = kategoriSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("kategori").insert(parsed.data);

  if (error) {
    if (error.code === "23505") {
      return { error: "Slug sudah dipakai kategori lain." };
    }
    return { error: "Gagal menambah kategori." };
  }

  updateTag(KATALOG_CACHE_TAG);
  return { ok: true };
}

export async function updateKategori(input: {
  id: string;
  nama: string;
  slug: string;
  urutan: number;
}) {
  await requireAdmin();
  const schema = kategoriSchema.extend({ id: z.uuid() });
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const supabase = await createClient();
  const { id, ...data } = parsed.data;
  const { error } = await supabase.from("kategori").update(data).eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Slug sudah dipakai kategori lain." };
    }
    return { error: "Gagal mengubah kategori." };
  }

  updateTag(KATALOG_CACHE_TAG);
  return { ok: true };
}

export async function deleteKategori(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("kategori").delete().eq("id", id);

  if (error) {
    if (error.code === "23503") {
      return {
        error: "Kategori masih dipakai oleh produk lain, tidak bisa dihapus.",
      };
    }
    return { error: "Gagal menghapus kategori." };
  }

  updateTag(KATALOG_CACHE_TAG);
  return { ok: true };
}
