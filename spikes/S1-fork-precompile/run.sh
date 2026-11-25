#!/usr/bin/env bash
# S1: prove an anvil fork of Base executes B20 precompile calls.
set -euo pipefail
FORK_PORT=8555
NVDAc=0xb20000000000000000000078ee7ce2fE4908108C
MORPHO=0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb
RPC="${BASE_RPC_URL:-https://mainnet.base.org}"

anvil --fork-url "$RPC" --port $FORK_PORT > anvil.log 2>&1 &
ANVIL_PID=$!
trap 'kill $ANVIL_PID' EXIT
sleep 5

echo "== eth_getCode (expect 0xef) =="
curl -s -X POST http://127.0.0.1:$FORK_PORT -H 'content-type: application/json' \
  -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_getCode\",\"params\":[\"$NVDAc\",\"latest\"]}"

echo "== balanceOf(Morpho) =="
cast call $NVDAc "balanceOf(address)(uint256)" $MORPHO --rpc-url http://127.0.0.1:$FORK_PORT

echo "== impersonate + fund + transfer 100 raw units =="
curl -s -X POST http://127.0.0.1:$FORK_PORT -H 'content-type: application/json' \
  -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"anvil_impersonateAccount\",\"params\":[\"$MORPHO\"]}"
curl -s -X POST http://127.0.0.1:$FORK_PORT -H 'content-type: application/json' \
  -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"anvil_setBalance\",\"params\":[\"$MORPHO\",\"0x21E19E0C9BAB2400000\"]}"
curl -s -X POST http://127.0.0.1:$FORK_PORT -H 'content-type: application/json' \
  -d "{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"eth_sendTransaction\",\"params\":[{\"from\":\"$MORPHO\",\"to\":\"$NVDAc\",\"data\":\"0xa9059cbb00000000000000000000000011111111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000064\"}]}"

echo "== balanceOf(0x1111…1111) — expect 100 =="
cast call $NVDAc "balanceOf(address)(uint256)" 0x1111111111111111111111111111111111111111 --rpc-url http://127.0.0.1:$FORK_PORT
