import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, QrCode, Smartphone, Wallet } from "lucide-react";

import logo from "../../../public/logo.png";

const tautan = [
  { href: "/", label: "Beranda" },
  { href: "/pesanan", label: "Pesanan Saya" },
  { href: "/auth/login", label: "Masuk" },
];

const metodePembayaran = [
  { label: "QRIS", icon: QrCode },
  { label: "E-Wallet", icon: Wallet },
  { label: "Virtual Account", icon: Smartphone },
  { label: "Kartu Debit/Kredit", icon: CreditCard },
];

export async function SiteFooter() {
  "use cache";
  cacheLife("days");

  const tahun = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
        <div className="flex flex-col justify-between gap-6 sm:flex-row">
          <div className="flex max-w-xs flex-col gap-2">
            <div className="flex items-center gap-2 font-heading text-lg font-semibold">
              <Image src={logo} alt="" className="size-6 w-auto" />
              <span className="text-primary">Cudatop</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Top up game dan pulsa, instan sampai ke akun tujuan.
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            {tautan.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-6">
          <p className="text-xs font-medium text-muted-foreground">
            Metode Pembayaran
          </p>
          <div className="flex flex-wrap gap-3">
            {metodePembayaran.map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground"
              >
                <m.icon className="size-3.5" />
                {m.label}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          © {tahun} Cudatop. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
