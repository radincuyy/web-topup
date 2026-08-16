import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getProdukWithNominalAdmin } from "@/lib/admin/get-produk-admin";
import { getAllKategoriAdmin } from "@/lib/admin/get-kategori-admin";
import { NominalManager } from "@/components/features/admin/nominal-manager";
import { ProdukEditForm } from "@/components/features/admin/produk-edit-form";

export default function AdminProdukDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">Memuat...</p>}
    >
      <AdminProdukDetail params={params} />
    </Suspense>
  );
}

async function AdminProdukDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [result, kategoriList] = await Promise.all([
    getProdukWithNominalAdmin(slug),
    getAllKategoriAdmin(),
  ]);

  if (!result) {
    notFound();
  }

  const { produk, nominal } = result;

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <header>
        <p className="text-sm text-muted-foreground">{produk.kategori?.nama}</p>
        <h1 className="text-xl font-semibold">{produk.nama}</h1>
      </header>
      <ProdukEditForm produk={produk} kategoriList={kategoriList} />
      <NominalManager
        produkId={produk.id}
        produkSlug={produk.slug}
        nominalList={nominal}
      />
    </div>
  );
}
