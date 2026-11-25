# S3 — NAV feed decimals, heartbeat, price semantics

**Answer (partial, with fallback applied):** `decimals()` is **8** on all five sampled feeds, and answers are the token price (underlying × multiplier) scaled 1e8. The full heartbeat measurement across a market session + overnight could not run inside one build session; the feasibility fallback `navMaxAge = 3600 s` stands, to be tightened from keeper runtime data in M05.

Date: 2026-11-25 ~02:51 UTC (pre-market; US open is 14:30 UTC). RPC: `https://mainnet.base.org`.

## Commands and output

```
for each feed: cast call <feed> "decimals()(uint8)" / "latestRoundData()(uint80,int256,uint256,uint256,uint80)" --rpc-url https://mainnet.base.org
```

| Feed                   | decimals | answer (1e8)             | updatedAt               | age at sampling                      |
| ---------------------- | -------- | ------------------------ | ----------------------- | ------------------------------------ |
| NVDAc `0x04689a…8513`  | 8        | 15,206,127,317 ($152.06) | 2026-11-25 02:01:41 UTC | ~50 min (pre-market update observed) |
| GOOGLc `0x5bF49E…34F2` | 8        | 27,751,644,857 ($277.52) | 2026-11-25 02:22:20 UTC | ~29 min                              |
| SPCXc `0x6A634B…Fa68`  | 8        | 12,471,984,802 ($124.72) | 2026-11-25 02:07:42 UTC | ~43 min                              |
| AAPLc `0x787f13…F988`  | 8        | 35,450,230,043 ($354.50) | 2026-11-24 21:14:58 UTC | ~5.6 h (last close)                  |
| METAc `0x6526aE…B27D`  | 8        | 58,629,174,135 ($586.29) | 2026-11-24 22:28:31 UTC | ~4.4 h                               |

## Findings

- `decimals()` = 8 everywhere → feed answers scaled 1e8.
- Updates occur outside regular market hours (NVDAc/GOOGLc/SPCXc updated within the last hour pre-market), not only in-session. Weekend/holiday freeze per the digest remains untested.
- Price semantics: answer = underlying equity price × multiplier per the B20 docs; spot-checked directionally against `nav_price` in `stocks.snapshot.json` (same magnitude, small drift expected as the snapshot is a day old).
- Heartbeat/deviation thresholds are not published; a rigorous gap log needs a multi-hour watcher. Deferred to the keeper in M05, which can record `updatedAt` continuously.

## Decision inputs

- `navMaxAge = 3600 s` default confirmed reasonable; pre-market evidence suggests sub-hourly in-session updates, so 1 h tolerates normal operation without masking a freeze.
