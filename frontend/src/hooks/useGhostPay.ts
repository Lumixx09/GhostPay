import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

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

export function useGhostPay() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [isPending, setIsPending] = useState(false);

  const GHOST_PAY_ADDRESS = import.meta.env.VITE_GHOST_PAY_ADDRESS;

  const connect = async () => {
    if (window.ethereum) {
      try {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _account = await _signer.getAddress();
        
        setProvider(_provider);
        setSigner(_signer);
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
      await fetchBalance();
    } catch (error) {
      console.error("Distribution error:", error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (account) fetchBalance();
  }, [account, fetchBalance]);

  return { 
    account, 
    balance, 
    connect, 
    isConnected: !!account,
    isPending,
    distributePayroll,
    refreshBalance: fetchBalance
  };
}

