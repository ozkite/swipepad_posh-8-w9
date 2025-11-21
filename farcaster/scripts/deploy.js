const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying SwipePad Farcaster contracts to Celo Mainnet...");
  
  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()));
  
  // Deploy DonationHandler
  console.log("Deploying DonationHandler...");
  const DonationHandler = await ethers.getContractFactory("DonationHandler");
  const donationHandler = await DonationHandler.deploy();
  await donationHandler.deployed();
  console.log("DonationHandler deployed to:", donationHandler.address);
  
  // Deploy MultiSigWallet (for treasury)
  console.log("Deploying MultiSigWallet...");
  const initialOwners = [deployer.address]; // Add other owners as needed
  const requiredSignatures = 1; // Change as needed
  const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
  const multiSigWallet = await MultiSigWallet.deploy(initialOwners, requiredSignatures);
  await multiSigWallet.deployed();
  console.log("MultiSigWallet deployed to:", multiSigWallet.address);
  
  // Deploy BoostHandler with MultiSigWallet as treasury
  console.log("Deploying BoostHandler...");
  const BoostHandler = await ethers.getContractFactory("BoostHandler");
  const boostHandler = await BoostHandler.deploy(multiSigWallet.address);
  await boostHandler.deployed();
  console.log("BoostHandler deployed to:", boostHandler.address);
  
  // Save deployment information
  const deploymentInfo = {
    network: "celo-mainnet",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      DonationHandler: donationHandler.address,
      MultiSigWallet: multiSigWallet.address,
      BoostHandler: boostHandler.address
    },
    initialOwners,
    requiredSignatures
  };
  
  // Create deployment directory if it doesn't exist
  const deploymentDir = path.join(__dirname, "../../deployment");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  // Save deployment information
  const deploymentFile = path.join(deploymentDir, "addresses.json");
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("Deployment information saved to:", deploymentFile);
  
  // Verify contracts on CeloScan
  console.log("Verifying contracts on CeloScan...");
  
  try {
    await hre.run("verify:verify", {
      address: donationHandler.address,
      constructorArguments: [],
    });
    console.log("DonationHandler verified on CeloScan");
  } catch (error) {
    console.log("Failed to verify DonationHandler:", error.message);
  }
  
  try {
    await hre.run("verify:verify", {
      address: multiSigWallet.address,
      constructorArguments: [initialOwners, requiredSignatures],
    });
    console.log("MultiSigWallet verified on CeloScan");
  } catch (error) {
    console.log("Failed to verify MultiSigWallet:", error.message);
  }
  
  try {
    await hre.run("verify:verify", {
      address: boostHandler.address,
      constructorArguments: [multiSigWallet.address],
    });
    console.log("BoostHandler verified on CeloScan");
  } catch (error) {
    console.log("Failed to verify BoostHandler:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
