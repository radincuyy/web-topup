import { cacheLife } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

/**
 * Kategori/Produk are publicly readable (RLS: kategori_select_public,
 * produk_select_public) and don't depend on the requester's session, so this
 * uses a plain client instead of the cookie-based server client — reading
 * cookies() here would pull runtime data into a "use cache" scope.
 */
function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export async function getKatalog() {
  "use cache";
  cacheLife("minutes");

  const supabase = createPublicClient();

  const [{ data: kategori }, { data: produk }] = await Promise.all([
    supabase.from("kategori").select("id, slug, nama, urutan").order("urutan"),
    supabase
      .from("produk")
      .select("id, slug, nama, kategori_id, destination_field_type, urutan")
      .order("urutan"),
  ]);

  return {
    kategori: kategori ?? [],
    produk: produk ?? [],
  };
}
