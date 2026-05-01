import pkg from 'hardhat';
const { ethers } = pkg;
import deployments from '../deployments.json';

async function main() {
  const [deployer] = await ethers.getSigners();
  const mockERC20 = await ethers.getContractAt(
    ['function mint(address to, uint256 amount) public'],
    deployments.mockERC20,
  );
  const amount = ethers.parseUnits('10000', 18); // mint 10,000 mUSDC
  await (await mockERC20.mint(deployer.address, amount)).wait();
  console.log(`✅ Minted 10,000 mUSDC to ${deployer.address}`);
}

main().catch(console.error);
