import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const GhostPayABI = [
  'event PayrollDistributed(address indexed employer, uint256 employeeCount, uint256 totalAmount)',
  'event SalaryClaimRequested(address indexed employee, uint256 unwrapRequestId)',
  'function underlying() view returns (address)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint256)',
  'function wrap(address, uint256) returns (bytes32)',
  'function demoBalances(address) view returns (uint256)',
  'function distributeConfidentialPayroll(address[], bytes32[], bytes)',
  'function reclaimToUnderlying(bytes32, bytes) returns (bytes32)',
  'function finalizeUnwrap(uint256)',
];

export interface Transaction {
  type: 'payroll' | 'claim';
  address: string;
  amount?: string;
  count?: number;
  timestamp: string;
  hash: string;
}

export function useGhostPay() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [wrappedBalance, setWrappedBalance] = useState('0.00');
  const [isPending, setIsPending] = useState(false);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);

  const GHOST_PAY_ADDRESS = import.meta.env.VITE_GHOST_PAY_ADDRESS;

  const fetchHistory = useCallback(async () => {
    if (!contract || !provider) return;

    try {
      // Query events from the last 10,000 blocks for performance
      const latestBlock = await provider.getBlockNumber();
      const fromBlock = latestBlock - 10000 > 0 ? latestBlock - 10000 : 0;

      const payrollFilter = contract.filters.PayrollDistributed();
      const claimFilter = contract.filters.SalaryClaimRequested();

      const [payrollEvents, claimEvents] = await Promise.all([
        contract.queryFilter(payrollFilter, fromBlock),
        contract.queryFilter(claimFilter, fromBlock),
      ]);

      const formattedHistory: Transaction[] = await Promise.all([
        ...payrollEvents.map(async (ev) => {
          const block = await provider.getBlock(ev.blockNumber);
          return {
            type: 'payroll' as const,
            address: (ev as any).args[0],
            count: Number((ev as any).args[1]),
            amount: ethers.formatUnits((ev as any).args[2], 18),
            timestamp: block
              ? new Date(block.timestamp * 1000).toLocaleString()
              : 'Recent',
            hash: ev.transactionHash,
            blockNumber: ev.blockNumber,
          };
        }),
        ...claimEvents.map(async (ev) => {
          const block = await provider.getBlock(ev.blockNumber);
          return {
            type: 'claim' as const,
            address: (ev as any).args[0],
            amount: ethers.formatUnits((ev as any).args[1], 18),
            timestamp: block
              ? new Date(block.timestamp * 1000).toLocaleString()
              : 'Recent',
            hash: ev.transactionHash,
            blockNumber: ev.blockNumber,
          };
        }),
      ]);

      setHistory(
        formattedHistory.sort(
          (a, b) => (b as any).blockNumber - (a as any).blockNumber,
        ),
      );
    } catch (error) {
      console.error('History fetch error:', error);
    }
  }, [contract, provider]);

  // Connect using any EIP-1193 provider (MetaMask, Phantom, Coinbase, etc.)
  const connectWithProvider = async (walletProvider: any) => {
    try {
      // Request the user to approve accounts from this specific wallet
      await walletProvider.request({ method: 'eth_requestAccounts' });
      const accounts: string[] = await walletProvider.request({
        method: 'eth_accounts',
      });

      if (!accounts || accounts.length === 0)
        throw new Error('No accounts returned');

      const _account = accounts[0];
      const _provider = new ethers.BrowserProvider(walletProvider);
      const _signer = await _provider.getSigner();

      setProvider(_provider);
      setAccount(_account);
      setAvailableAccounts(accounts);

      if (GHOST_PAY_ADDRESS) {
        const _contract = new ethers.Contract(
          GHOST_PAY_ADDRESS,
          GhostPayABI,
          _signer,
        );
        setContract(_contract);
      }

      return _account;
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  };

  // Legacy connect — triggers the WalletModal to open (handled in App.tsx)
  const connect = async () => {
    // App.tsx opens the WalletModal; this is a no-op fallback
  };

  // Connects to a specific account from the available list
  const connectWithAccount = async (selectedAccount: string) => {
    if (!window.ethereum) return;
    try {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const _signer = await _provider.getSigner(selectedAccount);
      setProvider(_provider);
      setAccount(selectedAccount);
      setAvailableAccounts([]);
      if (GHOST_PAY_ADDRESS) {
        const _contract = new ethers.Contract(
          GHOST_PAY_ADDRESS,
          GhostPayABI,
          _signer,
        );
        setContract(_contract);
      }
    } catch (error) {
      console.error('Connect with account error:', error);
    }
  };

  // No-op — kept for type compatibility
  const requestAccountSwitch = async () => {};

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setContract(null);
    setBalance('0.00');
    setHistory([]);
  };

  const refreshBalance = useCallback(async () => {
    if (contract && account && provider) {
      try {
        const underlyingAddr = await contract.underlying();
        const underlyingContract = new ethers.Contract(
          underlyingAddr,
          ['function balanceOf(address) view returns (uint256)'],
          provider,
        );
        const bal = await underlyingContract.balanceOf(account);
        setBalance(ethers.formatUnits(bal, 18));
        const wrappedBal = await contract.demoBalances(account);
        setWrappedBalance(ethers.formatUnits(wrappedBal, 18));
      } catch (error) {
        console.error('Balance fetch error:', error);
        setBalance('0.00');
        setWrappedBalance('0.00');
      }
    }
  }, [contract, account, provider]);

  const distributePayroll = async (employees: string[], amounts: string[]) => {
    if (!contract) return;
    setIsPending(true);
    try {
      // In a real iExec Nox dApp, we would use @iexec-nox/handle to encrypt
      // amounts[i] into a handle. For this demo, we pass the plaintext amount as bytes32.
      const dummyHandles = amounts.map((amt) =>
        ethers.zeroPadValue(ethers.toBeHex(ethers.parseUnits(amt, 18)), 32),
      );
      const dummyProof = ethers.randomBytes(65); // Dummy EIP-712 signature

      const tx = await contract.distributeConfidentialPayroll(
        employees,
        dummyHandles,
        dummyProof,
        { gasLimit: 1000000 },
      );
      await tx.wait();
      await Promise.all([refreshBalance(), fetchHistory()]);
    } catch (error) {
      console.error('Distribution error:', error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const reclaimFunds = async (amount: string) => {
    if (!contract) return;
    setIsPending(true);
    try {
      console.log(`Initiating confidential unwrap for ${amount} tokens...`);
      const handle = ethers.zeroPadValue(
        ethers.toBeHex(ethers.parseUnits(amount, 18)),
        32,
      );
      const dummyProof = ethers.randomBytes(65);

      const tx = await contract.reclaimToUnderlying(handle, dummyProof, {
        gasLimit: 1000000,
      });
      await tx.wait();
      await Promise.all([refreshBalance(), fetchHistory()]);
    } catch (error) {
      console.error('Reclaim error:', error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (account) {
      refreshBalance();
      fetchHistory();
    }
  }, [account, refreshBalance, fetchHistory]);

  return {
    account,
    balance,
    wrappedBalance,
    history,
    availableAccounts,
    connect,
    connectWithProvider,
    connectWithAccount,
    requestAccountSwitch,
    disconnect,
    isConnected: !!account,
    isPending,
    distributePayroll,
    reclaimFunds,
    refreshBalance,
    verifyIdentity: async (message: string) => {
      if (!provider) return false;
      try {
        const signer = await provider.getSigner();
        await signer.signMessage(message);
        return true;
      } catch (e) {
        console.error('Verification failed', e);
        return false;
      }
    },
    wrapFunds: async (amount: string) => {
      if (!contract || !provider) return;
      setIsPending(true);
      try {
        const parsedAmount = ethers.parseUnits(amount, 18);

        const wrapTx = await contract.wrap(account, parsedAmount, {
          gasLimit: 1000000,
        });
        await wrapTx.wait();

        await refreshBalance();
      } catch (error) {
        console.error('Wrap error:', error);
        throw error;
      } finally {
        setIsPending(false);
      }
    },
  };
}
