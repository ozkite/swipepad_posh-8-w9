export const CELO_TOKEN_ADDRESSES = {
  cUSD: "0x765de816845861e75a25fca122bb6898b8b1282a",
  USDT: "0x617f3112bf5397D0467D315cC709EF968D9ba546",
  USDC: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
} as const

export const TOKEN_ADDRESSES = CELO_TOKEN_ADDRESSES

export type TokenSymbol = keyof typeof CELO_TOKEN_ADDRESSES

export function getTokenAddress(symbol: TokenSymbol): string {
  return CELO_TOKEN_ADDRESSES[symbol]
}
