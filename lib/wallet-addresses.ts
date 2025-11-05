import celoKarmaGap100 from "../data/profiles/celo_karmagap_100.json"

export interface WalletAddressEntry {
  projectName: string
  walletAddress: string
}

// Extract all valid wallet addresses from the 100 projects
export const celoKarmaGap100WalletAddresses: WalletAddressEntry[] = celoKarmaGap100
  .filter((profile: any) => {
    const hasValidWallet =
      profile.wallet_address && profile.wallet_address !== "N/A" && profile.wallet_address.startsWith("0x")
    return hasValidWallet
  })
  .map((profile: any) => ({
    projectName: profile.Name,
    walletAddress: profile.wallet_address,
  }))

// Export a simple array of just the addresses for easy batch sending
export const walletAddressesOnly: string[] = celoKarmaGap100WalletAddresses.map((entry) => entry.walletAddress)

// Function to get wallet address by project name
export function getWalletAddressByProjectName(projectName: string): string | null {
  const entry = celoKarmaGap100WalletAddresses.find((e) => e.projectName.toLowerCase() === projectName.toLowerCase())
  return entry ? entry.walletAddress : null
}

// Function to validate if an address is in the list
export function isValidProjectWallet(address: string): boolean {
  return walletAddressesOnly.includes(address.toLowerCase())
}

console.log(`[v0] Loaded ${celoKarmaGap100WalletAddresses.length} wallet addresses from Celo KarmaGap 100 projects`)
