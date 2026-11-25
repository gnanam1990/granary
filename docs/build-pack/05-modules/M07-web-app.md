# M07 — Web app

## Goal
The product a judge sees: open a vault, read the balance sheet, watch a bill get paid by borrowing, follow every row to BaseScan. Base theme.

## Files
```
apps/web/app/layout.tsx  page.tsx  blocked/page.tsx  start/page.tsx
apps/web/app/vault/[address]/page.tsx   stats/page.tsx   docs/page.tsx
apps/web/middleware.ts                  geo gate (country header -> /blocked)
apps/web/components/{Button,Card,Chip,StatTile,WaterfallBar,CreditMeter,LedgerRow,ReceiptDrawer,CodeBlock,ConfirmCard,StateViews}.tsx
apps/web/lib/{keeper.ts,wagmi.ts,format.ts,tx.ts}
apps/web/styles/tokens.css  tailwind.config.ts
apps/web/e2e/*.spec.ts
```

## Rules
- Follow `04-UIUX-SPEC.md` exactly: tokens, type scale, components, screens, states, microcopy.
- All numbers come from the keeper API or directly from `books()`; the UI never computes money except by calling `packages/core`.
- Every owner action shows a confirmation card (what changes, old → new, the hard limit) before the wallet prompt. Transactions carry the Builder Code.
- The geo gate runs before any wallet code loads. `BLOCKED_COUNTRIES` from env. Local dev can override with a query flag only when `NODE_ENV !== "production"`.
- The non-US and not-advice notice is in the footer of every page.
- No analytics that collect personal data. No third-party fonts loaded from a CDN that tracks; self-host Inter.
- Wallet stack per S8 findings (wagmi + viem + a smart-wallet connector). Plain injected wallets must also work.

## Tests first
T-W01 … T-W09. Build components against fixtures (`apps/web/fixtures/*.json`, valid against the schemas) so the page is testable without a chain.

## Steps
1. Tokens, Tailwind theme, base components, a `/kitchen` page showing every component and state (dev only).
2. Vault page against fixtures (this is the demo surface; do it first).
3. Start flow with real `createVault`.
4. Ledger, receipt drawer, credit meter, waterfall bar.
5. Stats page, home page, docs page.
6. Geo gate and blocked page.
7. Responsive pass at 1440 / 768 / 390; keyboard pass; axe.
8. Demo actions drawer (owner of the dogfood vault only).

## Definition of Done
- [ ] T-W01–T-W09 pass
- [ ] A new visitor can create a vault on mainnet from the UI ([HUMAN] signs)
- [ ] The vault page shows a borrowed bill with the text "No stock sold." and a refusal with its reason
- [ ] Zero console errors; no horizontal scroll at 390 px
- [ ] Screenshots of home, start, vault (OK and DANGER), stats at three widths attached to the PR
- [ ] Deployed preview URL in the PR ([HUMAN] connects Vercel)

## Ship it
Branch `m07-web` (two PRs are fine: vault page first, then the rest) → `pnpm lint && pnpm typecheck && pnpm test && pnpm e2e` → PR with screenshots → checks green → self-review against the UI spec → squash merge.
