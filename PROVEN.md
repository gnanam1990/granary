# PROVEN

Only claims backed by an actual run live here: command, exit code, test counts, links, transaction hashes. If it is not in this file, it is not proven.

## M00 — repo and CI

Local machine: macOS arm64 (Darwin 25.6.0), node v24.21.0, pnpm 12.8.1, forge 1.10.0 (stable).

Test-first evidence: with `src/index.ts` absent, `pnpm test` failed in all six packages on module resolution of `../src/index` (expected failure); after adding the placeholder source files the same command passes.

| Command                                                       | Exit | Result                                        |
| ------------------------------------------------------------- | ---- | --------------------------------------------- |
| `pnpm install`                                                | 0    | lockfile written, 6 workspace packages linked |
| `pnpm lint` (eslint 10.15.0 strict + prettier 3.10.1 --check) | 0    | no findings                                   |
| `pnpm typecheck` (`tsc -p tsconfig.json` per package, strict) | 0    | 6/6 packages clean                            |
| `pnpm test` (vitest 5.1.1 per package)                        | 0    | 6 test files, 6 tests passed                  |
| `forge fmt --check` (contracts/)                              | 0    | clean                                         |
| `forge build` (solc 0.8.26, pinned)                           | 0    | compiler run successful                       |
| `forge test`                                                  | 0    | 2 passed, 0 failed (CounterTest smoke suite)  |

Pinned dependencies: forge-std v1.17.0 (f3dae6e), openzeppelin-contracts v5.7.0 (cab1993), both as git submodules under `contracts/lib/`.

CI evidence (GitHub Actions, workflow `ci`):

- Green matrix run, head `3293bfd` (final head): https://github.com/gnanam1990/granary/actions/runs/45533437223 — `gate` passed on **ubuntu-latest, macos-latest and windows-latest** (install → eslint+prettier → tsc typecheck → vitest → forge fmt --check → forge build → forge test).
- Devin Review convergence on PR #1: three rounds on heads `7b626f5` → `c087a1d` → `3293bfd`. Fixed: `engines.node` floor raised to match the eslint/vitest-supported ranges (`^22.13.0 || ^24.0.0 || >=26.0.0`); seven vendored build-pack JSON files renormalized CRLF → LF. Final round: zero bug/security findings; three flags remain that concern vendored build-pack spec content (demo payment below keeper minimum, BillRefused reindex gap, planBill vs invariant I4) and were escalated to the owner, since fixing them means editing the spec, not this PR's code.
- Gate proof, scratch head `6b20925`: https://github.com/gnanam1990/granary/actions/runs/45531941830 — failed at the **Unit tests** step with exactly the planted assertion (`expected '@granary/core' to be 'deliberately-wrong'`), lint and typecheck having passed first. Scratch PR #2 closed unmerged.
- Branch protection on `main`: applied by the owner (no repo-admin credentials available in the build environment).

## M00 merge

- PR #1 squash-merged to `main` as `1a9afdeba566e248066f5cdc190ece016daf81c4` (2026-11-25); head branch deleted. Merge executed via the GitHub API with the owner's repo-scoped token after Devin Review convergence and a green three-OS matrix.

## M01 — spikes and constants

Local machine same as M00. All commands run 2026-11-25.

| Command                                                                   | Exit | Result                                                                                           |
| ------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------ |
| `pnpm install`                                                            | 0    | viem 2.58.6 + @types/node added to `@granary/chain`                                              |
| `pnpm lint`                                                               | 0    | no findings                                                                                      |
| `pnpm typecheck`                                                          | 0    | 6/6 packages clean                                                                               |
| `pnpm test`                                                               | 0    | 9 test files: packages/chain 5 passed + 1 skipped (live RPC), 5 scaffold placeholders passed     |
| `BASE_RPC_URL=https://mainnet.base.org pnpm --filter @granary/chain test` | 0    | 6/6 incl. live `idToMarketParams` match for all 26 configured markets                            |
| `pnpm refresh-snapshots`                                                  | 0    | both snapshot files rewritten atomically from live APIs: 13 stocks, 26 markets, no zero navPrice |

Test-first evidence: `addresses.test.ts`/`snapshots.test.ts` failed initially with `Cannot find module '../src/abis/morpho'` / `'../src/addresses'` (expected), passing after implementation.

Spike evidence lives in `spikes/*/RESULT.md`:

- S1 PASS — anvil fork executes B20 precompile reads and an impersonated transfer (tx `0x108ed5d884f99b7bacedf6cfc7454a2141a978cbe3b72cb82dd67a3f1f9ed3df` inside the local fork).
- S3 PARTIAL (fallback stands) — all feeds 8 decimals; sampled `updatedAt` ages logged; full heartbeat deferred to keeper runtime data.
- S6 PASS — KyberSwap router `0x6131B5fae19EA4f9D964eAc0408E4408b66337b5` confirmed; USDC→SPCXc +0.314% vs NAV at USD 5, +0.315% at USD 50.
- S6 re-run with enforcement (`spikes/S6-swap-route/run.sh`, exit 0): deviations −0.152% / +0.012% vs the live NAV, router equality asserted, `/route/build` calldata 4,228–4,708 bytes.
- S8 PASS — package names/versions recorded.
- B20 registry probe (Base mainnet, 2026-11-25): `cast call 0x8453000000000000000000000000000000000002 "isAuthorized(uint64,address)(bool)" 1 0x...0001` → `true`; the `bytes32` encoding reverts; `policyExists(uint64)` → `false` / `bytes32` reverts. Policy IDs are uint64.
- S2/S4/S5/S7 BLOCKED [HUMAN] — funded wallet, CDP keys and the submission form needed; no mainnet spend attempted, no fallback triggered.

No mainnet transaction was sent; total spend USD 0.
