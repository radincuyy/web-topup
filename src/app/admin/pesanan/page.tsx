import { getAllPesananAdmin } from "@/lib/admin/get-pesanan-admin";
import { PesananRowActions } from "@/components/features/admin/pesanan-row-actions";
import {
  STATUS_PESANAN_LABEL,
  STATUS_PESANAN_VARIANT,
} from "@/lib/orders/status-label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Always-fresh Admin data — no static shell worth preserving.
export const instant = false;

export default async function AdminPesananPage() {
  const pesanan = await getAllPesananAdmin();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Pesanan</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Produk</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pesanan.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Belum ada pesanan.
              </TableCell>
            </TableRow>
          ) : (
            pesanan.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="text-muted-foreground">
                  {p.customer_email}
                </TableCell>
                <TableCell className="font-medium">
                  {p.produk_nama} — {p.nominal_nama}
                </TableCell>
                <TableCell>Rp{p.harga.toLocaleString("id-ID")}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_PESANAN_VARIANT[p.status] ?? "outline"}>
                    {STATUS_PESANAN_LABEL[p.status] ?? p.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <PesananRowActions orderId={p.id} status={p.status} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
