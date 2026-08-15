# Destination fields hardcoded per Produk, not Admin-configurable

Considered letting Admins define a custom field schema per Produk (e.g. a JSON-driven form builder) versus hardcoding the destination fields directly in the app. Chose hardcoded fields: the confirmed catalog is fixed and known up front, and a configurable schema builder is disproportionate effort for a college project with a fixed scope. A future reader should not assume the destination-field shape is data-driven — adding a new Produk with a new field shape requires a code change, not just a catalog entry.

**Correction (was: per Kategori)**: the original version of this ADR hardcoded fields per Kategori, assuming all Game Produk shared one shape (User ID + Zone ID). With the concrete catalog confirmed, this is wrong — each game needs a different shape:

- Mobile Legends: User ID + Zone ID
- Free Fire: User ID
- PUBG Mobile: User ID
- Valorant: Riot ID (`Username#Tag`)
- Roblox: Username
- Pulsa: nomor HP
- E-wallet Top Up: nomor HP
- Token PLN: nomor meter

The granularity is per Produk, not per Kategori — Kategori only groups Produk for catalog browsing, it says nothing about a shared field shape.
