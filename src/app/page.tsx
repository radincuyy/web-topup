import Link from "next/link";

import { getKatalog } from "@/lib/catalog/get-katalog";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function HomePage() {
  const { kategori, produk } = await getKatalog();
  const kategoriPertama = kategori[0]?.slug;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">Top Up Game &amp; Pulsa</h1>
        <p className="text-muted-foreground">
          Pilih kategori, lalu produk yang mau kamu top up. Instan sampai ke
          akun tujuan.
        </p>
      </header>

      {kategoriPertama ? (
        <Tabs defaultValue={kategoriPertama}>
          <TabsList>
            {kategori.map((k) => (
              <TabsTrigger key={k.id} value={k.slug}>
                {k.nama}
              </TabsTrigger>
            ))}
          </TabsList>
          {kategori.map((k) => {
            const produkKategori = produk.filter((p) => p.kategori_id === k.id);
            return (
              <TabsContent key={k.id} value={k.slug}>
                {produkKategori.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {produkKategori.map((p) => (
                      <Link key={p.id} href={`/produk/${p.slug}`}>
                        <Card className="transition-shadow hover:shadow-md">
                          <CardHeader>
                            <CardTitle className="text-base">
                              {p.nama}
                            </CardTitle>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Belum ada produk di kategori ini.
                  </p>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      ) : (
        <p className="text-sm text-muted-foreground">
          Katalog belum tersedia.
        </p>
      )}
    </main>
  );
}
