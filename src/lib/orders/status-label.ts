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
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
> = {
  menunggu_pembayaran: "outline",
  dibayar: "default",
  diproses: "warning",
  selesai: "success",
  gagal: "destructive",
  dibatalkan: "destructive",
};
