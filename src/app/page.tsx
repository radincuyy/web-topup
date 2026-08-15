import Link from "next/link";
import {
  Banknote,
  ClipboardList,
  Clock,
  CreditCard,
  Headset,
  QrCode,
  Search,
  ShieldCheck,
  Tag,
  Wallet,
  Zap,
} from "lucide-react";

import { getKatalog } from "@/lib/catalog/get-katalog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchableCatalog } from "@/components/features/home/searchable-catalog";
import Image from "next/image";
import poster from "../../public/poster.png";

const TRUST_STRIP = [
  { icon: Zap, label: "Proses instan" },
  { icon: ShieldCheck, label: "Pembayaran aman" },
  { icon: Clock, label: "Buka 24 jam" },
  { icon: CreditCard, label: "Banyak metode pembayaran" },
];

const LANGKAH = [
  {
    icon: Search,
    judul: "Pilih Produk",
    deskripsi: "Cari game, pulsa, atau produk lain yang mau kamu top up.",
  },
  {
    icon: ClipboardList,
    judul: "Isi Data Akun",
    deskripsi: "Masukkan User ID atau nomor tujuan sesuai produk.",
  },
  {
    icon: Wallet,
    judul: "Pilih Pembayaran",
    deskripsi: "QRIS, e-wallet, virtual account, atau kartu — bebas pilih.",
  },
  {
    icon: Zap,
    judul: "Terima Instan",
    deskripsi: "Kredit langsung masuk ke akun tujuan begitu bayar sukses.",
  },
];

const METODE_PEMBAYARAN = [
  { icon: QrCode, label: "QRIS" },
  { icon: Wallet, label: "E-Wallet" },
  { icon: Banknote, label: "Virtual Account" },
  { icon: CreditCard, label: "Kartu Debit/Kredit" },
];

const KEUNGGULAN = [
  {
    icon: Zap,
    judul: "Proses Instan",
    deskripsi: "Kredit diproses otomatis begitu pembayaran terkonfirmasi.",
  },
  {
    icon: ShieldCheck,
    judul: "Aman & Terpercaya",
    deskripsi: "Pembayaran diproses lewat gateway tepercaya, bukan manual.",
  },
  {
    icon: Headset,
    judul: "Bantuan 24/7",
    deskripsi: "Status pesanan bisa dipantau kapan saja lewat halaman Pesanan.",
  },
  {
    icon: Tag,
    judul: "Harga Transparan",
    deskripsi: "Harga tiap nominal jelas di depan, tanpa biaya tersembunyi.",
  },
];

export default async function HomePage() {
  const { kategori, produk } = await getKatalog();

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card/40">
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-transparent to-transparent"
          aria-hidden
        />
        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-5">
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Top up game &amp; pulsa,{" "}
              <span className="text-primary">tanpa nunggu.</span>
            </h1>
            <p className="max-w-md text-muted-foreground">
              Pilih game atau provider, isi tujuan, bayar pakai QRIS, e-wallet,
              VA, atau kartu kredit langsung diproses.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" nativeButton={false} render={<Link href="#katalog" />}>
                Mulai Top Up
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<Link href="/pesanan" />}
              >
                Cek Status Pesanan
              </Button>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
              {TRUST_STRIP.map((t) => (
                <div
                  key={t.label}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <t.icon className="size-4 text-primary" />
                  {t.label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto aspect-video w-full max-w-sm">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
            <Image
              src={poster}
              alt="Cudatop — top up game, pulsa, voucher digital, dan e-wallet cepat, aman, dan praktis"
              fill
              priority
              sizes="(min-width: 1024px) 24rem, 80vw"
              className="object-contain rounded-4xl"
            />
          </div>
        </div>
      </section>

      {/* Katalog */}
      <div id="katalog" className="mx-auto max-w-5xl scroll-mt-16 px-4 py-10">
        <h2 className="mb-6 font-heading text-2xl font-semibold tracking-tight">
          Semua Produk
        </h2>
        <SearchableCatalog kategori={kategori} produk={produk} />
      </div>

      {/* Cara top up */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="mb-8 font-heading text-2xl font-semibold tracking-tight">
            Cara Top Up
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LANGKAH.map((l, i) => (
              <div key={l.judul} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <l.icon className="size-5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Langkah {i + 1}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{l.judul}</p>
                  <p className="text-sm text-muted-foreground">{l.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metode pembayaran */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="mb-6 font-heading text-2xl font-semibold tracking-tight">
          Metode Pembayaran
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {METODE_PEMBAYARAN.map((m) => (
            <Card
              key={m.label}
              className="flex-row items-center gap-3 p-4"
            >
              <m.icon className="size-5 text-primary" />
              <span className="text-sm font-medium">{m.label}</span>
            </Card>
          ))}
        </div>
      </section>

      {/* Kenapa Cudatop */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="mb-8 font-heading text-2xl font-semibold tracking-tight">
            Kenapa Cudatop
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {KEUNGGULAN.map((k) => (
              <Card key={k.judul} className="gap-2 p-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <k.icon className="size-4.5" />
                </div>
                <p className="font-medium">{k.judul}</p>
                <p className="text-sm text-muted-foreground">{k.deskripsi}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
