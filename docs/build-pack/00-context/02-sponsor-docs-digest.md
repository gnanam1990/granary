# Sponsor docs digest — exact facts

Retrieved 2026-11-24. ✅ = checked live that day (API call, RPC call or official doc page). ⚠ = not verified; has a spike in M01.

## 1. Network
| Item | Value | |
|---|---|---|
| Base mainnet chain ID | 8453 (CAIP-2 `eip155:8453`) | ✅ |
| Base Sepolia chain ID | 84532 (`eip155:84532`) | ✅ x402 docs |
| Public RPC | `https://mainnet.base.org` (rate-limited; use a keyed RPC in production) | ✅ |
| Explorer | https://basescan.org | ✅ |
| Blocks | 200 ms blocks since the Denim upgrade; `block.timestamp` is still whole seconds | ✅ @buildonbase |

## 2. Tokens
| Token | Address (Base mainnet) | Decimals | |
|---|---|---|---|
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | 6 | ✅ returned by Morpho API and by `idToMarketParams` onchain |
| AAPLc | `0xb200000000000000000000C2e324d24d7eEcd1fb` | 8 | ✅ API + `decimals()` RPC |
| GOOGLc | `0xb2000000000000000000002D0BA3164cc74f58B7` | 8 | ✅ API |
| NVDAc | `0xb20000000000000000000078ee7ce2fE4908108C` | 8 | ✅ API |
| METAc | `0xb2000000000000000000008bC8786B856E61707C` | 8 | ✅ API |
| SPCXc | `0xb2000000000000000000007b9fcbd005511aCBd5` | 8 | ✅ API |
| TSLAc | `0xb2000000000000000000001e800a7f5189430cD0` | 8 | ✅ API |
| MSFTc | `0xB200000000000000000000Ab99cFa739E253872B` | 8 | ✅ API |

Full list with price feeds: `08-reference/stocks.snapshot.json`. Always refresh from the API at build time; identify tokens by address, never by ticker.

## 3. B20 tokenized stocks (rails — do not rebuild)
Source: https://docs.base.org/build-on-base/integrate-defi/list-tokenized-stocks
- B20 is Base's native token standard, ERC-20 compatible. Tokens are **native precompiles**: the address holds no normal bytecode (`eth_getCode` returns `0xef`, ✅). There is no verified contract per token on BaseScan.
- **Multiplier (ERC-8056).** One token is not always one share. `uiMultiplier()` is WAD (1e18). Helpers: `balanceOfUI(account)`, `totalSupplyUI()`, `toUIAmount(raw)`, `fromUIAmount(ui)`. Dividends are converted to shares by raising the multiplier, not paid in cash.
- Scheduled multiplier updates (`updateUIMultiplier`) give advance onchain notice; `Announcement` / `EndAnnouncement` events wrap corporate actions.
- **Policies.** `isAuthorized(policyID, account)` never reverts; check `policyExists(policyId)` first. `approve()` is not policy-gated, so an approval does not guarantee a transfer will pass. A blocked transfer reverts.
- **Pauses.** Specific functions can be paused per token. The API field `paused_features` lists them.
- Holding and secondary trading is permissionless; KYC applies only to mint/redeem by Authorized Participants.
- Other features: `transferWithMemo` (bytes32 memo), supply cap, mutable name/symbol, `extraMetadata(key)`.
- Onchain registry read by price feeds: `0x3f3E8cf41cdd3b1D118c16471aB0113DfDDd5CaD`.
- Chain contracts (✅ `GET /chains`): policy registry `0x8453000000000000000000000000000000000002`, token supply manager `0xD1Ca4dAcdf3231011D175351f1f02D15C7c5664C`, token factory `0x4bA3E29E254F25E94E61C4c9d67b37027331534D`.

⚠ **S1:** Foundry/anvil forks may not execute the B20 precompile. See feasibility doc.
⚠ **S2:** confirm a freshly deployed contract (a vault clone) can receive, hold and transfer a B20 stock.

## 4. Tokenized Stocks API (read-only, no key)
Base URL `https://api.coinbase.com/v1/tokenized-stocks` — https://docs.base.org/sdks/tokenized-stocks/overview
| Method | Path | Notes |
|---|---|---|
| GET | `/` | List records. `page_size` default 100, max 500; `next_page_token` → `page_token`. `include_zero_supply=false` to filter. |
| GET | `/chains` | Protocol contract addresses |
| GET | `/nav-feeds` | `{nav_feeds:[{contract_address, nav_feed_address}]}` |
| GET | `/total-supply/{contract_address}` | Normalized supply |
| GET | `/metadata/{ticker}` | Token metadata |
| GET | `/prospectus/{ticker}` | 302 redirect to PDF |
| GET | `/corporate-actions/{id}` | One corporate action |

