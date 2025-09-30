"use client"

import { ConnectButton, useActiveAccount } from "thirdweb/react"
import { createThirdwebClient } from "thirdweb"
import { celo } from "thirdweb/chains"
import { inAppWallet, createWallet } from "thirdweb/wallets"
import { useEffect } from "react"

const client = createThirdwebClient({
  clientId: "3d325540f5e91eb9d2ce5f2ab8122be3",
})

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "email",
        "phone",
        "google",
        "discord",
        "passkey",
        "guest",
        "apple",
        "github",
        "x",
        "telegram",
        "tiktok",
        "line",
        "farcaster",
        "twitch",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
]

export function ThirdwebConnect() {
  const account = useActiveAccount()

  useEffect(() => {
    if (account) {
      // Wallet is connected, trigger parent state update
      const event = new CustomEvent("walletConnected", { detail: { address: account.address } })
      window.dispatchEvent(event)
    }
  }, [account])

  return (
    <ConnectButton
      client={client}
      chains={[celo]}
      wallets={wallets}
      connectModal={{
        size: "compact",
        title: "Sign in to SwipePad",
        showAllWallets: true,
      }}
      theme="dark"
      connectButton={{
        label: "Connect Wallet",
        className:
          "!w-full !bg-[#FFD600] hover:!bg-[#E6C200] !text-black !font-bold !py-4 !px-6 !rounded-xl !transition-colors",
      }}
    />
  )
}
