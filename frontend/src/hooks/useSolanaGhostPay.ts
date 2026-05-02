/**
 * GhostPay Solana Engine
 * Handles Phantom wallet connection, SPL-USDC balance reading,
 * and confidential payroll dispatch on Solana Devnet / Mainnet-Beta.
 */

import { useState, useCallback, useEffect } from 'react';
import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  SystemProgram,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';

// ─── USDC Mint Addresses ───────────────────────────────────────────────────
const USDC_MINT_MAINNET = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
const USDC_MINT_DEVNET  = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // Circle devnet USDC

export type SolanaNetwork = 'devnet' | 'mainnet-beta';

export interface SolanaTransaction {
  type: 'sol-payroll' | 'sol-transfer';
  signature: string;
  amount: string;
  recipients: number;
  timestamp: string;
  chain: 'SOL';
}

/** Detect if an address is a Solana Base58 public key (not 0x…) */
export function isSolanaAddress(addr: string): boolean {
  return !addr.startsWith('0x') && addr.length >= 32 && addr.length <= 44;
}

export function useSolanaGhostPay() {
  const [phantomProvider, setPhantomProvider] = useState<any>(null);
  const [solanaAccount, setSolanaAccount] = useState<string | null>(null);
  const [solanaBalance, setSolanaBalance] = useState<string>('0.00'); // SOL balance
  const [usdcBalance, setUsdcBalance] = useState<string>('0.00');     // USDC balance
  const [network, setNetwork] = useState<SolanaNetwork>('devnet');
  const [isPending, setIsPending] = useState(false);
  const [history, setHistory] = useState<SolanaTransaction[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const getConnection = useCallback(
    () => new Connection(clusterApiUrl(network), 'confirmed'),
    [network]
  );

  const getUsdcMint = useCallback(
    () => (network === 'mainnet-beta' ? USDC_MINT_MAINNET : USDC_MINT_DEVNET),
    [network]
  );

  // ─── Detect Phantom on mount ─────────────────────────────────────────────
  useEffect(() => {
    const phantom = (window as any)?.phantom?.solana;
    if (phantom?.isPhantom) {
      setPhantomProvider(phantom);
      // Auto-reconnect if previously connected
      if (phantom.isConnected && phantom.publicKey) {
        setSolanaAccount(phantom.publicKey.toString());
        setIsConnected(true);
      }
    }
  }, []);

  // ─── Refresh balances whenever account or network changes ─────────────────
  const refreshSolanaBalance = useCallback(async () => {
    if (!solanaAccount) return;
    const connection = getConnection();
    const pubkey = new PublicKey(solanaAccount);

    try {
      // SOL balance
      const lamports = await connection.getBalance(pubkey);
      setSolanaBalance((lamports / LAMPORTS_PER_SOL).toFixed(4));

      // USDC balance
      const usdcMint = getUsdcMint();
      const ata = await getAssociatedTokenAddress(usdcMint, pubkey);
      try {
        const tokenAccount = await getAccount(connection, ata);
        setUsdcBalance((Number(tokenAccount.amount) / 1e6).toFixed(2));
      } catch {
        setUsdcBalance('0.00'); // ATA doesn't exist yet — user has 0 USDC
      }
    } catch (err) {
      console.error('Solana balance fetch error:', err);
    }
  }, [solanaAccount, getConnection, getUsdcMint]);

  useEffect(() => {
    if (solanaAccount) refreshSolanaBalance();
  }, [solanaAccount, refreshSolanaBalance]);

  // ─── Connect Phantom ──────────────────────────────────────────────────────
  const connectPhantom = async (): Promise<string | null> => {
    const phantom = (window as any)?.phantom?.solana;
    if (!phantom?.isPhantom) {
      window.open('https://phantom.app/', '_blank');
      return null;
    }
    try {
      const resp = await phantom.connect();
      const address = resp.publicKey.toString();
      setPhantomProvider(phantom);
      setSolanaAccount(address);
      setIsConnected(true);
      return address;
    } catch (err) {
      console.error('Phantom connect error:', err);
      return null;
    }
  };

  const disconnectPhantom = async () => {
    if (phantomProvider) await phantomProvider.disconnect();
    setSolanaAccount(null);
    setIsConnected(false);
    setSolanaBalance('0.00');
    setUsdcBalance('0.00');
  };

  // ─── Switch Network ────────────────────────────────────────────────────────
  const switchSolanaNetwork = (net: SolanaNetwork) => {
    setNetwork(net);
  };

  // ─── Confidential Payroll Dispatch (USDC SPL) ─────────────────────────────
  /**
   * Distributes USDC to multiple Solana addresses in one batched transaction.
   * USDC has 6 decimals on Solana.
   * @param recipients - Array of { address: string; amount: string } (USDC, human-readable)
   */
  const dispatchSolanaPayroll = async (
    recipients: { address: string; amount: string }[]
  ): Promise<string> => {
    if (!phantomProvider || !solanaAccount) throw new Error('Phantom not connected');
    setIsPending(true);

    const connection = getConnection();
    const payerPubkey = new PublicKey(solanaAccount);
    const usdcMint = getUsdcMint();
    const payerAta = await getAssociatedTokenAddress(usdcMint, payerPubkey);

    try {
      const tx = new Transaction();
      let totalAmount = 0;

      for (const r of recipients) {
        const recipientPubkey = new PublicKey(r.address);
        const recipientAta = await getAssociatedTokenAddress(usdcMint, recipientPubkey);
        const usdcAmount = Math.round(parseFloat(r.amount) * 1e6); // Convert to micro-USDC
        totalAmount += parseFloat(r.amount);

        // Create ATA if it doesn't exist
        try {
          await getAccount(connection, recipientAta);
        } catch {
          tx.add(
            createAssociatedTokenAccountInstruction(
              payerPubkey,
              recipientAta,
              recipientPubkey,
              usdcMint,
              TOKEN_PROGRAM_ID,
              ASSOCIATED_TOKEN_PROGRAM_ID
            )
          );
        }

        // Add transfer instruction
        tx.add(
          createTransferInstruction(
            payerAta,
            recipientAta,
            payerPubkey,
            usdcAmount
          )
        );
      }

      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = payerPubkey;

      // Phantom signs and sends
      const signed = await phantomProvider.signAndSendTransaction(tx);
      const signature = signed.signature;

      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      // Log to history
      const entry: SolanaTransaction = {
        type: 'sol-payroll',
        signature,
        amount: totalAmount.toFixed(2),
        recipients: recipients.length,
        timestamp: new Date().toLocaleString(),
        chain: 'SOL',
      };
      setHistory(prev => [entry, ...prev]);

      await refreshSolanaBalance();
      return signature;
    } catch (err) {
      console.error('Solana payroll error:', err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  // ─── Simple SOL transfer (for gas / test purposes) ────────────────────────
  const sendSol = async (to: string, amountSol: number): Promise<string> => {
    if (!phantomProvider || !solanaAccount) throw new Error('Phantom not connected');
    setIsPending(true);
    const connection = getConnection();
    const payerPubkey = new PublicKey(solanaAccount);
    const toPubkey = new PublicKey(to);

    try {
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: payerPubkey,
          toPubkey,
          lamports: Math.round(amountSol * LAMPORTS_PER_SOL),
        })
      );
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = payerPubkey;

      const signed = await phantomProvider.signAndSendTransaction(tx);
      await connection.confirmTransaction(signed.signature, 'confirmed');
      await refreshSolanaBalance();
      return signed.signature;
    } catch (err) {
      console.error('SOL transfer error:', err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const hasPhantom = !!(window as any)?.phantom?.solana?.isPhantom;

  return {
    solanaAccount,
    solanaBalance,
    usdcBalance,
    network,
    isPending,
    isConnected,
    history,
    hasPhantom,
    connectPhantom,
    disconnectPhantom,
    switchSolanaNetwork,
    dispatchSolanaPayroll,
    sendSol,
    refreshSolanaBalance,
    isSolanaAddress,
  };
}
