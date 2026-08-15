import Link from "next/link";

import { getKatalog } from "@/lib/catalog/get-katalog";
import { getKategoriIcon, getKategoriTint } from "@/lib/catalog/kategori-visual";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function HomePage() {
  const { kategori, produk } = await getKatalog();
  const kategoriPertama = kategori[0]?.slug;

  return (
    <main>
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-14 sm:py-20">
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Top up game &amp; pulsa,{" "}
            <span className="text-primary">tanpa nunggu.</span>
          </h1>
          <p className="max-w-md text-muted-foreground">
            Pilih game atau provider, isi tujuan, bayar pakai QRIS, e-wallet,
            VA, atau kartu — kreditnya langsung diproses.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10">
        {kategoriPertama ? (
          <Tabs defaultValue={kategoriPertama}>
            <TabsList className="mb-6">
              {kategori.map((k) => (
                <TabsTrigger key={k.id} value={k.slug}>
                  {k.nama}
                </TabsTrigger>
              ))}
            </TabsList>
            {kategori.map((k) => {
              const produkKategori = produk.filter((p) => p.kategori_id === k.id);
              const Icon = getKategoriIcon(k.slug);
              const tint = getKategoriTint(k.slug);
              return (
                <TabsContent key={k.id} value={k.slug}>
                  {produkKategori.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {produkKategori.map((p) => (
                        <Link key={p.id} href={`/produk/${p.slug}`}>
                          <Card className="gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-primary/30">
                            <div
                              className={`flex size-11 items-center justify-center rounded-xl ${tint}`}
                            >
                              <Icon className="size-5" />
                            </div>
                            <div>
                              <p className="font-medium">{p.nama}</p>
                              <p className="text-sm text-muted-foreground">
                                {p.hargaMulaiDari
                                  ? `Mulai Rp${p.hargaMulaiDari.toLocaleString("id-ID")}`
                                  : "Segera hadir"}
                              </p>
                            </div>
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
      </div>
    </main>
  );
}
