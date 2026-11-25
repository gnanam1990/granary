# M08 — Policy assistant and weekly statement

This module is first on the cut list. Skip it if Day 12 is not reached on time.

## Goal
Let an owner describe their rule in a sentence and get a policy draft they can review and sign. Produce a short weekly statement from the ledger.

## Files
```
apps/keeper/src/assistant/draftPolicy.ts      LLM call + schema validation + clamp
apps/keeper/src/assistant/statement.ts        LLM call + number check + template fallback
apps/keeper/src/assistant/prompts.ts          the system prompts from 02-TDD.md §9, verbatim
apps/keeper/src/api/assistant.ts              POST /v1/assistant/policy-draft, GET /v1/vaults/:address/statement
apps/web/components/PolicyAssistant.tsx
```

## Rules
- Model `claude-haiku-5-5` via the Anthropic API. **Read the current SDK documentation before writing the call**; do not write request shapes from memory. Temperature 0, max 600 output tokens, no tools.
- The user's sentence goes inside `<user_request>` tags as data.
- Output must validate against `08-reference/schemas/policy.schema.json`. On failure: one retry with the validation error, then return `{ok:false}` and the UI shows the manual form.
- After validation, run `clampPolicy` from `packages/core` with the vault's market LLTV. The response includes `draft`, `clamped` (what changed and why) and `notes`.
- The draft is never applied by the server. The UI shows old → new beside the hard limits; the owner signs `setPolicy`.
- Rate limit: 10 drafts per vault per hour.
- Statement: input is numbers only (totals per kind for the week). Every number in the returned text must appear in the input; otherwise use the fixed template. The statement never comments on the stock's prospects.
- Without `ANTHROPIC_API_KEY` the endpoints return 503 and the UI hides the assistant.

## Tests first
T-L01 … T-L05, with the model call mocked by recorded fixtures plus one live smoke test that is skipped without a key.

## Definition of Done
- [ ] T-L01–T-L05 pass
- [ ] Ten injection prompts in `apps/keeper/test/fixtures/injections.json` all end inside the hard bounds
- [ ] The assistant can be disabled with one env var and nothing else breaks

## Ship it
Branch `m08-policy-assistant` → local checks → PR with three example drafts (input sentence → output) → checks green → self-review → squash merge.
