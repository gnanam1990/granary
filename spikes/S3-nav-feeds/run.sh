#!/usr/bin/env bash
# S3: sample decimals() and latestRoundData() for the five feeds.
set -euo pipefail
RPC="${BASE_RPC_URL:-https://mainnet.base.org}"
feeds=(
  "NVDAc 0x04689a41629776563E6822F76f2e57D148d28513"
  "GOOGLc 0x5bF49E0ffA937CE2FfF033c739aD7C634c4D34F2"
  "SPCXc 0x6A634B235903C4ad6376892180d6fF8612e3Fa68"
  "AAPLc 0x787f13dEa48Db0897CbCDD985de77809D837F988"
  "METAc 0x6526aE6797A76123638b863AeE4dD27Ba4E4b27D"
)
for row in "${feeds[@]}"; do
  name=${row%% *}
  addr=${row##* }
  echo "== $name =="
  cast call "$addr" "decimals()(uint8)" --rpc-url "$RPC"
  cast call "$addr" "latestRoundData()(uint80,int256,uint256,uint256,uint80)" --rpc-url "$RPC"
done
date -u +"sampled %Y-%m-%dT%H:%M:%SZ"
