import { ethers } from "hardhat";

async function main() {
  const provider = ethers.provider;
  const balance = await provider.getBalance("0xc0dd2bd75f7a2a77c622a62e08e5e534a5360867");
  console.log("ETH:", ethers.formatEther(balance));
}

main().catch(console.error);
