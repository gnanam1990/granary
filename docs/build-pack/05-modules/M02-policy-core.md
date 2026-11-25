# M02 — Policy core (pure math)

## Goal
The money rules as pure TypeScript functions, proven on shared vectors. This is the reference the Solidity must match.

## Files
```
packages/core/src/types.ts        Policy, Books, BillPlan, Refusal, Band
packages/core/src/waterfall.ts    splitRevenue
packages/core/src/credit.ts       ltvBps, creditLeft, band, planBill, planProtect, minStockOut
packages/core/src/bounds.ts       HARD_BOUNDS, validatePolicy, clampPolicy
packages/core/src/format.ts       usdc/stock formatting for UI (string in, string out)
packages/core/test/*.test.ts
```

## Interfaces
Exactly as in `02-TDD.md` §4. All amounts `bigint`. No `Date.now()`, no I/O, no floats. Functions return a result or a `Refusal` value (`DAILY_CAP | NO_LIQUIDITY | CREDIT_CEILING`); they do not throw for business outcomes.

Rounding rules (TDD §3): collateral value down, debt up, LTV up, splits down with the remainder passed on.

`validatePolicy(policy, lltvBps)` returns a list of violations using PRD §7. `clampPolicy` moves each field to the nearest allowed value and returns what it changed.

## Steps
1. Write tests T-C01 … T-C10 from `03-TEST-PLAN.md`. Load vectors from `docs/build-pack/08-reference/schemas/waterfall-vectors.json`.
2. Run; confirm they fail.
3. Implement.
4. Add fast-check properties.
5. Copy the vector file to `contracts/test/vectors/` (M03 reads it there) and add a script that fails if the two copies differ.

## Definition of Done
- [ ] T-C01–T-C10 pass; ≥ 5,000 property runs
- [ ] 100% line and branch coverage on `waterfall.ts` and `credit.ts`
- [ ] No floating-point operator on money (lint rule or grep check in CI)
- [ ] `PROVEN.md` updated with counts

## Ship it
Branch `m02-policy-core` → `pnpm lint && pnpm typecheck && pnpm test` → PR with coverage output → checks green → self-review against this DoD → squash merge.
