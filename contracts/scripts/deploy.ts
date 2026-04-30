import pkg from 'hardhat';
import { writeFileSync } from 'fs';
import { join } from 'path';

const { ethers, network } = pkg;

async function main() {
  // const [deployer] = await ethers.getSigners();
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error(
      'No signers available. Check PRIVATE_KEY in your .env file.',
    );
  }
  const [deployer] = signers;
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log('--------------------------------------------------');
  console.log(` DEPLOYING GHOSTPAY ON ${network.name.toUpperCase()}`);
  console.log('--------------------------------------------------');
  console.log(' Deployer:', deployer.address);
  console.log(' Balance: ', ethers.formatEther(balance), 'ETH');
  console.log('--------------------------------------------------');

  // 1. Deploy mock underlying ERC-20 (stand-in for USDC).
  const MockERC20 = await ethers.getContractFactory('MockERC20');
  const mockUSDC = await MockERC20.deploy();
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log(' ✅ MockERC20 (mUSDC) deployed:', mockUSDCAddress);

  // 2. Deploy the GhostPay confidential wrapper.
  const GhostPay = await ethers.getContractFactory('GhostPay');
  const ghostPay = await GhostPay.deploy(
    mockUSDCAddress,
    'Ghost Confidential USDC',
    'cUSDC',
    'https://ghostpay.xyz/metadata.json',
  );
  await ghostPay.waitForDeployment();
  const ghostPayAddress = await ghostPay.getAddress();
  console.log(' ✅ GhostPay (cUSDC) deployed: ', ghostPayAddress);

  // 3. Persist deployment info next to the script for easy frontend pickup.
  const deployment = {
    network: network.name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    mockERC20: mockUSDCAddress,
    ghostPay: ghostPayAddress,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
  };
  const outPath = join(__dirname, '..', 'deployments.json');
  writeFileSync(outPath, JSON.stringify(deployment, null, 2));
  console.log(' 📝 Wrote deployments.json');

  console.log('--------------------------------------------------');
  console.log(' NEXT STEPS — copy into frontend/.env :');
  console.log('--------------------------------------------------');
  console.log(`VITE_GHOST_PAY_ADDRESS=${ghostPayAddress}`);
  console.log(`VITE_MOCK_ERC20_ADDRESS=${mockUSDCAddress}`);
  console.log(`VITE_CHAIN_ID=${deployment.chainId}`);
  console.log('--------------------------------------------------');
  console.log(' Then run `npm run dev` from the frontend directory.');
  console.log('--------------------------------------------------');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
