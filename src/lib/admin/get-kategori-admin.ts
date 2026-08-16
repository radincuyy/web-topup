import { createClient } from "@/lib/supabase/server";

export async function getAllKategoriAdmin() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("kategori")
    .select("id, nama, slug, urutan")
    .order("urutan");

  return data ?? [];
}
