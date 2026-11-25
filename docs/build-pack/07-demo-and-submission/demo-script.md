# Demo script — 3:00, live on Base mainnet

Everything shown is the real product path unless a label says otherwise. Keep BaseScan open in a second tab. Speak slowly; captions on.

| Time | Screen | Say |
|---|---|---|
| 0:00–0:20 | Title card, then the vault page | "Agents and small sellers on Base now get paid in USDC over x402. When a bill arrives, they either hold idle cash or sell their assets, often into a thin or closed market. Granary gives them a balance sheet instead." |
| 0:20–0:40 | Home page waterfall bar | "Every payment is split by one fixed rule: a reserve first, then loan repayment, then a tokenized-stock treasury. The agent cannot change the order." |
| 0:40–1:05 | Terminal: one paid request to the Stock Facts API → vault page updates | "Here is a real x402 payment. It lands in the seller's own vault. The rule runs onchain: this much to the reserve, this much set aside for stock." Click the row → BaseScan. |
| 1:05–1:25 | Ledger: `Invested` row; balance sheet shows stock | "The surplus buys the stock only when the reference price is fresh, and never below the onchain minimum. The stock is posted as collateral." |
| 1:25–1:55 | **Demo controls → "Pay a compute bill"** larger than the reserve | "Now a compute bill arrives that is bigger than the reserve. Granary does not sell. It borrows the shortfall against the stock on Morpho, inside a 30% ceiling." Show the row: "No stock sold." Open BaseScan: the `Borrowed` event. |
| 1:55–2:10 | **"Try a bill above the ceiling"** | "Ask for too much and it refuses. Nothing sold, nothing paid." Show the refusal reason. |
| 2:10–2:30 | Second paid request → `Repaid` row; credit meter moves back | "The next payment repays the loan first. The credit line refills by itself." |
| 2:30–2:42 | Risk beat (label on screen if simulated) | "If the stock falls and the loan nears danger, anyone can trigger protect: it repays from the reserve. It still never sells without the owner." |
| 2:42–2:52 | Stats page | "This is live on Base mainnet. These are settlements from outside sellers; our own wallets are excluded. Sellers adopt it with three lines." Show the snippet. |
| 2:52–3:00 | Closing card | "Granary. Borrow against your stock treasury, don't sell it. Unaudited, not available in the US, built on Base." |

## Before recording
- Pass the demo acceptance run (`03-TEST-PLAN.md`).
- Prepare the dogfood vault: reserve near the floor, some collateral posted, no debt, feed fresh (record during US market hours).
- Check the Morpho market has enough liquidity for the bill (a few USDC).
- Pre-open BaseScan tabs; set browser zoom so numbers are readable at 1080p.
- Hide bookmarks, wallet balances of other accounts and any personal data.

## If something fails live
Do not fake it. Stop, find the cause, record again. If the market is illiquid, use a smaller bill.
