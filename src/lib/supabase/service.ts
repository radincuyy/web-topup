import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

export function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { persistSession: false } },
  );
}
