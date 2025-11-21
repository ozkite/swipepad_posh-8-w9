require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-gas-reporter");
require("solidity-coverage");

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x" + "0".repeat(64);
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || "";
const CELOSCAN_API_KEY = process.env.CELOSCAN_API_KEY || "";

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    celo: {
      url: `https://celo-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [PRIVATE_KEY],
      chainId: 42220,
      gasPrice: 20000000000, // 20 gwei
    },
    alfajores: {
      url: `https://celo-alfajores.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [PRIVATE_KEY],
      chainId: 44787,
      gasPrice: 20000000000, // 20 gwei
    },
  },
  etherscan: {
    apiKey: CELOSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: 0,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};
