"use client"

import { ConnectButton, darkTheme, useActiveAccount } from "thirdweb/react"
import { client, defaultChain } from "@/lib/thirdweb"
import { inAppWallet, createWallet } from "thirdweb/wallets"

const wallets = [
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
        "line",
        "facebook",
        "apple",
        "guest",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
]

export function ThirdwebWalletButton() {
  const account = useActiveAccount()

  return (
    <ConnectButton
      client={client}
      chain={defaultChain}
      connectModal={{ size: "compact" }}
      theme={darkTheme({
        colors: {
          accentText: "hsl(51, 100%, 45%)",
          accentButtonBg: "hsl(51, 100%, 45%)",
          accentButtonText: "hsl(0, 0%, 0%)",
          borderColor: "hsl(221, 39%, 11%)",
          primaryButtonBg: "hsl(51, 100%, 45%)",
          primaryButtonText: "hsl(0, 0%, 0%)",
        },
      })}
      wallets={wallets}
      connectButton={{
        label: account ? "Connected" : "Connect Wallet",
        style: {
          backgroundColor: "hsl(51, 100%, 45%)",
          color: "hsl(0, 0%, 0%)",
          fontWeight: "bold",
          borderRadius: "0.75rem",
          padding: "0.75rem 1.5rem",
          fontSize: "0.875rem",
        },
      }}
    />
  )
}
