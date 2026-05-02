import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  const mUSDC = await ethers.getContractAt("MockERC20", "0x7864336CCF51c7Ce0132bCd4170D74CbcBF09C61");
  const tx = await mUSDC.mint("0xc0dd2bd75f7a2a77c622a62e08e5e534a5360867", ethers.parseUnits("10000", 18));
  await tx.wait();
  console.log("Minted 10000 mUSDC to user!");
}

main().catch(console.error);