- Record fields: `contract_address, symbol, name, decimals, icon_url, total_supply, isin, adgm_isin, multiplier, description, first_mint_date, paused_features, nav_price, nav_price_updated_at`. Default-valued fields are **omitted**; never assume a field is present.
- `nav_price` is the last Chainlink reference value, **not** a tradeable price. Always check `nav_price_updated_at`.
- Errors: HTTP 400 code 3 (bad input), 404 code 5 (not found), 503 code 14 (temporarily unavailable). Body `{code, message}`.
- The API has **no** wallet positions, cost basis or P&L. Granary computes its own from vault events.
- ✅ Live on 2026-11-24: 415 records, 138 with supply, 13 with `nav_price`, 14 NAV feeds.

## 5. Chainlink NAV feeds
- Standard AggregatorV3 interface; read `latestRoundData()` through the proxy; `decimals()` gives scale (⚠ S3: confirm 8).
- Feeds run 24/5, hold the last close on weekends and holidays, and freeze during corporate actions.
- Token price = underlying equity price × multiplier.
- Feed addresses: `08-reference/stocks.snapshot.json`. Example: NVDAc `0x04689a41629776563E6822F76f2e57D148d28513`, GOOGLc `0x5bF49E0ffA937CE2FfF033c739aD7C634c4D34F2`, SPCXc `0x6A634B235903C4ad6376892180d6fF8612e3Fa68`, AAPLc `0x787f13dEa48Db0897CbCDD985de77809D837F988`.
- ⚠ S3: heartbeat and deviation threshold per feed are not documented here. Measure `updatedAt` gaps during market hours.

## 6. Morpho (the lending rail)
Sources: https://docs.morpho.org/developers/contracts/addresses/ · https://blue-api.morpho.org/graphql · RPC
| Item | Value | |
|---|---|---|
| Morpho Blue (variable-rate) on Base | `0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb` | ✅ has code; `idToMarketParams` returns the AAPLc market |
| IRM used by stock markets | `0x46415998764C29aB2a25CbeA6254146D50D22687` | ✅ |
| Fixed-rate layer ("Midnight") | Exists; **out of scope** | — |

Stock markets (loan asset USDC), the ones with real liquidity on 2026-11-24:
| Collateral | LLTV | Market ID | Oracle | Supply USD | Borrowed USD | **Available USD** | Borrow APY |
|---|---|---|---|---|---|---|---|
| SPCXc | 62.5% | `0xce983b9ee6344e16ebbcc66812f23caafc63ae83fcc14fa29b66c7e69e9cecf6` | `0x9079857a2b5FFfC3d87052b11b866a185B4A6483` | 6,878 | 5,661 | **1,217** | 5.5% |
| GOOGLc | 77% | starts `0xa3913d896b…` (full ID in snapshot) | `0x24DC11055aa5b2C5692E4B77d7285c4f0fd9Cf99` | 5,883 | 4,846 | **1,037** | 5.5% |
| AAPLc | 62.5% | `0xae1a30486234bf7e7ac166c7c03d9bc5f2cd8a39be2c48e73c665ac7148c3c28` | `0xEcC5c9bf18CB2CfC94C2f7EFf8BDd5837A60AB0e` | 3,633 | 3,077 | **556** | 5.7% |
| NVDAc | 62.5% | `0xb4b42dd66cef25614b94510a910d54b2c148e7621d22b4271566724beda63d13` | `0x4F698C04d01d9CebCDd9494c189aBdD6C5453f84` | 537 | 487 | **50** | 5.1% |
| METAc | 62.5% | starts `0x44b343b508…` | `0x4752B27dFc1931eb9a5DFEFC7FBC9d0af9020dC7` | 369 | 333 | **36** | 5.1% |

All 26 markets: `08-reference/morpho-stock-markets.snapshot.json`. **Total available liquidity across all stock markets was about USD 3,000.** Credit lines must be small. Re-query before choosing the default market.

GraphQL (✅ working query; note the field names `marketId` and `oracle{address}`):
```graphql
{ markets(first:100, where:{chainId_in:[8453], collateralAssetAddress_in:["0x…"]}) {
    items { marketId lltv irmAddress oracle{address}
      collateralAsset{symbol address decimals} loanAsset{symbol address decimals}
      state{supplyAssetsUsd borrowAssetsUsd liquidityAssetsUsd borrowApy} } } }
```

