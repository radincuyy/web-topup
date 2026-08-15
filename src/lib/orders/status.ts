/**
 * Status Pesanan transition logic. See CONTEXT.md for the domain vocabulary
 * and docs/adr/0004-midtrans-sandbox-integration.md for why this is driven
 * by Notifikasi Midtrans instead of manual Admin verification.
 */

export type StatusPesanan =
  | "menunggu_pembayaran"
  | "dibayar"
  | "diproses"
  | "selesai"
  | "gagal"
  | "dibatalkan";

export type MidtransTransactionStatus =
  | "pending"
  | "settlement"
  | "capture"
  | "deny"
  | "cancel"
  | "expire";

export type OrderEvent =
  | { type: "notifikasi_midtrans"; transactionStatus: MidtransTransactionStatus }
  | { type: "mulai_proses" }
  | { type: "kredit_terkirim" }
  | { type: "dibatalkan"; oleh: "customer" | "admin" };

export class TransisiTidakValidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TransisiTidakValidError";
  }
}

export function transisiStatusPesanan(
  statusSaatIni: StatusPesanan,
  event: OrderEvent,
): StatusPesanan {
  switch (event.type) {
    case "notifikasi_midtrans":
      return terapkanNotifikasiMidtrans(statusSaatIni, event.transactionStatus);
    case "mulai_proses":
      if (statusSaatIni !== "dibayar") {
        throw new TransisiTidakValidError(
          `Tidak bisa mulai proses dari status ${statusSaatIni}, harus dari status dibayar`,
        );
      }
      return "diproses";
    case "kredit_terkirim":
      if (statusSaatIni !== "diproses") {
        throw new TransisiTidakValidError(
          `Tidak bisa menandai selesai dari status ${statusSaatIni}, harus dari status diproses`,
        );
      }
      return "selesai";
    case "dibatalkan":
      return terapkanPembatalan(statusSaatIni, event.oleh);
  }
}

function terapkanNotifikasiMidtrans(
  statusSaatIni: StatusPesanan,
  transactionStatus: MidtransTransactionStatus,
): StatusPesanan {
  if (statusSaatIni !== "menunggu_pembayaran") {
    throw new TransisiTidakValidError(
      `Notifikasi Midtrans hanya berlaku saat status menunggu_pembayaran, status saat ini: ${statusSaatIni}`,
    );
  }

  switch (transactionStatus) {
    case "settlement":
    case "capture":
      return "dibayar";
    case "pending":
      return "menunggu_pembayaran";
    case "expire":
    case "deny":
    case "cancel":
      return "gagal";
  }
}

function terapkanPembatalan(
  statusSaatIni: StatusPesanan,
  oleh: "customer" | "admin",
): StatusPesanan {
  if (
    statusSaatIni === "selesai" ||
    statusSaatIni === "gagal" ||
    statusSaatIni === "dibatalkan"
  ) {
    throw new TransisiTidakValidError(
      `Order dengan status ${statusSaatIni} tidak bisa dibatalkan`,
    );
  }

  if (oleh === "customer" && statusSaatIni !== "menunggu_pembayaran") {
    throw new TransisiTidakValidError(
      "Customer hanya bisa membatalkan Order saat status menunggu_pembayaran",
    );
  }

  return "dibatalkan";
}
