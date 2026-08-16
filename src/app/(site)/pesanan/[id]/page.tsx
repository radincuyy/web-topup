import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  STATUS_PESANAN_LABEL,
  STATUS_PESANAN_VARIANT,
} from "@/lib/orders/status-label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PesananPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground">Memuat pesanan...</p>
        }
      >
        <PesananDetail params={params} />
      </Suspense>
    </main>
  );
}

async function PesananDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) {
    redirect("/auth/login");
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, nominal_nama, harga, status, created_at, produk(nama)")
    .eq("id", id)
    .maybeSingle();

  if (!order) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/pesanan"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Pesanan Saya
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>
            {order.produk?.nama} — {order.nominal_nama}
          </CardTitle>
          <CardDescription>
            Rp{order.harga.toLocaleString("id-ID")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant={STATUS_PESANAN_VARIANT[order.status] ?? "outline"}>
            {STATUS_PESANAN_LABEL[order.status] ?? order.status}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
