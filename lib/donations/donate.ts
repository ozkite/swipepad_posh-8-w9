kimport { prepareContractCall, sendTransaction } from "thirdweb";
import { getContract } from "thirdweb";
import { celo } from "thirdweb/chains";

// cUSD Token on Celo
const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

/**
 * Execute a donation transaction
 * @param account - Connected wallet account
 * @param recipientAddress - Project wallet address
 * @param amount - Amount in cUSD (e.g., "1.5")
 */
export async function executeDonation(
  account: any,
  recipientAddress: string,
  amount: string
) {
  try {
    // Get cUSD token contract
    const contract = getContract({
      client: account.client,
      chain: celo,
      address: CUSD_ADDRESS,
    });

    // Convert amount to wei (18 decimals)
    const amountInWei = BigInt(parseFloat(amount) * 1e18);

    // Prepare transfer transaction
    const transaction = prepareContractCall({
      contract,
      method: "function transfer(address to, uint256 amount) returns (bool)",
      params: [recipientAddress, amountInWei],
    });

    // Send transaction
    const result = await sendTransaction({
      transaction,
      account,
    });

    console.log("✅ Donation successful!", result);
    return {
      success: true,
      transactionHash: result.transactionHash,
      amount,
      recipient: recipientAddress,
    };
  } catch (error) {
    console.error("❌ Donation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
