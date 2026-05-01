import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';

dotenv.config();

// const privateKey = process.env.PRIVATE_KEY;
// const accounts =
//   privateKey && privateKey.startsWith('0x') && privateKey.length === 66
//     ? [privateKey]
//     : [];
const privateKey = process.env.PRIVATE_KEY;

if (!privateKey || !privateKey.startsWith('0x') || privateKey.length !== 66) {
  throw new Error(
    `Invalid or missing PRIVATE_KEY in .env.\n` +
      `Expected format: 0x followed by 64 hex characters (66 chars total).\n` +
      `Got: "${privateKey?.slice(0, 6) ?? 'undefined'}..." (length: ${
        privateKey?.length ?? 0
      })`,
  );
}

const accounts = [privateKey];

const arbiscanApiKey = process.env.ARBISCAN_API_KEY ?? '';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.28',
    settings: {
      // Arbitrum still uses Paris-era opcodes for predictable gas costs.
      evmVersion: 'paris',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    'arbitrum-sepolia': {
      url:
        process.env.ARBITRUM_SEPOLIA_RPC ||
        'https://sepolia-rollup.arbitrum.io/rpc',
      chainId: 421614,
      accounts,
    },
  },
  etherscan: {
    // `hardhat verify` will pick the right API for this network using
    // the customChains entry below.
    apiKey: {
      arbitrumSepolia: arbiscanApiKey,
    },
    customChains: [
      {
        network: 'arbitrumSepolia',
        chainId: 421614,
        urls: {
          apiURL: 'https://api-sepolia.arbiscan.io/api',
          browserURL: 'https://sepolia.arbiscan.io',
        },
      },
    ],
  },
};

export default config;
