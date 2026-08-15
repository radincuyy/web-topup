# Topup Marketplace

A simulated e-commerce platform for buying digital top-up credit (game credit, mobile credit, etc.) that gets delivered to an external account the buyer specifies. Built as a final-year fullstack college project, intended to be hosted, but transactions and payments are simulated rather than real.

## Language

**Top Up**:
A digital credit/voucher product (e.g. game diamonds, mobile pulsa) purchased by a Customer and delivered to an external destination account they specify — not a balance held inside this application.
_Avoid_: Isi saldo, deposit, top-up saldo (those describe a wallet model, which this project explicitly is not)

**Customer**:
The user role that browses the catalog, places Orders, and receives delivered Top Up credit.
_Avoid_: Buyer, pembeli, user (when role matters, use Customer specifically)

**Admin**:
The user role that manages the product catalog (Kategori/Produk/Nominal/Ketersediaan), monitors Orders, manually fulfills Orders that reach Diproses (delivers the Top Up credit to the destination account, then marks the Order Terkirim), can Dibatalkan an Order before Selesai, and can trigger a manual Sinkronisasi Status against Midtrans for a specific Order. Does not verify payments manually — that is Notifikasi Midtrans's job — but delivery *is* manual, matching how small Indonesian top-up/PPOB sellers actually operate (see docs/adr/0005-manual-fulfillment.md).
_Avoid_: Seller, operator

**Order**:
A single purchase by a Customer, from product selection through credit delivery to the destination account. Moves through Order Status: Menunggu Pembayaran → Dibayar → Diproses → Selesai, branching to Gagal or Dibatalkan. Dibayar is driven by Notifikasi Midtrans and immediately auto-advances to Diproses (payment confirmed, delivery now owed). Diproses → Selesai is **not** automatic — it only happens when an Admin manually delivers the credit and marks the Order Terkirim. Diproses can sit for real, unbounded time, exactly like it would at a small manual top-up seller.
_Avoid_: Transaksi, pembelian, transaction, purchase

**Kategori** (Category):
A top-level grouping of Produk in the catalog: Game, Pulsa, E-wallet Top Up, or Token PLN.
_Avoid_: Jenis, tipe

**Produk** (Product):
A specific sellable item within a Kategori that a Customer selects. Confirmed Produk under Kategori Game: Mobile Legends, Roblox, Free Fire, Valorant, PUBG Mobile. Other Kategori use provider-style Produk (e.g. "Telkomsel", "GoPay", "PLN Prabayar"). A Produk offers one or more Nominal, and its destination-field shape is defined per Produk (see ADR 0003) — not uniform across a whole Kategori.
_Avoid_: Item, barang

**Nominal**:
A specific denomination and price variant of a Produk that a Customer actually buys (e.g. "86 Diamond — Rp15.000").
_Avoid_: Varian, paket (unless referring specifically to Pulsa data packages)

**Metode Pembayaran** (Payment Method):
How a Customer pays for an Order. Not a fixed list defined by this app — it is whatever payment channel Midtrans Snap (sandbox) presents at checkout (e.g. QRIS, GoPay, bank Virtual Account), determined by the Midtrans sandbox account's active channels, not hardcoded here. Distinct from the "E-wallet Top Up" Kategori — the same brand names (e.g. GoPay) can appear in both, but Metode Pembayaran is how the Customer pays for *this* Order via Midtrans, while E-wallet Top Up as a Kategori is an external e-wallet balance being purchased *as the product itself*. Never conflate the two.
_Avoid_: Cara bayar, daftar metode (this app does not maintain its own list — Midtrans Snap owns it)

**Status Pesanan** (Order Status):
The lifecycle state of an Order: Menunggu Pembayaran, Dibayar, Diproses, Selesai, Gagal, Dibatalkan. Menunggu Pembayaran → Dibayar is driven automatically by a Notifikasi Midtrans, not by an Admin action.
_Avoid_: Order status (use the Indonesian terms as the canonical enum values), payment status (this tracks the whole Order, not just payment)

**Notifikasi Midtrans** (Midtrans Notification):
The webhook callback Midtrans sends to this app when a transaction's payment status changes (e.g. settlement, expire, cancel, deny). This app's Order Status transitions for Dibayar and payment-driven Gagal are derived from this notification, not from manual Admin review.
_Avoid_: Webhook (fine as a technical term, but "Notifikasi Midtrans" is the domain name for the specific payload/event that drives Status Pesanan)

**Batas Waktu Pembayaran** (Payment Deadline):
The time window an Order has to reach Dibayar before it becomes Gagal. Sourced entirely from Midtrans's own transaction expiry (set via `custom_expiry` when the transaction is created); Gagal is triggered by a Notifikasi Midtrans with status `expire`. This app does not run its own independent timeout job.
_Avoid_: Timeout, expiry (keep the domain term; those are implementation-level synonyms)

**Ketersediaan** (Availability):
A Tersedia/Tidak Tersedia toggle an Admin sets per Nominal, controlling whether Customers can currently purchase it.
_Avoid_: Stok, stock (this is an on/off flag, not a counted inventory quantity)

**Sinkronisasi Status** (Manual Status Sync):
An Admin-triggered action on a single Order that queries Midtrans's transaction status API directly, used as a fallback when a Notifikasi Midtrans webhook is missed or delayed. Only affects the payment side (Menunggu Pembayaran → Dibayar/Gagal) — it never advances Diproses → Selesai, since that is a delivery fact only an Admin who actually delivered the credit can attest to.
_Avoid_: Retry, refresh (keep the domain term; it queries Midtrans, it doesn't retry payment)

**Tandai Terkirim** (Mark Delivered):
An Admin-triggered action on a single Order, moving it from Diproses to Selesai. The Admin performs this only after actually delivering the Top Up credit to the destination account shown on the Order — the system has no way to verify delivery itself.
_Avoid_: Selesaikan, complete (keep the domain term; it specifically means the Admin attests delivery happened)
