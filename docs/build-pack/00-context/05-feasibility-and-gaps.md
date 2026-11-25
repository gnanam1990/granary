# Feasibility and gaps audit

Done 2026-11-24 against live APIs, Base mainnet RPC and official doc pages. Nothing was deployed or paid.

## 1. Verified facts
| # | Fact | How it was verified |
|---|---|---|
| V1 | Morpho Blue is deployed on Base at `0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb` | `eth_getCode` returns bytecode |
| V2 | A USDC loan market against AAPLc exists with LLTV 62.5% | `idToMarketParams(0xae1a3048…)` returned loan = USDC `0x8335…2913`, collateral = AAPLc, oracle `0xEcC5…AB0e`, irm `0x4641…2687`, lltv `625000000000000000` |
| V3 | 26 stock-collateral markets exist for 7 stocks; 5 have meaningful liquidity | Morpho GraphQL API; snapshot saved |
| V4 | Total available liquidity across them ≈ USD 3,000 (largest: SPCXc 1,217; GOOGLc 1,037; AAPLc 556) | same |
| V5 | The Morpho oracle for AAPLc answers `price()` | `eth_call` returned a non-zero value |
| V6 | Stock tokens are precompiles: `eth_getCode` = `0xef`, `decimals()` = 8 | RPC |
| V7 | Token addresses, multipliers and 14 NAV feed addresses | Tokenized Stocks API `/` and `/nav-feeds` |
| V8 | x402 seller packages, env names, route config, `payTo` semantics, facilitator pricing | CDP docs pages read today |
| V9 | Builder Code registration endpoint and ERC-8021 suffix | Base docs page read today |
| V10 | Base brand tokens (colours, type, radii) | Computed styles read from base.org/stocksmaxxing |
| V11 | Judging leans on real onchain usage; deadline moved to 12 Dec | Press + @buildonbase |

## 2. Not verified (each has a Day-1 spike in M01)
| Spike | Question | Why it matters | If it fails |
|---|---|---|---|
| **S1** | Can anvil/forge fork Base and execute B20 precompile calls (`balanceOf`, `transfer`)? | Decides whether fork tests are possible | Use mocks for unit/invariant tests and prove integration on mainnet with USD 1–5 (plan already assumes this) |
| **S2** | Can a plain contract receive, hold and send a B20 stock? | The vault holds stock briefly before supplying it to Morpho | Morpho already holds B20 as collateral, so this should pass. If not: supply to Morpho in the same call straight from the router output (`receiver = Morpho` is not possible; use a bundler) — escalate to owner |
| **S3** | NAV feed `decimals()`, heartbeat and typical `updatedAt` gap in and out of market hours | Sets `navMaxAge` and the slippage check | Default `navMaxAge = 3600 s`; if feeds update less often in-session, raise it to the measured heartbeat + 10 min and record it |
| **S4** | Full round trip from a contract: supply USD 5 of stock as collateral → borrow USD 1 → repay by shares → withdraw | The core claim | Fallback ladder below |
| **S5** | Does the CDP Facilitator settle an `exact` payment to a **contract** `payTo` on Base mainnet? | Revenue must land in the vault | Set `payTo` to the seller's EOA/smart wallet and have the SDK forward to the vault in the same request handler (one extra transfer); note the weaker guarantee |
| **S6** | KyberSwap router address and API on Base; is there a route USDC → the chosen stock for USD 5–50 within 1.5% of NAV? | Buying the treasury | Try Aerodrome and Uniswap v3 routers directly; pick the stock with the best measured depth; worst case the owner buys stock manually once and Granary only manages collateral and credit |
| **S7** | Exact time of day of the 12 Dec deadline and the fields of the submission form | Planning | Assume 23:59 UTC; plan ends 11 Dec 12:00 UTC |
| **S8** | Current wagmi / smart-wallet / x402 Hono adapter package names | Avoid stale imports | Read the docs at build time; record in `DECISIONS.md` |

## 3. Gaps → resolution
| Gap | Resolution |
|---|---|
| **Morpho liquidity is tiny** (≈ USD 3,000 total; USD 50 in the main NVDAc market) | Design for micro credit: default credit ceiling 30% LTV, typical draws USD 1–50. Before any borrow, read market liquidity and fail closed if short. Default collateral stock = the market with the most available USDC at deploy time (SPCXc or GOOGLc on 24 Nov). State the limit in the README and UI |
| **No stocks on testnet** | Unit and invariant tests on mocks; a scripted mainnet proof with USD 5 (M04); the demo runs on mainnet |
| **Feeds freeze off-hours** | `invest` reverts on a stale feed. Borrow and repay do not need the NAV feed (Morpho's own oracle prices collateral), so the credit line works 24/7. This is a selling point: you can raise cash on a weekend without selling into a thin pool |
| **Collateral can gap down at the open** | Conservative max LTV (default 30% vs 62.5% liquidation), a `protect()` function anyone can call that repays from the reserve, and a risk band shown in the UI |
| **Pauses and policy blocks on B20** | Keeper reads `paused_features` and `isAuthorized` before acting; onchain calls simply revert and the vault stays consistent (no partial state) |
| **Traction needs outside users** | A seller SDK that takes three lines; a dogfood paid API run by the team; Bazaar listing; direct outreach to x402 sellers ([HUMAN]); a public stats page that excludes team wallets |
| **US users** | Geo-block the web app and the SDK onboarding by IP country, plus a self-attestation checkbox stored with the vault record. Contracts are permissionless; say so honestly |
| **Lending licence** | Granary does not lend or hold funds. The owner's vault borrows from Morpho directly. Fee is zero in v1. Say this in the README |
| **Operator key risk** | The operator can only: settle, invest into the one allowlisted stock within the onchain NAV check, pay allowlisted payees under a daily cap, and repay. It cannot withdraw, change policy or change payees |
| **One collateral stock per vault** | Accepted for v1. Multi-stock is on the cut list as a later item |
| **The 50/25/25 judging split is from press** | Optimise for traction anyway; keep product quality and public posts steady |

## 4. Fallback ladder for the riskiest dependency (borrowing against stock on Morpho)
- **F1 (plan):** the vault supplies the stock as collateral and borrows USDC on the existing Morpho market.
- **F2 (liquidity too low):** the team supplies a small amount of its own USDC to that same Morpho market as an ordinary lender ([HUMAN], e.g. USD 100–300). This is permissionless, adds real liquidity for every borrower, and is disclosed. The vault code does not change.
- **F3 (the contract path fails, S4):** the owner's wallet holds the Morpho position and Granary's keeper proposes transactions the owner signs (advisory mode). The waterfall and the borrow-first rule still run; autonomy is lower. Disclose it.
- **Stop condition:** if no stock can be bought on a DEX within 5% of NAV at USD 5 size (S6 fails on every router), tell the owner before continuing.

## 5. What this audit did not cover
- No transaction was sent. Every "should work" above is unproven until M01/M04.
- Morpho's Midnight fixed-rate markets, liquidation incentive size and bad-debt handling were not read.
- Chainlink feed parameters were not read from Chainlink's own pages.
- The submission form was not opened.
- Legal position in the owner's jurisdiction was not reviewed.
