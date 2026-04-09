import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("--------------------------------------------------");
  console.log("DEPLOYING GHOSTPAY ON ARBITRUM SEPOLIA");
  console.log("Deployer:", deployer.address);
  console.log("--------------------------------------------------");

  // 1. Deploy Mock underlying token (e.g., USDT)
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockUSDC = await MockERC20.deploy();
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("✅ MockUSDC deployed to:", mockUSDCAddress);

  // 2. Deploy GhostPay (Confidential Wrapper)
  const GhostPay = await ethers.getContractFactory("GhostPay");
  const ghostPay = await GhostPay.deploy(
    mockUSDCAddress,
    "Ghost Confidential USDC",
    "cUSDC",
    "https://ghostpay.xyz/metadata.json"
  );

  await ghostPay.waitForDeployment();
  const ghostPayAddress = await ghostPay.getAddress();
  console.log("✅ GhostPay deployed to:", ghostPayAddress);
  console.log("--------------------------------------------------");
  console.log("NEXT STEPS:");
  console.log(`1. Update VITE_GHOST_PAY_ADDRESS="${ghostPayAddress}" in frontend/.env`);
  console.log("2. Run frontend with npm run dev");
  console.log("--------------------------------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

