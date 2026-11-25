#!/usr/bin/env bash
# S6: fetch KyberSwap routes USDC -> SPCXc at USD 5 and USD 50 and compare with NAV.
set -euo pipefail
USDC=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
SPCXc=0xb2000000000000000000007b9fcbd005511aCBd5
for amount in 5000000 50000000; do
  echo "== amountIn=$amount =="
  curl -s "https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=$USDC&tokenOut=$SPCXc&amountIn=$amount" \
    | python3 -c "
import json, sys
d = json.load(sys.stdin)['data']['routeSummary']
print('routerAddress:', d['routerAddress'])
print('amountOut:', d['amountOut'], 'amountInUsd:', d['amountInUsd'], 'amountOutUsd:', d['amountOutUsd'])
print('gasUsd:', d['gasUsd'])
"
done
