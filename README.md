# Granary

Borrow against your stock treasury instead of selling it. A balance sheet for agents and x402 sellers on Base.

Revenue lands in the seller's own onchain vault. A fixed rule splits it: operating reserve first, then loan repayment, then a tokenized-stock treasury. When a bill arrives and the reserve is short, the vault borrows USDC against the stock on Morpho instead of selling it, and the next revenue repays that loan first.

Built for Base Stocks Maxxing Season (Agentic Stock Finance track). See `docs/build-pack/` for the full specification.

## Status

**Early scaffold.** Nothing below is live yet; this section is updated module by module.

### What is live

Nothing yet.

### What is mocked

Everything. No contract is deployed; no revenue flows.

### Trust assumptions

- Each seller owns their vault; Granary's operator key can never withdraw, change policy or change payees.
- Borrowing and collateral pricing rely on Morpho Blue's markets and oracles on Base; buying relies on Chainlink NAV feeds.
- The keeper service is an untrusted helper: the vault contract enforces every money rule onchain.

### Known limits

- Tiny Morpho liquidity for stock-collateral markets (a few thousand USD total as of 2026-11-24). Granary is designed for micro credit (USD 1–50 draws) and refuses a borrow the market cannot fund.
- One collateral stock per vault in v1.
- Unaudited contracts. Do not use with real money you cannot afford to lose.
- Tokenized stocks are precompile tokens (B20) with transfer policy controls; a pause can freeze movement.

### Non-US notice

Tokenized stocks are not available to US persons. This project does not serve US users: the web app geo-blocks US IPs and onboarding requires a non-US attestation. The contracts themselves are permissionless code on Base and cannot stop anyone from interacting directly; nothing here is investment advice, and no shareholder rights are created or implied.

## Development

Node 22, pnpm workspaces, TypeScript strict, Foundry for contracts. See `CLAUDE.md` for working rules, `DECISIONS.md` for what was chosen and why, and `PROVEN.md` for what has actually been run.

```
pnpm install
pnpm lint && pnpm typecheck && pnpm test
cd contracts && forge build && forge test
```

## License

Apache-2.0. Third-party notices in `NOTICE`.
