import { Wallet, Hourglass, PackageSearch, CircleCheck } from "lucide-react";

import { computeDashboardStats } from "@/lib/admin/dashboard-stats";
import type { Database } from "@/lib/supabase/types";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PesananAdmin =
  Database["public"]["Functions"]["admin_list_orders"]["Returns"][number];

export function DashboardStatCards({ pesanan }: { pesanan: PesananAdmin[] }) {
  const stats = computeDashboardStats(pesanan);

  const cards = [
    {
      label: "Pendapatan",
      value: `Rp${stats.pendapatan.toLocaleString("id-ID")}`,
      hint: "Dari seluruh pesanan yang sudah dibayar",
      icon: Wallet,
    },
    {
      label: "Menunggu Pembayaran",
      value: stats.menungguPembayaran,
      hint: "Belum ada Notifikasi Midtrans",
      icon: Hourglass,
    },
    {
      label: "Diproses",
      value: stats.diproses,
      hint: "Perlu dikirim oleh Admin",
      icon: PackageSearch,
    },
    {
      label: "Selesai",
      value: stats.selesai,
      hint: "Kredit sudah terkirim",
      icon: CircleCheck,
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map((card) => (
        <Card key={card.label} className="@container/card">
          <CardHeader>
            <CardDescription>{card.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
            <CardAction>
              <card.icon className="size-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            {card.hint}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
