import { ClipboardList, Package, Tags } from "lucide-react";

export const ADMIN_NAV = [
  { title: "Pesanan", url: "/admin/pesanan", icon: ClipboardList },
  { title: "Produk", url: "/admin/produk", icon: Package },
  { title: "Kategori", url: "/admin/kategori", icon: Tags },
] as const;
