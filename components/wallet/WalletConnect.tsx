"use client"

import type React from "react"

import { ConnectButton, darkTheme, ThirdwebProvider } from "thirdweb/react"
import { createThirdwebClient } from "thirdweb"
import { inAppWallet, createWallet } from "thirdweb/wallets"
import { defineChain } from "thirdweb/chains"

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "3d325540f5e91eb9d2ce5f2ab8122be3"

const client = createThirdwebClient({
  clientId,
})

const celoMainnet = defineChain({
  id: 42220,
  name: "Celo",
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
  rpc: "https://forno.celo.org",
})

const wallets = [
  // Only include inAppWallet if user has set their own client ID
  ...(process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
    ? [
        inAppWallet({
          auth: {
            options: [
              "google",
              "discord",
              "telegram",
              "farcaster",
              "email",
              "x",
              "passkey",
              "phone",
              "github",
              "tiktok",
              "facebook",
              "apple",
              "line",
              "guest",
            ],
          },
        }),
      ]
    : []),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
]

const customTheme = darkTheme({
  colors: {
    accentText: "hsl(51, 100%, 45%)",
    borderColor: "hsl(221, 39%, 11%)",
  },
})

export { client, wallets, customTheme, celoMainnet }

export function WalletConnect() {
  return (
    <ConnectButton
      client={client}
      chain={celoMainnet}
      connectModal={{ size: "compact" }}
      theme={customTheme}
      wallets={wallets}
    />
  )
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return <ThirdwebProvider>{children}</ThirdwebProvider>
}
