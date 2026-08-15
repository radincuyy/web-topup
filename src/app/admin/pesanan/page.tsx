import { getAllPesananAdmin } from "@/lib/admin/get-pesanan-admin";
import { PesananAdminTable } from "@/components/features/admin/pesanan-admin-table";

// Always-fresh Admin data — no static shell worth preserving.
export const instant = false;

export default async function AdminPesananPage() {
  const pesanan = await getAllPesananAdmin();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Pesanan</h1>
      <PesananAdminTable pesanan={pesanan} />
    </div>
  );
}
