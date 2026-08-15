"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KategoriCover } from "@/components/features/home/kategori-cover";

type Kategori = { id: string; slug: string; nama: string };
type Produk = {
  id: string;
  slug: string;
  nama: string;
  kategori_id: string;
  hargaMulaiDari: number | null;
};

export function SearchableCatalog({
  kategori,
  produk,
}: {
  kategori: Kategori[];
  produk: Produk[];
}) {
  const [query, setQuery] = useState("");
  const kategoriPertama = kategori[0]?.slug;

  const produkTersaring = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return produk;
    return produk.filter((p) => p.nama.toLowerCase().includes(q));
  }, [query, produk]);

  if (!kategoriPertama) {
    return (
      <p className="text-sm text-muted-foreground">Katalog belum tersedia.</p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari game atau produk..."
          className="h-10 pl-8"
        />
      </div>

      <Tabs defaultValue={kategoriPertama}>
        <TabsList className="mb-2">
          {kategori.map((k) => (
            <TabsTrigger key={k.id} value={k.slug}>
              {k.nama}
            </TabsTrigger>
          ))}
        </TabsList>
        {kategori.map((k) => {
          const produkKategori = produkTersaring.filter(
            (p) => p.kategori_id === k.id,
          );
          return (
            <TabsContent key={k.id} value={k.slug}>
              {produkKategori.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {produkKategori.map((p) => (
                    <Link key={p.id} href={`/produk/${p.slug}`}>
                      <Card className="gap-3 p-3 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-primary/30">
                        <KategoriCover slug={k.slug} />
                        <div className="px-1">
                          <p className="truncate font-medium">{p.nama}</p>
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
                  {query
                    ? "Produk tidak ditemukan."
                    : "Belum ada produk di kategori ini."}
                </p>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
