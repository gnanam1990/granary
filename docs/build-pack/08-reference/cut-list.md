# Cut list — drop in this order when time is short

1. Weekly statement text (M08, second half).
2. Policy assistant (rest of M08). The manual form already works.
3. `/docs` page (link to the README instead).
4. Ledger filters and the receipt drawer's "Copy JSON".
5. Runway calculation (show "—").
6. Smart-wallet batching; use a plain wallet flow.
7. Playwright tests for tablet width (keep desktop and mobile).
8. `close()` in the UI (keep it in the contract).
9. Bazaar listing.
10. Keeper `reindex` command (keep the tests that prove idempotency).

## Never cut
- Tests on `splitRevenue`, `planBill`, `payBill`, invariants I1–I8.
- The borrow-instead-of-sell path and its refusal cases.
- The mainnet USD 5 proof.
- Builder Code on every transaction.
- The non-US gate and notices.
- The honesty section of the README and the stats method box.
- The video and the X post (they are the entry).

## Later, not in this event
Multi-stock vaults · fixed-rate loans (Morpho Midnight) · automatic deleveraging by selling (owner opt-in) · other chains · fees · an audit.
