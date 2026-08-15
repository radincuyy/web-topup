import Link from "next/link";

import { getAllProdukAdmin } from "@/lib/admin/get-produk-admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

// Always-fresh Admin data — no static shell worth preserving.
export const instant = false;

export default async function AdminProdukPage() {
  const produk = await getAllProdukAdmin();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Produk</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kategori</TableHead>
            <TableHead>Produk</TableHead>
            <TableHead className="text-right">Kelola Nominal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produk.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <Badge variant="outline">{p.kategori?.nama}</Badge>
              </TableCell>
              <TableCell className="font-medium">{p.nama}</TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/admin/produk/${p.slug}`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Kelola
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
