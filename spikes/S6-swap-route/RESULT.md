# S6 — Router and quote API for USDC → stock within 1.5% of NAV

**Answer: PASS.** KyberSwap's aggregator routes USDC → SPCXc on Base at **+0.31%** vs NAV for both USD 5 and USD 50 (positive = received stock worth more than paid at NAV). The router address in the API response matches the candidate: `0x6131B5fae19EA4f9D964eAc0408E4408b66337b5` → `SWAP_ROUTER_ADDRESS` settled.

Date: 2026-11-25 ~02:55 UTC. NAV reference: SPCXc feed answer $124.72 (1e8-scaled, sampled minutes earlier in S3).

## Commands and output

```
GET https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=<USDC>&tokenOut=<SPCXc>&amountIn=5000000
GET ... amountIn=50000000
```

| Size      | amountOut (raw, 8dp) | shares     | value at NAV | deviation vs NAV |
| --------- | -------------------- | ---------- | ------------ | ---------------- |
| USD 5.00  | 4,021,709            | 0.04021709 | $5.0159      | +0.314%          |
| USD 50.00 | 40,218,118           | 0.40218118 | $50.1600     | +0.315%          |

- `routerAddress` field of the response: `0x6131B5fae19EA4f9D964eAc0408E4408b66337b5` (same as the MaxxAgent-sourced candidate, now confirmed by the provider's own API).
- Gas estimate ~$0.004–0.008 per swap — negligible.
- Route is a single direct pool hop both times.

## Consequences

- Default collateral stock confirmed: **SPCXc** — deepest Morpho liquidity (USD 1,217) and a verified swap route inside the 1.5% bound.
- The vault's `invest` slippage check can use 1.5% vs NAV as designed; measured spread is ~0.3%.
- Note: positive deviation means buying slightly below NAV; thin pools can flip sign fast, so the onchain NAV check stays mandatory.
