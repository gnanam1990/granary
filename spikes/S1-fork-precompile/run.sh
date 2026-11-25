#!/usr/bin/env bash
# S1: prove an anvil fork of Base executes B20 precompile calls.
# SECURITY: if BASE_RPC_URL carries a provider key in its path, the fork log
# records it. anvil.log is gitignored; never commit or share it.
set -euo pipefail
FORK_PORT=8555
NVDAc=0xb20000000000000000000078ee7ce2fE4908108C
MORPHO=0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb
RPC="${BASE_RPC_URL:-https://mainnet.base.org}"
LOCAL=http://127.0.0.1:$FORK_PORT

anvil --fork-url "$RPC" --port $FORK_PORT > anvil.log 2>&1 &
ANVIL_PID=$!
trap 'kill $ANVIL_PID 2>/dev/null || true' EXIT
sleep 5

rpc() {
  curl -s -X POST "$LOCAL" -H 'content-type: application/json' -d "$1"
}

echo "== eth_getCode (expect 0xef) =="
rpc "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_getCode\",\"params\":[\"$NVDAc\",\"latest\"]}"
echo

echo "== balanceOf(Morpho) =="
cast call $NVDAc "balanceOf(address)(uint256)" $MORPHO --rpc-url "$LOCAL"

echo "== impersonate + fund + transfer 100 raw units =="
rpc "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"anvil_impersonateAccount\",\"params\":[\"$MORPHO\"]}" > /dev/null
rpc "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"anvil_setBalance\",\"params\":[\"$MORPHO\",\"0x21E19E0C9BAB2400000\"]}" > /dev/null
RESP=$(rpc "{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"eth_sendTransaction\",\"params\":[{\"from\":\"$MORPHO\",\"to\":\"$NVDAc\",\"data\":\"0xa9059cbb00000000000000000000000011111111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000064\"}]}")
echo "$RESP"
TX=$(echo "$RESP" | python3 -c "import json,sys; print(json.load(sys.stdin).get('result') or '')")
if [ -z "$TX" ]; then
  echo "FAIL: transfer rejected: $RESP" >&2
  exit 1
fi

echo "== balanceOf(0x1111...1111) — must equal 100 =="
BAL=$(cast call $NVDAc "balanceOf(address)(uint256)" 0x1111111111111111111111111111111111111111 --rpc-url "$LOCAL")
echo "$BAL"
if [ "${BAL%% *}" != "100" ]; then
  echo "FAIL: expected balance 100, got $BAL" >&2
  exit 1
fi
echo "PASS: fork executes B20 precompile reads and transfers"
