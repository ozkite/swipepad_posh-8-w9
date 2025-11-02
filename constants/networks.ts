export const CELO_MAINNET_CHAIN_ID = 42220
export const CELO_ALFAJORES_CHAIN_ID = 44787

export const NETWORK_NAMES = {
  [CELO_MAINNET_CHAIN_ID]: "Celo Mainnet",
  [CELO_ALFAJORES_CHAIN_ID]: "Celo Alfajores Testnet",
} as const

export const RPC_URLS = {
  [CELO_MAINNET_CHAIN_ID]: "https://forno.celo.org",
  [CELO_ALFAJORES_CHAIN_ID]: "https://alfajores-forno.celo-testnet.org",
} as const

export const BLOCK_EXPLORERS = {
  [CELO_MAINNET_CHAIN_ID]: "https://explorer.celo.org",
  [CELO_ALFAJORES_CHAIN_ID]: "https://alfajores.celoscan.io",
} as const
