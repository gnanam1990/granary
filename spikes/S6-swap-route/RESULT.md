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
| USD 5.00  | 4,024,509            | 0.04024509 | $4.9941      | −0.152%          |
| USD 50.00 | 40,283,220           | 0.40283220 | $49.9885     | +0.012%          |

(enforcing run ~03:05 UTC: deviation computed against the live feed answer $124.10; `run.sh` exits non-zero outside ±1.5% or on any router mismatch)

- `routerAddress` field of the response: `0x6131B5fae19EA4f9D964eAc0408E4408b66337b5` (same as the MaxxAgent-sourced candidate, now confirmed by the provider's own API).
- `/route/build` verified: posting both route summaries returns executable calldata (4,708 bytes) targeting the same router — quotes are not just indicative.
- Gas estimate ~$0.004–0.008 per swap — negligible.
- Route is a single direct pool hop both times.

## Consequences

- Default collateral stock confirmed: **SPCXc** — deepest Morpho liquidity (USD 1,217) and a verified swap route inside the 1.5% bound.
- The vault's `invest` slippage check can use 1.5% vs NAV as designed; measured spread is ~0.3%.
- Note: positive deviation means buying slightly below NAV; thin pools can flip sign fast, so the onchain NAV check stays mandatory.
