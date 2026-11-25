# M00 — Repo and CI

## Goal
A public repo with a working monorepo skeleton, CI on every PR, and a protected `main`.

## Steps
1. [HUMAN] Confirm the repo name `gnanam1990/granary` is free and that creating a public repo is fine.
2. `gh repo create gnanam1990/granary --public --description "Borrow against your stock treasury instead of selling it. A balance sheet for agents and x402 sellers on Base." --clone`
3. Add the build pack at `docs/build-pack/` and copy `CLAUDE.md` to the root.
4. Scaffold: `pnpm-workspace.yaml`, root `package.json` (scripts `lint`, `typecheck`, `test`, `build`), `tsconfig.base.json` (strict), ESLint + Prettier, `.gitignore`, `.env.example` (from `08-reference/env.example`), `.nvmrc` (22).
5. Empty packages with one passing test each: `packages/core`, `packages/chain`, `packages/x402-seller`, `apps/keeper`, `apps/web`, `apps/demo-seller`.
6. `contracts/`: `forge init --no-git`, pin solc 0.8.26, install `openzeppelin-contracts` and `forge-std`, one passing test.
7. CI `.github/workflows/ci.yml` on `pull_request` and `push` to `main`: pnpm install → lint → typecheck → vitest → `forge build` → `forge test`. Cache pnpm and foundry.
8. `.github/pull_request_template.md`: What changed · Tests run (commands, counts) · Evidence (tx hashes, screenshots) · Definition of Done checklist · Risks.
9. Root files: `README.md` (stub with the honesty section headings and the non-US notice), `DECISIONS.md`, `PROVEN.md`, `NOTICE`, `LICENSE` (MIT — confirm with the owner).
10. Protect `main`: require PR, require the CI check, no direct pushes (`gh api -X PUT repos/gnanam1990/granary/branches/main/protection …`).

## Tests first
- A placeholder test per package that fails until the package exists.
- CI must fail on a deliberately broken commit in a scratch PR (prove the gate), then close that PR.

## Definition of Done
- [ ] Repo is public; `main` protected; CI required
- [ ] `pnpm lint && pnpm typecheck && pnpm test` and `forge test` pass locally and in CI
- [ ] Build pack present at `docs/build-pack/`
- [ ] `PROVEN.md` has the CI run link

## Ship it
Branch `m00-repo-ci` → PR → `gh pr checks --watch` → self-review → `gh pr merge --squash --delete-branch`. The first commit may go to `main` only to create the repo; everything after is by PR.
