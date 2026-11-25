# DECISIONS

What was chosen and why, newest last. IDs D1–D7 are opened by the TDD (`docs/build-pack/02-TDD.md` §11) and filled in as modules land.

## M00 — repo and CI

- **TypeScript pinned at 5.9.3, not 7.x.** TS 7 exists but the lint/test toolchain around it is newer than the rest of this stack; 5.9 keeps eslint, vitest and tsconfig behaviour predictable. Revisit after M00.
- **`build` is a passthrough chain** (`pnpm -r --if-present run build`) that currently runs nothing: the M00 packages are empty scaffolds with no artifacts. Each module adds real build scripts as it lands.
- **CI runs the full gate on ubuntu-latest, macos-latest and windows-latest** so every merge is proven cross-platform, not just on Linux.
- **Foundry in CI is installed with the official installer + `foundryup --install stable`** in a bash step instead of a third-party action: one code path works identically on all three operating systems.
- **Lint = eslint (typescript-eslint strict) + prettier --check.** `contracts/`, `docs/`, `pnpm-lock.yaml` are excluded from both; Solidity formatting is enforced separately with `forge fmt --check` in CI.
- **First commit to `main` carries only the build pack and `CLAUDE.md`** to establish the repo; everything else lands by pull request, per the module spec.
