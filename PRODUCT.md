# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router) + Supabase (SSR auth via `@supabase/ssr`), as already scaffolded in this repo. Continue building on it rather than introducing a new stack.

## Users

Consumers in Indonesia / Southeast Asia buying digital top-ups: game credits (e.g. in-game currency/diamonds), mobile credit (pulsa), and similar digital vouchers. They are doing a quick, transactional purchase — usually on mobile, often mid-session in a game or app, wanting the credit to land in their account with minimal friction.

## Product Purpose

A digital top-up storefront: visitors select a game/provider and denomination, pay, and receive their credit. Success is a fast, trustworthy purchase completing end-to-end with the credit actually delivered. This is a final-year fullstack college capstone project, intended to be hosted publicly, but it is a simulation — not a real business. No real money moves; payment is integrated against Midtrans's sandbox/test mode only.

## Positioning

Speed / instant fulfillment is the core differentiator — the mechanism competitors can't easily match is near-instant delivery of the purchased credit after payment, rather than competing primarily on price or catalog breadth (though those may still matter operationally).

## Operating Context

Local Indonesian/SEA payment methods matter given the target market (e.g. QRIS, GoPay, bank Virtual Account) — these are surfaced dynamically through Midtrans Snap sandbox, not hardcoded by this app. Purchases are transactional and likely mobile-first given the audience and use case. Full domain model (catalog structure, Order lifecycle, payment integration) is captured in `CONTEXT.md`; architectural decisions and their rationale are in `docs/adr/`.

## Capabilities and Constraints

- No product name or brand identity is confirmed yet.
- Payment gateway: Midtrans Sandbox (Snap), test mode only — see `docs/adr/0004-midtrans-sandbox-integration.md`. No real payment provider/production credentials are in scope.
- Catalog categories: Game, Pulsa, E-wallet Top Up, Token PLN. Confirmed Game titles: Mobile Legends, Roblox, Free Fire, Valorant, PUBG Mobile (see `CONTEXT.md`). Specific providers for Pulsa/E-wallet Top Up/Token PLN are not confirmed yet.
- No pricing model is defined yet.
- Auth scaffolding (Supabase SSR, login/session handling) already exists in the codebase and should be treated as available infrastructure, not yet wired to any account/order flow.

## Evidence on Hand

None. This is a pure concept stage: no confirmed brand name, logo, game/provider catalog, pricing, testimonials, or payment integration exist yet. Future work must not fabricate any of these — treat them as explicitly undecided until the user provides them.

## Product Principles

- Speed is the product: every flow (browse → select → pay → receive) should be optimized to minimize time-to-credit, not just visual speed.
- Trust is earned transactionally: since there's no brand history yet, trust signals (clear pricing, order status, confirmation) carry more weight than brand storytelling.
- Design for the target market's real payment habits (QRIS/e-wallets/VA), not assumptions carried over from card-first markets.
- Mobile-first: the primary buying context is a phone, often mid-session in another app or game.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established yet.
