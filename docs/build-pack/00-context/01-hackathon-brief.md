# Hackathon brief — Base Stocks Maxxing Season

Retrieved 2026-11-24. Re-check the Quest page before submitting; dates and criteria may change.

## Facts
| Item | Value | Source |
|---|---|---|
| Sponsor | Coinbase Technologies, Inc. ("Base") | https://www.base.org/stocksmaxxing/rules |
| Period | 5 Nov – **12 Dec 2026** (extended one week on 23 Nov) | Quest page; @buildonbase post of 23 Nov |
| Time of day | ⚠ not stated for 12 Dec. The old deadline was 23:59 UTC (Bankr post). Rules say times are UTC. | rules §2 |
| Our track | **Agentic Stock Finance** — "Build agents that research, earn or trade around tokenized stocks in novel ways." | Quest page |
| Track prizes | USD 21,000 total: USD 20,000 Base pool + partners (Bankr, BaseStonk, Clanker) | Quest page |
| Other tracks | Meme and Community Economies (USD 61,000), Programmable Stock Markets (USD 23,000) | Quest page |
| Build-in-public award | USD 6,000, community vote, share progress on X tagging @buildonbase | FAQ |
| Team | 1–5 people, one representative gets the prize | rules §4 |
| Entry | (1) public X post with a **video demo** tagging **@buildonbase**; (2) the submission form (linked from the Quest page) with the X link and track | rules §5 |
| Submissions per track | One per team per track. A project wins in one track only. | rules §5 |
| Pre-existing code | Allowed if the form clearly says what was built in the period | rules §6 |
| Testnet | Allowed, "not judged less favorably" — but see judging | rules §5 |
| Prizes paid | USDC on Base, after identity and sanctions checks | rules §9–10 |

## Judging
| Criterion | Weight | What judges see | Module that delivers it |
|---|---|---|---|
| Traction: real onchain usage | 50% | Mainnet transactions attributed by Builder Code; a public stats page; outside sellers using it | M06, M09, M10 |
| Product quality | 25% | The live app, the borrow-instead-of-sell proof, clear risk screens | M03, M04, M07 |
| Build in public | 25% | Regular X posts with progress, public repo, PR history | every module ends with a post draft; M10 |

⚠ The 50/25/25 split comes from press coverage (https://cryptobriefing.com/base-tokenized-stock-builder-competition/). The rules only say "criteria on the Quest page, weighted equally unless stated". Treat traction as most important either way.

## What Base asked for (Agentic track), and where Granary sits
Source: https://x.com/buildonbase/status/2120841565950062839
- **2.1 Agents that earn their stock treasury.** "useful work → revenue → operating reserve → stock treasury". Show: a real payment funding a permitted stock purchase, clear allocation rules, a reserve the agent can't invest.
- **2.3 Stock-backed working capital for agents.** Stock collateral, a capped credit line, rules that send part of incoming revenue to repayment while keeping an operating reserve; the agent tracks borrowing cost and collateral and flags rising risk. Show: an agent managing a financed position, repaying from revenue, and reacting to a collateral drop within its permissions.
- 2.2 Research-to-portfolio agents (not us).

Granary implements 2.1 and 2.3 as one loop and leads with 2.3. **The demo must show all three 2.3 "show us" beats.**

## Hard restrictions
- Projects that **enable trading for US users are not eligible**. Coinbase tokenized stocks are only for eligible jurisdictions outside the US (Bankr also excludes the UK).
- Teams that previously launched tokens are not eligible by default. Granary launches no token.
- Do not claim shareholder rights or any endorsement by Base, Coinbase, Morpho, Chainlink or a listed company.
- Builders carry their own compliance duty, including for lending. Granary lends nothing itself; it routes the vault owner's own position to Morpho.
- No unnecessary personal data in the submission.

## Competitors (do not copy; say how we differ)
| Entry | What it does | Difference |
|---|---|---|
| bunnbase (@bunnbase) | Agent hedges its own compute costs with stocks; x402 APIs; mainnet | No borrowing, no repay-from-income, single agent |
| research-to-treasury-agent (github.com/doydrop/research-to-treasury-agent) | Sells research over x402, sweeps profit into stocks; testnet | Same, and testnet only |
| YieldSeeker (@yieldseekerxyz) | Established yield agents; "Borrow agents" announced 13 Nov | Manages a person's DeFi loans; not tied to income or to a stock treasury |
| Leash, Maat, MetraxiaHQ | Mandate-bound portfolio agents, fail-closed trade guards | Portfolio management, not a balance sheet |
| MaxxAgent, StockPilot, Owl AI | Baskets, research-to-portfolio, strategy vaults | Idea 2.2 / indexes |

Scan limits: X search was rate-limited; the list comes from account timelines, Bankr's team list (https://x.com/bankrbot/status/2121323533972504600) and GitHub. More entrants may exist.

## Submission checklist (short form; full version in `07-demo-and-submission/submission-checklist.md`)
- [ ] Live mainnet app URL, non-US gate on
- [ ] Public repo with honest README
- [ ] X post with video demo, tagging @buildonbase
- [ ] Submission form sent ([HUMAN]; open the form early to see its fields)
- [ ] Form states exactly what was built in the period and which earlier repos' patterns were reused
