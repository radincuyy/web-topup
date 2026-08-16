import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getPesananDetailAdmin } from "@/lib/admin/get-pesanan-admin";
import {
  destinationFieldLabels,
  type DestinationFieldType,
} from "@/lib/orders/destination";
import {
  STATUS_PESANAN_LABEL,
  STATUS_PESANAN_VARIANT,
} from "@/lib/orders/status-label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyableField } from "@/components/features/admin/copyable-field";
import { TandaiTerkirimButton } from "@/components/features/admin/tandai-terkirim-button";
import { PesananSecondaryActions } from "@/components/features/admin/pesanan-secondary-actions";
import { RelativeTime } from "@/components/features/admin/relative-time";

// Always-fresh Admin data — no static shell worth preserving.
export const instant = false;

export default function AdminPesananDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">Memuat...</p>}
    >
      <AdminPesananDetail params={params} />
    </Suspense>
  );
}

async function AdminPesananDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getPesananDetailAdmin(id);

  if (!order) {
    notFound();
  }

  const destinationFields =
    destinationFieldLabels[order.destination_field_type as DestinationFieldType] ??
    [];
  const destinationData = order.destination_data as Record<string, string> | null;

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
          <h1 className="text-xl font-semibold">
            {order.produk_nama} — {order.nominal_nama}
          </h1>
          <p className="text-lg font-medium">
            Rp{order.harga.toLocaleString("id-ID")}
          </p>
        </div>
        <Badge variant={STATUS_PESANAN_VARIANT[order.status] ?? "outline"}>
          {STATUS_PESANAN_LABEL[order.status] ?? order.status}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {order.status === "diproses" ? (
          <TandaiTerkirimButton orderId={order.id} size="default" />
        ) : null}
        <PesananSecondaryActions orderId={order.id} status={order.status} />
      </div>

      {order.status === "gagal" && order.gagal_reason ? (
        <Card className="ring-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Alasan Gagal</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{order.gagal_reason}</CardContent>
        </Card>
      ) : null}

      {order.status === "dibatalkan" && order.dibatalkan_oleh ? (
        <Card>
          <CardHeader>
            <CardTitle>Dibatalkan Oleh</CardTitle>
          </CardHeader>
          <CardContent className="text-sm capitalize">
            {order.dibatalkan_oleh}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Tujuan Pengiriman</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {destinationFields.length > 0 && destinationData ? (
            destinationFields.map((f) => (
              <InfoField
                key={f.field}
                label={f.label}
                value={destinationData[f.field] ?? null}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Tidak ada data tujuan.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <InfoField label="Metode Pembayaran" value={order.metode_pembayaran} />
          <InfoField label="Midtrans Order ID" value={order.midtrans_order_id} />
          <InfoField
            label="Midtrans Transaction ID"
            value={order.midtrans_transaction_id}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Waktu</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Dibuat</p>
            <RelativeTime date={order.created_at} />
          </div>
          <div>
            <p className="text-muted-foreground">Diperbarui</p>
            <RelativeTime date={order.updated_at} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string | null }) {
  if (!value) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-muted-foreground">-</p>
        </div>
      </div>
    );
  }

  return <CopyableField label={label} value={value} />;
}
