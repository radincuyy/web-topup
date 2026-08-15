---
status: accepted
---

# Midtrans Sandbox (Snap) replaces manual Admin payment verification

Reverses [ADR-0001](0001-manual-payment-verification.md). The project wants a genuine payment gateway integration to demonstrate for the capstone, kept safe by using Midtrans's sandbox/test mode exclusively — no real money moves. Considered Stripe (the only option Vercel Marketplace's `payments` category offers) but rejected it: Stripe's sandbox has no native QRIS/GoPay/Indonesian Virtual Account support, which is central to this project's Indonesian top-up positioning. Midtrans Sandbox was chosen instead, set up manually (API keys as env vars) since it isn't Vercel Marketplace-provisioned.

Bukti Pembayaran (manual proof upload) is removed. Menunggu Pembayaran → Dibayar is now driven entirely by Notifikasi Midtrans (webhook), and Metode Pembayaran is not a fixed list in this app's code — it is whatever channels are active on the Midtrans sandbox account, surfaced via Midtrans Snap. A future reader should not add a hardcoded payment-method enum or reintroduce manual Admin verification without revisiting this decision.
