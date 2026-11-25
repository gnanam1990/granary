#!/usr/bin/env bash
# S8: record current versions of the web3/x402 dependencies.
set -euo pipefail
for p in viem wagmi ox @coinbase/cdp-sdk @x402/core @x402/evm @x402/express @x402/extensions @x402/hono @x402/next; do
  echo "$p: $(npm view "$p" version)"
done
