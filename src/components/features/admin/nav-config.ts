import { ClipboardList, LayoutDashboard, Package, Tags } from "lucide-react";

export const ADMIN_NAV = [
  { title: "Ringkasan", url: "/admin", icon: LayoutDashboard },
  { title: "Pesanan", url: "/admin/pesanan", icon: ClipboardList },
  { title: "Produk", url: "/admin/produk", icon: Package },
  { title: "Kategori", url: "/admin/kategori", icon: Tags },
] as const;

/**
 * Picks the most specific (longest) matching nav item for a pathname.
 * "/admin" is a prefix of every admin route, so a plain startsWith scan
 * would always match Ringkasan first — pick the longest match instead.
 */
export function getActiveAdminNavItem(pathname: string) {
  const matches = ADMIN_NAV.filter(
    (item) => pathname === item.url || pathname.startsWith(item.url + "/"),
  );
  return matches.sort((a, b) => b.url.length - a.url.length)[0];
}
