import { useState, useEffect } from 'react';
import { 
  House, 
  User, 
  Clock, 
  Gear, 
  Wallet,
  ShieldCheck,
  TrendUp,
  PaperPlaneTilt,
  CircleNotch,
  Users,
  EyeSlash,
  Eye,
  Fingerprint,
  Info,
  Cpu,
  Plus,
  CheckCircle
} from "@phosphor-icons/react";
import ChatAssistant from './components/ChatAssistant';
import WalletModal from './components/WalletModal';
import NetworkSelector from './components/NetworkSelector';
import { useGhostPay } from './hooks/useGhostPay';
import { useSolanaGhostPay } from './hooks/useSolanaGhostPay';
import './App.css';

const MiniChart = ({ color = 'var(--primary)', delay = 0 }) => (
  <div style={{ height: '35px', width: '100%', marginTop: '12px', opacity: 0.8 }}>
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      <path 
        d="M0,25 C20,25 30,5 50,15 S80,0 100,20" 
        fill="none" 
        stroke={color} 
        strokeWidth="3"
        strokeLinecap="round"
        className="sparkline-path"
        style={{ animationDelay: `${delay}s` }}
      />
    </svg>
  </div>
);

const LandingPage = ({ connect }: { connect: () => void }) => (
  <div className="landing-container animate-fade-in">
    <nav className="landing-nav">
      <div className="nav-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.5rem', boxShadow: '0 0 20px var(--primary-glow)' }}>N</div>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'white' }}>NOX PROTOCOL</span>
        </div>
        <div className="landing-nav-links">
          <a href="#features">Platform</a>
          <a href="#security">Security</a>
          <a href="https://docs.iex.ec" target="_blank" rel="noreferrer">Documentation</a>
          <button className="btn-connect-pro" onClick={connect}>Launch App</button>
        </div>
      </div>
    </nav>

    <section className="landing-hero-enterprise">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="hero-video-bg"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-background-with-3d-data-visualization-loop-1084-large.mp4" type="video/mp4" />
      </video>
      <div className="hero-video-overlay"></div>
      <div className="hero-ambient-glow"></div>
      
      <div className="hero-text-side">
        <div className="badge-nox">Enterprise Omnichain Infrastructure</div>
        <h1 className="landing-title-pro">
          Confidential Wealth,<br /> Engineered for Scale.
        </h1>
        <p className="landing-subtitle-pro">
          Execute global bulk distributions across Arbitrum, Ethereum, and Solana simultaneously. End-to-end encryption secures your treasury and protects employee privacy.
        </p>
        <div className="hero-actions">
          <button className="launch-btn-giant" onClick={connect}>Launch Protocol</button>
          <a href="https://docs.iex.ec" target="_blank" rel="noreferrer" className="secondary-btn-giant">Read the Docs</a>
        </div>
      </div>
      
      <div className="hero-visual-side">
        <div className="visual-glow"></div>
        <img src="/ghostpay_3d_vault.png" className="floating-asset" alt="Confidential Vault" />
      </div>
    </section>

    <section className="landing-info-extended">
      <div className="info-extended-header">
        <div className="badge-nox">Seamless Integration</div>
        <h2>Scale Your Global Workforce</h2>
        <p>Nox Protocol removes the friction of Web3 payroll management.</p>
      </div>
      <div className="info-extended-grid">
        <div className="info-box">
          <h4>Multi-Chain Native</h4>
          <p>Deploy capital on EVM networks or Solana without switching platforms. Our protocol automatically routes your CSV distributions to the correct execution environment.</p>
        </div>
        <div className="info-box">
          <h4>Institutional Privacy</h4>
          <p>By leveraging TEEs (Trusted Execution Environments), we ensure that your organizational chart, salary data, and treasury outflows remain completely hidden from block explorers.</p>
        </div>
        <div className="info-box">
          <h4>Employee Autonomy</h4>
          <p>Employees receive a dedicated portal to view their encrypted earning history, communicate with the integrated AI assistant, and withdraw funds to their preferred wallets instantly.</p>
        </div>
      </div>
    </section>

    <section className="landing-features-pro" id="features">
      <div className="feature-card-pro">
        <div className="feature-icon-box"><ShieldCheck size={28} weight="fill" /></div>
        <h3>Zero-Knowledge Architecture</h3>
        <p>Powered by iExec Nox. Treasury deposits and individual salary claims remain completely hidden from public block explorers.</p>
      </div>
      <div className="feature-card-pro">
        <div className="feature-icon-box"><PaperPlaneTilt size={28} weight="fill" /></div>
        <h3>Omnichain Dispatch</h3>
        <p>A single CSV engine routes payments to EVM and Solana addresses simultaneously. No more manual network switching.</p>
      </div>
      <div className="feature-card-pro">
        <div className="feature-icon-box"><Wallet size={28} weight="fill" /></div>
        <h3>Institutional Treasury</h3>
        <p>Manage multi-asset vaults with full analytics. Built for DAOs, protocols, and enterprises scaling their global workforce.</p>
      </div>
    </section>

    <section className="landing-split-section" id="security">
      <div className="split-content">
        <div className="badge-nox">Security First</div>
        <h2>Data Privacy as a Standard.</h2>
        <p>
          Legacy payroll protocols expose your burn rate, organizational structure, and employee salaries to the public. Nox Protocol utilizes Trusted Execution Environments (TEEs) to wrap and distribute funds without leaking metadata.
        </p>
        <ul className="pro-feature-list">
          <li><CheckCircle size={20} weight="fill" color="var(--primary)" /> End-to-end encrypted distribution channels</li>
          <li><CheckCircle size={20} weight="fill" color="var(--primary)" /> ZK-proof employee identity verification</li>
          <li><CheckCircle size={20} weight="fill" color="var(--primary)" /> Immutable, audited smart contracts</li>
        </ul>
      </div>
      <div className="split-visual">
        <div className="abstract-ui-mockup">
          <div className="mockup-header">
            <span></span><span></span><span></span>
          </div>
          <div className="mockup-body">
            <div className="mockup-line w-100"></div>
            <div className="mockup-line w-75"></div>
            <div className="mockup-line w-85"></div>
            <div style={{ marginTop: '2rem' }}></div>
            <div className="mockup-data-row">
              <div className="mockup-col"></div>
              <div className="mockup-col encrypted"></div>
            </div>
            <div className="mockup-data-row">
              <div className="mockup-col"></div>
              <div className="mockup-col encrypted"></div>
            </div>
            <div className="mockup-data-row">
              <div className="mockup-col"></div>
              <div className="mockup-col encrypted"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer className="landing-footer-pro">
      <div className="footer-top">
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>NOX PROTOCOL</span>
          </div>
          <p>Institutional-grade confidential payroll infrastructure for the omnichain economy.</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Platform</h4>
            <a href="#features">Features</a>
            <a href="#security">Security</a>
          </div>
          <div>
            <h4>Developers</h4>
            <a href="https://docs.iex.ec" target="_blank" rel="noreferrer">Documentation</a>

          </div>
          <div>
            <h4>Organization</h4>
            <a href="https://iex.ec" target="_blank" rel="noreferrer">About iExec</a>
            <a href="mailto:contact@iex.ec">Contact Support</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom-pro">
        <p>&copy; 2026 Nox Protocol. Enterprise Confidential Finance.</p>
        <div className="legal-links">
          <a href="https://iex.ec/privacy-policy/" target="_blank" rel="noreferrer">Privacy Policy</a>
          <a href="https://iex.ec/terms-and-conditions/" target="_blank" rel="noreferrer">Terms of Service</a>
        </div>
      </div>
    </footer>
  </div>
);

