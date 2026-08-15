import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getPesananSaya } from "@/lib/orders/get-pesanan-saya";
import {
  STATUS_PESANAN_LABEL,
  STATUS_PESANAN_VARIANT,
} from "@/lib/orders/status-label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Always own-user data — no static shell worth preserving.
export const instant = false;

export default function PesananSayaPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Pesanan Saya</h1>
      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground">Memuat pesanan...</p>
        }
      >
        <PesananSayaList />
      </Suspense>
    </main>
  );
}

async function PesananSayaList() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) {
    redirect("/auth/login");
  }

  const pesanan = await getPesananSaya();

  if (pesanan.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Belum ada pesanan. Yuk mulai belanja dari{" "}
        <Link href="/" className="text-primary underline-offset-4 hover:underline">
          halaman utama
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {pesanan.map((p) => (
        <Link key={p.id} href={`/pesanan/${p.id}`}>
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">
                  {p.produk?.nama} — {p.nominal_nama}
                </p>
                <p className="text-sm text-muted-foreground">
                  Rp{p.harga.toLocaleString("id-ID")} ·{" "}
                  {new Date(p.created_at).toLocaleString("id-ID")}
                </p>
              </div>
              <Badge variant={STATUS_PESANAN_VARIANT[p.status] ?? "outline"}>
                {STATUS_PESANAN_LABEL[p.status] ?? p.status}
              </Badge>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
