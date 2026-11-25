# Research evidence

Full research report: `hackathon-db/reports/20261124-base-stocks-maxxing-ideas.md` in the Hackathon Atlas folder (not in this zip). The parts needed here are below.

## The problem, with evidence
| Claim | Evidence | Strength |
|---|---|---|
| Agents and APIs now earn real money over x402 on Base | CDP Facilitator: "more than 100 million transactions and $28 million in payment volume" (https://docs.cdp.coinbase.com/x402/seller/facilitator). Chainalysis: ~138.5M x402 transactions by end Q3 2026 (https://www.chainalysis.com/blog/x402-agentic-payments-adoption/) | Strong on volume. Quality is disputed (wash activity reported: https://www.cryptopolitan.com/base-logs-138-million-x402-payments-as-ai-agent-revenue-draws-scrutiny/) |
| Agent running costs are lumpy and overrun | https://www.informationweek.com/machine-learning-ai/a-practical-guide-to-controlling-ai-agent-costs-before-they-spiral · https://www.darkreading.com/application-security/how-ai-agents-can-trigger-runaway-costs | Medium. Shows overruns, **not** agents failing for lack of cash |
| Idle business cash earns nothing | UK: £126B of small-business cash in zero-interest accounts (https://www.fintilect.com/resources/insights/business-savings-idle-cash-uk-providers/) | Secondary source |
| Selling tokenized stock at the wrong time is costly | Thin off-hours liquidity (https://www.forbes.com/sites/murtuza-merchant/2026/11/20/tokenized-stocks-go-live-for-americans-monday-check-these-risks-first/); entrant report that a USD 1,000 sell moves a pool (@neqro_61 on X); only 13 of 415 stocks have a reference price (live API) | Medium |
| Borrowing against tokenized stock is possible today | Morpho stock-backed loans on Base (https://cryptobriefing.com/morpho-stock-backed-loans-base-coinbase/ · https://thedefiant.io/news/defi/morpho-coinbase-tokenized-stocks-borrowing-base); live market data in `08-reference/` | Strong, verified onchain |
| Base wants this | Wanted ideas 2.1 and 2.3 (https://x.com/buildonbase/status/2120841565950062839) | Strong |

**Honest weak point:** there is no direct evidence that agents or solo sellers currently fail because cash ran out. The most believable first user is a solo x402 seller with idle USDC, not a fully autonomous agent. The PRD's first persona reflects this.

## Prior art in the Hackathon Atlas database (176,632 unique ideas, checked 2026-11-24)
| Query | Core matches | Winners | Verdict |
|---|---|---|---|
| agent treasury stock x402 revenue | 3 | 0 | Wide open |
| agent earns x402 invests tokenized stocks | 1 | 0 | Wide open |
| stock collateral credit line agent | 5 | 0 | Wide open |
| borrow against stock repay revenue waterfall | 1 | 0 | Wide open |
| revenue split reserve treasury policy agent | 5 | 0 | Wide open |
| tokenized stock agent (broad) | 390 | 35 | Saturated |

Closest older projects, each only one piece:
- Vela — stock-collateralized credit line on Robinhood Chain (https://www.hackquest.io/projects/Vela)
- Tessera — lending protocol for tokenized stocks (https://www.hackquest.io/projects/Tessera-4oZXdz)
- Muara — two-sided lending market for tokenized stocks, a winner (https://www.hackquest.io/projects/Muara)
- EQLTY — bounded agents making a verifiable stock trade, a winner (https://ethglobal.com/showcase/eqlty-smqdg)

Limit: the meaning-based search did not run (local embedding server was off), so differently-worded prior art may be missed.

## Why Granary is not a sponsor feature
Base/Coinbase ship: B20 tokens, multipliers, announcements, policies, pauses, NAV feeds, the read-only API, x402 and its facilitator, Builder Codes. Morpho ships the stock-collateral loan markets. Granary rebuilds none of these. Its own value is the **rule that connects them**: reserve first, repay from income, invest the surplus, borrow instead of sell, fail closed.

The owner's earlier `corporate-action-guard` idea is **not** used as a product: scheduled multiplier updates and announcements now handle stale corporate-action state natively. Granary only reads `paused_features`, multiplier and feed freshness as safety inputs.

## Why this holds up as AI gets stronger
A stronger model earns more and spends more, so it needs a balance sheet more. What Granary holds is not intelligence: it is collateral, a repayment record, and a rule the model cannot override.
