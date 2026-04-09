import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const accounts = (privateKey && privateKey.startsWith("0x") && privateKey.length === 66) ? [privateKey] : [];

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    "arbitrum-sepolia": {
      url: process.env.ARBITRUM_SEPOLIA_RPC || "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: accounts,
    },
  },
};

export default config;
