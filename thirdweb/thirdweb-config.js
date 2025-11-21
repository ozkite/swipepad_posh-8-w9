// thirdweb-config.js
module.exports = {
  sdk: {
    network: "base",
    wallet: process.env.WALLET_PRIVATE_KEY,
  },
  contracts: {
    nftCollection: "0x...",
    marketplace: "0x...",
    token: "0x..."
  },
  storage: {
    gateway: "https://ipfs.io/ipfs/"
  }
};