function App() {
  const [view, setView] = useState<'employer' | 'employee'>('employer');
  const [isLaunched, setIsLaunched] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'payrolls' | 'history' | 'contacts' | 'profile' | 'settings'>('dashboard');
  const [notification, setNotification] = useState<string | null>(null);
  
  const [bulkInput, setBulkInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isShadowMode, setIsShadowMode] = useState(false);
  const [isSettingsUnlocked, setIsSettingsUnlocked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [activeModal, setActiveModal] = useState<null | 'contact' | 'wrap'>(null);
  const [modalData, setModalData] = useState({ field1: '', field2: '' });
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [contacts, setContacts] = useState<{name: string, address: string}[]>(() => {
    const saved = localStorage.getItem('ghostpay_contacts');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const { 
    account, 
    balance, 
    wrappedBalance,
    history,
    connect,
    connectWithProvider,
    disconnect,
    isConnected, 
    isPending, 
    distributePayroll,
    reclaimFunds,
    refreshBalance,
    verifyIdentity,
    wrapFunds,
    mintTokens,
    activeChain,
    availableChains,
    switchChain,
  } = useGhostPay();

  const { connectPhantom, dispatchSolanaPayroll, isConnected: isSolanaConnected, solanaAccount, solanaBalance } = useSolanaGhostPay();

  useEffect(() => {
    localStorage.setItem('ghostpay_contacts', JSON.stringify(contacts));
  }, [contacts]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleVerifyIdentity = async () => {
    setIsVerifying(true);
    const success = await verifyIdentity("Verify cryptographic identity to access GhostPay Confidential Settings.");
    if (success) {
      setIsSettingsUnlocked(true);
      showNotification("Identity Verified. Protocol Access Granted.");
    } else {
      showNotification("Verification Failed.");
    }
    setIsVerifying(false);
  };

  const handleRefresh = async () => {
    await refreshBalance();
    showNotification("Balances synchronized with Nox Protocol.");
  };

  // Universal Cross-Chain Dispatcher
  const handleBulkDistribute = async () => {
    if (!bulkInput.trim()) return;
    setIsProcessing(true);
    try {
      const lines = bulkInput.split('\n').filter(line => line.trim());

      const evmAddresses: string[] = [];
      const evmAmounts: string[] = [];
      const solanaRecipients: { address: string; amount: string }[] = [];
      const skipped: string[] = [];

      lines.forEach(line => {
        const parts = line.split(/[,\t ]+/).map(s => s.trim());
        const addr = parts[0];
        const amt = parts[1];
        if (!addr || !amt || isNaN(parseFloat(amt))) { skipped.push(line); return; }

        if (addr.startsWith('0x') && addr.length === 42) {
          evmAddresses.push(addr);
          evmAmounts.push(amt);
        } else if (addr.length >= 32 && addr.length <= 44 && !addr.startsWith('0x')) {
          // Solana Base58 address
          solanaRecipients.push({ address: addr, amount: amt });
        } else {
          skipped.push(line);
        }
      });

      if (evmAddresses.length === 0 && solanaRecipients.length === 0) {
        throw new Error('No valid recipients found. Use: address, amount — per line.');
      }

      const tasks: Promise<any>[] = [];
      let summary: string[] = [];

      // EVM dispatch
      if (evmAddresses.length > 0) {
        tasks.push(
          distributePayroll(evmAddresses, evmAmounts)
            .then(() => summary.push(`${evmAddresses.length} EVM (${activeChain.shortName})`))
            .catch((e: any) => showNotification(`EVM dispatch failed: ${e.message}`))
        );
      }

      // Solana dispatch
      if (solanaRecipients.length > 0) {
        if (!isSolanaConnected) {
          showNotification('Connect Phantom to dispatch Solana payments.');
        } else {
          tasks.push(
            dispatchSolanaPayroll(solanaRecipients)
              .then(() => summary.push(`${solanaRecipients.length} Solana (SOL) ✓`))
              .catch((e: any) => showNotification(`Solana dispatch failed: ${e.message}`))
          );
        }
      }

      await Promise.allSettled(tasks);

      const summaryStr = summary.join(' + ');
      showNotification(`Omnichain dispatch complete: ${summaryStr || 'processed'}.`);
      setBulkInput('');
    } catch (error: any) {
      console.error(error);
      showNotification(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isLaunched && !isConnected && !isSolanaConnected) {
    return (
      <>
        <LandingPage connect={() => setShowWalletModal(true)} />
        {showWalletModal && (
          <WalletModal
            onConnect={async (provider) => {
              await connectWithProvider(provider);
              setShowWalletModal(false);
            }}
            onSolanaConnect={connectPhantom}
            onClose={() => setShowWalletModal(false)}
          />
        )}
      </>
    );
  }
  return (
    <div className={`dashboard-container ${isRightSidebarCollapsed ? 'right-collapsed' : ''}`}>
      {/* Island Notification */}
      {notification && (
        <div className="protocol-island animate-island-in">
          <div className="island-dot"></div>
          <span style={{ fontWeight: 700, marginRight: '8px' }}>NOX:</span> {notification}
        </div>
      )}

      <aside className="sidebar">
        <img src="/Logo.png" alt="Nox Protocol Logo" className="logo-standalone" onClick={() => setActiveTab('dashboard')} />
        <nav className="sidebar-nav">
          <div className={`sidebar-icon ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <House size={26} weight={activeTab === 'dashboard' ? "fill" : "regular"} />
          </div>
          <div className={`sidebar-icon ${activeTab === 'payrolls' ? 'active' : ''}`} onClick={() => setActiveTab('payrolls')}>
            <PaperPlaneTilt size={26} weight={activeTab === 'payrolls' ? "fill" : "regular"} />
          </div>
          <div className={`sidebar-icon ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <Clock size={26} weight={activeTab === 'history' ? "fill" : "regular"} />
          </div>
          <div className={`sidebar-icon ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}>
            <Users size={26} weight={activeTab === 'contacts' ? "fill" : "regular"} />
          </div>
          <div className={`sidebar-icon ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Gear size={26} weight={activeTab === 'settings' ? "fill" : "regular"} />
          </div>
        </nav>
        <div className={`sidebar-icon ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <User size={26} weight={activeTab === 'profile' ? "fill" : "regular"} />
        </div>
      </aside>

      <main className="main-wrapper">
        <div className="main-header-row">
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div className="segmented-control">
              <button className={`segment-btn ${view === 'employer' ? 'active' : ''}`} onClick={() => setView('employer')}>Employer</button>
              <button className={`segment-btn ${view === 'employee' ? 'active' : ''}`} onClick={() => setView('employee')}>Employee</button>
            </div>
            <button className={`stealth-toggle ${isShadowMode ? 'active' : ''}`} onClick={() => setIsShadowMode(!isShadowMode)}>
              {isShadowMode ? <Eye size={20} weight="fill" /> : <EyeSlash size={20} weight="bold" />}
              <span>SHADOW MODE</span>
            </button>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {isConnected && (
              <NetworkSelector
                activeChain={activeChain}
                availableChains={availableChains}
                onSwitch={switchChain}
                disabled={isPending}
              />
            )}
            <button 
              className={`btn-connect-pro ${(activeChain.type === 'evm' ? isConnected : isSolanaConnected) ? 'connected' : ''}`} 
              onClick={() => setShowWalletModal(true)}
            >
              <div className="active-dot"></div>
              <Wallet size={18} weight="bold" />
              <span>
                {activeChain.type === 'evm' 
                  ? (account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet')
                  : (solanaAccount ? `${solanaAccount.slice(0, 4)}...${solanaAccount.slice(-4)}` : 'Connect Wallet')
                }
              </span>
            </button>
          </div>
        </div>

        <section className="section-header animate-fade-in">
          <div className="section-meta">GhostPay Live Protocol</div>
          <h1 className="section-title">
            {activeTab === 'dashboard' ? 'Protocol Insight' : 
             activeTab === 'payrolls' ? 'Batch Dispatch' : 
             activeTab === 'history' ? 'Transaction Audit' : 
             activeTab === 'contacts' ? 'Confidential Contacts' : 'Protocol Identity'}
          </h1>
        </section>

        <div className="tab-content-area">
          {!isConnected && activeTab !== 'dashboard' ? (
            <div className="locked-segment-container animate-fade-in">
              <div className="lock-icon-box">
                <Wallet size={52} weight="duotone" />
              </div>
              <div className="section-meta">Connection Required</div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Wallet Disconnected</h2>
              <p style={{ color: 'var(--text-dim)', maxWidth: '450px' }}>
                You have successfully signed out of the protocol. 
                Please reconnect your wallet to interact with your confidential vault.
              </p>
              <button className="btn-connect-pro" onClick={connect} style={{ marginTop: '2rem' }}>
                Re-Connect to Protocol
              </button>
            </div>
          ) : (
            activeTab === 'dashboard' ? (
              view === 'employer' ? (
                <div className="cards-layout animate-fade-in">
                  <div style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '0.5rem' }}>
                    <div className="pro-card" style={{ padding: '1.5rem', overflow: 'visible' }}>
                      <div className="section-meta">Active Payrolls</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, margin: '5px 0' }}>
                        {history.filter(tx => tx.type === 'payroll').length}
                      </div>
                      <MiniChart color="var(--primary)" delay={0} />
                    </div>
                    <div className="pro-card" style={{ padding: '1.5rem', overflow: 'visible' }}>
                      <div className="section-meta">Protocol events</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, margin: '5px 0' }}>
                        {history.length}
                      </div>
                      <MiniChart color="var(--secondary)" delay={0.5} />
                    </div>
                    <div className="pro-card" style={{ padding: '1.5rem', overflow: 'visible' }}>
                      <div className="section-meta">Total Recipients</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, margin: '5px 0', color: 'var(--primary)' }}>
                        {history.reduce((acc, tx) => acc + (tx.type === 'payroll' ? (tx.count || 0) : 0), 0).toLocaleString()}
                      </div>
                      <MiniChart color="var(--primary)" delay={1} />
                    </div>
                    <div className="pro-card" style={{ padding: '1.5rem', overflow: 'visible' }}>
                      <div className="section-meta">Privacy Status</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, margin: '5px 0', color: 'var(--success)' }}>ENCRYPTED</div>
                      <MiniChart color="var(--success)" delay={1.5} />
                    </div>
                  </div>

                  <div className="pro-card" style={{ gridColumn: 'span 2', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="section-meta">Total Protocol Volume</div>
                    <div style={{ fontSize: '4rem', fontWeight: 900, margin: '0.5rem 0', color: 'var(--primary)', lineHeight: 1 }}>
                      {isShadowMode ? <div className="masked-data" style={{ width: '280px', height: '48px' }}></div> : `$${history.reduce((acc, tx) => acc + (tx.amount ? parseFloat(tx.amount) : 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--success)', fontWeight: 700 }}>+Real-time synced</div>
                  </div>
                  
                  <div className="pro-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(159, 122, 234, 0.1) 0%, rgba(214, 188, 250, 0.1) 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="section-meta" style={{ color: 'white', margin: 0 }}>Employer Treasury</div>
                      <button 
                        onClick={async () => {
                          try {
                            await mintTokens();
                            showNotification("Successfully minted 10,000 test mUSDC!");
                          } catch (e: any) {
                            showNotification(e.message);
                          }
                        }}
                        disabled={isPending}
                        style={{ 
                          background: 'rgba(255,255,255,0.05)', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          color: 'var(--primary)', 
                          fontSize: '0.7rem', 
                          padding: '4px 8px', 
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
                      >
                        {isPending ? '...' : 'GET FAUCET'}
                      </button>
                    </div>
                    <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                          {activeChain.type === 'evm' ? 'Available to Wrap' : 'Solana Balance'}
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                          {isShadowMode ? (
                            <div className="masked-data" style={{ width: '80px' }}></div>
                          ) : (
                            activeChain.type === 'evm' ? balance : solanaBalance
                          )} 
                          <span style={{ fontSize: '0.8rem' }}> {activeChain.nativeCurrency.symbol}</span>
                        </div>
                      </div>
                      {activeChain.type === 'evm' && (
                        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                          <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Confidential Balance</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                            {isShadowMode ? <div className="masked-data" style={{ width: '80px' }}></div> : wrappedBalance} <span style={{ fontSize: '0.8rem' }}>cUSDC</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {activeChain.type === 'evm' ? (
                        <button 
                          className="btn-connect-pro" 
                          style={{ width: '100%', justifyContent: 'center' }} 
                          onClick={() => {
                            setModalData({ field1: '', field2: '' });
                            setActiveModal('wrap');
                          }}
                          disabled={isPending}
                        >
                          {isPending ? <CircleNotch size={20} className="animate-spin" /> : "Deposit & Wrap"}
                        </button>
                      ) : (
                        <button 
                          className="btn-connect-pro" 
                          style={{ width: '100%', justifyContent: 'center', background: '#14F195', color: '#000' }} 
                          onClick={() => connectPhantom()}
                          disabled={isSolanaConnected}
                        >
                          {isSolanaConnected ? "Phantom Connected" : "Connect Phantom"}
                        </button>
                      )}
                      <button className="btn-connect-pro" style={{ width: '100%', justifyContent: 'center', background: 'transparent', border: '1px solid var(--glass-border)' }} onClick={() => setActiveTab('payrolls')}>Dispatch Batch</button>
                    </div>
                  </div>

                  <div className="pro-card" style={{ gridColumn: 'span 3', padding: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0 }}>Live Transaction Audit</h3>
                      <div className="ai-status-pill" style={{ margin: 0 }}>Synced: {history.length} Events</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {history.length > 0 ? history.slice(0, 5).map((tx, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <ShieldCheck size={28} color="var(--primary)" weight="fill" />
                            <div>
                              <div style={{ fontWeight: 700 }}>
                                {isShadowMode ? <div className="masked-data" style={{ width: '120px' }}></div> : (tx.type === 'payroll' ? `Confidential Batch #${tx.hash.slice(2, 6).toUpperCase()}` : 'Salary Claim')}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                {isShadowMode ? <div className="masked-data" style={{ width: '80px' }}></div> : `${tx.address.slice(0, 6)}...${tx.address.slice(-4)} • ${tx.timestamp}`}
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                              {isShadowMode ? <div className="masked-data" style={{ width: '60px' }}></div> : (tx.type === 'payroll' ? `${tx.count} Recipients` : 'Confidential')}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Arbiscan Verified</div>
                          </div>
                        </div>
                      )) : <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>No protocol events found.</div>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="balance-card-pro" style={{ gridColumn: 'span 3' }}>
                  <span className="ai-status-pill"><ShieldCheck size={14} weight="bold" /> Nox Protocol Active</span>
                  <div className="section-meta" style={{ marginTop: '1.5rem' }}>Your Confidential Balance</div>
                  <div className="balance-pro-value">
                    {isShadowMode ? <div className="masked-data" style={{ width: '250px', height: '60px' }}></div> : <>{wrappedBalance} <span className="currency">cUSDC</span></>}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      className="btn-connect-pro" 
                      style={{ padding: '16px 40px', background: 'var(--primary)', color: 'var(--bg-deep)' }} 
                      onClick={async () => {
                        try {
                          await reclaimFunds(wrappedBalance);
                          showNotification("Withdrawal successful! Tokens sent to your wallet.");
                        } catch (e: any) {
                          showNotification(e.message);
                        }
                      }} 
                      disabled={!isConnected || isPending || parseFloat(wrappedBalance) <= 0}
                    >
                      {isPending ? <CircleNotch size={24} className="animate-spin" /> : "Withdraw Funds"}
                    </button>
                    <button 
                      className="btn-connect-pro" 
                      onClick={handleRefresh} 
                      disabled={isPending}
                    >
                      {isPending ? <CircleNotch size={20} className="animate-spin" /> : "Refresh Balance"}
                    </button>
                  </div>
                </div>
              )
            ) : activeTab === 'payrolls' ? (
              <div className="pro-card" style={{ gridColumn: 'span 3', padding: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.8rem' }}>Omnichain Payroll Dispatch</h2>
                    <p style={{ color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                      Enter EVM <span style={{ color: 'var(--primary)' }}>(0x...)</span> and Solana <span style={{ color: '#a78bfa' }}>(Base58)</span> addresses together. GhostPay routes each payment automatically.
                    </p>
                  </div>
                  <ShieldCheck size={48} weight="fill" color="var(--primary)" />
                </div>

                {/* Live Chain Preview */}
                {bulkInput.trim() && (() => {
                  const lines = bulkInput.split('\n').filter(l => l.trim());
                  let evm = 0, sol = 0, invalid = 0;
                  lines.forEach(line => {
                    const parts = line.split(/[,\t ]+/).map(s => s.trim());
                    const addr = parts[0]; const amt = parts[1];
                    if (!addr || !amt || isNaN(parseFloat(amt))) { invalid++; return; }
                    if (addr.startsWith('0x') && addr.length === 42) evm++;
                    else if (addr.length >= 32 && addr.length <= 44) sol++;
                    else invalid++;
                  });
                  return (
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                      {evm > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.3)', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: activeChain.color, display: 'inline-block' }} />
                          {evm} × {activeChain.shortName} (EVM)
                        </div>
                      )}
                      {sol > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, color: '#a78bfa' }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} />
                          {sol} × Solana (SOL)
                          {!isSolanaConnected && <span style={{ color: '#f59e0b', marginLeft: 4 }}>· Connect Phantom</span>}
                        </div>
                      )}
                      {invalid > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, color: '#f87171' }}>
                          ⚠ {invalid} invalid lines (will be skipped)
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="bulk-input-container">
                  <div className="bulk-input-wrapper">
                    <div className="shield-scan-line"></div>
                    <textarea
                      className="bulk-textarea"
                      placeholder={`EVM:    0x1234...abcd, 500\nSolana: 7xKXtg...9Qzc, 250\n0x5678...efgh, 1000`}
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                      disabled={isPending || isProcessing}
                    />
                  </div>
                  <div className="input-hint">Format: [address], [amount in USDC] — Mix EVM and Solana addresses freely</div>
                </div>
                <button
                  className="btn-connect-pro"
                  style={{ width: '100%', marginTop: '2rem', padding: '20px', background: 'var(--primary)', color: 'var(--bg-deep)', justifyContent: 'center' }}
                  onClick={handleBulkDistribute}
                  disabled={isPending || isProcessing || !isConnected}
                >
                  {isProcessing || isPending
                    ? <CircleNotch size={24} className="animate-spin" />
                    : <><PaperPlaneTilt size={24} weight="bold" /> Execute Omnichain Payout</>}
                </button>
              </div>

            ) : activeTab === 'contacts' ? (
              <div className="pro-card" style={{ gridColumn: 'span 3', padding: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                  <div><h2>Confidential Contacts</h2><p style={{ color: 'var(--text-dim)' }}>Your private enterprise address book. Stored in local vault.</p></div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {selectedContacts.length > 0 && (
                      <button 
                        className="btn-connect-pro" 
                        style={{ background: 'var(--primary)', color: 'var(--bg-deep)' }}
                        onClick={() => {
                          const formatted = selectedContacts.map(addr => `${addr}, 1000`).join('\n');
                          setBulkInput(formatted);
                          setActiveTab('payrolls');
                          setSelectedContacts([]);
                        }}
                      >
                        <PaperPlaneTilt size={20} weight="bold" /> Dispatch to {selectedContacts.length} Selected
                      </button>
                    )}
                    <button className="btn-connect-pro" onClick={() => {
                      setModalData({ field1: '', field2: '' });
                      setActiveModal('contact');
                    }}><Plus size={20} weight="bold" /> Add Contact</button>
                  </div>
                </div>
                <div className="cards-layout" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                  {contacts.length > 0 ? contacts.map((contact, i) => (
                    <div key={i} className={`pro-card ${selectedContacts.includes(contact.address) ? 'selected-contact' : ''}`} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)', border: selectedContacts.includes(contact.address) ? '1px solid var(--primary)' : '1px solid var(--glass-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <strong>{contact.name}</strong>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button 
                            style={{ background: 'transparent', border: 'none', color: selectedContacts.includes(contact.address) ? 'var(--primary)' : 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 700 }}
                            onClick={() => {
                              if (selectedContacts.includes(contact.address)) {
                                setSelectedContacts(selectedContacts.filter(a => a !== contact.address));
                              } else {
                                setSelectedContacts([...selectedContacts, contact.address]);
                              }
                            }}
                          >
                            {selectedContacts.includes(contact.address) ? 'Deselect' : 'Select'}
                          </button>
                          <button style={{ background: 'transparent', border: 'none', color: 'var(--accent-orange)', fontSize: '0.75rem' }} onClick={() => setContacts(contacts.filter((_, idx) => idx !== i))}>Remove</button>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'monospace', marginBottom: '1rem' }}>{isShadowMode ? <div className="masked-data" style={{ width: '100%' }}></div> : contact.address}</div>
                      <button 
                        className="btn-connect-pro" 
                        style={{ width: '100%', fontSize: '0.8rem', padding: '8px', background: 'rgba(255,255,255,0.05)' }}
                        onClick={() => {
                          setBulkInput(`${contact.address}, 1000`);
                          setActiveTab('payrolls');
                        }}
                      >
                        Quick Dispatch
                      </button>
                    </div>
                  )) : <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>No contacts saved.</div>}
                </div>
              </div>
            ) : activeTab === 'history' ? (
              <div className="pro-card" style={{ gridColumn: 'span 3', padding: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}><h3>Live Transaction Audit</h3><div className="ai-status-pill">Arbiscan Verified</div></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {history.map((tx, i) => (
                    <div key={i} className="pro-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <PaperPlaneTilt size={24} weight="bold" color="var(--primary)" />
                        <div>
                          <div style={{ fontWeight: 600 }}>{isShadowMode ? <div className="masked-data" style={{ width: '150px' }}></div> : (tx.type === 'payroll' ? 'Bulk Payroll' : 'Salary Claim')}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{isShadowMode ? <div className="masked-data" style={{ width: '200px' }}></div> : `${tx.hash.slice(0, 18)}...`}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}><div style={{ fontWeight: 700 }}>{isShadowMode ? <div className="masked-data" style={{ width: '80px' }}></div> : (tx.type === 'payroll' ? `${tx.count} Addrs` : `${tx.amount} cUSDC`)}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{tx.timestamp}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'profile' ? (
              <div className="balance-card-pro" style={{ gridColumn: 'span 3', display: 'flex', gap: '4rem', alignItems: 'center' }}>
                <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${account || 'ghost'}`} style={{ width: '180px', borderRadius: '40px', background: 'var(--bg-surface)', padding: '1rem' }} />
                <div>
                  <span className="ai-status-pill">Confidential Identity</span>
                  <h2 style={{ fontSize: '2.5rem', wordBreak: 'break-all' }}>{account || 'Disconnected'}</h2>
                  <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>Protected by iExec Nox Infrastructure.</p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-connect-pro" style={{ background: 'var(--accent-orange)', color: 'white' }} onClick={() => { disconnect(); setActiveTab('dashboard'); }}>Sign Out of Protocol</button>
                    <button className="btn-connect-pro" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }} onClick={() => setActiveTab('dashboard')}>Return to Hub</button>
                  </div>
                </div>
              </div>
            ) : activeTab === 'settings' ? (
              !isSettingsUnlocked ? (
                <div className="locked-segment-container animate-fade-in">
                  <div className="lock-icon-box">
                    <Fingerprint size={52} weight="duotone" />
                  </div>
                  <div className="section-meta">Module Locked</div>
                  <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Restricted Segment</h2>
                  <p style={{ color: 'var(--text-dim)', maxWidth: '450px' }}>
                    This area contains sensitive protocol configurations. 
                    Please verify your cryptographic identity to proceed.
                  </p>
                  <button className="btn-verify" onClick={handleVerifyIdentity} disabled={isVerifying}>
                    {isVerifying ? <CircleNotch size={24} className="animate-spin" /> : "Verify Identity"}
                  </button>
                </div>
              ) : (
                <div className="settings-grid">
                  <div className="settings-card" style={{ gridColumn: 'span 2' }}>
                    <div className="settings-label"><Info size={18} weight="bold" /> Protocol Identity</div>
                    <div className="settings-value">
                      {isShadowMode ? <div className="masked-data" style={{ width: '100%' }}></div> : account}
                    </div>
                    <div style={{ marginTop: '1rem', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 700 }}>
                      <ShieldCheck size={14} weight="bold" /> Identity cryptographically verified via Nox session.
                    </div>
                  </div>

                  <div className="settings-card">
                    <div className="settings-label"><Cpu size={18} weight="bold" /> Nox Contract</div>
                    <div className="settings-value">
                      {isShadowMode ? <div className="masked-data" style={{ width: '100%' }}></div> : (import.meta.env.VITE_GHOST_PAY_ADDRESS || '0x...')}
                    </div>
                  </div>

                  <div className="settings-card">
                    <div className="settings-label"><CircleNotch size={18} weight="bold" /> AI Analytics Engine</div>
                    <div className="settings-value">ChainGPT Web3-LLM</div>
                  </div>

                  <div className="settings-card" style={{ gridColumn: 'span 2', background: `${activeChain.color}10`, border: `1px solid ${activeChain.color}44` }}>
                    <div className="settings-label" style={{ color: activeChain.color }}><ShieldCheck size={18} weight="bold" /> Network Status</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: activeChain.color, boxShadow: `0 0 8px ${activeChain.color}`, display: 'inline-block' }} />
                        {activeChain.name}
                        {activeChain.isTestnet && <span style={{ fontSize: '0.65rem', padding: '2px 8px', background: 'rgba(255,150,0,0.15)', color: '#f59e0b', borderRadius: 6, fontWeight: 700 }}>TESTNET</span>}
                      </div>
                      <div className="ai-status-pill">Active & Healthy</div>
                    </div>
                    {!activeChain.ghostPayAddress && (
                      <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#f59e0b' }}>⚠ GhostPay not yet deployed on this chain. Deploy the contract and add the address to your .env to activate.</div>
                    )}
                  </div>
                </div>
              )
            ) : (
              <div className="pro-card" style={{ gridColumn: 'span 3', padding: '6rem', textAlign: 'center' }}><h3>Module Not Found</h3></div>
            )
          )}
        </div>
      </main>

      <aside className="right-panel">
        <button 
          className="right-panel-toggle" 
          onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
        >
          {isRightSidebarCollapsed ? '«' : '»'}
        </button>
        {!isRightSidebarCollapsed && (
          <>
            <section><h2 className="panel-section-title"><TrendUp size={22} weight="bold" /> Stats</h2><div className="ai-brief-card"><span className="ai-status-pill">Health: ONLINE</span><p>Connected to {activeChain.name} via Nox Vault.</p></div></section>
            <section className="chat-compact"><h2 className="panel-section-title">Transaction Audit AI</h2><ChatAssistant history={history} view={view} /></section>
          </>
        )}
      </aside>

      {/* Wallet Connect Modal */}
      {showWalletModal && (
        <WalletModal
          onConnect={async (provider) => {
            await connectWithProvider(provider);
            setIsLaunched(true);
            setShowWalletModal(false);
          }}
          onSolanaConnect={async () => {
            const addr = await connectPhantom();
            if (addr) {
              setIsLaunched(true);
              setShowWalletModal(false);
            }
            return addr;
          }}
          onClose={() => setShowWalletModal(false)}
        />
      )}

      {/* Custom Modal Overlay */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              {activeModal === 'contact' ? 'New Contact' : 'Deposit Treasury'}
            </div>
            <div className="modal-subtitle">
              {activeModal === 'contact' ? 'Add a recipient to your confidential vault.' : 'Wrap public USDC into confidential cUSDC.'}
            </div>

            <div className="modal-input-group">
              <label className="modal-label">{activeModal === 'contact' ? 'Contact Name' : 'Deposit Amount'}</label>
              <input 
                type="text" 
                className="modal-input" 
                placeholder={activeModal === 'contact' ? 'e.g. Satoshi Nakamoto' : 'e.g. 500.00'}
                value={modalData.field1}
                onChange={e => setModalData({...modalData, field1: e.target.value})}
                autoFocus
              />
            </div>

            {activeModal === 'contact' && (
              <div className="modal-input-group">
                <label className="modal-label">Wallet Address</label>
                <input 
                  type="text" 
                  className="modal-input" 
                  placeholder="0x..."
                  value={modalData.field2}
                  onChange={e => setModalData({...modalData, field2: e.target.value})}
                />
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => setActiveModal(null)}>Cancel</button>
              <button 
                className="btn-modal-submit" 
                disabled={!modalData.field1 || (activeModal === 'contact' && !modalData.field2) || isPending}
                onClick={async () => {
                  if (activeModal === 'contact') {
                    setContacts([...contacts, { name: modalData.field1, address: modalData.field2 }]);
                    showNotification("Contact saved to confidential vault.");
                    setActiveModal(null);
                  } else {
                    const amt = modalData.field1;
                    setActiveModal(null);
                    try {
                      await wrapFunds(amt);
                      showNotification(`Successfully wrapped ${amt} USDC.`);
                    } catch (e: any) {
                      showNotification(`Wrap failed: ${e.message}`);
                    }
                  }
                }}
              >
                {isPending ? <CircleNotch size={20} className="animate-spin" /> : (activeModal === 'contact' ? 'Save Contact' : 'Execute Deposit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
