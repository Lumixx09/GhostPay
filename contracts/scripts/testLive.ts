import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { join } from "path";
import * as fs from "fs";

async function main() {
  const envPath = join(__dirname, "..", "..", "frontend", ".env");
  const env = dotenv.parse(fs.readFileSync(envPath));
  
  const ghostPayAddress = env.VITE_GHOST_PAY_ADDRESS;
  const mockUSDCAddress = env.VITE_MOCK_ERC20_ADDRESS;
  
  console.log("Testing GhostPay at:", ghostPayAddress);
  console.log("MockUSDC at:", mockUSDCAddress);

  const [deployer] = await ethers.getSigners();
  const mUSDC = await ethers.getContractAt("MockERC20", mockUSDCAddress);
  const GhostPay = await ethers.getContractAt("GhostPay", ghostPayAddress);

  console.log("Checking deployer balance...");
  const bal = await mUSDC.balanceOf(deployer.address);
  console.log("Balance:", ethers.formatUnits(bal, 18));

  console.log("Attempting Wrap (Bypassing Approve)...");
  try {
    const tx = await GhostPay.wrap(deployer.address, ethers.parseUnits("1", 18), { gasLimit: 5000000 });
    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("Success!");
  } catch (e) {
    console.error("Wrap failed:", e);
  }
}

main().catch(console.error);
