"use client";

import React from "react";
import { ConnectButton, darkTheme } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { thirdwebClient } from "../../config/thirdweb.config";
import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from "../../config/chains.config";

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "email",
        "phone",
        "google",
        "discord",
        "telegram",
        "farcaster",
        "x",
        "passkey",
        "github",
        "twitch",
        "line",
        "tiktok",
        "apple",
        "guest",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
  createWallet("com.valora"),
];

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
});

export const ConnectWalletButton: React.FC = () => {
  return (
    <ConnectButton
      client={thirdwebClient}
      wallets={wallets}
      chain={DEFAULT_CHAIN}
      chains={SUPPORTED_CHAINS}
      theme={customTheme}
      connectButton={{
        label: "Enter SwipePad",
        style: {
          fontSize: "16px",
          fontWeight: "600",
        },
      }}
      connectModal={{
        title: "Sign in to SwipePad",
        size: "compact",
        showThirdwebBranding: true,
        welcomeScreen: {
          title: "Welcome to SwipePad",
          subtitle: "Connect your wallet to get started on Celo",
        },
      }}
    />
  );
};
