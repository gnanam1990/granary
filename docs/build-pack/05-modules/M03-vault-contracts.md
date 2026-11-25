# M03 — Vault contracts

## Goal
`GranaryFactory` and `GranaryVault` implemented against mocks, matching the pure math bit for bit, with invariants proven.

## Files
```
contracts/src/GranaryVault.sol
contracts/src/GranaryFactory.sol
contracts/src/lib/WaterfallLib.sol     splitRevenue (pure)
contracts/src/lib/CreditLib.sol        ltvBps, creditLeft, band, planBill, planProtect, minStockOut (pure)
contracts/src/interfaces/{IMorpho,IOracle,IAggregatorV3,IB20}.sol
contracts/test/mocks/{MockUSDC,MockStock,MockMorpho,MockOracle,MockFeed,MockRouter,EvilRouter}.sol
contracts/test/{Factory,Settle,Invest,PayBill,Protect,Owner,Close,Pause,Reentrancy,Differential}.t.sol
contracts/test/invariant/{Handler.sol,Invariants.t.sol}
contracts/test/vectors/waterfall-vectors.json
```

## Interfaces
Use `02-TDD.md` §5 exactly: function names, events, errors, access rules, pause behaviour.

`MockMorpho` must model: collateral per user, borrow shares with interest accrual on demand, a settable oracle price, settable available liquidity, and liquidation threshold checks on `borrow` and `withdrawCollateral`. Take share math from Morpho's `SharesMathLib` (GPL-2.0-or-later / check its licence header and keep it; if the licence is incompatible with MIT for the vault, vendor it under `lib/` unchanged and say so in `NOTICE`).

## Implementation notes
- Solidity 0.8.26, optimizer on. OpenZeppelin `Clones`, `ReentrancyGuard` (upgradeable-safe variant for clones or a simple status slot), `SafeERC20`, `Initializable`.
- Immutables cannot be used in clones: store market params in storage at `initialize`, or use clones-with-immutable-args. Pick one and record it in `DECISIONS.md`.
- `settle()` order: accrue interest on Morpho → read debt → compute split → repay step-2 amount (approve exact, call `repay`, reset approval) → write buckets → emit.
- When step 2 would clear the debt, repay by **shares** so the debt reads exactly zero; any USDC not consumed flows to step 3.
- `invest()` measures balances before and after the router call; trusts nothing the router returns.
- `payBill()` borrows to `address(this)` then transfers to the payee, so the event shows both parts.
- Daily cap uses `block.timestamp / 1 days` as the day key.
- No `selfdestruct`, no `delegatecall` outside the clone proxy, no admin.
- NatSpec on every external function, written for a reader who has not seen this pack.

## Tests first
Write T-S01 … T-S19 (`03-TEST-PLAN.md`) before the contracts. The differential test (T-S04) reads the vector file with `vm.readFile` + `vm.parseJson` and asserts all five numbers per vector.

## Steps
1. Mocks.
2. `WaterfallLib` + differential test → green.
3. `CreditLib` + table tests mirroring T-C05–T-C09.
4. Factory.
5. Vault: `settle` → `invest` → `payBill` → `protect` → owner functions → `close`.
6. Reentrancy tests with `EvilRouter`.
7. Invariant handler and I1–I8.
8. `forge snapshot`; `forge coverage` report into the PR.

## Definition of Done
- [ ] T-S01–T-S19 pass
- [ ] Differential test passes on every vector
- [ ] Invariants hold over ≥ 256 runs × depth 50
- [ ] Line coverage ≥ 95% on `src/`
- [ ] No compiler warnings; `slither` (if installed) findings triaged in the PR
- [ ] README section "What the operator can and cannot do" written from the code

## Ship it
Branch `m03-vault-contracts` → `forge fmt --check && forge build && forge test -vv` plus `pnpm test` → PR with coverage and gas snapshot → checks green → self-review against the invariants list → squash merge. Split into two PRs (libs+factory, then vault) if the diff exceeds ~1,200 lines.
