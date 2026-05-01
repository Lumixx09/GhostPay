import { ethers } from "hardhat";

async function main() {
  const GhostPay = await ethers.getContractAt("GhostPay", "0xBc28afB86d7fB6398677266Fe0E40827F90578Fc");
  const tx = await GhostPay.transferOwnership("0xc0Dd2bd75f7A2a77C622a62E08E5e534A5360867");
  await tx.wait();
  console.log("Ownership transferred to user!");
}

main().catch(console.error);
