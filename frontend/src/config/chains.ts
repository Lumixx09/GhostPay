/**
 * GhostPay Omnichain — EVM Chain Registry
 * Add new EVM chains here. The same GhostPay.sol ABI works on every chain.
 */

export interface ChainConfig {
  id: number | string; // EVM Chain ID or 'solana'
  name: string;
  shortName: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  ghostPayAddress: string;
  mockERC20Address: string;
  isTestnet: boolean;
  color: string;
  type: 'evm' | 'solana';
}

const chains: ChainConfig[] = [
  {
    id: 421614,
    name: 'Arbitrum Sepolia',
    shortName: 'ARB-SEP',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    explorerUrl: 'https://sepolia.arbiscan.io',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    ghostPayAddress: import.meta.env.VITE_GHOST_PAY_ADDRESS || '',
    mockERC20Address: import.meta.env.VITE_MOCK_ERC20_ADDRESS || '',
    isTestnet: true,
    color: '#12aaff',
    type: 'evm',
  },
  {
    id: 42161,
    name: 'Arbitrum One',
    shortName: 'ARB',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    ghostPayAddress: import.meta.env.VITE_GHOST_PAY_ADDRESS_ARB_ONE || '',
    mockERC20Address: import.meta.env.VITE_USDC_ADDRESS_ARB_ONE || '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    isTestnet: false,
    color: '#12aaff',
    type: 'evm',
  },
  {
    id: 1,
    name: 'Ethereum Mainnet',
    shortName: 'ETH',
    rpcUrl: `https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_KEY || ''}`,
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    ghostPayAddress: import.meta.env.VITE_GHOST_PAY_ADDRESS_ETH || '',
    mockERC20Address: import.meta.env.VITE_USDC_ADDRESS_ETH || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    isTestnet: false,
    color: '#627EEA',
    type: 'evm',
  },
  {
    id: 11155111,
    name: 'Ethereum Sepolia',
    shortName: 'ETH-SEP',
    rpcUrl: 'https://rpc.sepolia.org',
    explorerUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    ghostPayAddress: import.meta.env.VITE_GHOST_PAY_ADDRESS_ETH_SEP || '',
    mockERC20Address: import.meta.env.VITE_MOCK_ERC20_ADDRESS_ETH_SEP || '',
    isTestnet: true,
    color: '#627EEA',
    type: 'evm',
  },
  {
    id: 'solana-mainnet',
    name: 'Solana Mainnet',
    shortName: 'SOL',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://explorer.solana.com',
    nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
    ghostPayAddress: 'GhostPay111111111111111111111111111111111', // Placeholder
    mockERC20Address: 'EPjFW3F2ox2Df3it79qB7Su4tG8uvc7vPiBN86L9VG8C', // USDC
    isTestnet: false,
    color: '#14F195',
    type: 'solana',
  },
  {
    id: 'solana-devnet',
    name: 'Solana Devnet',
    shortName: 'SOL-DEV',
    rpcUrl: 'https://api.devnet.solana.com',
    explorerUrl: 'https://explorer.solana.com/?cluster=devnet',
    nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 9 },
    ghostPayAddress: 'GhostPay111111111111111111111111111111111',
    mockERC20Address: 'Gh9ZwE9pk6f7owC1u9qJ9yXGQS2jiddXiw2AJ6si7YVw', // Devnet USDC
    isTestnet: true,
    color: '#14F195',
    type: 'solana',
  },
];

export const getChainById = (id: number | string): ChainConfig | undefined =>
  chains.find((c) => c.id === id);

export const getDefaultChain = (): ChainConfig => chains[0]; // Arbitrum Sepolia by default

export default chains;
