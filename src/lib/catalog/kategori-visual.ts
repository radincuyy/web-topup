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

/**
 * Placeholder "cover art" gradient per Kategori, standing in for real
 * game/provider imagery until we have licensed assets (see icon+tint note
 * above — same constraint applies here).
 */
export const KATEGORI_GRADIENT: Record<string, string> = {
  game: "from-primary/30 via-primary/10 to-transparent",
  pulsa:
    "from-[oklch(0.7_0.18_300)]/30 via-[oklch(0.7_0.18_300)]/10 to-transparent",
  ewallet_topup: "from-success/30 via-success/10 to-transparent",
  token_pln: "from-warning/30 via-warning/10 to-transparent",
};

export function getKategoriIcon(slug: string): LucideIcon {
  return KATEGORI_ICON[slug] ?? Gamepad2;
}

export function getKategoriTint(slug: string): string {
  return KATEGORI_TINT[slug] ?? "bg-muted text-muted-foreground";
}

export function getKategoriGradient(slug: string): string {
  return KATEGORI_GRADIENT[slug] ?? "from-muted via-muted/40 to-transparent";
}
