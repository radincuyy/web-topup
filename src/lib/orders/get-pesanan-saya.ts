import { createClient } from "@/lib/supabase/server";

/**
 * Own-orders history. Not "use cache" — always fresh. Filters explicitly by
 * customer_id rather than relying on RLS alone: orders_select also lets
 * Admins read every row (for the Admin Pesanan page), so an unfiltered query
 * here would leak every Customer's orders to an Admin visiting this page.
 */
export async function getPesananSaya() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub as string | undefined;

  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select("id, nominal_nama, harga, status, created_at, produk(nama)")
    .eq("customer_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}
