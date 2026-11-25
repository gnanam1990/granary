# Write-up draft (for the submission form and the README top)

Replace every `{{…}}` with the real value. Do not submit with placeholders. Do not claim anything that is not in `PROVEN.md`.

## One line
Granary is a balance sheet for agents and sellers paid over x402 on Base: it keeps a reserve, builds a tokenized-stock treasury, and borrows against that stock instead of selling it when a bill arrives.

## What it does
- Revenue lands in the seller's own vault contract.
- One fixed rule splits it: survival floor, loan repayment, reserve target, stock treasury, free cash.
- A bill larger than the reserve is paid by borrowing USDC against the stock on Morpho, inside the owner's ceiling (30% by default against a 62.5% liquidation line). If that is not possible it refuses. It never sells stock by itself.
- The next revenue repays the loan first.
- If the stock falls and the loan nears danger, anyone can call `protect()`, which repays from the reserve.

## Why it matters
Base asked for agents that earn a stock treasury and for stock-backed working capital for agents. Granary joins the two into one loop and adds the missing rule between them. Other entries stop at "earn and buy"; Granary's point is what happens when the cash runs short.

## How it uses Base
- Coinbase tokenized stocks (B20) as the treasury asset; multiplier-aware balances.
- Chainlink reference feeds as the onchain floor for every purchase.
- Morpho's stock-collateral markets on Base as the credit line.
- x402 with the CDP Facilitator as the revenue rail; the vault is the `payTo` address.
- Builder Code `{{bc_code}}` on every transaction.

## What is live
- Factory `{{factory_address}}` and vault implementation `{{impl_address}}`, verified on BaseScan.
- App: `{{app_url}}` · Stats: `{{app_url}}/stats` · Repo: `{{repo_url}}`
- Usage as of `{{date}}`: `{{outside_vaults}}` outside vaults, `{{settlements}}` settlements, `{{usdc_settled}}` USDC settled, `{{borrow_repay_cycles}}` borrow-and-repay cycles. Team wallets excluded.

## What was built in the Quest period
The whole repository: contracts, policy library, keeper, seller SDK, the Stock Facts paid API and the web app. It reuses design patterns (not code) from the author's earlier public repos `flowops`, `snapfall`, `sherpa`, `tollbooth` and `heirloom-protocol`. `{{list any adapted files and their licences, or delete this sentence}}`

## Honest limits
- Unaudited.
- Morpho's stock markets are small, so credit lines are small.
- One stock per vault.
- The owner still carries liquidation risk; Granary lowers it, it does not remove it.
- No admin keys: a fix needs a new factory and owners moving over.
- `{{anything simulated in the demo}}`
- Not available to US persons. Not investment advice. Independent project, not affiliated with Base, Coinbase, Morpho or Chainlink.

## Next
Multi-stock vaults, fixed-rate credit, an audit, and a managed keeper for sellers who do not want to run one.
