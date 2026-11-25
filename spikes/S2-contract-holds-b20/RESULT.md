# S2 — Can a plain contract receive, hold and send a B20 stock?

**Status: BLOCKED [HUMAN] — not yet executed.** Needs a funded test wallet on Base mainnet (~USD 5 total for S2+S4+S5) and owner approval for mainnet spend. The keeper/vault contracts do not exist yet (M03).

Plan once funded: deploy a ~20-line holder contract on mainnet, send it USD 1 of stock, have it send the stock back; record tx hashes here.

Fallback if it fails (from `00-context/05-feasibility-and-gaps.md`): supply to Morpho in the same call straight from the router output via a bundler, since `receiver = Morpho` is not possible — escalate to owner.

Date opened: 2026-11-25.
