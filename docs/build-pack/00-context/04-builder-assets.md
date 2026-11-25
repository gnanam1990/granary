# Builder assets — what to reuse

Owner's GitHub: `gnanam1990`. Repo facts checked 2026-11-24 with `gh api`.

| Repo | Licence | Language | What it is | Use in Granary |
|---|---|---|---|---|
| `flowops` | none | Go, Solidity, Next | Policy, authorization, settlement evidence for agent payments on Base. `cmd/x402-conformance`, `cmd/base-observer`, `cmd/escrow-conformance`, `contracts/src` | **Patterns only** (no licence file, and Go). Policy-as-data, approval flow, reconciling x402 settlements against chain events |
| `snapfall` | MIT | Go, Solidity, TS | Self-financing AI workforce on Arc; capital pool repaid first in one settlement. `contracts/src` (FloatPool, JobVault, AuditAnchor), `daemon/`, `sidecar/` | Repay-first waterfall shape, credit-limit curve, invariant tests. Solidity may be adapted with attribution |
| `tollbooth` | none | Solidity, TS SDK | Pay-per-call registry and per-call escrow | Patterns for the seller SDK shape (`sdk/src`) |
| `sherpa` | Apache-2.0 | TS, Solidity | NL DeFi agent on Base mainnet, 2 security reviews. `packages/safety`, `packages/contracts`, `packages/llm`, `apps/web` | Deterministic safety checks, confirmation cards, smart-wallet onboarding, LLM-output validation. Code may be adapted with attribution |
| `heirloom-protocol` | — | Solidity | Base mainnet factory, audit-remediated | Factory + clone deployment and BaseScan verification flow |
| `kiteindex` | — | TS (Ponder) | Indexer | Not used; the keeper reads logs with viem directly (simpler) |

## Per module
| Module | Lift |
|---|---|
| M02 policy core | snapfall's waterfall ordering and rounding discipline (always round against the vault owner's debt, i.e. debt up, credit down); flowops' "policy is data, decision is a pure function" |
| M03 contracts | snapfall invariant-test style (`contracts/test`); heirloom factory/clone pattern; sherpa router's exact-approval-then-reset pattern |
| M04 adapters | sherpa `packages/safety` slippage and allowlist checks |
| M05 keeper | flowops `base-observer` idea: reconcile from chain logs, never from webhooks alone; idempotent jobs keyed by tx hash + log index |
| M06 seller SDK | tollbooth `sdk/src` API shape; flowops `x402-conformance` test idea |
| M07 web | sherpa `apps/web` smart-wallet connect and confirmation cards |
| M08 assistant | sherpa `packages/llm` schema validation at the boundary |
| M09 deploy | heirloom mainnet verify flow; sherpa `scripts/compliance` for the geo gate |

## Continuity disclosure (needed on the submission form)
Granary is a new repository started in the Quest period. It reuses **design patterns** from the owner's earlier public repos `flowops`, `snapfall`, `sherpa`, `tollbooth` and `heirloom-protocol`. If any file is adapted from `snapfall` (MIT) or `sherpa` (Apache-2.0), keep the licence header and list the file in `NOTICE`. State this in the README and on the form.

## Owner's known gaps to cover
- Distribution is weak: plan the video, the live URL and the X thread from day 1 (25% of the score is building in public).
- Few mainnet deployments: Granary must be on Base mainnet with a written self-review (M09).
