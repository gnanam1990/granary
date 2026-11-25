# DECISIONS

What was chosen and why, newest last. IDs D1–D7 are opened by the TDD (`docs/build-pack/02-TDD.md` §11) and filled in as modules land.

## M00 — repo and CI

- **TypeScript pinned at 5.9.3, not 7.x.** TS 7 exists but the lint/test toolchain around it is newer than the rest of this stack; 5.9 keeps eslint, vitest and tsconfig behaviour predictable. Revisit after M00.
- **`build` is a passthrough chain** (`pnpm -r --if-present run build`) that currently runs nothing: the M00 packages are empty scaffolds with no artifacts. Each module adds real build scripts as it lands.
- **CI runs the full gate on ubuntu-latest, macos-latest and windows-latest** so every merge is proven cross-platform, not just on Linux.
- **Foundry in CI is installed with the official installer + `foundryup --install stable`** in a bash step instead of a third-party action: one code path works identically on all three operating systems.
- **Lint = eslint (typescript-eslint strict) + prettier --check.** `contracts/`, `docs/`, `pnpm-lock.yaml` are excluded from both; Solidity formatting is enforced separately with `forge fmt --check` in CI.
- **First commit to `main` carries only the build pack and `CLAUDE.md`** to establish the repo; everything else lands by pull request, per the module spec.
- **License is Apache-2.0**, chosen by the owner over the pack's MIT proposal.
- **`.gitattributes` forces LF checkouts on every platform** (`* text=auto eol=lf`): prettier enforces LF line endings, and Windows runners otherwise rewrite files to CRLF on checkout.
- **No CI concurrency group.** Under rapid pushes the group deadlocked runs into a serialized wait and mass cancellation; with cheap jobs the protection is not worth it.
- **Three Devin Review flags on the vendored build pack are deferred to their owning modules** instead of editing the spec in M00: (a) the demo's $0.005 Stock Facts payment sits below the keeper's $0.01 MIN_SETTLE, so the demo shows no settlement — resolve in M06/M10; (b) BillRefused rows live only in the keeper database and a chain-log rebuild cannot restore them — resolve in M05; (c) planBill permits reserve-covered bills while the vault is above ceiling, contradicting invariant I4 — resolve in M02/M03. Deferred per owner's approval; each module must re-check its flag before merge.
