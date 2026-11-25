# S1 — Can a forge/anvil fork of Base execute B20 precompile calls?

**Answer: YES — fork tests are allowed.** `balanceOf` reads and an impersonated `transfer` both execute against the NVDAc precompile on an anvil fork of Base mainnet.

Date: 2026-11-25. RPC: `https://mainnet.base.org` (public), forked locally with anvil 1.10.0.

## Commands and output

```
anvil --fork-url https://mainnet.base.org --port 8555

# eth_getCode of NVDAc precompile (0xb200…108C) on the fork:
{"result":"0xef"}                                   # matches the documented precompile marker

# balanceOf(Morpho Blue 0xBBBB…FFCb) on the fork:
1950210963                                          # raw uint256, 8 decimals ≈ 19.5 NVDAc

# impersonate a holder, fund gas, transfer 100 raw units to 0x1111…1111:
anvil_impersonateAccount(0xBBBB…FFCb)               # result null (ok)
anvil_setBalance(0xBBBB…FFCb, 100 ETH)              # result null (ok)
eth_sendTransaction transfer(0x1111…1111, 100)
  → tx 0x108ed5d884f99b7bacedf6cfc7454a2141a978cbe3b72cb82dd67a3f1f9ed3df

# balanceOf(0x1111…1111) after the transfer:
100                                                 # exact amount received
```

## Notes

- The precompile holds no normal bytecode (`0xef`); calls still execute correctly on the fork.
- Impersonation needs `anvil_impersonateAccount` + `anvil_setBalance`; `cast send --unlocked` alone fails with "No Signer available".
- Consequence for the build: unit/invariant tests may fork Base mainnet; no mocks needed for precompile reads.
