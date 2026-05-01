import { ethers } from "hardhat";
import { writeFileSync } from "fs";
import { join } from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockUSDC = await MockERC20.deploy();
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("MockERC20 deployed:", mockUSDCAddress);

  const GhostPay = await ethers.getContractFactory("GhostPay");
  const ghostPay = await GhostPay.deploy(
    mockUSDCAddress,
    "Ghost Confidential USDC",
    "cUSDC",
    "https://ghostpay.xyz/metadata.json"
  );
  await ghostPay.waitForDeployment();
  const ghostPayAddress = await ghostPay.getAddress();
  console.log("GhostPay deployed:", ghostPayAddress);

  const userAddress = "0xc0Dd2bd75f7A2a77C622a62E08E5e534A5360867";

  const tx1 = await ghostPay.transferOwnership(userAddress);
  await tx1.wait();
  console.log("Ownership transferred!");

  const tx2 = await mockUSDC.mint(userAddress, ethers.parseUnits("10000", 18));
  await tx2.wait();
  console.log("Minted 10000 mUSDC to user!");

  const envPath = join(__dirname, "..", "..", "frontend", ".env");
  const envContent = `VITE_CHAINGPT_API_KEY=adc23e93-834e-4f7c-a97f-debfadf0a843
VITE_GHOST_PAY_ADDRESS=${ghostPayAddress}
VITE_MOCK_ERC20_ADDRESS=${mockUSDCAddress}
VITE_CHAIN_ID=421614`;
  writeFileSync(envPath, envContent);
  console.log("Updated frontend .env!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
