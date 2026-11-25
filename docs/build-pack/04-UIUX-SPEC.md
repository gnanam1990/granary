# Granary — UI/UX spec (Base theme)

The app must look like it belongs on Base: white page, near-black ink, one pure blue, pill buttons, thin grey borders, no shadows, no gradients. Values below were read from computed styles on https://www.base.org/stocksmaxxing on 2026-11-24.

## 1. Design tokens
```css
:root {
  /* colour */
  --bg: #ffffff;
  --surface: #f8f8f8;        /* quiet panels */
  --tint: #f6f7ff;           /* blue-tinted panel */
  --ink: #171717;            /* body text */
  --ink-strong: #000000;     /* headings */
  --muted: #787878;
  --subtle: #9a9a9a;
  --line: #efefef;           /* 1px borders */
  --blue: #0000ff;           /* Base blue; site uses color(display-p3 0 0 1) */
  --blue-press: #003ec1;     /* --bds-blue-80 */
  --blue-soft: #d3e1ff;      /* --bds-blue-5 */
  --ok: #098551;   --ok-soft: #cbf5e3;      /* --bds-green-60 / -5 */
  --warn: #ae7100; --warn-soft: #fff4c0;    /* --bds-yellow-60 / -5 */
  --danger: #c2410c; --danger-soft: #fee8d2;/* orange family; site has --bds-orange-5 #fee8d2 */
  /* shape */
  --r-card: 12px; --r-pill: 9999px; --r-input: 8px;
  /* type */
  --font: "Inter", "Helvetica Neue", Arial, sans-serif;   /* stand-in for Base Sans */
  --mono: "JetBrains Mono", ui-monospace, monospace;      /* hashes, addresses */
}
@supports (color: color(display-p3 0 0 1)) { :root { --blue: color(display-p3 0 0 1); } }
```
Tailwind: map these in `theme.extend.colors` (`bg, surface, tint, ink, muted, subtle, line, blue, ok, warn, danger`), `borderRadius: { card: '12px', pill: '9999px' }`, `fontFamily: { sans: [...], mono: [...] }`.

**Font note:** Base's own typeface ("Base Sans") is proprietary. Do not copy the font files. Use Inter. Follow https://brand.base.org for logo use: say "Built on Base", do not imply endorsement.

## 2. Typography
| Role | Size / line | Weight | Tracking |
|---|---|---|---|
| Display (hero number) | 56 / 60 | 400 | −1.5px |
| H1 | 40 / 44 | 400 | −1px |
| H2 | 28 / 36 | 400 | −0.7px (exact site value) |
| H3 | 20 / 28 | 500 | −0.3px |
| Body | 16 / 24 | 400 | 0 |
| Small / label | 13 / 18 | 500 | 0.2px, `--muted` |
| Number cells | 16 / 24 mono | 400 | `font-variant-numeric: tabular-nums` |

Headings are weight 400, never bold. All money, hashes and percentages use tabular numerals.

## 3. Components
- **Button, primary:** `--blue` fill, white text, pill, height 44, padding 0 20, weight 400. Hover: `--blue-press`. Focus: 2px `--blue` ring with 2px white gap. Disabled: `--line` fill, `--subtle` text.
- **Button, secondary:** white fill, 1px `--line` border, `--ink` text, pill.
- **Link:** `--blue`, no underline until hover.
- **Card:** white, 1px `--line`, radius 12, padding 24, no shadow.
- **Stat tile:** label (small) above a mono number; optional delta chip.
- **Chip (status):** pill, 13px. OK = `--ok` on `--ok-soft`; WATCH = `--warn` on `--warn-soft`; DANGER = `--danger` on `--danger-soft`; neutral = `--muted` on `--surface`. Always icon + word, never colour alone.
- **Waterfall bar:** one horizontal bar split into five labelled segments (Floor, Repay, Reserve, Invest, Free). Segment widths follow the amounts; each has a text label with the amount, so it is readable without colour. Blue only for "Repay"; the others are greys of different lightness with patterns (solid, diagonal, dots).
- **Credit meter:** a track from 0% to the liquidation line. Marks at the owner's ceiling (30%) and the danger line. A needle shows current LTV with the number beside it.
- **Ledger row:** time · kind chip · plain sentence · amount · BaseScan link icon.
- **Receipt drawer:** slides from the right; shows the decoded event, tx hash, block, the policy values used, and a "Copy JSON" button.
- **Code block:** `--surface`, mono, copy button.
- **Icons:** SVG only (Lucide). No emoji in the interface.
- **Brand mark:** a small blue square (the Base square) is Base's; do not use it as Granary's logo. Granary's mark: three stacked horizontal bars of decreasing width in `--ink`, bottom bar `--blue`.

## 4. Screens

