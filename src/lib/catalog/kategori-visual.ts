import { Gamepad2, Smartphone, Wallet, Zap, type LucideIcon } from "lucide-react";

/**
 * We have no licensed game/provider cover art, so each Kategori gets a
 * consistent icon + tint instead (see docs — PRODUCT.md forbids fabricating
 * commercial assets). One lucide icon, one accent per Kategori, used
 * everywhere that Kategori appears.
 */
export const KATEGORI_ICON: Record<string, LucideIcon> = {
  game: Gamepad2,
  pulsa: Smartphone,
  ewallet_topup: Wallet,
  token_pln: Zap,
};

export const KATEGORI_TINT: Record<string, string> = {
  game: "bg-primary/15 text-primary",
  pulsa: "bg-[oklch(0.7_0.18_300)]/15 text-[oklch(0.7_0.18_300)]",
  ewallet_topup: "bg-success/15 text-success",
  token_pln: "bg-warning/15 text-warning",
};

export function getKategoriIcon(slug: string): LucideIcon {
  return KATEGORI_ICON[slug] ?? Gamepad2;
}

export function getKategoriTint(slug: string): string {
  return KATEGORI_TINT[slug] ?? "bg-muted text-muted-foreground";
}
