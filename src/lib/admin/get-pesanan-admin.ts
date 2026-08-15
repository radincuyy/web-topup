import { createClient } from "@/lib/supabase/server";

export async function getAllPesananAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_list_orders");

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function getPesananDetailAdmin(orderId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("admin_get_order", { p_order_id: orderId })
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}
