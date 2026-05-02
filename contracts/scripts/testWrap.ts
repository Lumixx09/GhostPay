import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const mUSDC = await ethers.getContractAt("MockERC20", "0x706a2dc3cCF2Def6362B5fCB0556F38ec6bfe0C0");
  const GhostPay = await ethers.getContractAt("GhostPay", "0x2a3d27a23476226e33E13Bfb04eaD028b557f3D0");

  console.log("Minting...");
  await (await mUSDC.mint(deployer.address, ethers.parseUnits("100", 18))).wait();

  console.log("Approving...");
  await (await mUSDC.approve(await GhostPay.getAddress(), ethers.parseUnits("100", 18))).wait();

  console.log("Wrapping...");
  await (await GhostPay.wrap(deployer.address, ethers.parseUnits("100", 18))).wait();
  
  console.log("Success!");
}
main().catch(console.error);
