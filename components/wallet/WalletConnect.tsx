"use client"

import type React from "react"

import { ConnectButton, darkTheme, ThirdwebProvider } from "thirdweb/react"
import { createThirdwebClient } from "thirdweb"
import { createWallet } from "thirdweb/wallets"
import { defineChain } from "thirdweb/chains"

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "3d325540f5e91eb9d2ce5f2ab8122be3",
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

// Using only external wallets that work without domain restrictions
const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
]

const customTheme = darkTheme({
  colors: {
    accentText: "hsl(51, 100%, 45%)",
    accentButtonBg: "hsl(51, 100%, 45%)",
    accentButtonText: "hsl(221, 39%, 11%)",
    borderColor: "hsl(0, 0%, 20%)",
    modalBg: "hsl(221, 39%, 11%)",
    separatorLine: "hsl(201, 86%, 40%)",
    primaryButtonBg: "hsl(221, 39%, 15%)",
    primaryButtonText: "hsl(0, 0%, 100%)",
    secondaryButtonBg: "hsl(221, 39%, 18%)",
    secondaryButtonText: "hsl(0, 0%, 90%)",
    secondaryButtonHoverBg: "hsl(221, 39%, 22%)",
    dropdownBg: "hsl(221, 39%, 13%)",
    inputAutofillBg: "hsl(221, 39%, 15%)",
    scrollbarBg: "hsl(221, 39%, 20%)",
    skeletonBg: "hsl(221, 39%, 18%)",
    connectedButtonBg: "hsl(221, 39%, 15%)",
    connectedButtonBgHover: "hsl(221, 39%, 18%)",
    selectedTextColor: "hsl(51, 100%, 45%)",
    selectedTextBg: "hsl(51, 100%, 15%)",
  },
})

export { client, wallets, customTheme, celoMainnet }

export function WalletConnect() {
  return (
    <ConnectButton
      client={client}
      connectButton={{
        label: "Enter SwipePad",
        style: {
          fontSize: "16px",
          fontWeight: "600",
        },
      }}
      connectModal={{
        size: "compact",
        title: "Connect Wallet",
        showThirdwebBranding: true,
        welcomeScreen: {
          title: "Welcome to SwipePad",
          subtitle: "Connect your wallet to get started",
        },
      }}
      theme={customTheme}
      wallets={wallets}
      chains={[celoMainnet]}
    />
  )
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return <ThirdwebProvider>{children}</ThirdwebProvider>
}
