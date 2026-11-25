# Granary — build pack (START HERE)

This folder is everything a coding agent needs to build **Granary** for Base Stocks Maxxing Season. It has no other context, so read the files in the order below before writing code.

## The idea in 30 seconds
Granary is a balance sheet for AI agents and solo sellers who get paid in USDC over x402 on Base.

1. Revenue lands in the seller's own onchain vault.
2. A fixed rule splits it: operating reserve first, then loan repayment, then a tokenized-stock treasury.
3. When a bill arrives and the reserve is short, the vault **borrows USDC against the stock** on Morpho instead of selling it.
4. The next revenue repays that loan first.

The pitch leads with steps 3 and 4 (borrow instead of sell, repay from income). Steps 1 and 2 are plumbing; two other entrants already do "earn and buy stocks".

## How to use this pack in a new chat
1. Unzip into the new repo at `docs/build-pack/`.
2. Copy `CLAUDE.md` to the repo root.
3. Paste `06-prompts/00-bootstrap.md` into the chat.
4. Then paste one module prompt at a time, from `06-prompts/M00-repo-and-ci.md` through `06-prompts/M10-traction-demo-submission.md`. Do not start a module before the previous PR is merged.

## Reading order
| # | File | Why |
|---|---|---|
| 1 | `CLAUDE.md` | Rules for the coding agent |
| 2 | `00-context/01-hackathon-brief.md` | Event facts, judging, competitors |
| 3 | `00-context/05-feasibility-and-gaps.md` | What is verified, what is not, fallbacks |
| 4 | `00-context/02-sponsor-docs-digest.md` | Exact addresses, APIs, constants |
| 5 | `01-PRD.md` → `02-TDD.md` → `03-TEST-PLAN.md` → `04-UIUX-SPEC.md` | The product and design |
| 6 | `05-modules/` + `06-prompts/` | One module at a time |
| 7 | `07-demo-and-submission/`, `08-reference/` | Demo, submission, day plan, cut list |

`00-context/03-research-evidence.md` and `00-context/04-builder-assets.md` are background; read them when a module points to them.

## Non-negotiables
- **Deterministic code decides money.** No model output ever sets an amount, a recipient or a trade. The LLM only produces schema-validated policy drafts and text.
- **The vault never sells stock by itself.** Short of cash means borrow within the limit, or fail closed.
- **Non-custodial.** Each seller owns their vault. Granary's operator key can never withdraw.
- **No US users.** Tokenized stocks are not available to US persons, and projects that enable trading for US users are not eligible. Geo-block and say so.
- **Real usage only.** Half the score is onchain traction. Never send transactions just to inflate numbers; the public stats page excludes team wallets.
- **Test first, one module per branch and PR, never push to `main`.**
- **Stop at every [HUMAN] step** and ask.

## Deadline
Submissions close **12 December 2026** (time of day unconfirmed; the earlier deadline was 23:59 UTC). The day plan finishes on 11 December 12:00 UTC. See `08-reference/day-plan.md`.

## Status of this pack
`SPECIFICATION_ONLY`. Nothing here has been built or run. Facts marked ⚠ were not verified and each has a spike in module M01.
