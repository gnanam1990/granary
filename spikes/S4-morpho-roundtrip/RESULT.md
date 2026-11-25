# S4 — Full Morpho round trip from a contract (supply → borrow → repay by shares → withdraw)

**Status: BLOCKED [HUMAN] — not yet executed.** Same funded-wallet dependency as S2 (about USD 5 of stock + gas). This is the core claim of the project.

Plan once funded: from a small contract, approve + `supplyCollateral` USD 5 of SPCXc → `borrow` USD 1 → `repay` by shares (`assets = 0, shares = borrowShares`) → `withdrawCollateral`; record all tx hashes here.

Fallback ladder if it fails (from the feasibility doc): F2 team seeds the market with own USDC as an ordinary lender; F3 advisory mode where the keeper proposes transactions the owner signs. Stop condition: no stock buyable within 5% of NAV on any router (already disproven — S6 passed at ~0.3%).

Date opened: 2026-11-25.
