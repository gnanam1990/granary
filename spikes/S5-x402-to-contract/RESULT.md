# S5 — Does the CDP Facilitator settle an `exact` payment to a contract `payTo`?

**Status: BLOCKED [HUMAN] — not yet executed.** Needs CDP API keys (`CDP_API_KEY_ID`, `CDP_API_KEY_SECRET` — account creation is a human step) plus the funded wallet from S2 for the contract `payTo` target.

Plan once unblocked: run the x402 seller quickstart with `payTo` = the S2 contract, `environment: "production"`, price `$0.01`; pay it once; confirm USDC lands in the contract; record the tx hash here. Note the digest's expectation: the `exact` EVM scheme uses USDC `transferWithAuthorization`, which has no receiver hook, so settlement to a contract should succeed.

Fallback if it fails (from the feasibility doc): set `payTo` to the seller's EOA/smart wallet and forward to the vault in the same request handler (one extra transfer, weaker guarantee — disclose it).

Date opened: 2026-11-25.
