// Generated from docs/build-pack/08-reference snapshots (2026-11-24). Refresh with scripts/refresh-snapshots.ts.

export const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;
export const MORPHO_BLUE =
  "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb" as const;
// KyberSwap aggregator router on Base, verified in spike S6 (2026-11-25).
export const SWAP_ROUTER =
  "0x6131B5fae19EA4f9D964eAc0408E4408b66337b5" as const;

export interface StockConstant {
  symbol: string;
  address: `0x${string}`;
  decimals: number;
  navFeed: `0x${string}`;
}

export const STOCKS: readonly StockConstant[] = [
  {
    symbol: "ANTc",
    address: "0xb20000000000000000000016e38FD364d271Ba28",
    decimals: 8,
    navFeed: "0xeEDc7412E991a3F2BD693eb2aC7fB0F27d4660dA",
  },
  {
    symbol: "CRCLc",
    address: "0xB20000000000000000000019f6E7C675b73C2e4D",
    decimals: 8,
    navFeed: "0x0231cF2635D1E17bB5c2462cc7504Ba1fBd61f33",
  },
  {
    symbol: "TSLAc",
    address: "0xb2000000000000000000001e800a7f5189430cD0",
    decimals: 8,
    navFeed: "0xFaf869185383a24F8cb00e27BdA6b63B9905DCb4",
  },
  {
    symbol: "GOOGLc",
    address: "0xb2000000000000000000002D0BA3164cc74f58B7",
    decimals: 8,
    navFeed: "0x5bF49E0ffA937CE2FfF033c739aD7C634c4D34F2",
  },
  {
    symbol: "SNDKc",
    address: "0xb200000000000000000000397293Cb8cda9a10c5",
    decimals: 8,
    navFeed: "0x388b0dC46C0Fb05A74BeE0994fa5b02c6Fcca2eA",
  },
  {
    symbol: "MSTRc",
    address: "0xb2000000000000000000004884b426556b92883d",
    decimals: 8,
    navFeed: "0xB3cE282CD188b35DA0E38D8Bc7d58e33173D202a",
  },
  {
    symbol: "INTCc",
    address: "0xB2000000000000000000004AFF16039bA04bdFBc",
    decimals: 8,
    navFeed: "0xAB657C39bac0D5886250D70849e2E3E008F2EECB",
  },
  {
    symbol: "NVDAc",
    address: "0xb20000000000000000000078ee7ce2fE4908108C",
    decimals: 8,
    navFeed: "0x04689a41629776563E6822F76f2e57D148d28513",
  },
  {
    symbol: "SPCXc",
    address: "0xb2000000000000000000007b9fcbd005511aCBd5",
    decimals: 8,
    navFeed: "0x6A634B235903C4ad6376892180d6fF8612e3Fa68",
  },
  {
    symbol: "METAc",
    address: "0xb2000000000000000000008bC8786B856E61707C",
    decimals: 8,
    navFeed: "0x6526aE6797A76123638b863AeE4dD27Ba4E4b27D",
  },
  {
    symbol: "MSFTc",
    address: "0xB200000000000000000000Ab99cFa739E253872B",
    decimals: 8,
    navFeed: "0xeB10A6c9aa7E537aEd766C08c35Dae35B321b18c",
  },
  {
    symbol: "AAPLc",
    address: "0xb200000000000000000000C2e324d24d7eEcd1fb",
    decimals: 8,
    navFeed: "0x787f13dEa48Db0897CbCDD985de77809D837F988",
  },
  {
    symbol: "AMZNc",
    address: "0xb200000000000000000000d9192b6B456483C2E8",
    decimals: 8,
    navFeed: "0x06A8E4b3aBB3B7543d8396FB2B763d22820cB295",
  },
] as const;

export interface MarketConstant {
  marketId: `0x${string}`;
  stock: string;
  lltvBps: number;
  oracle: `0x${string}`;
  irm: `0x${string}`;
}

