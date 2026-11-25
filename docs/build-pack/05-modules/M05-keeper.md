# M05 — Keeper service

## Goal
A small service that notices revenue, calls the vault at the right moments, keeps a ledger and serves it to the web app.

## Files
```
apps/keeper/src/index.ts            Hono app + cycle loop
apps/keeper/src/config.ts           env parsing (zod); refuses to start if anything required is missing
apps/keeper/src/db/{schema,client,migrate}.ts   Drizzle + SQLite
apps/keeper/src/jobs/detect.ts      USDC Transfer logs -> pending settlements; VaultCreated -> vaults
apps/keeper/src/jobs/settle.ts
apps/keeper/src/jobs/invest.ts
apps/keeper/src/jobs/risk.ts
apps/keeper/src/jobs/ledger.ts      decode vault events -> events table
apps/keeper/src/api/{vaults,ledger,stats,bills,health}.ts
apps/keeper/src/auth/hmac.ts        per-vault key = HMAC(master, vault address)
apps/keeper/src/cli.ts              reindex | status
```

## Behaviour
See `02-TDD.md` §6. Additional rules:
- A job is a row; a row is processed once; failures store the named contract error.
- Do not retry in a tight loop. A skipped invest is retried next cycle only if conditions changed (feed updated, quote improved).
- `settle` is sent only when the simulated `Settled.revenue ≥ MIN_SETTLE`.
- The keeper acts as operator only for vaults whose `operator()` equals its address ("managed mode"). For others it indexes and serves data only.
- Bills endpoint: `POST /v1/vaults/:address/bills`, headers `x-granary-ts`, `x-granary-sig` (HMAC-SHA256 over `ts + "." + body`, 5-minute window). Body per `08-reference/schemas/bill-request.schema.json`. A refusal by the contract returns 422 `{refused: "CREDIT_CEILING" | …}` and writes a `BillRefused` ledger row (offchain kind) so the UI can show it.
- `GET /v1/vaults/:address` returns `08-reference/schemas/vault-books.schema.json`.
- `GET /v1/stats` → `{vaults, outsideVaults, settlements, usdcSettled, borrowed, repaid, billsRefused, builderCode, teamWallets[]}`.
- CORS: allow the web origin only.
- Logs are structured JSON; never log keys, signatures or full request bodies.

## Tests first
T-K01 … T-K10. Use anvil with the M03 mocks for T-K10; unit-test jobs with a fake chain client.

## Definition of Done
- [ ] T-K01–T-K10 pass
- [ ] `pnpm keeper reindex` on a fresh DB reproduces the same rows (hash of the table compared in a test)
- [ ] Killing and restarting the process mid-cycle loses nothing and double-sends nothing (test with a crash injection)
- [ ] Runs locally against the M04 proof factory and shows its six events through the API
- [ ] `apps/keeper/README.md`: how to run, env, what it can and cannot do

## Ship it
Branch `m05-keeper` → `pnpm lint && pnpm typecheck && pnpm test` → PR with a sample `/v1/vaults/:address` response → checks green → self-review → squash merge.
