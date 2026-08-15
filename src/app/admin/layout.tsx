import Link from "next/link";

import { requireAdmin } from "@/lib/auth/require-admin";

// Every /admin route requires a fresh per-request auth check (requireAdmin
// reads cookies) — there is no static shell worth preserving here, so this
// segment is allowed to block instead of streaming via Suspense.
export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-4 border-b border-border pb-3 text-sm">
        <span className="font-heading font-medium">Admin</span>
        <Link href="/admin/produk" className="text-muted-foreground hover:text-foreground">
          Produk
        </Link>
        <Link href="/admin/pesanan" className="text-muted-foreground hover:text-foreground">
          Pesanan
        </Link>
        <Link href="/" className="ml-auto text-muted-foreground hover:text-foreground">
          Kembali ke situs
        </Link>
      </nav>
      {children}
    </div>
  );
}
