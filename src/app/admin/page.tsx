import { getAllPesananAdmin } from "@/lib/admin/get-pesanan-admin";
import { DashboardStatCards } from "@/components/features/admin/dashboard-stat-cards";
import { DashboardChart } from "@/components/features/admin/dashboard-chart";
import { PerluTindakanList } from "@/components/features/admin/perlu-tindakan-list";

// Always-fresh Admin data — no static shell worth preserving.
export const instant = false;

export default async function AdminDashboardPage() {
  const pesanan = await getAllPesananAdmin();

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <h1 className="text-xl font-semibold">Ringkasan</h1>
      <DashboardStatCards pesanan={pesanan} />
      <DashboardChart pesanan={pesanan} />
      <PerluTindakanList pesanan={pesanan} />
    </div>
  );
}
