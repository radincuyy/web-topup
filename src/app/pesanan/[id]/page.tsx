import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATUS_LABEL: Record<string, string> = {
  menunggu_pembayaran: "Menunggu Pembayaran",
  dibayar: "Dibayar",
  diproses: "Diproses",
  selesai: "Selesai",
  gagal: "Gagal",
  dibatalkan: "Dibatalkan",
};

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
        <Badge>{STATUS_LABEL[order.status] ?? order.status}</Badge>
      </CardContent>
    </Card>
  );
}
