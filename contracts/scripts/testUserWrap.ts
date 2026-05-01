import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const user = ethers.Wallet.createRandom().connect(ethers.provider);

  console.log("Funding user with ETH...");
  await (await deployer.sendTransaction({ to: user.address, value: ethers.parseEther("0.002") })).wait();

  const mUSDCAddress = "0xd2F3A98E302C6565A352A14773353BA789F4e985";
  const ghostPayAddress = "0x6b6F557aA110AE09050eE6A9c2cA1889f5172781";

  const mUSDC = await ethers.getContractAt("MockERC20", mUSDCAddress);
  const GhostPay = await ethers.getContractAt("GhostPay", ghostPayAddress);

  console.log("Minting 100 to user...");
  await (await mUSDC.mint(user.address, ethers.parseUnits("100", 18))).wait();

  console.log("Wrapping from user...");
  const tx = await GhostPay.connect(user).wrap(user.address, ethers.parseUnits("100", 18), { gasLimit: 500000 });
  console.log("Sent:", tx.hash);
  await tx.wait();
  console.log("Success!");
}

main().catch(console.error);
