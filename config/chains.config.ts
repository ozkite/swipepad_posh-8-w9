import { defineChain } from "thirdweb/chains"

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