export const MARKETS: readonly MarketConstant[] = [
  {
    marketId:
      "0xae1a30486234bf7e7ac166c7c03d9bc5f2cd8a39be2c48e73c665ac7148c3c28",
    stock: "AAPLc",
    lltvBps: 6250,
    oracle: "0xEcC5c9bf18CB2CfC94C2f7EFf8BDd5837A60AB0e",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0x26d61964fa3ab7dbaf904661c1c20de82a96ade9c4702a3f7346f15d0b55edf2",
    stock: "AAPLc",
    lltvBps: 6250,
    oracle: "0x66B97bad8053BA427316a4a3CDbB7Fe7A852ABA0",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0x560a19b8432903078816b6ed89ee2c2bdb9bf140b3a0cdd17ba6c2b3e214608a",
    stock: "AAPLc",
    lltvBps: 9800,
    oracle: "0xE6Ef8C3e2372cfBB5a01F5F9e6A111cef6309C4C",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0xb50ecaba0652b5a51bde9a747e9b7a2075c7ab68fd3c6ef7c05eabf6bb0f1d28",
    stock: "AAPLc",
    lltvBps: 6250,
    oracle: "0xf94C3C8aEb3E79376868a23f42a31Cb3B6a3F132",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0x7934723c6cc42d5f2bd3c58af4fc14bf0b5ae38245638adabf2052032967b398",
    stock: "AAPLc",
    lltvBps: 7700,
    oracle: "0xDF21F507676cF34F78080a7eAAeD967E741fDD00",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0xa3913d896b7e9c0e0a84f1be27d376cf2065616101cb7c44674af8a154e684cc",
    stock: "GOOGLc",
    lltvBps: 7700,
    oracle: "0x24DC11055aa5b2C5692E4B77d7285c4f0fd9Cf99",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0x4e8fcfab7ec82d20d1b179b274de9739d684aba8c7b09314948a1ed8fd786d97",
    stock: "GOOGLc",
    lltvBps: 6250,
    oracle: "0x3475e8D809dB0AE01c17758404778516039Ae7d2",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0x0cc78b1f4993015116e90626a18a1ba0e1ca73d0b75781b231d02fa5536e62a5",
    stock: "GOOGLc",
    lltvBps: 6250,
    oracle: "0x24DC11055aa5b2C5692E4B77d7285c4f0fd9Cf99",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0x45059d2328299056d05545d0368c8b0d34397047820a0d46b7775275375c76b2",
    stock: "GOOGLc",
    lltvBps: 7700,
    oracle: "0x112e34bFD7B39e3790B435Afb825a980E0512355",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0x44b343b5087c0bd34207cb5c199f12030777bf6b8c0a128438246f1212f37ca5",
    stock: "METAc",
    lltvBps: 6250,
    oracle: "0x4752B27dFc1931eb9a5DFEFC7FBC9d0af9020dC7",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0xa8835b567d1808f1fc9970d635b374d0f376b9f74e4b5840b2c74c5597cac88a",
    stock: "METAc",
    lltvBps: 8600,
    oracle: "0x4490497FB4f49061FB99F3E4De0bC4D182377cAA",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0xcce338a21d208d72f416a967daa5b040a6710c560ccb98854f2f9ebaa8d87376",
    stock: "METAc",
    lltvBps: 6250,
    oracle: "0xb25491504F627637E77CA4701FA46C2F16B65d6B",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0x6cf665db25bb5a59615cceffed97e527cfe0183f08176c568fc9c939f91b6647",
    stock: "METAc",
    lltvBps: 7700,
    oracle: "0x7DB3B3de66Dd60D26ca9aEDc4378cE2Fa2D837BD",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0x4f9329a87a70e722cdab07b3647ef705671b25079d4f3bae559be5cfe12a7318",
    stock: "MSFTc",
    lltvBps: 6250,
    oracle: "0x5a4CEB3240d50A16a8BBBBc0F72C53018B8E38be",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0xba887b01160863891d76a273f5dbab6efc6dbe3df5a732ee112313da5aba7ff7",
    stock: "MSFTc",
    lltvBps: 7700,
    oracle: "0x04Cb51598F7b7B78dd46BF26766256Fe1f8EeA88",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0xb4b42dd66cef25614b94510a910d54b2c148e7621d22b4271566724beda63d13",
    stock: "NVDAc",
    lltvBps: 6250,
    oracle: "0x4F698C04d01d9CebCDd9494c189aBdD6C5453f84",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0x91360eea2686ef7ce4966b4e82cf6ff712af02baf0f7211459780d9f5af1612a",
    stock: "NVDAc",
    lltvBps: 7700,
    oracle: "0xE0AE3137a30393410B595E1C1d572a1449A969ea",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0xaba747cd9c548324d7baab447bae58f1b23d8a96597415e7cdd58b9471060026",
    stock: "NVDAc",
    lltvBps: 6250,
    oracle: "0x67b878530ba7FbE5A1CD1020E8fFE20fcb30943C",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0xfef5641f70e19a87e369304daa9ba823754f3db1e6481d757fcae0442cffe479",
    stock: "NVDAc",
    lltvBps: 7700,
    oracle: "0x1E2b20B4703F97710c2600eA73179c6CD1E00b02",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0x5c800e8607e95fb96196570e229aef9a8a66595d4233a58fc406373bfac675db",
    stock: "NVDAc",
    lltvBps: 7700,
    oracle: "0x39712F36c013C09Cf4D62D0F695DD74eBe67FD19",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0x34b62b714803c0121c14ce767b8de3a1d87460f41c662b927dd2bc1527316876",
    stock: "NVDAc",
    lltvBps: 6250,
    oracle: "0xf256b7b9Ef29eF2A279052209F686f66BA952987",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0xce983b9ee6344e16ebbcc66812f23caafc63ae83fcc14fa29b66c7e69e9cecf6",
    stock: "SPCXc",
    lltvBps: 6250,
    oracle: "0x9079857a2b5FFfC3d87052b11b866a185B4A6483",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0xcf7cced126f93840c1b98706cbeb91d7a90f00799d813995683b5c144782ac77",
    stock: "SPCXc",
    lltvBps: 6250,
    oracle: "0xd2f719512DD4B7390EA01de7A20e0a8aE32354c3",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0xc22d1bc9f71832e1f83eedbecdb45980381176f8889f7b697c2bf6de6223c242",
    stock: "SPCXc",
    lltvBps: 6250,
    oracle: "0xb96F27C67e626C9931c58fa01bF8F8ED08acE28a",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0xc819df1685193012fc1d189e4ae22f6658442805f121303aebb04c81bd6d55d5",
    stock: "TSLAc",
    lltvBps: 6250,
    oracle: "0xFDD26bC94502a281f333e9593501d9A3C5a9905c",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
  {
    marketId:
      "0xd62e941889f385ac51cc825c72a2ea04e7c8e02ceb68c141d0b0a7d17fbf01c9",
    stock: "TSLAc",
    lltvBps: 6250,
    oracle: "0xe8aD8d1Bbbd8e3A0BBb5c1Bc600318ffb4AD073D",
    irm: "0x46415998764C29aB2a25CbeA6254146D50D22687",
  },
] as const;

// Default collateral: most USDC liquidity with a swap route (SPCXc, USD 1,217 on 2026-11-24; S6 verifies the route).
export const DEFAULT_STOCK = "SPCXc" as const;
