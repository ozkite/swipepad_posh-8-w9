import { prepareContractCall, sendTransaction, getContract } from "thirdweb"
import { client, defaultChain } from "./thirdweb"
import { TOKEN_ADDRESSES } from "./token-addresses"
import type { StableCoin } from "@/components/amount-selector"
import type { Account } from "thirdweb/wallets"

// ERC-20 ABI for transfer function
const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
] as const

export interface TransactionItem {
  recipientAddress: string
  amount: number
  currency: StableCoin
  projectName: string
}

/**
 * Execute batch transactions to send tokens to multiple recipients
 * @param account - Connected wallet account
 * @param transactions - Array of transaction items
 * @returns Array of transaction results
 */
export async function executeBatchTransactions(
  account: Account,
  transactions: TransactionItem[],
): Promise<{ success: boolean; txHash?: string; error?: string }[]> {
  const results: { success: boolean; txHash?: string; error?: string }[] = []

  for (const tx of transactions) {
    try {
      console.log("[v0] Executing transaction:", {
        to: tx.recipientAddress,
        amount: tx.amount,
        currency: tx.currency,
        project: tx.projectName,
      })

      // Get token contract address
      const tokenAddress = TOKEN_ADDRESSES[tx.currency]
      if (!tokenAddress) {
        throw new Error(`Token address not found for ${tx.currency}`)
      }

      // Create contract instance
      const contract = getContract({
        client,
        chain: defaultChain,
        address: tokenAddress,
      })

      // Convert amount to wei (assuming 18 decimals for stablecoins)
      const amountInWei = BigInt(Math.floor(tx.amount * 100)) * BigInt(10 ** 16) // Convert cents to wei

      // Prepare the transfer transaction
      const transaction = prepareContractCall({
        contract,
        method: "function transfer(address to, uint256 amount) returns (bool)",
        params: [tx.recipientAddress, amountInWei],
      })

      // Send the transaction
      const result = await sendTransaction({
        transaction,
        account,
      })

      console.log("[v0] Transaction successful:", result.transactionHash)

      results.push({
        success: true,
        txHash: result.transactionHash,
      })
    } catch (error) {
      console.error("[v0] Transaction failed:", error)
      results.push({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  return results
}

/**
 * Execute a single transaction
 * @param account - Connected wallet account
 * @param recipientAddress - Recipient wallet address
 * @param amount - Amount in cents
 * @param currency - Token currency
 * @returns Transaction result
 */
export async function executeSingleTransaction(
  account: Account,
  recipientAddress: string,
  amount: number,
  currency: StableCoin,
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  const results = await executeBatchTransactions(account, [
    {
      recipientAddress,
      amount,
      currency,
      projectName: "Single Transaction",
    },
  ])

  return results[0]
}
