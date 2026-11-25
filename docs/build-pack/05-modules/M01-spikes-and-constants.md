# M01 — Spikes and constants

## Goal
Answer the eight unknowns in `00-context/05-feasibility-and-gaps.md` with evidence, and publish a typed constants package the rest of the build imports.

## Inputs
`00-context/02-sponsor-docs-digest.md`, `08-reference/stocks.snapshot.json`, `08-reference/morpho-stock-markets.snapshot.json`.

## Outputs
- `spikes/S1…S8/` — small scripts plus a `RESULT.md` each (question, command, output, answer, date).
- `packages/chain/src/addresses.ts` — USDC, Morpho, router(s), per-stock `{address, decimals, navFeed, symbol}`, per-market `{marketId, stock, lltvBps, oracle, irm}`.
- `packages/chain/src/abis/` — Morpho, oracle, AggregatorV3, B20 (ERC-20 + `uiMultiplier`, `balanceOfUI`, `toUIAmount`, `isAuthorized`, `policyExists`).
- `scripts/refresh-snapshots.ts` — re-pulls both snapshot files from the live APIs.
- Updated `DECISIONS.md` and `PROVEN.md`; ⚠ marks in the digest resolved or kept with a reason.

## Spikes
| ID | Do | Pass means |
|---|---|---|
| S1 | `anvil --fork-url $BASE_RPC_URL`; `cast call <NVDAc> "balanceOf(address)" <holder>`; try a transfer with an impersonated holder | Precompile works on a fork → fork tests allowed |
| S2 | [HUMAN] fund a test wallet with USD 5. Deploy a 20-line holder contract on mainnet; send it USD 1 of stock; have it send the stock back | A contract can hold and move B20 |
| S3 | Read `decimals()`, `latestRoundData()` for 5 feeds every 5 min for a market session and overnight; log `updatedAt` gaps. Confirm whether the answer is per token or per share (compare with API `nav_price` and `multiplier`) | `navMaxAge` and the price formula are settled |
| S4 | From a small contract: approve + `supplyCollateral` USD 5 of stock → `borrow` USD 1 → `repay` by shares → `withdrawCollateral` | The Morpho path works from a contract |
| S5 | Run the x402 seller quickstart with `payTo` = the S2 contract, `environment: "production"`, price `$0.01`; pay it once | USDC arrives in the contract |
| S6 | Find the router and quote API for USDC → the candidate stocks at USD 5 and USD 50; compare with NAV; record router address from the provider's own docs | A route within 1.5% of NAV exists; `SWAP_ROUTER_ADDRESS` set |
| S7 | [HUMAN] open the Quest page and the submission form; record the exact deadline time and every form field in `docs/submission-fields.md` | Fields known |
| S8 | Read current docs for wagmi, the smart-wallet connector, the x402 Hono/Next adapters, `ox/erc8021`; record package names and versions | Recorded in `DECISIONS.md` |

Choose the **default collateral stock**: the market with the most `liquidityAssetsUsd` that also has a working swap route (S6). Record it.

## Tests first
- `addresses.test.ts`: every address is checksummed; every configured market's `idToMarketParams` (live RPC, skipped in CI without `BASE_RPC_URL`) equals the constants.
- `snapshots.test.ts`: snapshot files parse and contain the default stock.

## Definition of Done
- [ ] Eight `RESULT.md` files with real output
- [ ] Any failed spike has its fallback chosen and written in `DECISIONS.md`
- [ ] Constants package exported and tested
- [ ] No mainnet spend above USD 5 total; tx hashes in `PROVEN.md`

## Ship it
Branch `m01-spikes` → local checks → `gh pr create` (paste the spike table with answers) → `gh pr checks --watch` → self-review → squash merge.

## If a spike fails
Stop, apply the fallback from the feasibility doc, and tell the owner in one message what changed.
