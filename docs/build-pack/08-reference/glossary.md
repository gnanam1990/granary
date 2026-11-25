# Glossary

| Term | Meaning |
|---|---|
| **x402** | A way to pay for an HTTP request: the server answers 402 with a price, the client pays in USDC and retries |
| **Facilitator** | The service that checks and settles x402 payments onchain (here, Coinbase's CDP Facilitator) |
| **payTo** | The address an x402 payment is sent to. In Granary it is the seller's vault |
| **Vault** | One smart contract per seller that holds their cash, posts their stock as collateral and enforces the rule |
| **Operator** | A key allowed to run routine actions for a vault inside hard limits. It cannot withdraw |
| **Keeper** | The offchain service that notices payments and calls the vault |
| **Waterfall** | The fixed order money is split in: floor, repay, reserve, invest, free cash |
| **Reserve floor / target** | The minimum cash kept before repaying; the comfortable level filled before investing |
| **Investable** | Cash set aside to buy stock |
| **Free cash** | What is left; only the owner can withdraw it |
| **B20** | Base's native token standard. Coinbase tokenized stocks are B20 tokens |
| **Tokenized stock** | A token issued by Coinbase that tracks a share. Not available to US persons. Gives no voting rights |
| **Multiplier** | The number of shares one token stands for. Rises with dividends and splits |
| **NAV feed** | Chainlink's reference price for a stock token. Not a tradeable price; frozen when the market is closed |
| **Morpho Blue** | A lending protocol. Each "market" pairs one collateral with one loan asset |
| **Collateral** | Stock posted to Morpho so the vault can borrow |
| **LTV** | Loan-to-value: debt divided by collateral value |
| **LLTV** | The LTV at which Morpho allows liquidation (62.5% or 77% for these markets) |
| **Credit ceiling (`maxLtvBps`)** | The owner's own, lower limit. Default 30% |
| **Band** | OK, WATCH or DANGER, by where the LTV sits |
| **protect()** | A function anyone can call in DANGER that repays the loan from the reserve |
| **Bps** | Basis points; 10,000 bps = 100% |
| **Micro-unit** | The smallest USDC unit; 1 USDC = 1,000,000 |
| **Builder Code** | A tag added to transactions so Base can attribute them to an app |
| **Bazaar** | Coinbase's index of x402 endpoints |
| **Dogfood API** | The team's own small paid API that uses Granary |
| **Spike** | A short test to answer one unknown before building on it |
