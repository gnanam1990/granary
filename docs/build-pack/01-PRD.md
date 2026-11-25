# Granary — Product Requirements

## 1. Problem
A seller or agent earning USDC over x402 has three bad choices today:
1. Leave all cash idle.
2. Buy assets and then sell them whenever a bill arrives, often into a thin or closed market.
3. Run out of cash between a bill and the next customer payment.

Nothing connects income, a reserve, a stock treasury and a credit line under one rule the agent cannot break.

## 2. Users
| Persona | Who | Wants | First-use moment |
|---|---|---|---|
| **P1 Solo seller** (primary) | A developer selling an API or data over x402 on Base, outside the US | Idle USDC put to work without losing the ability to pay bills | Points `payTo` at a vault, sees the first payment split |
| **P2 Agent operator** | Someone running an autonomous agent that both earns and pays for compute | The agent must never stop for lack of cash and must never overspend | Sets a daily spend cap and a credit ceiling |
| **P3 Judge / visitor** | Reads the app for two minutes | Proof it is real | Opens the public stats page and a transaction on BaseScan |

Economic buyer for a later paid version: P1/P2 themselves (fee on managed volume). Demand is **unproven**; the hackathon measures usage, not revenue.

## 3. Goals and non-goals
**Goals**
- G1 Revenue reaching a vault is split by a fixed, visible rule.
- G2 A bill can be paid when the reserve is short by borrowing against the stock, within a hard ceiling.
- G3 The next revenue repays the loan before anything else except the survival floor.
- G4 Every dollar is traceable to a transaction.
- G5 A seller can adopt it in minutes.

**Non-goals (v1)**
- Picking stocks or giving advice. The owner chooses one stock from a fixed list.
- Selling stock automatically.
- Lending Granary's own money, holding user funds, or charging fees.
- Fixed-rate loans, multiple collateral stocks per vault, other chains, a token.
- Serving US users.

## 4. The rule (the product in one table)
On every settlement of new revenue `R`:
| Step | Name | Amount |
|---|---|---|
| 1 | Survival floor | Fill the reserve up to `reserveFloor` |
| 2 | Repay | `repayBps` of what is left goes to the loan, up to the debt |
| 3 | Reserve target | Fill the reserve up to `reserveTarget` |
| 4 | Invest | `investBps` of what is left becomes "investable" |
| 5 | Free cash | The rest; only the owner can withdraw it |

When a bill of size `B` is paid:
- Reserve ≥ `B` → pay from the reserve.
- Otherwise borrow the shortfall if the loan stays under `maxLtvBps` and the market has the liquidity. If not, **refuse** (no sale, no partial payment).

When collateral falls and the loan-to-value passes the danger line, anyone may call `protect()`: it repays from the reserve until the loan is back under the ceiling, or the reserve is empty.

## 5. User stories and acceptance criteria
**US-1 Create a vault** (P1)
- Given an eligible (non-US) visitor with a wallet, when they choose a stock and accept defaults, then one transaction deploys their vault and the app shows its address and a `payTo` snippet.
- A US IP is blocked before the wallet prompt.

**US-2 Receive revenue** (P1)
- Given a vault as `payTo`, when an x402 payment settles, then within one keeper cycle a `Settled` event shows the five amounts and they sum to the revenue exactly.

**US-3 Invest surplus** (P1)
- Given investable cash and a fresh price feed, when the operator invests, then the vault receives at least the onchain minimum computed from the feed and slippage limit, and the stock is posted as collateral.
- Given a stale feed, the call reverts and no approval remains.

**US-4 Pay a bill by borrowing** (P2) — the headline
- Given a reserve smaller than the bill and enough credit, when the operator pays an allowlisted payee, then the reserve is used first, the shortfall is borrowed, the payee receives the full amount, no stock is sold, and a `Borrowed` event records it.
- Given the borrow would break the ceiling or the market lacks liquidity, the call reverts and nothing changes.
- Given a payee not on the list, or the daily cap exceeded, the call reverts.

**US-5 Repay from income** (P1/P2)
- Given a debt, when new revenue settles, then the repay step runs before the reserve target and the debt falls; when the debt is cleared it reads exactly zero.

**US-6 React to a collateral drop** (P2)
- Given a price fall that pushes LTV past the danger line, when anyone calls `protect()`, then debt is repaid from the reserve and a `Protected` event is emitted; the UI shows the risk band changing.

**US-7 Stay in control** (P1)
- The owner can change policy within hard bounds, change payees, replace the operator, pause, withdraw free cash, repay, and close the vault (repay all, withdraw collateral). The operator can do none of these.

**US-8 See the books** (P1, P3)
- The dashboard shows reserve, investable, free cash, stock held (in share-equivalent units using the multiplier), stock value, debt, LTV, credit left, runway in days, and a ledger where every row links to BaseScan.

**US-9 Integrate in minutes** (P1)
- A seller adds one package and three lines to an existing x402 server and revenue reaches the vault.

**US-10 Describe a policy in plain words** (P1, optional)
- The owner types a sentence; the assistant returns a policy draft; the app shows it next to the hard limits; nothing is applied until the owner signs.

**US-11 Public proof** (P3)
- `/stats` shows vaults, settlements, USDC settled, borrowed and repaid, with team wallets excluded and the method explained.

## 6. Features by module
| Module | Delivers |
|---|---|
| M00 | Repo, CI, protected `main` |
| M01 | Spikes S1–S8, constants package |
| M02 | Pure policy math + shared vectors |
| M03 | `GranaryVault`, `GranaryFactory` with mocks and invariants |
| M04 | Morpho/feed/router adapters, mainnet USD 5 proof |
| M05 | Keeper: detect revenue, settle, invest, watch risk; ledger DB; API |
| M06 | Seller SDK + dogfood paid API |
| M07 | Web app in Base theme |
| M08 | Policy assistant and weekly statement |
| M09 | Mainnet deploy, Builder Code, geo gate, self security review |
| M10 | Traction push, demo, submission, release |

## 7. Policy defaults and hard bounds
| Field | Default | Hard bound (contract-enforced) |
|---|---|---|
| `reserveFloor` | 5 USDC | ≤ `reserveTarget` |
| `reserveTarget` | 25 USDC | ≤ 1,000,000 USDC |
| `repayBps` | 10,000 (100%) | 1,000 – 10,000 |
| `investBps` | 8,000 (80%) | 0 – 10,000 |
| `maxLtvBps` | 3,000 (30%) | ≤ market LLTV − 2,000 |
| danger line | market LLTV − 1,000 | fixed |
| `dailyOpexCap` | 20 USDC | any |
| `maxSlippageBps` vs NAV | 150 | ≤ 500 |
| `navMaxAge` | 3,600 s | 60 – 93,600 s |
| fee | 0 | fixed 0 in v1 |

## 8. Revenue model (after the hackathon; not built)
A small fee on invested volume or on interest saved, plus a paid managed keeper. Stated only as a scenario.

## 9. Success metrics for the event
| Metric | Target by 11 Dec |
|---|---|
| Outside vaults (not team) | ≥ 5 |
| Settlements on mainnet | ≥ 300 |
| Borrow → repay cycles completed by outside vaults | ≥ 5 |
| Public progress posts on X | ≥ 10 |
| Demo shows all three Base 2.3 beats | yes |

Targets are goals, not claims. Report the real numbers.

## 10. Risks
See `08-reference/risk-register.md`. Top three: thin Morpho liquidity, getting outside sellers, and the B20 precompile behaving differently from a normal ERC-20.

## 11. Scope cuts
See `08-reference/cut-list.md`.
