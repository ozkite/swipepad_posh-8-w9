import { defineChain } from "thirdweb";

export const celoMainnet = defineChain({
  id: 42220,
  name: "Celo",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  rpc: "https://forno.celo.org",
  blockExplorers: [
    {
      name: "Celoscan",
      url: "https://celoscan.io",
    },
  ],
  testnet: false,
});

export const celoAlfajores = defineChain({
  id: 44787,
  name: "Celo Alfajores Testnet",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  rpc: "https://alfajores-forno.celo-testnet.org",
  blockExplorers: [
    {
      name: "Alfajores Celoscan",
      url: "https://alfajores.celoscan.io",
    },
  ],
  testnet: true,
});
