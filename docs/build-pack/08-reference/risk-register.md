# Risk register

| # | Risk | Likelihood | Impact | Early sign | Response |
|---|---|---|---|---|---|
| R1 | Morpho stock markets too illiquid to borrow | High | High | `liquidityAssetsUsd` < 20 on the chosen market | Pick the deepest market at deploy; keep draws to USD 1–50; fallback F2 (team supplies USDC as a lender, disclosed) |
| R2 | No outside sellers adopt it | High | High (50% of score) | Zero outside vaults by Day 12 | Start outreach Day 6; three-line SDK; Bazaar listing; help sellers set up live; run the dogfood API honestly labelled |
| R3 | B20 precompile breaks fork tests or behaves unlike ERC-20 | Medium | Medium | S1/S2 fail | Mocks for unit tests; mainnet USD 5 proof; `SafeERC20`; balance-delta checks |
| R4 | x402 facilitator will not settle to a contract | Low | Medium | S5 fails | Pay to the seller's wallet, forward to the vault in the SDK; disclose |
| R5 | No DEX route for the chosen stock near NAV | Medium | High | S6 quote worse than 5% | Try other routers and stocks; smaller size; owner buys once manually and Granary manages credit only |
| R6 | Price gaps at the market open push a vault toward liquidation | Medium | High for that user | LTV band moves to WATCH | 30% default ceiling vs 62.5% liquidation; `protect()`; clear risk text; tiny amounts during the event |
| R7 | A bug in the vault loses funds | Low | Very high | Invariant or fuzz failure | Invariants I1–I8, differential tests, red-team run, tiny mainnet amounts, no admin keys, "unaudited" notice |
| R8 | Operator key leaks | Low | Low–medium | Unexpected `BillPaid` | Bounded by payee allowlist and daily cap; owner rotates operator |
| R9 | A US user gets through | Medium | Eligibility | — | IP gate, attestation, notices, block list in env; contracts stay permissionless and that is stated |
| R10 | Docs changed since 24 Nov (package names, ABIs) | Medium | Low | Install or type errors | M01 S8 re-reads docs; `DECISIONS.md` |
| R11 | Deadline time earlier than assumed | Low | High | — | Submit a day early |
| R12 | Feed semantics differ (per share vs per token) | Medium | Medium | S3 | One multiplication by the multiplier; covered by a test either way |
| R13 | Judges see "earn and buy stocks" as a copy of bunnbase | Medium | Medium | — | Lead every surface with borrow-instead-of-sell and repay-from-income |
| R14 | Team's own lender deposit (F2) looks like self-dealing | Low | Low | — | Disclose amount and address in the README and stats page |
| R15 | Running out of time on the web app | Medium | Medium | Day 11 not green | Cut list; the vault page comes before everything else |
