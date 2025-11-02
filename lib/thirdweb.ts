import { createThirdwebClient } from "thirdweb"
import { defineChain } from "thirdweb/chains"

export const client = createThirdwebClient({
  clientId: "3d325540f5e91eb9d2ce5f2ab8122be3",
})

export const celoMainnet = defineChain({
  id: 42220,
  name: "Celo Mainnet",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "Celo Explorer",
      url: "https://explorer.celo.org",
      apiUrl: "https://explorer.celo.org/api",
    },
  ],
  testnet: false,
})

export const celoAlfajores = defineChain({
  id: 44787,
  name: "Celo Alfajores Testnet",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "Celo Alfajores Explorer",
      url: "https://alfajores.celoscan.io",
      apiUrl: "https://alfajores.celoscan.io/api",
    },
  ],
  testnet: true,
})

// Default chain for testing
export const defaultChain = celoAlfajores

// Network constants
export const CELO_MAINNET_CHAIN_ID = 42220
export const CELO_ALFAJORES_CHAIN_ID = 44787

export const NETWORK_NAMES = {
  [CELO_MAINNET_CHAIN_ID]: "Celo Mainnet",
  [CELO_ALFAJORES_CHAIN_ID]: "Celo Alfajores Testnet",
} as const
