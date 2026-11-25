# Day plan

Deadline: **12 Dec 2026** (assume 23:59 UTC until S7 confirms). Submit by **11 Dec 12:00 UTC**. Today is 24 Nov. That gives 17 working days and a one-day buffer.

Traction is half the score, so mainnet goes live early (Day 9) and outreach starts on Day 6, not at the end.

| Day | Date | Work | Done when |
|---|---|---|---|
| 1 | Wed 25 Nov | M00 repo + CI. M01 spikes S1–S4 (precompile on fork, contract holds B20, feed params, Morpho round trip with USD 5) | Spike results in `PROVEN.md`; fallback chosen if any failed |
| 2 | Thu 26 Nov | M01 spikes S5–S8 (x402 to a contract, swap route, deadline, package names). M02 core math | Vectors pass in TS |
| 3 | Fri 27 Nov | M03 contracts: libs, factory, `settle` | Differential test green |
| 4 | Sat 28 Nov | M03: `invest`, `payBill`, `protect`, owner functions | T-S01–S16 green |
| 5 | Sun 29 Nov | M03: invariants, fuzz. M04 adapters | I1–I8 green |
| 6 | Mon 30 Nov | M04 mainnet USD 5 proof. **Start outreach list** ([HUMAN]: 15 x402 sellers) | Six tx hashes in `PROVEN.md` |
| 7 | Tue 1 Dec | M05 keeper: detect, settle, ledger, API | T-K01–K08 green |
| 8 | Wed 2 Dec | M05: invest, risk, bills. M06 seller SDK + dogfood API | A paid request ends as a `Settled` row |
| 9 | Thu 3 Dec | M09 (early part): deploy factory to mainnet, verify, Builder Code, keeper live. **Dogfood API live on mainnet** | Real settlements counted |
| 10 | Fri 4 Dec | M07 web: start flow, vault page | Create-vault works from the UI |
| 11 | Sat 5 Dec | M07: ledger, credit meter, stats, all eight states, mobile | Playwright green |
| 12 | Sun 6 Dec | M08 policy assistant + statement. **Outreach round 2**, Bazaar listing | First outside vault |
| 13 | Mon 7 Dec | M09 (rest): geo gate, red-team run, self security review, honest README | T-R01–R08 recorded |
| 14 | Tue 8 Dec | Harden: fix findings, retry paths, empty/error states. Support outside sellers | No open P0 |
| 15 | Wed 9 Dec | M10: demo acceptance run, record video ([HUMAN]) | Run passes end to end |
| 16 | Thu 10 Dec | Edit video, write-up, X thread, screenshots, release tag `v0.1.0` | Assets ready |
| 17 | Fri 11 Dec | **Post on X and submit the form by 12:00 UTC** ([HUMAN]) | Confirmation saved |
| — | Sat 12 Dec | Buffer only. No new features | — |

## Every day
- One short progress post on X tagging @buildonbase ([HUMAN] posts; the agent drafts it at the end of each module).
- Update `PROVEN.md`.

## If a day slips
Use `cut-list.md` in order. Never move the mainnet date (Day 9) later than Day 11.
