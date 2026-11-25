# M10 — Traction, demo, submission, release

## Goal
Real outside usage, a clear three-minute video, and a complete entry sent a day early.

## Traction (starts Day 6, runs to the end)
- `docs/outreach.md`: a list of x402 sellers on Base (from the Bazaar, the other Stocks Maxxing builders who expose x402 APIs, and the owner's network) and a short honest message: what Granary does, that it is unaudited, the three-line change, an offer to set it up live. [HUMAN] sends every message.
- Offer to other entrants: the "Stock Facts" paid API is useful to them; using it is real usage for both sides.
- Help each new seller create a vault with a small reserve target so the full loop (invest → borrow → repay) happens with small amounts.
- Never send transactions to raise counts. The stats page excludes `TEAM_WALLETS` and says how numbers are computed.
- Track weekly: outside vaults, settlements, borrow→repay cycles. Report real numbers in the write-up.

## Demo
- Pass the demo acceptance run in `03-TEST-PLAN.md` on mainnet first.
- Follow `07-demo-and-submission/demo-script.md` and `video-storyboard.md`.
- [HUMAN] records screen and voice. The agent prepares the vault state, the script on screen and the BaseScan tabs.
- Anything simulated (the collateral-drop beat, if done on a fork with a mock oracle) carries an on-screen label "Simulated price drop on a local fork".

## Submission
- `07-demo-and-submission/submission-checklist.md` is the gate.
- [HUMAN] posts the X thread with the video, tagging @buildonbase, then submits the form with the X link.
- The form must state what was built in the Quest period and name the earlier repos whose patterns were reused.

## Release
- Final README pass; `PROVEN.md` complete; `DECISIONS.md` complete.
- Tag `v0.1.0` and create a GitHub release with: live URL, contract addresses, the video link, known limits.

## Tests first
- `scripts/check-submission.ts`: fails if any item in the checklist file is unchecked, if the README lacks the honesty headings, if `deployments/base-mainnet.json` is missing, or if `/v1/stats` is unreachable.

## Definition of Done
- [ ] Demo acceptance run passed; evidence in `PROVEN.md`
- [ ] Video ≤ 3 minutes, readable at 1080p, captions on
- [ ] X post live; form submitted; confirmation screenshot saved in `docs/submission/`
- [ ] `v0.1.0` tagged and released
- [ ] Real traction numbers written down as they are

## Ship it
Branch `m10-submission` → `pnpm tsx scripts/check-submission.ts` → PR → checks green → self-review → squash merge → `git tag v0.1.0 && git push --tags` → `gh release create v0.1.0`.
