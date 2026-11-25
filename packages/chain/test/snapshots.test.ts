import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DEFAULT_STOCK, STOCKS } from "../src/addresses";

const REF_DIR = new URL(
  "../../../docs/build-pack/08-reference/",
  import.meta.url,
);

interface StocksSnapshot {
  chainId: number;
  stocks: {
    symbol: string;
    token: string;
    decimals: number;
    navFeed: string;
  }[];
}

interface MarketsSnapshot {
  chainId: number;
  markets: {
    collateral: string;
    marketId: string;
    oracle: string;
    irm: string;
    liquidityUsd: number;
  }[];
}

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(new URL(name, REF_DIR), "utf8")) as T;
}

describe("reference snapshots", () => {
  it("stocks snapshot parses and contains the default stock", () => {
    const snap = readJson<StocksSnapshot>("stocks.snapshot.json");
    expect(snap.chainId).toBe(8453);
    expect(snap.stocks.length).toBeGreaterThan(0);
    const symbols = snap.stocks.map((s) => s.symbol);
    expect(symbols).toContain(DEFAULT_STOCK);
    for (const sym of STOCKS.map((s) => s.symbol)) {
      expect(symbols, `constants stock ${sym} missing from snapshot`).toContain(
        sym,
      );
    }
  });

  it("morpho markets snapshot parses and contains the default stock", () => {
    const snap = readJson<MarketsSnapshot>(
      "morpho-stock-markets.snapshot.json",
    );
    expect(snap.chainId).toBe(8453);
    expect(snap.markets.length).toBeGreaterThan(0);
    const collaterals = snap.markets.map((m) => m.collateral);
    expect(collaterals).toContain(DEFAULT_STOCK);
    for (const m of snap.markets) {
      expect(m.marketId).toMatch(/^0x[0-9a-f]{64}$/);
      expect(m.liquidityUsd).toBeGreaterThanOrEqual(0);
    }
  });
});
