import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getProdukBySlug } from "@/lib/catalog/get-produk";
import type { DestinationFieldType } from "@/lib/orders/destination";
import { CheckoutForm } from "@/components/features/checkout/checkout-form";

export default function ProdukPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground">Memuat produk...</p>
        }
      >
        <ProdukDetail params={params} />
      </Suspense>
    </main>
  );
}

async function ProdukDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getProdukBySlug(slug);

  if (!result) {
    notFound();
  }

  const { produk, nominal } = result;

  return (
    <>
      <header className="mb-6">
        <p className="text-sm text-muted-foreground">{produk.kategori?.nama}</p>
        <h1 className="text-2xl font-semibold">{produk.nama}</h1>
      </header>

      {nominal.length > 0 ? (
        <CheckoutForm
          produkId={produk.id}
          destinationFieldType={
            produk.destination_field_type as DestinationFieldType
          }
          nominalList={nominal}
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          Belum ada nominal tersedia untuk produk ini.
        </p>
      )}
    </>
  );
}
