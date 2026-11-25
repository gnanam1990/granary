#!/usr/bin/env bash
# S8: record current versions of the web3/x402 dependencies.
# Fails loudly if any lookup fails — a blank version is never evidence.
set -euo pipefail
for p in viem wagmi ox @coinbase/cdp-sdk @x402/core @x402/evm @x402/express @x402/extensions @x402/hono @x402/next; do
  v=$(npm view "$p" version 2>/dev/null || true)
  if [ -z "$v" ]; then
    echo "FAIL: npm view $p returned nothing" >&2
    exit 1
  fi
  echo "$p: $v"
done
