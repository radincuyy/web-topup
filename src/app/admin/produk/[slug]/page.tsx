import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getProdukWithNominalAdmin } from "@/lib/admin/get-produk-admin";
import { NominalManager } from "@/components/features/admin/nominal-manager";

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
  const result = await getProdukWithNominalAdmin(slug);

  if (!result) {
    notFound();
  }

  const { produk, nominal } = result;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-sm text-muted-foreground">{produk.kategori?.nama}</p>
        <h1 className="text-xl font-semibold">{produk.nama}</h1>
      </header>
      <NominalManager
        produkId={produk.id}
        produkSlug={produk.slug}
        nominalList={nominal}
      />
    </div>
  );
}
