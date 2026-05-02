import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import chains, { type ChainConfig, getChainById, getDefaultChain } from '../config/chains';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const GhostPayABI = [
  "event PayrollDistributed(address indexed employer, uint256 employeeCount, uint256 totalAmount)",
  "event SalaryClaimRequested(address indexed employee, uint256 unwrapRequestId)",
  "function underlying() view returns (address)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint256)",
  "function wrap(address, uint256) returns (bytes32)",
  "function confidentialBalances(address) view returns (uint256)",
  "function distributeConfidentialPayroll(address[], bytes32[], bytes)",
  "function reclaimToUnderlying(bytes32, bytes) returns (bytes32)",
  "function finalizeUnwrap(uint256)"
];

export interface Transaction {
  type: 'payroll' | 'claim';
  address: string;
  amount?: string;
  count?: number;
  timestamp: string;
  hash: string;
  chain?: string;
}

export function useGhostPay() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [wrappedBalance, setWrappedBalance] = useState("0.00");
  const [isPending, setIsPending] = useState(false);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);
  const [activeChain, setActiveChain] = useState<ChainConfig>(getDefaultChain());
  const [walletProvider, setWalletProvider] = useState<any>(null);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const parseError = (error: any): string => {
    const errorStr = String(error?.message || error).toLowerCase();
    if (errorStr.includes("json-rpc") || errorStr.includes("coalesce")) {
      return "Network sync issue. Please reset MetaMask activity (Settings → Advanced → Clear activity tab data) and refresh.";
    }
    if (errorStr.includes("user rejected")) {
      return "Transaction cancelled.";
    }
    if (errorStr.includes("insufficient funds")) {
      return `Insufficient ETH for gas on ${activeChain.name}.`;
    }
    if (errorStr.includes("allowance") || errorStr.includes("transfer amount exceeds")) {
      return "Token allowance too low. Please approve more tokens first.";
    }
    return "Transaction failed. Please refresh and try again.";
  };

  // Switch the wallet to a different chain
  const switchChain = useCallback(async (chain: ChainConfig) => {
    if (chain.type === 'evm') {
      if (!walletProvider) return;
      const chainHex = `0x${Number(chain.id).toString(16)}`;
      try {
        await walletProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainHex }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await walletProvider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainHex,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: [chain.rpcUrl],
              blockExplorerUrls: [chain.explorerUrl],
            }],
          });
        } else {
          throw switchError;
        }
      }

      const _provider = new ethers.BrowserProvider(walletProvider);
      const _signer = await _provider.getSigner();
      setProvider(_provider);
      if (chain.ghostPayAddress) {
        setContract(new ethers.Contract(chain.ghostPayAddress, GhostPayABI, _signer));
      } else {
        setContract(null);
      }
    } else {
      // Solana or other non-EVM
      setProvider(null);
      setContract(null);
      setBalance("0.00");
      setWrappedBalance("0.00");
    }

    setActiveChain(chain);
  }, [walletProvider]);

  const fetchHistory = useCallback(async () => {
    if (!contract || !provider) return;
    try {
      const latestBlock = await provider.getBlockNumber();
      const fromBlock = latestBlock - 10000 > 0 ? latestBlock - 10000 : 0;

      const payrollFilter = contract.filters.PayrollDistributed();
      const claimFilter = contract.filters.SalaryClaimRequested();

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
            amount: ethers.formatUnits((ev as any).args[2], 18),
            timestamp: block ? new Date(block.timestamp * 1000).toLocaleString() : 'Recent',
            hash: ev.transactionHash,
            chain: activeChain.shortName,
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
            chain: activeChain.shortName,
            blockNumber: ev.blockNumber
          };
        })
      ]);

      setHistory(formattedHistory.sort((a, b) => (b as any).blockNumber - (a as any).blockNumber));
    } catch (error) {
      console.error("History fetch error:", error);
    }
  }, [contract, provider, activeChain]);

  const connectWithProvider = async (rawProvider: any) => {
    try {
      await rawProvider.request({ method: 'eth_requestAccounts' });
      const accounts: string[] = await rawProvider.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) throw new Error('No accounts returned');

      const _account = accounts[0];
      const _provider = new ethers.BrowserProvider(rawProvider);
      const _signer = await _provider.getSigner();

      // Detect which chain the wallet is currently on
      const networkData = await _provider.getNetwork();
      const detectedChain = getChainById(Number(networkData.chainId)) || getDefaultChain();

      setProvider(_provider);
      setAccount(_account);
      setAvailableAccounts(accounts);
      setActiveChain(detectedChain);
      setWalletProvider(rawProvider);

      if (detectedChain.ghostPayAddress) {
        const _contract = new ethers.Contract(detectedChain.ghostPayAddress, GhostPayABI, _signer);
        setContract(_contract);
      }

      // Listen for chain changes
      rawProvider.on('chainChanged', async (chainIdHex: string) => {
        const newChainId = parseInt(chainIdHex, 16);
        const newChain = getChainById(newChainId) || getDefaultChain();
        setActiveChain(newChain);
        const newProvider = new ethers.BrowserProvider(rawProvider);
        const newSigner = await newProvider.getSigner();
        setProvider(newProvider);
        if (newChain.ghostPayAddress) {
          setContract(new ethers.Contract(newChain.ghostPayAddress, GhostPayABI, newSigner));
        } else {
          setContract(null);
        }
      });

      return _account;
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  };

  const connect = async () => {};

  const connectWithAccount = async (selectedAccount: string) => {
    if (!window.ethereum) return;
    try {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const _signer = await _provider.getSigner(selectedAccount);
      setProvider(_provider);
      setAccount(selectedAccount);
      setAvailableAccounts([]);
      if (activeChain.ghostPayAddress) {
        const _contract = new ethers.Contract(activeChain.ghostPayAddress, GhostPayABI, _signer);
        setContract(_contract);
      }
    } catch (error) {
      console.error('Connect with account error:', error);
    }
  };

  const requestAccountSwitch = async () => {};

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setContract(null);
    setBalance("0.00");
    setHistory([]);
    setWalletProvider(null);
  };

  const refreshBalance = useCallback(async () => {
    if (contract && account && provider) {
      try {
        const underlyingAddr = await contract.underlying();
        const underlyingContract = new ethers.Contract(
          underlyingAddr,
          ["function balanceOf(address) view returns (uint256)"],
          provider
        );
        const bal = await underlyingContract.balanceOf(account);
        setBalance(ethers.formatUnits(bal, 18));
        const wrappedBal = await contract.confidentialBalances(account);
        setWrappedBalance(ethers.formatUnits(wrappedBal, 18));
      } catch (error) {
        console.error("Balance fetch error:", error);
        setBalance("0.00");
        setWrappedBalance("0.00");
      }
    }
  }, [contract, account, provider]);

  const distributePayroll = async (employees: string[], amounts: string[]) => {
    if (!contract) return;
    const totalAmount = amounts.reduce((acc, val) => acc + parseFloat(val), 0);
    const totalParsed = amounts.reduce((acc, val) => acc + ethers.parseUnits(val, 18), 0n);
    const wrappedParsed = ethers.parseUnits(wrappedBalance, 18);

    if (totalParsed > wrappedParsed) {
      setIsPending(false);
      throw new Error(`Insufficient cUSDC: Total payout is ${totalAmount} cUSDC but you only have ${wrappedBalance} cUSDC. Please wrap more tokens first.`);
    }

    setIsPending(true);
    try {
      const dummyHandles = amounts.map((amt) => ethers.zeroPadValue(ethers.toBeHex(ethers.parseUnits(amt, 18)), 32));
      const dummyProof = ethers.randomBytes(65);
      const tx = await contract.distributeConfidentialPayroll(employees, dummyHandles, dummyProof, { gasLimit: 1000000 });
      await tx.wait();
      await sleep(2000);
      await Promise.all([refreshBalance(), fetchHistory()]);
    } catch (error) {
      console.error("Distribution error:", error);
      throw new Error(parseError(error));
    } finally {
      setIsPending(false);
    }
  };

  const reclaimFunds = async (amount: string) => {
    if (!contract) return;
    setIsPending(true);
    try {
      const handle = ethers.zeroPadValue(ethers.toBeHex(ethers.parseUnits(amount, 18)), 32);
      const dummyProof = ethers.randomBytes(65);
      const tx = await contract.reclaimToUnderlying(handle, dummyProof, { gasLimit: 1000000 });
      await tx.wait();
      await sleep(2000);
      await Promise.all([refreshBalance(), fetchHistory()]);
    } catch (error) {
      console.error("Reclaim error:", error);
      throw new Error(parseError(error));
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
    activeChain,
    availableChains: chains,
    connect,
    connectWithProvider,
    connectWithAccount,
    requestAccountSwitch,
    disconnect,
    switchChain,
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
        return false;
      }
    },
    wrapFunds: async (amount: string) => {
      if (!contract || !provider) return;
      setIsPending(true);
      try {
        const parsedAmount = ethers.parseUnits(amount, 18);
        
        // 1. Check Allowance & Approve
        const underlyingAddr = await contract.underlying();
        const underlyingContract = new ethers.Contract(
          underlyingAddr,
          ["function allowance(address, address) view returns (uint256)", "function approve(address, uint256) returns (bool)"],
          await provider.getSigner()
        );

        const currentAllowance = await underlyingContract.allowance(account, await contract.getAddress());
        if (currentAllowance < parsedAmount) {
          const approveTx = await underlyingContract.approve(await contract.getAddress(), ethers.MaxUint256);
          await approveTx.wait();
        }

        // 2. Wrap
        const wrapTx = await contract.wrap(account, parsedAmount, { gasLimit: 1000000 });
        await wrapTx.wait();
        await sleep(2000);
        await refreshBalance();
      } catch (error) {
        console.error("Wrap error:", error);
        throw new Error(parseError(error));
      } finally {
        setIsPending(false);
      }
    },
    mintTokens: async () => {
      if (!account || !provider) return;
      setIsPending(true);
      try {
        const underlyingAddr = await contract?.underlying();
        const underlyingContract = new ethers.Contract(
          underlyingAddr,
          ["function mint(address, uint256)"],
          await provider.getSigner()
        );
        const tx = await underlyingContract.mint(account, ethers.parseUnits("10000", 18), { gasLimit: 200000 });
        await tx.wait();
        await sleep(2000);
        await refreshBalance();
      } catch (error) {
        console.error("Mint error:", error);
        throw new Error(parseError(error));
      } finally {
        setIsPending(false);
      }
    }
  };
}
