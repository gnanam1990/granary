# DECISIONS

What was chosen and why, newest last. IDs D1–D7 are opened by the TDD (`docs/build-pack/02-TDD.md` §11) and filled in as modules land.

## M00 — repo and CI

- **TypeScript pinned at 5.9.3, not 7.x.** TS 7 exists but the lint/test toolchain around it is newer than the rest of this stack; 5.9 keeps eslint, vitest and tsconfig behaviour predictable. Revisit after M00.
- **`build` is a passthrough chain** (`pnpm -r --if-present run build`) that currently runs nothing: the M00 packages are empty scaffolds with no artifacts. Each module adds real build scripts as it lands.
- **CI runs the full gate on ubuntu-latest, macos-latest and windows-latest** so every merge is proven cross-platform, not just on Linux.
- **Foundry in CI is installed with the official installer + `foundryup --install stable`** in a bash step instead of a third-party action: one code path works identically on all three operating systems.
- **Lint = eslint (typescript-eslint strict) + prettier --check.** `contracts/`, `docs/`, `pnpm-lock.yaml` are excluded from both; Solidity formatting is enforced separately with `forge fmt --check` in CI.
- **First commit to `main` carries only the build pack and `CLAUDE.md`** to establish the repo; everything else lands by pull request, per the module spec.
- **License is Apache-2.0**, chosen by the owner over the pack's MIT proposal.
- **`.gitattributes` forces LF checkouts on every platform** (`* text=auto eol=lf`): prettier enforces LF line endings, and Windows runners otherwise rewrite files to CRLF on checkout.
- **No CI concurrency group.** Under rapid pushes the group deadlocked runs into a serialized wait and mass cancellation; with cheap jobs the protection is not worth it.
- **Three Devin Review flags on the vendored build pack are deferred to their owning modules** instead of editing the spec in M00: (a) the demo's $0.005 Stock Facts payment sits below the keeper's $0.01 MIN_SETTLE, so the demo shows no settlement — resolve in M06/M10; (b) BillRefused rows live only in the keeper database and a chain-log rebuild cannot restore them — resolve in M05; (c) planBill permits reserve-covered bills while the vault is above ceiling, contradicting invariant I4 — resolve in M02/M03. Deferred per owner's approval; each module must re-check its flag before merge.

## M01 — spikes and constants

- **Default collateral stock is SPCXc.** Deepest Morpho liquidity (USD 1,118 on refresh vs USD 1,217 at audit) and a verified KyberSwap route at +0.31% vs NAV for USD 5 and USD 50 (spike S6).
- **`SWAP_ROUTER_ADDRESS` = KyberSwap `0x6131B5fae19EA4f9D964eAc0408E4408b66337b5`** and `SWAP_QUOTE_API_URL` = `https://aggregator-api.kyberswap.com/base/api/v1`: confirmed by the provider's own API response, resolving the ⚠ in the digest.
- **`navMaxAge` stays at the 3600 s fallback.** Feeds are 8-decimal AggregatorV3 and update at least hourly pre-market (spike S3), but a full market-session heartbeat measurement needs a long-running watcher — the keeper collects that data in M05 and may tighten the value then.
- **Fork tests are the default for chain integration tests** (spike S1 passed: the B20 precompile executes on an anvil fork, including transfers from impersonated holders).
- **Package baselines (spike S8, verified on npm 2026-11-25):** viem 2.58.6, wagmi 3.7.11, ox 1.8.21, @coinbase/cdp-sdk 1.62.0, @x402/* 2.32.0 — the Hono and Next adapters exist as `@x402/hono` / `@x402/next`, resolving the digest ⚠. Modules pin exact versions when they ship.
- **Tokenized Stocks API quirks found while writing `refresh-snapshots.ts`:** trailing slash before the query string returns 404; the list key is `tokens`; `nav_price` only appears in the unfiltered list response; `/metadata/{ticker}` carries no price. The script writes both snapshot files only after both payloads build, so a failed refresh never leaves a mixed pair.
- **Spikes S2/S4/S5/S7 are deferred, not failed.** They need a funded mainnet wallet, CDP keys and the owner opening the submission form — all [HUMAN]. Their `RESULT.md` files record the plan and the fallback for each; no fallback had to be applied yet.
