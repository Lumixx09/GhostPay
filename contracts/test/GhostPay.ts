import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("GhostPay", function () {
  async function deployGhostPayFixture() {
    const [owner, employee1, employee2] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mockUSDC = await MockERC20.deploy();

    const GhostPay = await ethers.getContractFactory("GhostPay");
    const ghostPay = await GhostPay.deploy(
      await mockUSDC.getAddress(),
      "Ghost USDC",
      "gUSDC",
      "https://ghostpay.xyz/metadata.json"
    );

    return { ghostPay, mockUSDC, owner, employee1, employee2 };
  }

  describe("Deployment", function () {
    it("Should set the right underlying asset", async function () {
      const { ghostPay, mockUSDC } = await deployGhostPayFixture();
      expect(await ghostPay.underlying()).to.equal(await mockUSDC.getAddress());
    });

    it("Should have correctly set token metadata", async function () {
      const { ghostPay } = await deployGhostPayFixture();
      expect(await ghostPay.name()).to.equal("Ghost USDC");
      expect(await ghostPay.symbol()).to.equal("gUSDC");
    });

    it("Should set the correct owner", async function () {
      const { ghostPay, owner } = await deployGhostPayFixture();
      expect(await ghostPay.owner()).to.equal(owner.address);
    });
  });
});
