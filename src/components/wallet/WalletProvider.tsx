"use client";

import React from "react";
import { ThirdwebProvider } from "thirdweb/react";

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
};
