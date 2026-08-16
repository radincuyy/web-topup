import { createClient } from "@/lib/supabase/server";

export async function getAllProdukAdmin() {
  const supabase = await createClient();

  const { data: produk } = await supabase
    .from("produk")
    .select("id, slug, nama, urutan, aktif, kategori(nama, slug)")
    .order("urutan");

  return produk ?? [];
}

export async function getProdukWithNominalAdmin(slug: string) {
  const supabase = await createClient();

  const { data: produk } = await supabase
    .from("produk")
    .select(
      "id, slug, nama, destination_field_type, kategori_id, urutan, aktif, kategori(nama, slug)",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!produk) {
    return null;
  }

  const { data: nominal } = await supabase
    .from("nominal")
    .select("id, nama, harga, tersedia, urutan")
    .eq("produk_id", produk.id)
    .order("urutan");

  return { produk, nominal: nominal ?? [] };
}
