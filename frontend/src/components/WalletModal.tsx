import { useState, useEffect } from 'react';
import { X } from '@phosphor-icons/react';

// EIP-6963: Modern multi-wallet provider detection
interface EIP6963ProviderInfo {
  rdns: string;
  uuid: string;
  name: string;
  icon: string;
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: any;
}

interface WalletModalProps {
  onConnect: (provider: any, walletName: string) => Promise<void>;
  onSolanaConnect?: () => Promise<string | null>;
  onClose: () => void;
}

export default function WalletModal({ onConnect, onSolanaConnect, onClose }: WalletModalProps) {
  const [detectedWallets, setDetectedWallets] = useState<EIP6963ProviderDetail[]>([]);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const hasPhantomSolana = !!(window as any)?.phantom?.solana?.isPhantom;

  useEffect(() => {
    const providers: EIP6963ProviderDetail[] = [];

    // EIP-6963: Listen for wallet announcements
    const handleAnnounce = (event: any) => {
      const detail = event.detail as EIP6963ProviderDetail;
      // Avoid duplicates
      if (!providers.find(p => p.info.uuid === detail.info.uuid)) {
        providers.push(detail);
        setDetectedWallets([...providers]);
      }
    };

    window.addEventListener('eip6963:announceProvider', handleAnnounce);
    // Request all wallets to announce themselves
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    // Fallback: Legacy wallet detection for wallets that don't support EIP-6963
    setTimeout(() => {
      if (providers.length === 0) {
        const legacyWallets: EIP6963ProviderDetail[] = [];

        // Check for MetaMask specifically
        if (window.ethereum?.isMetaMask && !window.ethereum?.isPhantom) {
          legacyWallets.push({
            info: {
              rdns: 'io.metamask',
              uuid: 'metamask-legacy',
              name: 'MetaMask',
              icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMTggMzE4Ij48cGF0aCBmaWxsPSIjRTI3NjFCIiBkPSJNMjc0LjEgMzUuNUw3NC43IDE4Ny4yIDEwOC43IDk1Ljd6Ii8+PHBhdGggZmlsbD0iI0U0NzYxQiIgZD0iTTQ0LjQgMzUuNUwyNDMuNyAxODguNSAyMDkuNCA5NS43ek0yMzguOSAyMDYuOGwtNTEgMzkuNiA1OS45IDE2LjUgMTcuMi02MC41em0tMTYwLjcgMGwtMjYuMiA2LjUgMTcuMiA2MC41IDU5LjktMTYuNXoiLz48cGF0aCBmaWxsPSIjRTI3NjFCIiBkPSJNMTM0LjEgMTY3LjFsLTE1LjMgMjMuMSA1NC43IDIuNS0xLjktMjUuNnoiLz48cGF0aCBmaWxsPSIjRTI3NjFCIiBkPSJNMTg0LjQgMTY3LjFsLTM3LjktMC41LTEuOSAyNS42IDU0LjctMi41eiIvPjwvc3ZnPg==',
            },
            provider: window.ethereum,
          });
        }

        // Check for Phantom EVM
        if ((window as any).phantom?.ethereum) {
          legacyWallets.push({
            info: {
              rdns: 'app.phantom',
              uuid: 'phantom-legacy',
              name: 'Phantom',
              icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgcng9IjI2IiBmaWxsPSIjNTQyMEZFIi8+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMTAuNCA2NEMxMTAuNCA0MC40IDkxLjMgMjEgNjggMjFIMjUuMkMyMi4xIDIxIDE5LjcgMjMuNCAxOS43IDI2LjVWNjRDMTkuNyA4Ny42IDM4LjggMTA3IDYyLjEgMTA3SDg0LjJDOTkgMTA3IDExMC40IDk2IDExMC40IDgxLjZWNjRaIi8+PC9zdmc+',
            },
            provider: (window as any).phantom.ethereum,
          });
        }

        // Generic fallback
        if (window.ethereum && legacyWallets.length === 0) {
          legacyWallets.push({
            info: {
              rdns: 'generic',
              uuid: 'generic-legacy',
              name: window.ethereum.isPhantom ? 'Phantom' : 'Browser Wallet',
              icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzJkZDRiZiIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyYzAgNS41MiA0LjQ4IDEwIDEwIDEwczEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQyIDAtOC0zLjU4LTgtOHMzLjU4LTggOC04IDggMy41OCA4IDgtMy41OCA4LTggOHoiLz48L3N2Zz4=',
            },
            provider: window.ethereum,
          });
        }

        if (legacyWallets.length > 0) {
          setDetectedWallets(legacyWallets);
        }
      }
    }, 100);

    return () => {
      window.removeEventListener('eip6963:announceProvider', handleAnnounce);
    };
  }, []);

  const handleConnect = async (wallet: EIP6963ProviderDetail) => {
    setIsConnecting(wallet.info.uuid);
    try {
      await onConnect(wallet.provider, wallet.info.name);
      onClose();
    } catch (err) {
      console.error('Wallet connection failed:', err);
    } finally {
      setIsConnecting(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '440px', padding: '2rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div className="modal-title" style={{ margin: 0 }}>Connect Wallet</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: '4px' }}>
            <X size={22} weight="bold" />
          </button>
        </div>
        <div className="modal-subtitle" style={{ marginBottom: '1.5rem' }}>
          Choose a wallet to connect to GhostPay Protocol.
        </div>

        {/* Wallet List */}
        {detectedWallets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ marginBottom: '1rem' }}>No wallets detected.</p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noreferrer"
              className="btn-connect-pro"
              style={{ display: 'inline-flex', textDecoration: 'none' }}
            >
              Install MetaMask
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {detectedWallets.map(wallet => (
              <button
                key={wallet.info.uuid}
                onClick={() => handleConnect(wallet)}
                disabled={isConnecting === wallet.info.uuid}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '16px', padding: '1rem 1.25rem',
                  cursor: 'pointer', color: 'white', textAlign: 'left',
                  transition: 'all 0.2s', width: '100%',
                  opacity: isConnecting && isConnecting !== wallet.info.uuid ? 0.5 : 1,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(45, 212, 191, 0.06)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                }}
              >
                <img
                  src={wallet.info.icon}
                  alt={wallet.info.name}
                  style={{ width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{wallet.info.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {isConnecting === wallet.info.uuid ? 'Connecting...' : 'Click to connect'}
                  </div>
                </div>
                {isConnecting === wallet.info.uuid && (
                  <div style={{ width: '20px', height: '20px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Solana Section */}
        {(hasPhantomSolana || onSolanaConnect) && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '1.25rem 0 0.75rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Solana Network</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
            </div>
            <button
              onClick={async () => {
                if (!onSolanaConnect) return;
                setIsConnecting('phantom-solana');
                try {
                  const addr = await onSolanaConnect();
                  if (addr) onClose();
                } catch (e) {
                  console.error('Solana connect error:', e);
                } finally {
                  setIsConnecting(null);
                }
              }}
              disabled={isConnecting === 'phantom-solana'}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                background: 'rgba(88, 32, 254, 0.08)',
                border: '1px solid rgba(88, 32, 254, 0.3)',
                borderRadius: '16px', padding: '1rem 1.25rem',
                cursor: 'pointer', color: 'white', textAlign: 'left',
                transition: 'all 0.2s', width: '100%',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#5820FE';
                (e.currentTarget as HTMLElement).style.background = 'rgba(88, 32, 254, 0.15)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(88, 32, 254, 0.3)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(88, 32, 254, 0.08)';
              }}
            >
              {/* Phantom SVG icon */}
              <svg width="40" height="40" viewBox="0 0 128 128" style={{ borderRadius: '10px', flexShrink: 0 }}>
                <rect width="128" height="128" rx="26" fill="#5420FE"/>
                <path fill="white" d="M110.4 64C110.4 40.4 91.3 21 68 21H25.2C22.1 21 19.7 23.4 19.7 26.5V64C19.7 87.6 38.8 107 62.1 107H84.2C99 107 110.4 96 110.4 81.6V64Z"/>
                <ellipse cx="50" cy="67" rx="7" ry="9" fill="#5420FE"/>
                <ellipse cx="80" cy="67" rx="7" ry="9" fill="#5420FE"/>
              </svg>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Phantom</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                  {isConnecting === 'phantom-solana' ? 'Connecting to Solana...' : 'Connect Solana wallet'}
                </div>
              </div>
              <span style={{ fontSize: '0.65rem', padding: '3px 8px', background: 'rgba(88,32,254,0.3)', borderRadius: 6, color: '#a78bfa', fontWeight: 700 }}>SOLANA</span>
              {isConnecting === 'phantom-solana' && (
                <div style={{ width: '20px', height: '20px', border: '2px solid #5820FE', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              )}
            </button>
            {!hasPhantomSolana && (
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '6px', textAlign: 'center' }}>
                Phantom not detected. <a href="https://phantom.app/" target="_blank" rel="noreferrer" style={{ color: '#a78bfa' }}>Install Phantom</a> to enable Solana payments.
              </p>
            )}
          </>
        )}

        <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '1.5rem', textAlign: 'center', lineHeight: 1.6 }}>
          By connecting, you agree to GhostPay's terms. Your wallet connection is secured by iExec Nox.
        </p>
      </div>
    </div>
  );
}
