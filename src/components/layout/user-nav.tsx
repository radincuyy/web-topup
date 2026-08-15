import Link from "next/link";

import { signOut } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { Button, buttonVariants } from "@/components/ui/button";

export async function UserNav() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login" className={buttonVariants({ variant: "ghost" })}>
          Masuk
        </Link>
        <Link href="/auth/sign-up" className={buttonVariants()}>
          Daftar
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">{user.email}</span>
      <form action={signOut}>
        <Button variant="outline" size="sm" type="submit">
          Keluar
        </Button>
      </form>
    </div>
  );
}
