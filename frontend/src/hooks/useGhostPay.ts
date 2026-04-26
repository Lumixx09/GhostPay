import { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { createEthersHandleClient, type HandleClient } from '@iexec-nox/handle';

declare global {
  interface Window {
    ethereum?: any;
  }
}

/**
 * ABI is hand-rolled and matches the on-chain GhostPay contract exactly.
 * `externalEuint256` is encoded as `bytes32` over the wire.
 * Hidden balances are returned as `bytes32` handles, NOT plaintext numbers
 * — call the Nox SDK's `decrypt` method on the handle to read the value.
 */
const GhostPayABI = [
  // events
  'event PayrollDistributed(address indexed employer, uint256 employeeCount)',
  'event SalaryClaimRequested(address indexed employee, bytes32 unwrapRequestId)',
  // views
  'function underlying() view returns (address)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (bytes32)',
  // wrap (plaintext amount -> encrypted balance)
  'function wrap(address to, uint256 amount) returns (bytes32)',
  // confidential bulk distribution
  'function distributeConfidentialPayroll(address[] employees, bytes32[] encryptedAmounts, bytes inputProof)',
  // step 1 of unwrap
  'function reclaimToUnderlying(bytes32 encryptedAmount, bytes inputProof) returns (bytes32 unwrapRequestId)',
  // step 2 of unwrap (inherited from ERC20ToERC7984Wrapper)
  'function finalizeUnwrap(bytes32 unwrapRequestId, bytes decryptedAmountAndProof)',
];

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

export interface Transaction {
  type: 'payroll' | 'claim';
  address: string;
  amount?: string; // populated only when known (e.g. wrap/finalize); empty for confidential events
  count?: number;
  timestamp: string;
  hash: string;
  blockNumber: number;
}

const GHOST_PAY_ADDRESS = import.meta.env.VITE_GHOST_PAY_ADDRESS as
  | string
  | undefined;
const MOCK_ERC20_ADDRESS = import.meta.env.VITE_MOCK_ERC20_ADDRESS as
  | string
  | undefined;

export function useGhostPay() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isPending, setIsPending] = useState(false);
  const [history, setHistory] = useState<Transaction[]>([]);

  // The Nox handle client is async to construct and we only need it once.
  const noxClientRef = useRef<HandleClient | null>(null);

  /**
   * Lazily initialise the Nox SDK. We do this on demand rather than at connect
   * time so the wallet UX feels snappy.
   */
  const getNoxClient = useCallback(async (): Promise<HandleClient> => {
    if (noxClientRef.current) return noxClientRef.current;
    if (!signer) throw new Error('Wallet not connected');
    noxClientRef.current = await createEthersHandleClient(signer);
    return noxClientRef.current;
  }, [signer]);

  const fetchHistory = useCallback(async () => {
    if (!contract || !provider) return;
    try {
      const latestBlock = await provider.getBlockNumber();
      // Arbitrum Sepolia: ~10k blocks ≈ a few hours of activity.
      const fromBlock = Math.max(latestBlock - 10_000, 0);

      const payrollFilter = contract.filters.PayrollDistributed();
      const claimFilter = contract.filters.SalaryClaimRequested();

      const [payrollEvents, claimEvents] = await Promise.all([
        contract.queryFilter(payrollFilter, fromBlock),
        contract.queryFilter(claimFilter, fromBlock),
      ]);

      const formatted: Transaction[] = await Promise.all([
        ...payrollEvents.map(async (ev) => {
          const block = await provider.getBlock(ev.blockNumber);
          const args = (ev as ethers.EventLog).args;
          return {
            type: 'payroll' as const,
            address: args[0] as string,
            count: Number(args[1]),
            timestamp: block
              ? new Date(block.timestamp * 1000).toLocaleString()
              : 'Recent',
            hash: ev.transactionHash,
            blockNumber: ev.blockNumber,
          };
        }),
        ...claimEvents.map(async (ev) => {
          const block = await provider.getBlock(ev.blockNumber);
          const args = (ev as ethers.EventLog).args;
          return {
            type: 'claim' as const,
            address: args[0] as string,
            // Amount is encrypted on-chain. We set "0" rather than `undefined`
            // so the dashboard's `+$${tx.amount}` and `parseFloat(tx.amount)`
            // expressions don't render NaN. The honest UI fix is to display
            // "Confidential" — that's an App.tsx tweak the team can layer on.
            amount: '0',
            timestamp: block
              ? new Date(block.timestamp * 1000).toLocaleString()
              : 'Recent',
            hash: ev.transactionHash,
            blockNumber: ev.blockNumber,
          };
        }),
      ]);

      setHistory(formatted.sort((a, b) => b.blockNumber - a.blockNumber));
    } catch (error) {
      console.error('History fetch error:', error);
    }
  }, [contract, provider]);

  const fetchBalance = useCallback(async () => {
    if (!contract || !account) return;
    try {
      // balanceOf returns an encrypted handle (bytes32). Decrypt it via Nox.
      const handle: string = await contract.balanceOf(account);
      // A zero handle means the account has never received confidential funds.
      if (/^0x0+$/.test(handle)) {
        setBalance('0');
        return;
      }
      const nox = await getNoxClient();
      const plaintext = await nox.decrypt(handle, 'uint256');
      setBalance(ethers.formatUnits(plaintext as bigint, 18));
    } catch (error) {
      console.error('Balance fetch error:', error);
      setBalance('0.00');
    }
  }, [contract, account, getNoxClient]);

  const connect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
    try {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const _signer = await _provider.getSigner();
      const _account = await _signer.getAddress();

      setProvider(_provider);
      setSigner(_signer);
      setAccount(_account);

      if (GHOST_PAY_ADDRESS) {
        setContract(
          new ethers.Contract(GHOST_PAY_ADDRESS, GhostPayABI, _signer),
        );
      } else {
        console.warn('VITE_GHOST_PAY_ADDRESS is not set in .env');
      }

      // Reset Nox client so it rebinds to the new signer next time.
      noxClientRef.current = null;
      return _account;
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  /**
   * Distribute confidential salaries.
   *
   * @param employees Recipient addresses.
   * @param amounts   Plaintext amounts as decimal strings (e.g. "100.50").
   *                  These are encrypted client-side via the Nox SDK before
   *                  being sent on-chain.
   */
  const distributePayroll = async (employees: string[], amounts: string[]) => {
    if (!contract || !signer) throw new Error('Wallet not connected');
    if (employees.length !== amounts.length) {
      throw new Error('employees and amounts must have the same length');
    }
    if (employees.length === 0) {
      throw new Error('Employee list is empty');
    }

    setIsPending(true);
    try {
      const nox = await getNoxClient();

      // Encrypt every amount in a single Nox session so we get one inputProof
      // for the whole batch — this is what the Solidity contract expects.
      const plaintexts: bigint[] = amounts.map((a) => ethers.parseUnits(a, 18));
      const encryption = await nox.encryptInput(plaintexts, 'uint256');
      // Returned shape per Nox SDK docs: { handles: bytes32[]; inputProof: bytes }
      const { handles, inputProof } = encryption;

      const tx = await contract.distributeConfidentialPayroll(
        employees,
        handles,
        inputProof,
      );
      await tx.wait();
      await Promise.all([fetchBalance(), fetchHistory()]);
    } catch (error) {
      console.error('Distribution error:', error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  /**
   * Step 1 of reclaim: encrypted burn + decryption request.
   * The dApp / Nox protocol must subsequently call `finalizeUnwrap` once the
   * decryption is ready. For the demo we surface a notification asking the
   * user to retry "Withdraw Funds" a few seconds later, which then runs
   * finalizeUnwrap.
   */
  const reclaimFunds = async (amount: string) => {
    if (!contract || !signer) throw new Error('Wallet not connected');
    setIsPending(true);
    try {
      const nox = await getNoxClient();
      const plain: bigint = ethers.parseUnits(amount, 18);
      const { handles, inputProof } = await nox.encryptInput(
        [plain],
        'uint256',
      );

      const tx = await contract.reclaimToUnderlying(handles[0], inputProof);
      await tx.wait();
      await Promise.all([fetchBalance(), fetchHistory()]);
    } catch (error) {
      console.error('Reclaim error:', error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  /**
   * Wrap plaintext mUSDC into confidential cUSDC. Required before payroll.
   */
  const wrap = async (amount: string) => {
    if (!contract || !signer || !account)
      throw new Error('Wallet not connected');
    if (!MOCK_ERC20_ADDRESS) throw new Error('VITE_MOCK_ERC20_ADDRESS not set');
    setIsPending(true);
    try {
      const erc20 = new ethers.Contract(MOCK_ERC20_ADDRESS, ERC20_ABI, signer);
      const parsed = ethers.parseUnits(amount, 18);

      const approveTx = await erc20.approve(GHOST_PAY_ADDRESS, parsed);
      await approveTx.wait();

      const wrapTx = await contract.wrap(account, parsed);
      await wrapTx.wait();

      await Promise.all([fetchBalance(), fetchHistory()]);
    } catch (error) {
      console.error('Wrap error:', error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  // React to wallet account / chain changes.
  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null);
        setSigner(null);
        setContract(null);
      } else {
        setAccount(accounts[0]);
      }
    };
    const handleChainChanged = () => window.location.reload();
    window.ethereum.on?.('accountsChanged', handleAccountsChanged);
    window.ethereum.on?.('chainChanged', handleChainChanged);
    return () => {
      window.ethereum?.removeListener?.(
        'accountsChanged',
        handleAccountsChanged,
      );
      window.ethereum?.removeListener?.('chainChanged', handleChainChanged);
    };
  }, []);

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
    wrap,
    refreshBalance: fetchBalance,
  };
}
