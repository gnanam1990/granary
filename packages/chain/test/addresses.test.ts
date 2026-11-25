import { createPublicClient, getAddress, http, isAddress } from "viem";
import { base } from "viem/chains";
import { describe, expect, it } from "vitest";
import { morphoBlueAbi } from "../src/abis/morpho";
import {
  DEFAULT_STOCK,
  MARKETS,
  MORPHO_BLUE,
  STOCKS,
  SWAP_ROUTER,
  USDC,
} from "../src/addresses";

describe("chain constants", () => {
  it("every address is a valid checksummed evm address", () => {
    const all = [
      USDC,
      MORPHO_BLUE,
      SWAP_ROUTER,
      ...STOCKS.flatMap((s) => [s.address, s.navFeed]),
      ...MARKETS.flatMap((m) => [m.oracle, m.irm]),
    ];
    for (const addr of all) {
      expect(isAddress(addr), addr).toBe(true);
      expect(getAddress(addr), `checksum ${addr}`).toBe(addr);
    }
    for (const m of MARKETS) {
      expect(m.marketId).toMatch(/^0x[0-9a-f]{64}$/);
      expect(m.lltvBps).toBeGreaterThan(0);
      expect(m.lltvBps).toBeLessThanOrEqual(10_000);
      expect(STOCKS.map((s) => s.symbol)).toContain(m.stock);
    }
  });

  it("exposes a default collateral stock that has a market", () => {
    expect(STOCKS.map((s) => s.symbol)).toContain(DEFAULT_STOCK);
    expect(MARKETS.map((m) => m.stock)).toContain(DEFAULT_STOCK);
  });

  const rpcUrl = process.env.BASE_RPC_URL;
  const live = rpcUrl ? it : it.skip;
  live(
    "every configured market's idToMarketParams matches the constants (live RPC)",
    async () => {
      const client = createPublicClient({
        chain: base,
        transport: http(rpcUrl),
      });
      for (const m of MARKETS) {
        const params = await client.readContract({
          address: MORPHO_BLUE,
          abi: morphoBlueAbi,
          functionName: "idToMarketParams",
          args: [m.marketId],
        });
        const stock = STOCKS.find((s) => s.symbol === m.stock);
        expect(stock, `stock for market ${m.marketId}`).toBeDefined();
        expect(params.loanToken).toBe(USDC);
        expect(params.collateralToken).toBe(stock?.address);
        expect(params.oracle.toLowerCase()).toBe(m.oracle.toLowerCase());
        expect(params.irm.toLowerCase()).toBe(m.irm.toLowerCase());
        expect(params.lltv / 10n ** 14n).toBe(BigInt(m.lltvBps));
      }
    },
    60_000,
  );
});
