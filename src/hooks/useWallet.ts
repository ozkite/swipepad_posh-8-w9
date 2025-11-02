import {
  useActiveAccount,
  useActiveWallet,
  useConnect,
  useDisconnect,
  useWalletBalance,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { DEFAULT_CHAIN } from "../config/chains.config";
import { thirdwebClient } from "../config/thirdweb.config";

export const useWallet = () => {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { connect, isConnecting, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const switchChain = useSwitchActiveWalletChain();

  const { data: balance, isLoading: balanceLoading } = useWalletBalance({
    client: thirdwebClient,
    address: account?.address,
    chain: DEFAULT_CHAIN,
  });

  const switchToCelo = async () => {
    if (wallet) {
      try {
        await switchChain(DEFAULT_CHAIN);
      } catch (error) {
        console.error("Error switching chain:", error);
      }
    }
  };

  return {
    address: account?.address,
    account,
    wallet,
    isConnected: !!account,
    balance: balance
      ? {
          displayValue: balance.displayValue,
          value: balance.value,
          symbol: balance.symbol,
          decimals: balance.decimals,
        }
      : null,
    balanceLoading,
    connect,
    disconnect,
    isConnecting,
    connectError,
    switchToCelo,
    currentChain: wallet?.getChain(),
  };
};
