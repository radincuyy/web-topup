"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Database } from "@/lib/supabase/types";
import { formatDestinationData } from "@/lib/orders/format-destination";
import {
  STATUS_PESANAN_LABEL,
  STATUS_PESANAN_VARIANT,
} from "@/lib/orders/status-label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TandaiTerkirimButton } from "@/components/features/admin/tandai-terkirim-button";
import { PesananSecondaryActions } from "@/components/features/admin/pesanan-secondary-actions";
import { RelativeTime } from "@/components/features/admin/relative-time";
import { DiprosesAging } from "@/components/features/admin/diproses-aging";

type PesananAdmin =
  Database["public"]["Functions"]["admin_list_orders"]["Returns"][number];

const STATUS_TABS = [
  { value: "diproses", label: "Diproses" },
  { value: "semua", label: "Semua" },
  { value: "menunggu_pembayaran", label: "Menunggu Pembayaran" },
  { value: "dibayar", label: "Dibayar" },
  { value: "selesai", label: "Selesai" },
  { value: "gagal", label: "Gagal" },
  { value: "dibatalkan", label: "Dibatalkan" },
] as const;

function filterAndSort(pesanan: PesananAdmin[], status: string) {
  const filtered =
    status === "semua" ? pesanan : pesanan.filter((p) => p.status === status);

  if (status === "diproses") {
    // Oldest-waiting first — that's the actual fulfillment queue order.
    return [...filtered].sort(
      (a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
    );
  }
  return [...filtered].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function PesananAdminTable({ pesanan }: { pesanan: PesananAdmin[] }) {
  const [activeTab, setActiveTab] = useState<string>("diproses");

  const countByStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of pesanan) {
      counts[p.status] = (counts[p.status] ?? 0) + 1;
    }
    return counts;
  }, [pesanan]);

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as string)}>
      <TabsList className="mb-4 h-auto flex-wrap">
        {STATUS_TABS.map((t) => {
          const count =
            t.value === "semua" ? pesanan.length : (countByStatus[t.value] ?? 0);
          return (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
              {count > 0 ? (
                <span className="text-muted-foreground">({count})</span>
              ) : null}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {STATUS_TABS.map((t) => (
        <TabsContent key={t.value} value={t.value}>
          <PesananTableBody
            pesanan={filterAndSort(pesanan, t.value)}
            emphasizeAging={t.value === "diproses"}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function PesananTableBody({
  pesanan,
  emphasizeAging,
}: {
  pesanan: PesananAdmin[];
  emphasizeAging: boolean;
}) {
  if (pesanan.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Tidak ada pesanan di kategori ini.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Produk</TableHead>
          <TableHead>Tujuan</TableHead>
          <TableHead>Waktu</TableHead>
          <TableHead>Harga</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pesanan.map((p) => (
          <TableRow key={p.id}>
            <TableCell
              className="max-w-[160px] truncate text-muted-foreground"
              title={p.customer_email}
            >
              {p.customer_email}
            </TableCell>
            <TableCell className="font-medium">
              <Link href={`/admin/pesanan/${p.id}`} className="hover:underline">
                {p.produk_nama} — {p.nominal_nama}
              </Link>
            </TableCell>
            <TableCell
              className="max-w-[180px] truncate text-muted-foreground"
              title={formatDestinationData(p.destination_field_type, p.destination_data)}
            >
              {formatDestinationData(p.destination_field_type, p.destination_data)}
            </TableCell>
            <TableCell className="text-muted-foreground">
              <RelativeTime date={p.created_at} />
            </TableCell>
            <TableCell>Rp{p.harga.toLocaleString("id-ID")}</TableCell>
            <TableCell>
              <div className="flex flex-col gap-0.5">
                <Badge variant={STATUS_PESANAN_VARIANT[p.status] ?? "outline"}>
                  {STATUS_PESANAN_LABEL[p.status] ?? p.status}
                </Badge>
                {emphasizeAging && p.status === "diproses" ? (
                  <DiprosesAging updatedAt={p.updated_at} />
                ) : null}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-2">
                {p.status === "diproses" ? (
                  <TandaiTerkirimButton orderId={p.id} />
                ) : null}
                <PesananSecondaryActions orderId={p.id} status={p.status} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
