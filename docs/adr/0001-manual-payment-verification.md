---
status: superseded by ADR-0004
---

# Manual Admin payment verification instead of a real payment gateway

This is a simulated marketplace built as a final-year college project, not a real product handling real money, so integrating a real payment gateway (Midtrans, Xendit, etc.) would add cost and risk without serving the project's purpose. Instead, Customers upload a Bukti Pembayaran (payment proof file) at checkout, and an Admin manually reviews it to move the Order from Menunggu Pembayaran to Dibayar. A future reader should not assume any transaction here reflects real fund movement, and should not "fix" this by wiring up a real gateway without first confirming the project's scope has changed.

**Superseded**: reversed in favor of real sandbox gateway integration — see [ADR-0004](0004-midtrans-sandbox-integration.md).
