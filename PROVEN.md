# PROVEN

Only claims backed by an actual run live here: command, exit code, test counts, links, transaction hashes. If it is not in this file, it is not proven.

## M00 — repo and CI

Local machine: macOS arm64 (Darwin 25.6.0), node v24.21.0, pnpm 12.8.1, forge 1.10.0 (stable).

Test-first evidence: with `src/index.ts` absent, `pnpm test` failed in all six packages on module resolution of `../src/index` (expected failure); after adding the placeholder source files the same command passes.

| Command                                                       | Exit | Result                                        |
| ------------------------------------------------------------- | ---- | --------------------------------------------- |
| `pnpm install`                                                | 0    | lockfile written, 6 workspace packages linked |
| `pnpm lint` (eslint 10.15.0 strict + prettier 3.10.1 --check) | 0    | no findings                                   |
| `pnpm typecheck` (`tsc -p tsconfig.json` per package, strict) | 0    | 6/6 packages clean                            |
| `pnpm test` (vitest 5.1.1 per package)                        | 0    | 6 test files, 6 tests passed                  |
| `forge fmt --check` (contracts/)                              | 0    | clean                                         |
| `forge build` (solc 0.8.26, pinned)                           | 0    | compiler run successful                       |
| `forge test`                                                  | 0    | 2 passed, 0 failed (CounterTest smoke suite)  |

Pinned dependencies: forge-std v1.17.0 (f3dae6e), openzeppelin-contracts v5.7.0 (cab1993), both as git submodules under `contracts/lib/`.

CI run link: — pending first push —
Cross-platform matrix evidence (ubuntu/macos/windows): — pending CI —
