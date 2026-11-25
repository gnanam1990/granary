# M04 — Chain adapters and the mainnet USD 5 proof

## Goal
Typed offchain access to Morpho, feeds, the router and Builder Codes; then prove the whole loop on Base mainnet with about USD 5.

## Files
```
packages/chain/src/clients.ts       viem public + wallet clients, RPC fallback
packages/chain/src/morpho.ts        readMarket, readPosition, debtAssets, liquidity, borrowApy
packages/chain/src/feeds.ts         readNav (answer, decimals, updatedAt), isFresh
packages/chain/src/b20.ts           multiplier, balanceOfUI, pausedFeatures (API), isAuthorized
packages/chain/src/router.ts        quote(usdcIn, stock) -> {router, data, expectedOut}; validates target
packages/chain/src/builderCode.ts   dataSuffix from BUILDER_CODE (ox/erc8021)
packages/chain/src/vault.ts         typed read/write wrappers for GranaryVault + Factory
scripts/mainnet-proof.ts            the six-step run
scripts/deploy-proof-factory.s.sol  a factory deployed only for the proof (or reuse S2/S4 learnings)
```

## Behaviour
- Every write goes through one `sendTx` helper that appends the Builder Code suffix, simulates first, and returns the hash and receipt.
- `router.quote` rejects any quote whose call target is not the allowlisted router, and returns `expectedOut` so the caller can compare with the onchain `minOut`.
- Reads are pinned to one block number per cycle so a view is consistent.
- RPC errors retry with backoff, then switch to the fallback URL.

## Tests first
T-A01 … T-A04 (unit, with recorded RPC fixtures). T-A06 if S1 passed.

## The mainnet proof (T-A05)
[HUMAN] funds the deployer with gas and about USD 6 of USDC, and approves each step count.

`pnpm tsx scripts/mainnet-proof.ts` runs, pausing for confirmation before each transaction:
1. Deploy factory (proof instance) and create a vault for the default stock with a low reserve target (2 USDC) so investing happens.
2. Send 5 USDC to the vault; call `settle()`.
3. `invest()` the investable amount (stock bought, posted as collateral).
4. `payBill()` for an amount above the reserve so about USD 1 is borrowed.
5. Send 2 USDC more; `settle()` → loan repaid from income.
6. `close()` → everything back to the owner.

It writes each tx hash, the decoded events and the `books()` before/after to `PROVEN.md`, and fails loudly if any expected event is missing. If a step fails for market reasons (liquidity, stale feed), record it and apply the fallback ladder.

Run it during US market hours so the NAV feed is fresh.

## Definition of Done
- [ ] T-A01–T-A04 pass
- [ ] Six mainnet tx hashes in `PROVEN.md` with decoded events
- [ ] Builder Code visible in the input data of each
- [ ] Total spend ≤ USD 10 including gas
- [ ] Anything that differed from the pack recorded in `DECISIONS.md`

## Ship it
Branch `m04-adapters-proof` → local checks → PR with the six BaseScan links → checks green → self-review → squash merge.
