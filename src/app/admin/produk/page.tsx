import { getAllProdukAdmin } from "@/lib/admin/get-produk-admin";
import { getAllKategoriAdmin } from "@/lib/admin/get-kategori-admin";
import { ProdukList } from "@/components/features/admin/produk-list";

// Always-fresh Admin data — no static shell worth preserving.
export const instant = false;

export default async function AdminProdukPage() {
  const [produk, kategori] = await Promise.all([
    getAllProdukAdmin(),
    getAllKategoriAdmin(),
  ]);

  return <ProdukList produkList={produk} kategoriList={kategori} />;
}
