import { createClient } from "@/lib/supabase/server";

export async function getAllPesananAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_list_orders");

  if (error) {
    return [];
  }

  return data ?? [];
}
