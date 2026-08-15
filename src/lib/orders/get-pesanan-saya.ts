import { createClient } from "@/lib/supabase/server";

/**
 * Own-orders history. Not "use cache" — always fresh, and RLS (orders_select)
 * already scopes this to the caller's own rows via auth.uid().
 */
export async function getPesananSaya() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("id, nominal_nama, harga, status, created_at, produk(nama)")
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}
