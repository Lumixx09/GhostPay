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
  ArrowRight,
  LockKey,
  HandCoins,
  CheckCircle
} from "@phosphor-icons/react";
import ChatAssistant from './components/ChatAssistant';
import WalletModal from './components/WalletModal';
import { useGhostPay } from './hooks/useGhostPay';
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

const LandingPage = ({ connect, setView }: { connect: () => void, setView: (v: 'employer' | 'employee') => void }) => (
  <div className="landing-container animate-fade-in">
    <nav className="landing-nav">
      <img src="/Logo.png" alt="GhostPay Logo" style={{ height: '50px' }} />
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <a href="#features" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontWeight: 600 }}>Features</a>
        <a href="https://docs.iex.ec" target="_blank" rel="noreferrer" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontWeight: 600 }}>iExec Nox</a>
        <button className="btn-connect-pro" onClick={connect}>Launch App</button>
      </div>
    </nav>

    <section className="landing-hero-grid">
      <div className="hero-ambient-glow"></div>
      <div className="hero-text-side">
        <div className="badge-nox">Powered by iExec Nox • Arbitrum Sepolia</div>
        <h1 className="landing-title">Confidential Payroll, <span style={{ color: 'var(--primary)' }}>Redefined.</span></h1>
        <p className="landing-subtitle">
          GhostPay is the leading confidential payroll protocol on Arbitrum Sepolia. 
          Execute bulk distributions and manage global teams with end-to-end encryption 
          powered by iExec Nox confidential computing.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
          <button className="launch-btn-giant" onClick={connect}>Connect Wallet & Launch</button>
        </div>
      </div>
      <div className="hero-visual-side">
        <div className="visual-glow"></div>
        <img src="/ghostpay_3d_vault.png" className="floating-asset" alt="Confidential Vault" />
      </div>
    </section>

    <section className="landing-features" id="features">
      <div className="landing-card">
        <div className="feature-icon-box"><ShieldCheck size={32} weight="fill" /></div>
        <h3>Nox Confidential Vaults</h3>
        <p>Your payroll data is stored in secure, encrypted enclaves. Neither GhostPay nor the network can see your distribution amounts.</p>
      </div>
      <div className="landing-card">
        <div className="feature-icon-box"><PaperPlaneTilt size={32} weight="fill" /></div>
        <h3>Bulk Batching</h3>
        <p>Distribute salaries to your entire global team in a single confidential batch. Low gas, maximum privacy, zero delay.</p>
      </div>
      <div className="landing-card">
        <div className="feature-icon-box"><Wallet size={32} weight="fill" /></div>
        <h3>ZK-Earning Claims</h3>
        <p>Employees claim their earnings via secure confidential transfers, ensuring total privacy for individual salary data.</p>
      </div>
    </section>

    <section className="landing-info-section">
      <div className="info-header">
        <div className="badge-nox">Protocol Workflow</div>
        <h2>How GhostPay Works</h2>
        <p>A three-step confidential bridge between corporate treasury and employee wallets.</p>
      </div>
      <div className="workflow-grid">
        <div className="workflow-step">
          <div className="step-number">01</div>
          <div className="step-icon"><LockKey size={32} color="var(--primary)" /></div>
          <h4>Deposit & Wrap</h4>
          <p>Employers deposit standard USDC into the GhostPay vault. iExec Nox wraps it into confidential cUSDC, hiding the balance from public view.</p>
        </div>
        <ArrowRight size={24} className="step-arrow" />
        <div className="workflow-step">
          <div className="step-number">02</div>
          <div className="step-icon"><PaperPlaneTilt size={32} color="var(--primary)" /></div>
          <h4>Batch Dispatch</h4>
          <p>Execute bulk payroll to thousands of addresses. On-chain observers only see a single batch transaction with encrypted individual amounts.</p>
        </div>
        <ArrowRight size={24} className="step-arrow" />
        <div className="workflow-step">
          <div className="step-number">03</div>
          <div className="step-icon"><HandCoins size={32} color="var(--primary)" /></div>
          <h4>Private Claim</h4>
          <p>Employees connect their wallets and claim their specific salary. The transaction history is obscured via Nox, preserving income privacy.</p>
        </div>
      </div>
    </section>

    <section className="landing-dual-grid">
      <div className="ecosystem-card employer">
        <div className="badge-nox" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>Employer Ecosystem</div>
        <h3>Institutional Management</h3>
        <ul className="feature-list">
          <li>
            <CheckCircle size={20} weight="fill" color="var(--primary)" />
            <span><strong>Bulk CSV Engine:</strong> Paste or upload thousands of employee records instantly.</span>
          </li>
          <li>
            <CheckCircle size={20} weight="fill" color="var(--primary)" />
            <span><strong>AI Analytics:</strong> ChainGPT powered insights into payroll volume and burn rates.</span>
          </li>
          <li>
            <CheckCircle size={20} weight="fill" color="var(--primary)" />
            <span><strong>Shadow Mode:</strong> Toggle UI privacy for secure screen sharing and reporting.</span>
          </li>
          <li>
            <CheckCircle size={20} weight="fill" color="var(--primary)" />
            <span><strong>Multi-Asset Vaults:</strong> Support for any ERC-20 confidential wrapping.</span>
          </li>
        </ul>
      </div>
      <div className="ecosystem-card employee">
        <div className="badge-nox" style={{ background: 'rgba(45, 212, 191, 0.2)', color: '#5eead4' }}>Employee Portal</div>
        <h3>Privacy-First Access</h3>
        <ul className="feature-list">
          <li>
            <CheckCircle size={20} weight="fill" color="var(--success)" />
            <span><strong>Confidential Balance:</strong> Your income is your business. Balances are hidden from Etherscan.</span>
          </li>
          <li>
            <CheckCircle size={20} weight="fill" color="var(--success)" />
            <span><strong>GhostAssistant AI:</strong> Query your specific payout history via a secure AI interface.</span>
          </li>
          <li>
            <CheckCircle size={20} weight="fill" color="var(--success)" />
            <span><strong>One-Click Claims:</strong> Withdraw your earnings to your wallet in seconds.</span>
          </li>
          <li>
            <CheckCircle size={20} weight="fill" color="var(--success)" />
            <span><strong>Identity Verification:</strong> ZK-proof based session management for profile access.</span>
          </li>
        </ul>
      </div>
    </section>

    <section className="landing-cta-final">
      <h2>Ready to take your payroll private?</h2>
      <p>Join the future of confidential institutional finance on Arbitrum Sepolia.</p>
      <button className="launch-btn-giant" onClick={connect} style={{ margin: '2rem auto' }}>Launch Protocol</button>
    </section>

    <footer className="landing-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/Logo.png" alt="GhostPay Logo" style={{ height: '40px', marginBottom: '1.5rem' }} />
          <p>Institutional-grade confidential payroll infrastructure on Arbitrum Sepolia.</p>
          <div className="footer-badges">
            <div className="badge-nox" style={{ marginBottom: 0, fontSize: '10px' }}>iExec Nox</div>
            <div className="badge-nox" style={{ marginBottom: 0, fontSize: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>ChainGPT AI</div>
          </div>
        </div>
        
        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Protocol</h4>
            <a href="#features">Features</a>
            <button className="footer-link-btn" onClick={() => { setView('employer'); connect(); }}>Employer Portal</button>
            <button className="footer-link-btn" onClick={() => { setView('employee'); connect(); }}>Employee Hub</button>
            <a href="https://docs.iex.ec/nox-protocol/welcome" target="_blank" rel="noreferrer">Security</a>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="https://docs.iex.ec" target="_blank" rel="noreferrer">Documentation</a>
            <a href="https://discord.gg/RXYHBJceMe" target="_blank" rel="noreferrer">Vibe Challenge</a>
            <a href="https://sepolia.arbiscan.io" target="_blank" rel="noreferrer">Arbitrum Sepolia</a>
            <a href="https://github.com/Lumixx09/GhostPay" target="_blank" rel="noreferrer">Github</a>
          </div>
          <div className="footer-col">
            <h4>Social</h4>
            <a href="https://x.com/iex_ec" target="_blank" rel="noreferrer">Twitter / X</a>
            <a href="https://discord.gg/RXYHBJceMe" target="_blank" rel="noreferrer">Discord</a>
            <a href="https://t.me/iexec_rlc_official" target="_blank" rel="noreferrer">Telegram</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 GhostPay Protocol. Built for the iExec Vibe Coding Challenge.</p>
        <div style={{ display: 'flex', gap: '2rem' }}>
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
    mintTokens
  } = useGhostPay();

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

  const handleBulkDistribute = async () => {
    if (!bulkInput.trim()) return;
    setIsProcessing(true);
    try {
      const lines = bulkInput.split('\n').filter(line => line.trim());
      const addresses: string[] = [];
      const amounts: string[] = [];
      
      lines.forEach(line => {
        // Robust parser: handles commas, tabs, or multiple spaces
        const parts = line.split(/[, \t]+/).map(s => s.trim());
        const addr = parts[0];
        const amt = parts[1];
        
        if (addr && addr.startsWith('0x') && amt && !isNaN(parseFloat(amt))) {
          addresses.push(addr);
          amounts.push(amt);
        }
      });

      if (addresses.length === 0) throw new Error("No valid recipients found. Use: address amount");
      await distributePayroll(addresses, amounts);
      showNotification(`Successfully distributed payroll to ${addresses.length} employees!`);
      setBulkInput('');
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isLaunched && !isConnected) {
    return (
      <>
        <LandingPage connect={() => setShowWalletModal(true)} setView={setView} />
        {showWalletModal && (
          <WalletModal
            onConnect={async (provider) => {
              await connectWithProvider(provider);
              setIsLaunched(true);
              setShowWalletModal(false);
            }}
            onClose={() => setShowWalletModal(false)}
          />
        )}
      </>
    );
  }
  return (
    <div className="dashboard-container">
      {/* Island Notification */}
      {notification && (
        <div className="protocol-island animate-island-in">
          <div className="island-dot"></div>
          <span style={{ fontWeight: 700, marginRight: '8px' }}>GHOST:</span> {notification}
        </div>
      )}

      <aside className="sidebar">
        <img src="/Logo.png" alt="GhostPay Logo" className="logo-standalone" onClick={() => setActiveTab('dashboard')} />
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
          <button 
            className={`btn-connect-pro ${isConnected ? 'connected' : ''}`} 
            onClick={isConnected ? () => setActiveTab('profile') : () => setShowWalletModal(true)}
          >
            <Wallet size={20} weight="bold" />
            {isConnected ? `${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Connect Wallet'}
          </button>
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
                      <MiniChart color="#6366f1" delay={0.5} />
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
                  
                  <div className="pro-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(45, 212, 191, 0.1) 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="section-meta" style={{ color: 'white', margin: 0 }}>Employer Treasury</div>
                      <button 
                        onClick={mintTokens}
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
                        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Available to Wrap</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                          {isShadowMode ? <div className="masked-data" style={{ width: '80px' }}></div> : balance} <span style={{ fontSize: '0.8rem' }}>mUSDC</span>
                        </div>
                      </div>
                      <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Confidential Balance</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                          {isShadowMode ? <div className="masked-data" style={{ width: '80px' }}></div> : wrappedBalance} <span style={{ fontSize: '0.8rem' }}>cUSDC</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                  <div className="balance-pro-value">{wrappedBalance} <span className="currency">cUSDC</span></div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      className="btn-connect-pro" 
                      style={{ padding: '16px 40px', background: 'var(--primary)', color: 'var(--bg-deep)' }} 
                      onClick={() => reclaimFunds(wrappedBalance)} 
                      disabled={!isConnected || isPending || parseFloat(wrappedBalance) <= 0}
                    >
                      {isPending ? <CircleNotch size={24} className="animate-spin" /> : "Withdraw Funds"}
                    </button>
                    <button className="btn-connect-pro" onClick={refreshBalance} disabled={isPending}>Refresh Balance</button>
                  </div>
                </div>
              )
            ) : activeTab === 'payrolls' ? (
              <div className="pro-card" style={{ gridColumn: 'span 3', padding: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div><h2 style={{ fontSize: '1.8rem' }}>Bulk Confidential Payroll</h2><p style={{ color: 'var(--text-dim)', marginTop: '0.5rem' }}>Enter addresses and amounts to distribute privately via Nox.</p></div>
                  <ShieldCheck size={48} weight="fill" color="var(--primary)" />
                </div>
                <div className="bulk-input-container">
                  <div className="bulk-input-wrapper"><div className="shield-scan-line"></div><textarea className="bulk-textarea" placeholder="0x123..., 100&#10;0x456..., 250" value={bulkInput} onChange={(e) => setBulkInput(e.target.value)} disabled={isPending || isProcessing} /></div>
                  <div className="input-hint">Format: [Wallet Address], [Amount in USDC] per line</div>
                </div>
                <button className="btn-connect-pro" style={{ width: '100%', marginTop: '2rem', padding: '20px', background: 'var(--primary)', color: 'var(--bg-deep)', justifyContent: 'center' }} onClick={handleBulkDistribute} disabled={isPending || isProcessing || !isConnected}>
                  {isProcessing || isPending ? <CircleNotch size={24} className="animate-spin" /> : <><PaperPlaneTilt size={24} weight="bold" /> Execute Confidential Payout</>}
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

                  <div className="settings-card" style={{ gridColumn: 'span 2', background: 'rgba(45, 212, 191, 0.05)', border: '1px solid var(--primary)' }}>
                    <div className="settings-label" style={{ color: 'var(--primary)' }}><ShieldCheck size={18} weight="bold" /> Network Status</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>Arbitrum Sepolia</div>
                      <div className="ai-status-pill">Active & Healthy</div>
                    </div>
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
        <section><h2 className="panel-section-title"><TrendUp size={22} weight="bold" /> Stats</h2><div className="ai-brief-card"><span className="ai-status-pill">Health: ONLINE</span><p>Connected to Arbitrum Sepolia via Nox Vault.</p></div></section>
        <section className="chat-compact"><h2 className="panel-section-title">Transaction Audit AI</h2><ChatAssistant history={history} view={view} /></section>
      </aside>

      {/* Wallet Connect Modal */}
      {showWalletModal && (
        <WalletModal
          onConnect={async (provider) => {
            await connectWithProvider(provider);
            setIsLaunched(true);
            setShowWalletModal(false);
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
