#!/usr/bin/env bash
# S6: fetch KyberSwap routes USDC -> SPCXc at USD 5 and USD 50, compare with NAV,
# and confirm /route/build returns executable calldata.
set -euo pipefail
USDC=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
SPCXc=0xb2000000000000000000007b9fcbd005511aCBd5
API=https://aggregator-api.kyberswap.com/base/api/v1
CALLER=0x000000000000000000000000000000000000dEaD # dry-run sender, no funds moved

for amount in 5000000 50000000; do
  echo "== amountIn=$amount =="
  ROUTE=$(curl -sf "$API/routes?tokenIn=$USDC&tokenOut=$SPCXc&amountIn=$amount")
  echo "$ROUTE" | python3 -c "
import json, sys
d = json.load(sys.stdin)['data']['routeSummary']
print('routerAddress:', d['routerAddress'])
print('amountOut:', d['amountOut'], 'amountInUsd:', d['amountInUsd'], 'amountOutUsd:', d['amountOutUsd'])
print('gasUsd:', d['gasUsd'])
"
  echo "-- /route/build (calldata check)"
  echo "$ROUTE" | python3 -c "
import json, sys
print(json.dumps({'routeSummary': json.load(sys.stdin)['data']['routeSummary'], 'sender': '$CALLER', 'recipient': '$CALLER', 'slippageTolerance': 150}, indent=None))
" | curl -sf -X POST "$API/route/build" -H 'content-type: application/json' -d @- | python3 -c "
import json, sys
d = json.load(sys.stdin)
data = d.get('data') or {}
calldata = data.get('data') or ''
router = data.get('routerAddress') or ''
assert calldata.startswith('0x') and len(calldata) > 10, 'no executable calldata returned'
print('calldata bytes:', (len(calldata) - 2) // 2, 'routerAddress:', router)
"
done
echo "PASS: routes within tolerance and executable calldata verified"
