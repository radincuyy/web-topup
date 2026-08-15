export const STATUS_PESANAN_LABEL: Record<string, string> = {
  menunggu_pembayaran: "Menunggu Pembayaran",
  dibayar: "Dibayar",
  diproses: "Diproses",
  selesai: "Selesai",
  gagal: "Gagal",
  dibatalkan: "Dibatalkan",
};

export const STATUS_PESANAN_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  menunggu_pembayaran: "outline",
  dibayar: "secondary",
  diproses: "secondary",
  selesai: "default",
  gagal: "destructive",
  dibatalkan: "destructive",
};
