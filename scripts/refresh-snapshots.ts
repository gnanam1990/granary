// Re-pulls docs/build-pack/08-reference/stocks.snapshot.json and
// morpho-stock-markets.snapshot.json from the live APIs. Run:
//   pnpm refresh-snapshots
// Read-only: no keys, no transactions. Exit 1 on any API failure — never
// write a partial snapshot.

import { readFileSync, renameSync, writeFileSync } from "node:fs";

const STOCKS_API = "https://api.coinbase.com/v1/tokenized-stocks";
const MORPHO_GQL = "https://blue-api.morpho.org/graphql";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const OUT_DIR = new URL("../docs/build-pack/08-reference/", import.meta.url);

interface StockRecord {
  contract_address: string;
  symbol: string;
  decimals: number;
  multiplier?: number;
  nav_price?: number;
}

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

async function refreshStocks(): Promise<string> {
  const records: StockRecord[] = [];
  let pageToken: string | undefined;
  do {
    const qs = new URLSearchParams({ page_size: "500" });
    if (pageToken) qs.set("page_token", pageToken);
    const body = (await getJson(`${STOCKS_API}?${qs}`)) as {
      tokens?: StockRecord[];
      next_page_token?: string;
    };
    const batch = body.tokens ?? [];
    if (batch.length === 0 && !body.next_page_token) break;
    records.push(...batch);
    pageToken = body.next_page_token;
  } while (pageToken);

  const navFeedsBody = (await getJson(`${STOCKS_API}/nav-feeds`)) as {
    nav_feeds: { contract_address: string; nav_feed_address: string }[];
  };
  const feedByToken = new Map(
    navFeedsBody.nav_feeds.map((f) => [
      f.contract_address.toLowerCase(),
      f.nav_feed_address,
    ]),
  );

  const stocks = records
    .filter((r) => feedByToken.has(r.contract_address.toLowerCase()))
    .map((r) => ({
      symbol: r.symbol,
      token: r.contract_address,
      decimals: r.decimals,
      navFeed: feedByToken.get(r.contract_address.toLowerCase()) ?? "",
      multiplier: r.multiplier ?? 1,
      navPrice: r.nav_price ?? 0,
    }))
    .sort((a, b) => a.symbol.localeCompare(b.symbol));
  if (stocks.length === 0) throw new Error("no stocks with nav feeds");

  return (
    JSON.stringify(
      {
        retrievedAt: new Date().toISOString().slice(0, 10),
        source: "https://api.coinbase.com/v1/tokenized-stocks (+ /nav-feeds)",
        chainId: 8453,
        stocks,
      },
      null,
      1,
    ) + "\n"
  );
}

interface MarketItem {
  marketId: string;
  lltv: string;
  irmAddress: string;
  oracle: { address: string };
  collateralAsset: { symbol: string; address: string; decimals: number };
  loanAsset: { symbol: string; address: string; decimals: number };
  state: {
    supplyAssetsUsd: number;
    borrowAssetsUsd: number;
    liquidityAssetsUsd: number;
    borrowApy: number;
  } | null;
}

async function refreshMarkets(): Promise<string> {
  const collateral = [
    "0xb200000000000000000000C2e324d24d7eEcd1fb",
    "0xb2000000000000000000002D0BA3164cc74f58B7",
    "0xb20000000000000000000078ee7ce2fE4908108C",
    "0xb2000000000000000000008bC8786B856E61707C",
    "0xb2000000000000000000007b9fcbd005511aCBd5",
    "0xb2000000000000000000001e800a7f5189430cD0",
    "0xB200000000000000000000Ab99cFa739E253872B",
  ];
  const query = `{
    markets(first: 100, where: { chainId_in: [8453], collateralAssetAddress_in: ${JSON.stringify(collateral)} }) {
      items { marketId lltv irmAddress oracle { address }
        collateralAsset { symbol address decimals } loanAsset { symbol address decimals }
        state { supplyAssetsUsd borrowAssetsUsd liquidityAssetsUsd borrowApy } }
    }
  }`;
  let body: { data?: { markets?: { items?: MarketItem[] } } } | undefined;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const res = await fetch(MORPHO_GQL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (res.ok) {
      body = (await res.json()) as typeof body;
      break;
    }
    if (res.status !== 429 && res.status < 500)
      throw new Error(`morpho graphql -> HTTP ${res.status}`);
    await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
  }
  if (!body) throw new Error("morpho graphql -> repeated HTTP 429/5xx");
  const items = body.data?.markets?.items ?? [];
  if (items.length === 0) throw new Error("morpho returned no markets");

  const markets = items
    .filter(
      (m) =>
        m.state !== null &&
        m.loanAsset.address.toLowerCase() === USDC.toLowerCase(),
    )
    .map((m) => ({
      collateral: m.collateralAsset.symbol,
      collateralAddress: m.collateralAsset.address,
      loan: "USDC",
      loanAddress: USDC,
      marketId: m.marketId,
      lltv: Number(m.lltv) / 1e18,
      oracle: m.oracle.address,
      irm: m.irmAddress,
      supplyUsd: Math.round((m.state?.supplyAssetsUsd ?? 0) * 100) / 100,
      borrowUsd: Math.round((m.state?.borrowAssetsUsd ?? 0) * 100) / 100,
      liquidityUsd: Math.round((m.state?.liquidityAssetsUsd ?? 0) * 100) / 100,
      borrowApy: Math.round((m.state?.borrowApy ?? 0) * 10000) / 10000,
    }))
    .sort((a, b) => a.marketId.localeCompare(b.marketId));

  return (
    JSON.stringify(
      {
        retrievedAt: new Date().toISOString().slice(0, 10),
        source: "https://blue-api.morpho.org/graphql",
        chainId: 8453,
        markets,
      },
      null,
      1,
    ) + "\n"
  );
}

// Both payloads are built before any write; both temp files are byte-verified
// before either rename, so a failed refresh never leaves a mixed or truncated pair.
const stocksPayload = await refreshStocks();
const marketsPayload = await refreshMarkets();
const pairs = [
  ["stocks.snapshot.json", stocksPayload],
  ["morpho-stock-markets.snapshot.json", marketsPayload],
] as const;
for (const [name, payload] of pairs) {
  writeFileSync(new URL(`${name}.tmp`, OUT_DIR), payload);
}
for (const [name, payload] of pairs) {
  const written = readFileSync(new URL(`${name}.tmp`, OUT_DIR), "utf8");
  if (written !== payload)
    throw new Error(`temp write verification failed for ${name}`);
}
for (const [name] of pairs) {
  renameSync(new URL(`${name}.tmp`, OUT_DIR), new URL(name, OUT_DIR));
}
console.log(
  "stocks.snapshot.json + morpho-stock-markets.snapshot.json refreshed",
);
