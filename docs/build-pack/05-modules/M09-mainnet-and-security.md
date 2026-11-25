# M09 — Mainnet deploy, attribution, geo gate, security review

Part A happens on Day 9 (before the web app) so real usage starts early. Part B happens on Day 13.

## Part A — go live
1. [HUMAN] Register the Builder Code: `POST https://api.base.dev/v1/agents/builder-codes` with the operator wallet address; register the app at https://dashboard.base.org. Put the code in env.
2. [HUMAN] Fund the deployer with gas. Deploy `GranaryFactory` with: USDC, Morpho, the router(s) from S6, and the market list chosen in M01 (only markets that passed the spikes).
   `forge script script/Deploy.s.sol --rpc-url $BASE_RPC_URL --broadcast --verify`
3. Verify the factory and the vault implementation on BaseScan and Sourcify.
4. Write `deployments/base-mainnet.json` (addresses, block, commit, constructor args).
5. [HUMAN] Deploy the keeper and the dogfood API to Railway with a persistent volume; set env. Health check green.
6. Create the team's dogfood vault through the factory; point the dogfood API's `payTo` at it; mark its owner in `TEAM_WALLETS`.
7. One real paid request end to end; confirm the `Settled` row and the Builder Code in the transaction input.

## Part B — harden
1. Geo gate live in production; test from a US IP (or header simulation in a preview deployment).
2. Run the red-team table T-R01 … T-R08 against mocks (and on mainnet with dust where it is safe: T-R01, T-R03, T-R05). Record each result.
3. Write `SECURITY.md`:
   - Trust model and what each key can do.
   - Invariants and which test proves each.
   - Known limits: unaudited; no admin keys means no emergency fix (owners must `close` and move to a new factory); one stock per vault; tiny market liquidity; liquidation risk remains with the owner; B20 pause and policy risk; operator key in managed mode.
   - How to report an issue.
4. Self-review pass: read every external function against the TDD; list findings with severity and fix or accept each in the PR.
5. README honesty section, final version: **Live** (what runs on mainnet, with addresses), **Mocked or simulated** (anything, e.g. the collateral-drop demo if done on a fork), **Trust assumptions**, **Limits**, **Not available to US persons**, **Continuity** (patterns reused from earlier repos).
6. If fallback F2 is used (team supplies USDC to the Morpho market): [HUMAN] does it; disclose address and amount in the README and on `/stats`.

## Tests first
- A deploy dry-run on anvil with mocks that asserts the constructor checks.
- A script test that reads `deployments/base-mainnet.json` and asserts onchain state matches (factory markets, routers).

## Definition of Done
- [ ] Factory and implementation verified; addresses in `deployments/base-mainnet.json` and README
- [ ] Builder Code on every keeper and web transaction (spot-check three)
- [ ] Geo gate verified
- [ ] T-R01–T-R08 results in `PROVEN.md`
- [ ] `SECURITY.md` and README honesty section complete
- [ ] No private key, API secret or HMAC master in the repo history (`git log -p | grep` check documented)

## Ship it
Two PRs: `m09a-mainnet-live`, `m09b-harden`. Each: local checks → PR with BaseScan links → checks green → self-review → squash merge.
