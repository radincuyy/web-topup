import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/**
 * Redirects to /auth/login (not signed in) or / (signed in but not Admin).
 * Returns the caller's claims when they are an Admin.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const user = auth?.claims;

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.sub as string)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return user;
}