Morpho Blue interface (stable core ABI; confirm against `morpho-org/morpho-blue` at build):
```solidity
struct MarketParams { address loanToken; address collateralToken; address oracle; address irm; uint256 lltv; }
function idToMarketParams(bytes32 id) external view returns (MarketParams memory);   // selector 0x2c3c9157 ✅
function position(bytes32 id, address user) external view returns (uint256 supplyShares, uint128 borrowShares, uint128 collateral);
function market(bytes32 id) external view returns (uint128 totalSupplyAssets, uint128 totalSupplyShares, uint128 totalBorrowAssets, uint128 totalBorrowShares, uint128 lastUpdate, uint128 fee);
function accrueInterest(MarketParams memory) external;
function supplyCollateral(MarketParams memory, uint256 assets, address onBehalf, bytes memory data) external;
function withdrawCollateral(MarketParams memory, uint256 assets, address onBehalf, address receiver) external;
function borrow(MarketParams memory, uint256 assets, uint256 shares, address onBehalf, address receiver) external returns (uint256, uint256);
function repay(MarketParams memory, uint256 assets, uint256 shares, address onBehalf, bytes memory data) external returns (uint256, uint256);
```
- Oracle: `price()` (selector `0xa035b1fe` ✅ returns a value) = collateral priced in loan token, scaled by `1e36 × 10^(loanDecimals − collateralDecimals)` = `1e34` here. Collateral value in USDC units = `collateral × price / 1e36`.
- Debt in assets = `borrowShares × totalBorrowAssets / totalBorrowShares` (round up; Morpho uses virtual shares — use the official `SharesMathLib`/`MorphoBalancesLib`).
- Liquidation when `debt > collateralValue × lltv`.
- To clear a debt fully, repay by **shares** (`assets = 0, shares = borrowShares`), not by assets.
- The Morpho app restricts stock markets to non-US persons; the contracts are permissionless.
- ⚠ S4: confirm the full borrow/repay round trip from a contract with USD 5.

## 7. x402 (how revenue arrives)
Sources: https://docs.cdp.coinbase.com/x402/seller/quickstart · https://docs.cdp.coinbase.com/x402/seller/facilitator
- Packages (✅ per docs today): `@coinbase/cdp-sdk` (import `createX402Server` from `@coinbase/cdp-sdk/x402`), `@x402/core`, `@x402/evm`, `@x402/extensions`, `@x402/express` (`paymentMiddlewareFromHTTPServer`). Hono and Next.js adapters exist (⚠ exact package names: check "Runnable examples").
- Env: `CDP_API_KEY_ID`, `CDP_API_KEY_SECRET`, `X402_PAY_TO`. Node 22+.
- Route config: `routes: { "GET /report": { price: "$0.01", networks: ["eip155:8453"], description } }`, `payToConfig: { type: "address", evm: payTo }`, `environment: "development" | "production"`.
- An unpaid request returns HTTP 402 with a `PAYMENT-REQUIRED` header.
- `payTo` is "any onchain address that can receive the asset". **Granary sets `payTo` to the seller's vault address.** ⚠ S5: confirm the CDP Facilitator settles to a contract address (the `exact` EVM scheme uses USDC `transferWithAuthorization`, which has no receiver hook, so it should).
- Facilitator: OFAC/KYT screening; schemes `exact`, `upto`, `batch-settlement`; first 1,000 onchain settlements per month free, then USD 0.001 each.
- Bazaar: discovery index for x402 endpoints (get listed for traction).
- Coding-agent skill: `npx skills add coinbase/cdp-sdk --skill build-x402-server`.

## 8. Builder Codes (traction attribution)
Source: https://docs.base.org/specifications/builder-codes/for-agent-developers
- A Builder Code (`bc_xxxxxxxx`) is appended to calldata as an **ERC-8021** suffix; contracts ignore it.
- Register (no auth): `POST https://api.base.dev/v1/agents/builder-codes` body `{"walletAddress":"0x…"}` → `{"builderCode":"bc_…","walletAddress":"0x…"}`. Idempotent.
- Wire with the `ox` library (`ox/erc8021`) as viem `dataSuffix`. Skill: `npx skills add base/skills`.
- Verify: the last 16 bytes of tx input are the repeating `8021` marker.
- Every Granary transaction (keeper and web) must carry the code. Also register the app at https://dashboard.base.org ([HUMAN]).

## 9. Swapping USDC → stock
- Coinbase stocks trade on DEXs on Base (Aerodrome named in press; bunnbase uses Uniswap v3; MaxxAgent routes through the KyberSwap aggregator).
- ⚠ S6: KyberSwap router on Base `0x6131B5fae19EA4f9D964eAc0408E4408b66337b5` (from MaxxAgent's README, not from Kyber docs) and aggregator API `https://aggregator-api.kyberswap.com/base/api/v1/routes` + `/route/build`. Verify both, get a quote for USD 5 → SPCXc, compare with the NAV feed.
- Pools are thin: one entrant reported a USD 1,000 sell moving a pool. Keep each buy small and check against NAV onchain.

## 10. Limits that shape the design
- Tiny Morpho liquidity → credit lines of roughly USD 5–200.
- NAV feeds only for 14 stocks; Morpho markets only for 7.
- Feeds freeze outside US market hours → the vault refuses to buy on a stale feed.
- No tokenized stocks on testnet (reported by another entrant, ⚠) → integration proof happens on mainnet with tiny amounts.
