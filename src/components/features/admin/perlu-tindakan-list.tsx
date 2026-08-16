import Link from "next/link";

import { getPerluTindakan } from "@/lib/admin/dashboard-stats";
import { formatDestinationData } from "@/lib/orders/format-destination";
import type { Database } from "@/lib/supabase/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TandaiTerkirimButton } from "@/components/features/admin/tandai-terkirim-button";
import { DiprosesAging } from "@/components/features/admin/diproses-aging";

type PesananAdmin =
  Database["public"]["Functions"]["admin_list_orders"]["Returns"][number];

export function PerluTindakanList({ pesanan }: { pesanan: PesananAdmin[] }) {
  const antrean = getPerluTindakan(pesanan);

  return (
    <Card className="@container/card">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Perlu Tindakan</CardTitle>
        <Link
          href="/admin/pesanan"
          className="text-sm text-muted-foreground hover:underline"
        >
          Lihat semua pesanan
        </Link>
      </CardHeader>
      <CardContent>
        {antrean.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Tidak ada pesanan yang menunggu diproses.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {antrean.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/pesanan/${p.id}`}
                    className="font-medium hover:underline"
                  >
                    {p.produk_nama} — {p.nominal_nama}
                  </Link>
                  <p className="truncate text-sm text-muted-foreground">
                    {p.customer_email} ·{" "}
                    {formatDestinationData(p.destination_field_type, p.destination_data)}
                  </p>
                  <DiprosesAging updatedAt={p.updated_at} />
                </div>
                <TandaiTerkirimButton orderId={p.id} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
