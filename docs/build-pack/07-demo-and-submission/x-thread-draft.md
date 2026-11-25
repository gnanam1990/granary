# X thread draft (submission post)

Post 1 carries the video and tags @buildonbase (required for entry). Replace `{{…}}`. Keep it plain; no hype words, no price talk, no "earn" or "yield" for stocks.

**1/** (video attached)
Granary: a balance sheet for agents and sellers paid over x402 on Base.

When a bill is bigger than the reserve, it borrows against the stock treasury instead of selling it. The next payment repays the loan first.

Live on Base mainnet. Built for Stocks Maxxing. @buildonbase

**2/**
The rule is fixed and onchain:
reserve floor → repay loan → reserve target → buy stock → free cash.

The agent runs it. The agent cannot change it, and it cannot withdraw.

**3/**
Borrowing uses Morpho's stock-collateral markets on Base, inside the owner's own ceiling (30% by default; liquidation is at 62.5%).

If the bill would break the ceiling, Granary refuses. Nothing sold, nothing paid.

**4/**
Sellers adopt it with three lines: set the vault as `payTo` in their x402 server.

`{{snippet_image_or_gist_link}}`

**5/**
Numbers so far (team wallets excluded): `{{outside_vaults}}` outside vaults, `{{settlements}}` settlements, `{{borrow_repay_cycles}}` borrow-and-repay cycles.
Stats: `{{app_url}}/stats`
Code: `{{repo_url}}`

Unaudited. Small credit lines. Not available in the US. Not investment advice.

---

## Build-in-public posts (one per day; the agent drafts, the owner posts)
Ideas, each with one screenshot or tx link and @buildonbase:
- Day 1: "Spike results: can a contract hold a B20 stock and borrow against it on Morpho? Answer and tx."
- Day 3: "The waterfall as 15 test vectors, same numbers in TypeScript and Solidity."
- Day 5: "Eight invariants the vault can never break."
- Day 6: "USD 5 on mainnet: settle → invest → borrow → repay → close. Six transactions."
- Day 9: "Factory verified on Base. First real x402 payment settled."
- Day 11: "The vault page: has, owes, credit left."
- Day 12: "First outside seller."
- Day 13: "What the operator key can and cannot do. Red-team results."
- Day 15: "What is still mocked, and the limits we know about."

Post real results, including failures. Never post numbers that include team wallets.
