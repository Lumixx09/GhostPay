import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const GhostPayABI = [
  "event PayrollDistributed(address indexed employer, uint256 employeeCount)",
  "event SalaryClaimed(address indexed employee, uint256 amount)",
  "function underlying() view returns (address)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint256)",
  "function wrap(address, uint256)",
  "function unwrap(address, uint256)",
  "function distributeConfidentialPayroll(address[], uint256[])",
  "function reclaimToUnderlying(uint256)"
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
  const [balance, setBalance] = useState<string>("0");
  const [isPending, setIsPending] = useState(false);
  const [history, setHistory] = useState<Transaction[]>([]);

  const GHOST_PAY_ADDRESS = import.meta.env.VITE_GHOST_PAY_ADDRESS;

  const fetchHistory = useCallback(async () => {
    if (!contract || !provider) return;
    
    try {
      // Query events from the last 10,000 blocks for performance
      const latestBlock = await provider.getBlockNumber();
      const fromBlock = latestBlock - 10000 > 0 ? latestBlock - 10000 : 0;

      const payrollFilter = contract.filters.PayrollDistributed();
      const claimFilter = contract.filters.SalaryClaimed();

      const [payrollEvents, claimEvents] = await Promise.all([
        contract.queryFilter(payrollFilter, fromBlock),
        contract.queryFilter(claimFilter, fromBlock)
      ]);

      const formattedHistory: Transaction[] = await Promise.all([
        ...payrollEvents.map(async (ev) => {
          const block = await provider.getBlock(ev.blockNumber);
          return {
            type: 'payroll' as const,
            address: (ev as any).args[0],
            count: Number((ev as any).args[1]),
            timestamp: block ? new Date(block.timestamp * 1000).toLocaleString() : 'Recent',
            hash: ev.transactionHash,
            blockNumber: ev.blockNumber
          };
        }),
        ...claimEvents.map(async (ev) => {
          const block = await provider.getBlock(ev.blockNumber);
          return {
            type: 'claim' as const,
            address: (ev as any).args[0],
            amount: ethers.formatUnits((ev as any).args[1], 18),
            timestamp: block ? new Date(block.timestamp * 1000).toLocaleString() : 'Recent',
            hash: ev.transactionHash,
            blockNumber: ev.blockNumber
          };
        })
      ]);

      setHistory(formattedHistory.sort((a, b) => (b as any).blockNumber - (a as any).blockNumber));
    } catch (error) {
      console.error("History fetch error:", error);
    }
  }, [contract, provider]);

  const connect = async () => {
    if (window.ethereum) {
      try {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _account = await _signer.getAddress();
        
        setProvider(_provider);
        setAccount(_account);

        if (GHOST_PAY_ADDRESS) {
          const _contract = new ethers.Contract(GHOST_PAY_ADDRESS, GhostPayABI, _signer);
          setContract(_contract);
        }
        
        return _account;
      } catch (error) {
        console.error("Connection error:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fetchBalance = useCallback(async () => {
    if (contract && account) {
      try {
        const bal = await contract.balanceOf(account);
        setBalance(ethers.formatUnits(bal, 18));
      } catch (error) {
        console.error("Balance fetch error:", error);
        setBalance("0.00");
      }
    }
  }, [contract, account]);

  const distributePayroll = async (employees: string[], amounts: string[]) => {
    if (!contract) return;
    setIsPending(true);
    try {
      const tx = await contract.distributeConfidentialPayroll(
        employees, 
        amounts.map(a => ethers.parseUnits(a, 18))
      );
      await tx.wait();
      await Promise.all([fetchBalance(), fetchHistory()]);
    } catch (error) {
      console.error("Distribution error:", error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const reclaimFunds = async (amount: string) => {
    if (!contract) return;
    setIsPending(true);
    try {
      // In Nox, reclaiming usually involves unwrapping the confidential token
      const tx = await contract.reclaimToUnderlying(ethers.parseUnits(amount, 18));
      await tx.wait();
      await Promise.all([fetchBalance(), fetchHistory()]);
    } catch (error) {
      console.error("Reclaim error:", error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (account) {
      fetchBalance();
      fetchHistory();
    }
  }, [account, fetchBalance, fetchHistory]);

  return { 
    account, 
    balance, 
    history,
    connect, 
    isConnected: !!account,
    isPending,
    distributePayroll,
    reclaimFunds,
    refreshBalance: fetchBalance
  };
}


