import { describe, expect, it } from "vitest";
import {
  TransisiTidakValidError,
  transisiStatusPesanan,
} from "./status";

describe("transisiStatusPesanan — Notifikasi Midtrans", () => {
  it("settlement moves menunggu_pembayaran to dibayar", () => {
    expect(
      transisiStatusPesanan("menunggu_pembayaran", {
        type: "notifikasi_midtrans",
        transactionStatus: "settlement",
      }),
    ).toBe("dibayar");
  });

  it("capture moves menunggu_pembayaran to dibayar", () => {
    expect(
      transisiStatusPesanan("menunggu_pembayaran", {
        type: "notifikasi_midtrans",
        transactionStatus: "capture",
      }),
    ).toBe("dibayar");
  });

  it.each(["expire", "deny", "cancel"] as const)(
    "%s moves menunggu_pembayaran to gagal",
    (transactionStatus) => {
      expect(
        transisiStatusPesanan("menunggu_pembayaran", {
          type: "notifikasi_midtrans",
          transactionStatus,
        }),
      ).toBe("gagal");
    },
  );

  it("pending keeps the order at menunggu_pembayaran", () => {
    expect(
      transisiStatusPesanan("menunggu_pembayaran", {
        type: "notifikasi_midtrans",
        transactionStatus: "pending",
      }),
    ).toBe("menunggu_pembayaran");
  });

  it("rejects a notification once the order is no longer menunggu_pembayaran", () => {
    expect(() =>
      transisiStatusPesanan("dibayar", {
        type: "notifikasi_midtrans",
        transactionStatus: "settlement",
      }),
    ).toThrow(TransisiTidakValidError);
  });
});

describe("transisiStatusPesanan — pengiriman kredit", () => {
  it("mulai_proses moves dibayar to diproses", () => {
    expect(
      transisiStatusPesanan("dibayar", { type: "mulai_proses" }),
    ).toBe("diproses");
  });

  it("kredit_terkirim moves diproses to selesai", () => {
    expect(
      transisiStatusPesanan("diproses", { type: "kredit_terkirim" }),
    ).toBe("selesai");
  });

  it("rejects mulai_proses from a status other than dibayar", () => {
    expect(() =>
      transisiStatusPesanan("menunggu_pembayaran", { type: "mulai_proses" }),
    ).toThrow(TransisiTidakValidError);
  });

  it("rejects kredit_terkirim from a status other than diproses", () => {
    expect(() =>
      transisiStatusPesanan("dibayar", { type: "kredit_terkirim" }),
    ).toThrow(TransisiTidakValidError);
  });
});

describe("transisiStatusPesanan — Dibatalkan", () => {
  it("customer can cancel while menunggu_pembayaran", () => {
    expect(
      transisiStatusPesanan("menunggu_pembayaran", {
        type: "dibatalkan",
        oleh: "customer",
      }),
    ).toBe("dibatalkan");
  });

  it("customer cannot cancel once the order is dibayar", () => {
    expect(() =>
      transisiStatusPesanan("dibayar", { type: "dibatalkan", oleh: "customer" }),
    ).toThrow(TransisiTidakValidError);
  });

  it.each(["menunggu_pembayaran", "dibayar", "diproses"] as const)(
    "admin can cancel from %s",
    (statusSaatIni) => {
      expect(
        transisiStatusPesanan(statusSaatIni, {
          type: "dibatalkan",
          oleh: "admin",
        }),
      ).toBe("dibatalkan");
    },
  );

  it.each(["selesai", "gagal", "dibatalkan"] as const)(
    "nobody can cancel from the terminal status %s",
    (statusSaatIni) => {
      expect(() =>
        transisiStatusPesanan(statusSaatIni, {
          type: "dibatalkan",
          oleh: "admin",
        }),
      ).toThrow(TransisiTidakValidError);
    },
  );
});
