import { expect } from 'chai';
import pkg from 'hardhat';

const { ethers } = pkg;

describe('GhostPay', function () {
  async function deployGhostPayFixture() {
    const [owner, employee1, employee2] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory('MockERC20');
    const mockUSDC = await MockERC20.deploy();
    await mockUSDC.waitForDeployment();

    const GhostPay = await ethers.getContractFactory('GhostPay');
    const ghostPay = await GhostPay.deploy(
      await mockUSDC.getAddress(),
      'Ghost USDC',
      'gUSDC',
      'https://ghostpay.xyz/metadata.json',
    );
    await ghostPay.waitForDeployment();

    return { ghostPay, mockUSDC, owner, employee1, employee2 };
  }

  describe('Deployment', function () {
    it('Should set the right underlying asset', async function () {
      const { ghostPay, mockUSDC } = await deployGhostPayFixture();
      expect(await ghostPay.underlying()).to.equal(await mockUSDC.getAddress());
    });

    it('Should have correctly set token metadata', async function () {
      const { ghostPay } = await deployGhostPayFixture();
      expect(await ghostPay.name()).to.equal('Ghost USDC');
      expect(await ghostPay.symbol()).to.equal('gUSDC');
    });

    it('Should set the correct owner', async function () {
      const { ghostPay, owner } = await deployGhostPayFixture();
      expect(await ghostPay.owner()).to.equal(owner.address);
    });
  });

  describe('Access control', function () {
    it('Should revert distributeConfidentialPayroll when caller is not the owner', async function () {
      const { ghostPay, employee1 } = await deployGhostPayFixture();

      // Build placeholder calldata; we only care that the access-control check
      // fires before any Nox-related processing happens.
      const fakeHandle = '0x' + '11'.repeat(32);
      const fakeProof = '0x' + '00'.repeat(65);

      await expect(
        ghostPay
          .connect(employee1)
          .distributeConfidentialPayroll(
            [employee1.address],
            [fakeHandle],
            fakeProof,
          ),
      ).to.be.revertedWithCustomError(ghostPay, 'OwnableUnauthorizedAccount');
    });

    it('Should revert distributeConfidentialPayroll when employees array is empty', async function () {
      const { ghostPay } = await deployGhostPayFixture();
      const fakeProof = '0x' + '00'.repeat(65);

      await expect(
        ghostPay.distributeConfidentialPayroll([], [], fakeProof),
      ).to.be.revertedWithCustomError(ghostPay, 'EmptyPayroll');
    });

    it('Should revert when employees and amounts arrays have different lengths', async function () {
      const { ghostPay, employee1, employee2 } = await deployGhostPayFixture();
      const fakeHandle = '0x' + '11'.repeat(32);
      const fakeProof = '0x' + '00'.repeat(65);

      await expect(
        ghostPay.distributeConfidentialPayroll(
          [employee1.address, employee2.address],
          [fakeHandle],
          fakeProof,
        ),
      ).to.be.revertedWithCustomError(ghostPay, 'LengthMismatch');
    });
  });

  // NOTE: True end-to-end tests of `distributeConfidentialPayroll` and
  // `reclaimToUnderlying` require a Nox handle gateway (TEE), which is not
  // available in a local Hardhat node. Those flows are exercised against
  // Arbitrum Sepolia by the frontend integration tests / the demo video.
});
