import { ethers } from "hardhat";

async function main() {
  const ghostPayAddress = "0xdBCbd9d4e6eaa19AEF54ef133632Ff1EC6FD355d";
  const userAddress = "0xc0Dd2bd75f7A2a77C622a62E08E5e534A5360867";
  
  const ghostPay = await ethers.getContractAt("GhostPay", ghostPayAddress);
  
  console.log("Attempting test wrap of 100 tokens...");
  const tx = await ghostPay.wrap(userAddress, ethers.parseUnits("100", 18), { gasLimit: 1000000 });
  await tx.wait();
  console.log("Wrap SUCCESSFUL on-chain!");
  
  const bal = await ghostPay.confidentialBalances(userAddress);
  console.log("New Confidential Balance:", ethers.formatUnits(bal, 18));
}

main().catch((error) => {
  console.error("Test Wrap FAILED:", error);
  process.exitCode = 1;
});
