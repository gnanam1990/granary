#!/usr/bin/env bash
# S6: fetch KyberSwap routes USDC -> SPCXc at USD 5 and USD 50, enforce the 1.5%
# NAV bound and the expected router, and confirm /route/build returns executable
# calldata. Exits non-zero on any breach.
set -euo pipefail
USDC=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
SPCXc=0xb2000000000000000000007b9fcbd005511aCBd5
NAV_FEED=0x6A634B235903C4ad6376892180d6fF8612e3Fa68
EXPECTED_ROUTER=0x6131B5fae19EA4f9D964eAc0408E4408b66337b5
API=https://aggregator-api.kyberswap.com/base/api/v1
CALLER=0x000000000000000000000000000000000000dEaD # dry-run sender, no funds moved
RPC="${BASE_RPC_URL:-https://mainnet.base.org}"

# Live NAV per share from the Chainlink feed (8 decimals).
NAV_RAW=$(cast call $NAV_FEED "latestRoundData()(uint80,int256,uint256,uint256,uint80)" --rpc-url "$RPC" | sed -n '2p' | awk '{print $1}')
NAV=$(python3 -c "print($NAV_RAW / 1e8)")
echo "NAV per share: $NAV"

for amount in 5000000 50000000; do
  echo "== amountIn=$amount =="
  ROUTE=$(curl -sf "$API/routes?tokenIn=$USDC&tokenOut=$SPCXc&amountIn=$amount")
  echo "$ROUTE" | python3 -c "
import json, sys
d = json.load(sys.stdin)['data']['routeSummary']
router = d['routerAddress']
assert router.lower() == '$EXPECTED_ROUTER'.lower(), f'unexpected router {router}'
# exact USDC spent (6 decimals), not kyberswap's USD estimate
paid = int(d['amountIn']) / 1e6
shares = int(d['amountOut']) / 1e8
nav_value = shares * $NAV
# compare in integer basis points: a quote exactly at the inclusive limit passes
dev_bps = round((nav_value / paid - 1) * 10000)
print('routerAddress:', router)
print('amountOut:', d['amountOut'], 'usdcSpent:', paid, 'amountOutUsd:', d['amountOutUsd'])
print('gasUsd:', d['gasUsd'])
print(f'shares: {shares} navValueUsd: {nav_value:.4f} deviation vs NAV: {dev_bps / 100:+.2f}%')
assert abs(dev_bps) <= 150, f'route outside 1.5% NAV bound: {dev_bps / 100:+.2f}%'
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
assert router.lower() == '$EXPECTED_ROUTER'.lower(), f'build targets unexpected router {router}'
print('calldata bytes:', (len(calldata) - 2) // 2, 'routerAddress:', router)
"
done
echo "PASS: both sizes inside the 1.5% NAV bound, router verified, calldata executable"
