# M06 — Seller SDK and the dogfood paid API

## Goal
Make adoption a three-line change, and run one real paid API on Granary so there is honest usage from day 9.

## Files
```
packages/x402-seller/src/index.ts     granary({vault, keeperUrl, billsKey?}) -> { payTo(), notify(), payBill(), books() }
packages/x402-seller/README.md        copy-paste guide for Express, Hono, Next.js
apps/demo-seller/src/server.ts        the paid API
apps/demo-seller/src/data/*.ts        the service logic
```

## The SDK
- `payTo()` → `{ type: "address", evm: vault }` for `createX402Server`.
- `notify()` → middleware that, after a paid 200 response, sends a fire-and-forget hint to the keeper. It must never delay or fail the seller's response (timeout 500 ms, errors swallowed and counted).
- `payBill({payee, amount, memo})` → signs and calls the bills endpoint; returns `{ok, txHash}` or `{refused, reason}`.
- `books()` → the vault view.
- Zero dependencies beyond `fetch` and a tiny HMAC helper. Publish to npm as `@granary/x402-seller` ([HUMAN] for the npm account) or document install from GitHub.

## The dogfood API: "Stock Facts"
A paid endpoint that is useful to the other Stocks Maxxing builders, built only from public data:
- `GET /v1/stock/:symbol` — price $0.005. Returns: token address, decimals, current multiplier, reference price with its age, DEX-vs-reference gap if a route exists, whether a Morpho market exists and its available liquidity, paused features, and a "safe to act now" boolean with reasons.
- `GET /v1/credit/:symbol` — price $0.005. Returns the Morpho markets for that stock with LLTV, borrow rate and available USDC.
- Sources: the Tokenized Stocks API, Chainlink feeds, the Morpho API. Cache 30 s. State sources and retrieval time in every response. No advice, no rankings.
- `payTo` is the team's Granary vault. The vault page of this vault is the public demo.
- Free `GET /` explains the API, prices, sources and the non-US notice.

## Tests first
T-X01 … T-X04. T-X02 runs in the x402 development environment (Base Sepolia). T-X04 is one real mainnet payment ([HUMAN] funds a buyer wallet with USD 1).

## Steps
1. SDK tests and implementation.
2. Demo seller in development mode; 402 → pay → 200 locally.
3. [HUMAN] CDP API key. Switch to production; one real payment; watch the keeper settle it.
4. List on the Bazaar if the listing flow is simple (cut-list item 9).
5. Write the three-line integration guide and a short post draft for X.

## Definition of Done
- [ ] T-X01–T-X04 pass; mainnet payment tx and its `Settled` tx in `PROVEN.md`
- [ ] The SDK README works when followed from scratch in a clean folder
- [ ] The demo API never returns stale data without saying so
- [ ] Outreach message drafted in `docs/outreach.md` ([HUMAN] sends it)

## Ship it
Branch `m06-seller-sdk` → local checks → PR with the two tx links → checks green → self-review → squash merge.
