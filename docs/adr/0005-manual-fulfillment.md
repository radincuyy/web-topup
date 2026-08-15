---
status: accepted
---

# Diproses → Selesai requires manual Admin fulfillment, not a timer

The original Diproses → Selesai transition was a hardcoded ~3 second delay in the webhook handler — cosmetic, and no Admin action was involved. Research into how real Indonesian top-up sites work (small/medium sellers, the PPOB model used by Digiflazz-style resellers) shows this doesn't match reality: `Proses` is a genuine waiting state where a human or a supplier API is actually executing the delivery, and can be blocked by real conditions (network, provider downtime, stock). Bigger platforms (Codashop, UniPin) skip this because they have direct publisher API integration; this project has neither a publisher integration nor a supplier API, so it should model itself on the manual-seller pattern it is actually simulating.

Reversed: Dibayar still auto-advances to Diproses (payment confirmed, delivery now owed), but Diproses → Selesai now only happens via the Admin's **Tandai Terkirim** action, after they manually deliver the credit using the Order's `destination_data`. Sinkronisasi Status (Midtrans sync) is unaffected — it only ever resolves the payment side, never delivery. The Admin Pesanan list now surfaces `destination_data` so Admin has what they need to actually fulfill the Order — without it, manual fulfillment would have been unworkable.

A future reader should not reintroduce an automatic Diproses → Selesai transition without revisiting this decision — the whole point is that only a human can attest the credit was actually delivered.
