"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import { groupPesananByDay } from "@/lib/admin/dashboard-stats";
import type { Database } from "@/lib/supabase/types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type PesananAdmin =
  Database["public"]["Functions"]["admin_list_orders"]["Returns"][number];

const chartConfig = {
  jumlah: {
    label: "Pesanan",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const RANGE_LABEL: Record<string, string> = {
  "90": "90 hari terakhir",
  "30": "30 hari terakhir",
  "7": "7 hari terakhir",
};

export function DashboardChart({ pesanan }: { pesanan: PesananAdmin[] }) {
  const isMobile = useIsMobile();
  const [range, setRange] = React.useState("30");

  React.useEffect(() => {
    if (isMobile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- responsive default range switch; isMobile only resolves after mount
      setRange("7");
    }
  }, [isMobile]);

  const data = React.useMemo(
    () => groupPesananByDay(pesanan, Number(range)),
    [pesanan, range],
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Pesanan Masuk</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {RANGE_LABEL[range]}
          </span>
          <span className="@[540px]/card:hidden">Jumlah pesanan per hari</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            multiple={false}
            value={range ? [range] : []}
            onValueChange={(value) => {
              setRange(value[0] ?? "30");
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90">90 hari</ToggleGroupItem>
            <ToggleGroupItem value="30">30 hari</ToggleGroupItem>
            <ToggleGroupItem value="7">7 hari</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={range}
            onValueChange={(value) => {
              if (value !== null) {
                setRange(value);
              }
            }}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Pilih rentang"
            >
              <SelectValue placeholder="30 hari terakhir" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90" className="rounded-lg">
                90 hari terakhir
              </SelectItem>
              <SelectItem value="30" className="rounded-lg">
                30 hari terakhir
              </SelectItem>
              <SelectItem value="7" className="rounded-lg">
                7 hari terakhir
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillJumlah" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-jumlah)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-jumlah)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("id-ID", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="jumlah"
              type="natural"
              fill="url(#fillJumlah)"
              stroke="var(--color-jumlah)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