### 4.1 Home `/`
- Top bar: Granary mark + name, links (How it works, Stats, Docs), primary button "Open a vault".
- Hero, left aligned: H1 "Borrow against your stock treasury. Don't sell it." Body line: "A balance sheet for agents and sellers paid over x402 on Base." Buttons: "Open a vault", "See it live" (→ `/stats`).
- Under the hero: a live strip with three stat tiles from `/v1/stats` (Settlements, USDC settled, Borrowed and repaid).
- "How it works": the waterfall bar with a worked example (100 USDC in), then three short cards: Reserve first · Borrow, don't sell · Repaid from income.
- Footer notice (always visible): "Tokenized stocks are available only in eligible jurisdictions outside the United States. Not investment advice. Unaudited software. Independent project; not affiliated with Base, Coinbase, Morpho or Chainlink."

### 4.2 Blocked `/blocked`
Plain message: "Granary is not available in your region." No wallet prompt, no links into the app.

### 4.3 Start `/start` (three steps on one page)
1. **Connect** — wallet button; checkbox "I am not a US person and tokenized stocks are available where I live."
2. **Choose your stock** — a list of supported stocks, each row: name, ticker, reference price with its age, available credit liquidity on Morpho, LLTV. Rows without enough liquidity are shown but marked "Low liquidity". One selection.
3. **Set the rule** — five fields with defaults and the hard limit beside each: reserve floor, reserve target, share of surplus to invest, credit ceiling, daily spend cap. Optional text box "Describe it in your own words" (assistant, M08). A live waterfall bar previews a sample 100 USDC payment.
- Primary button: "Create vault" → wallet prompt → success state shows the vault address and the three-line seller snippet with a copy button.

### 4.4 Vault `/vault/[address]`
Layout, top to bottom:
1. **Header:** short address + copy, stock chip, status chip (OK / WATCH / DANGER / Paused), "Owner" badge when the connected wallet owns it.
2. **Balance sheet card (the first thing a judge sees):** two columns. *Has:* Reserve, Investable, Free cash, Stock (share-equivalent units and USD value). *Owes:* Loan. Below: Net worth, Runway in days (reserve ÷ average daily bills over 7 days; "—" when there are no bills).
3. **Credit card:** the credit meter, "Credit left: X USDC", borrow rate, market liquidity.
4. **Last settlement card:** the waterfall bar for the most recent `Settled` event.
5. **Ledger:** newest first, filter chips (All, Revenue, Invested, Bills, Borrowed, Repaid, Risk).
6. **Owner panel (owner only):** Edit rule, Payees, Operator, Pause, Withdraw free cash, Repay, Close vault. Each opens a confirmation card listing exactly what will change before the wallet prompt.
7. **Integrate tab:** `payTo` snippet, bills API key (shown once), curl example.

### 4.5 Stats `/stats`
Tiles: Vaults, Outside vaults, Settlements, USDC settled, Borrowed, Repaid, Bills refused by the rule. A table of the latest 50 events across all vaults with links. A "How we count" box: team wallets listed and excluded, numbers read from contract events, Builder Code shown.

### 4.6 Docs `/docs`
One page: the rule, the limits, the trust model, the seller snippet, the bills API, the honesty section.

## 5. States (every data view)
| State | What the user sees |
|---|---|
| Loading | Skeleton blocks the same size as the content; no layout shift |
| Empty | "No payments yet." + the `payTo` snippet + "Send a test payment" link to the dogfood API |
| Success | Data + BaseScan links |
| Partial | A yellow strip: "Showing chain data only. The indexer is behind by N blocks." |
| Blocked | The refusal reason in words: "Refused: this would take the loan above your 30% ceiling." |
| Error | What failed, a Retry button, and the raw error in a collapsed detail |
| Offline | Top banner "You are offline. Showing the last data from HH:MM." Actions disabled |
| Permission denied | "Only the vault owner can do this." with the owner address |

## 6. Microcopy (use these exact strings)
- Borrowed bill row: "Paid 12.00 USDC to compute. 4.00 from reserve, 8.00 borrowed. No stock sold."
- Refusal: "Refused. Nothing was sold and nothing was paid."
- Stale feed: "Not buying now: the reference price is 14 h old (market closed)."
- Repay row: "Repaid 6.50 USDC from new income. Loan is now 1.50 USDC."
- Risk WATCH: "Your loan is above your own ceiling. New borrowing is off until it comes down."
- Risk DANGER: "Close to liquidation. Granary is repaying from your reserve."
- Never use: "safe", "guaranteed", "risk-free", "earn", "yield" (for stocks), "investment advice".

## 7. Accessibility and motion
- Contrast ≥ 4.5:1 for text, ≥ 3:1 for controls. Note: pure blue on white passes; blue on `--tint` must be checked.
- Full keyboard operation; focus ring always visible; targets ≥ 44×44.
- Charts have text equivalents (the waterfall bar's labels, the meter's number).
- Motion: 150 ms ease-out on drawers and bar segments only. `prefers-reduced-motion: reduce` turns all of it off.
- Breakpoints 1440 / 768 / 390. On 390 the balance sheet stacks; the ledger becomes cards. No horizontal scroll.

## 8. Demo surface
The vault page is the demo. A "Demo actions" drawer appears only for the dogfood vault's owner: "Send a paid request", "Pay a compute bill", "Try a bill above the ceiling". Each calls the real path. Label it "Demo controls — real transactions".
