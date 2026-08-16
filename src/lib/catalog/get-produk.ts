import { cacheLife, cacheTag } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";
import { KATALOG_CACHE_TAG } from "@/lib/catalog/get-katalog";

function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export function produkCacheTag(slug: string) {
  return `produk:${slug}`;
}

export async function getProdukBySlug(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(produkCacheTag(slug));
  cacheTag(KATALOG_CACHE_TAG);

  const supabase = createPublicClient();

  const { data: produk } = await supabase
    .from("produk")
    .select("id, slug, nama, destination_field_type, kategori(nama, slug)")
    .eq("slug", slug)
    .eq("aktif", true)
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
