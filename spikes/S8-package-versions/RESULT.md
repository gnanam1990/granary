# S8 — Current package names and versions (wagmi, smart wallet, x402 adapters, ox)

**Answer: recorded.** All names verified live on npm today; the Hono and Next x402 adapters exist as `@x402/hono` / `@x402/next` (resolves the ⚠ in the digest).

Date: 2026-11-25.

## Commands and output

```
npm view viem version          → 2.58.6
npm view wagmi version         → 3.7.11
npm view ox version            → 1.8.21    (ox/erc8021 for Builder Code suffixes)
npm view @coinbase/cdp-sdk version → 1.62.0
npm view @x402/core version    → 2.32.0
npm view @x402/evm version     → 2.32.0
npm view @x402/express version → 2.32.0
npm view @x402/extensions version → 2.32.0
npm view @x402/hono version    → 2.32.0    (keeper adapter — exists)
npm view @x402/next version    → 2.32.0    (web/demo adapter — exists)
```

## Consequences

- M05 keeper uses `@x402/hono`; M06/M07 use `@x402/next` where applicable; seller SDK builds on `@coinbase/cdp-sdk` + `@x402/*` 2.x.
- Builder Code wiring via `ox` 1.8.x (`ox/erc8021`) as viem `dataSuffix`.
- Exact pins land in each module's package.json when the module ships; versions recorded in `DECISIONS.md`.
