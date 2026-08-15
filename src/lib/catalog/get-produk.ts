import { cacheLife } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export async function getProdukBySlug(slug: string) {
  "use cache";
  cacheLife("minutes");

  const supabase = createPublicClient();

  const { data: produk } = await supabase
    .from("produk")
    .select("id, slug, nama, destination_field_type, kategori(nama, slug)")
    .eq("slug", slug)
    .maybeSingle();

  if (!produk) {
    return null;
  }

  const { data: nominal } = await supabase
    .from("nominal")
    .select("id, nama, harga, tersedia, urutan")
    .eq("produk_id", produk.id)
    .eq("tersedia", true)
    .order("urutan");

  return { produk, nominal: nominal ?? [] };
}
