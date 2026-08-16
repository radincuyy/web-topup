import { getAllKategoriAdmin } from "@/lib/admin/get-kategori-admin";
import { KategoriManager } from "@/components/features/admin/kategori-manager";

// Always-fresh Admin data — no static shell worth preserving.
export const instant = false;

export default async function AdminKategoriPage() {
  const kategori = await getAllKategoriAdmin();

  return <KategoriManager kategoriList={kategori} />;
}
