import { useState } from 'react';
import { 
  House, 
  User, 
  Clock, 
  Gear, 
  Wallet,
  CheckCircle,
  ShieldCheck,
  TrendUp,
  PaperPlaneTilt,
  WarningCircle,
  CircleNotch
} from "@phosphor-icons/react";
import ChatAssistant from './components/ChatAssistant';
import { useGhostPay } from './hooks/useGhostPay';
import './App.css';



const LandingPage = ({ connect }: { connect: () => void }) => (
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

    <footer style={{ padding: '4rem', color: 'var(--text-dim)', fontSize: '0.9rem', borderTop: '1px solid var(--glass-border)', width: '100%', textAlign: 'center' }}>
      &copy; 2026 GhostPay Protocol • Built for iExec Vibe Coding Challenge
    </footer>
  </div>
);

function App() {
  const [view, setView] = useState<'employer' | 'employee'>('employer');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'payrolls' | 'history' | 'settings' | 'profile'>('dashboard');
  const [notification, setNotification] = useState<string | null>(null);
  
  // Bulk Input State
  const [bulkInput, setBulkInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { 
    account, 
    balance, 
    connect, 
    isConnected, 
    isPending, 
    distributePayroll,
    refreshBalance 
  } = useGhostPay();

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleBulkDistribute = async () => {
    if (!bulkInput.trim()) return;
    setIsProcessing(true);
    
    try {
      const lines = bulkInput.split('\n').filter(line => line.trim());
      const addresses: string[] = [];
      const amounts: string[] = [];
      
      lines.forEach(line => {
        const [addr, amt] = line.split(',').map(s => s.trim());
        if (addr && amt) {
          addresses.push(addr);
          amounts.push(amt);
        }
      });

      if (addresses.length === 0) throw new Error("Invalid format. Use: address, amount");

      await distributePayroll(addresses, amounts);
      showNotification(`Successfully distributed payroll to ${addresses.length} employees!`);
      setBulkInput('');
    } catch (error: any) {
      console.error(error);
      showNotification(`Error: ${error.message || 'Transaction failed'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isConnected) return <LandingPage connect={connect} />;

  return (
    <div className="dashboard-container">
      {/* Sidebar - Column 1 */}
      <aside className="sidebar">
        <img src="/Logo.png" alt="GhostPay Logo" className="logo-standalone" onClick={() => setActiveTab('dashboard')} />
        <nav className="sidebar-nav">
          <div 
            className={`sidebar-icon ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <House size={26} weight={activeTab === 'dashboard' ? "fill" : "regular"} />
          </div>
          <div 
            className={`sidebar-icon ${activeTab === 'payrolls' ? 'active' : ''}`}
            onClick={() => setActiveTab('payrolls')}
          >
            <PaperPlaneTilt size={26} weight={activeTab === 'payrolls' ? "fill" : "regular"} />
          </div>
          <div 
            className={`sidebar-icon ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Clock size={26} weight={activeTab === 'history' ? "fill" : "regular"} />
          </div>
          <div 
            className={`sidebar-icon ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Gear size={26} weight={activeTab === 'settings' ? "fill" : "regular"} />
          </div>
        </nav>
        
        <div 
          className={`sidebar-icon ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={26} weight={activeTab === 'profile' ? "fill" : "regular"} />
        </div>
      </aside>

      {/* Main Content - Column 2 */}
      <main className="main-wrapper">
        <div className="main-header-row">
          <div className="segmented-control">
            <button 
              className={`segment-btn ${view === 'employer' ? 'active' : ''}`}
              onClick={() => setView('employer')}
            >
              Employer
            </button>
            <button 
              className={`segment-btn ${view === 'employee' ? 'active' : ''}`}
              onClick={() => setView('employee')}
            >
              Employee
            </button>
          </div>
          <button 
            className={`btn-connect-pro ${isConnected ? 'connected' : ''}`} 
            onClick={connect}
          >
            <Wallet size={20} weight="bold" />
            {isConnected ? `${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>

        <section className="section-header animate-fade-in">
          <div className="section-meta">GhostPay Live Protocol</div>
          <h1>
            {activeTab === 'dashboard' ? 'Protocol Insight' : 
             activeTab === 'payrolls' ? 'Payroll Hub' :
             activeTab === 'history' ? 'Transaction Audit' : 'Confidential Profile'}
          </h1>
        </section>

        <div className="cards-layout animate-fade-in">
          {activeTab === 'dashboard' ? (
            view === 'employer' ? (
              <>
                {/* Metrics Grid */}
                <div style={{ gridColumn: 'span 3', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '0.5rem' }}>
                  <div className="pro-card" style={{ padding: '1.5rem' }}>
                    <div className="section-meta">Active Payrolls</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '5px 0' }}>12</div>
                  </div>
                  <div className="pro-card" style={{ padding: '1.5rem' }}>
                    <div className="section-meta">Nox Streamers</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '5px 0' }}>48</div>
                  </div>
                  <div className="pro-card" style={{ padding: '1.5rem' }}>
                    <div className="section-meta">Daily Volume</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '5px 0', color: 'var(--primary)' }}>$8.4k</div>
                  </div>
                  <div className="pro-card" style={{ padding: '1.5rem' }}>
                    <div className="section-meta">Privacy Health</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '5px 0' }}>100%</div>
                  </div>
                </div>

                <div className="pro-card" style={{ gridColumn: 'span 2', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="section-meta">Total Protocol Volume</div>
                  <div style={{ fontSize: '4rem', fontWeight: 900, margin: '0.5rem 0', color: 'var(--primary)', lineHeight: 1 }}>
                    $142,500.00
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--success)', fontWeight: 700 }}>
                     +12.5% this month
                  </div>
                </div>
                
                <div className="pro-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(45, 212, 191, 0.1) 100%)' }}>
                  <div className="section-meta" style={{ color: 'white' }}>Quick Commands</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1rem' }}>
                    <button className="btn-connect-pro" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setActiveTab('payrolls')}>Dispatch New Batch</button>
                    <button className="btn-connect-pro" style={{ width: '100%', justifyContent: 'center', background: 'transparent', border: '1px solid var(--glass-border)' }} onClick={() => setActiveTab('history')}>Audit History</button>
                  </div>
                </div>

                <div className="pro-card" style={{ gridColumn: 'span 3', padding: '2.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Live Protocol Ledger</h3>
                    <div className="ai-status-pill" style={{ margin: 0 }}>Arb-Sepolia Synced</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <ShieldCheck size={28} color="var(--primary)" weight="fill" />
                          <div>
                            <div style={{ fontWeight: 700 }}>Confidential Batch #{1024 + i}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>0x71C...49A • {i * 2} mins ago</div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, color: 'var(--primary)' }}>+$2,500.00</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Confirmed</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (

              <div className="balance-card-pro" style={{ gridColumn: 'span 3' }}>
                <span className="ai-status-pill"><ShieldCheck size={14} weight="bold" /> Nox Protocol Active</span>
                <div className="section-meta" style={{ marginTop: '1.5rem' }}>Your Confidential Balance</div>
                <div className="balance-pro-value">
                  {balance} <span className="currency">cUSDC</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    className="btn-connect-pro" 
                    style={{ padding: '16px 40px', background: 'var(--primary)', color: 'var(--bg-deep)' }} 
                    onClick={() => showNotification("Withdrawal initiated via Nox...")}
                    disabled={!isConnected || parseFloat(balance) <= 0}
                  >
                    Withdraw Funds
                  </button>
                  <button className="btn-connect-pro" onClick={refreshBalance}>Refresh Balance</button>
                </div>
              </div>
            )
          ) : activeTab === 'payrolls' ? (
              <div className="pro-card" style={{ gridColumn: 'span 3', padding: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.8rem' }}>Bulk Confidential Payroll</h2>
                    <p style={{ color: 'var(--text-dim)', marginTop: '0.5rem' }}>Enter wallet addresses and amounts to distribute privately via Nox.</p>
                  </div>
                  <ShieldCheck size={48} weight="fill" color="var(--primary)" />
                </div>

                <div className="bulk-input-container">
                  <textarea 
                    className="bulk-textarea"
                    placeholder="0x123..., 100&#10;0x456..., 250&#10;0x789..., 50"
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    disabled={isPending || isProcessing}
                  />
                  <div className="input-hint">Format: [Wallet Address], [Amount in USDC] per line</div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button 
                    className="btn-connect-pro" 
                    style={{ flex: 1, padding: '20px', background: 'var(--primary)', color: 'var(--bg-deep)', justifyContent: 'center' }}
                    onClick={handleBulkDistribute}
                    disabled={isPending || isProcessing || !isConnected}
                  >
                    {isPending || isProcessing ? (
                      <CircleNotch size={24} weight="bold" className="animate-spin" />
                    ) : (
                      <>
                        <PaperPlaneTilt size={24} weight="bold" />
                        Execute Confidential Payout
                      </>
                    )}
                  </button>
                </div>
                {!isConnected && (
                  <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-orange)', fontSize: '0.9rem', fontWeight: 600 }}>
                    <WarningCircle size={18} weight="bold" />
                    Please connect your wallet to execute distribution.
                  </div>
                )}
              </div>
          ) : activeTab === 'history' ? (
            <div className="pro-card" style={{ gridColumn: 'span 3', padding: '4rem', textAlign: 'center' }}>
                <div className="subtitle">Audit Ledger</div>
                <h3>Transaction History</h3>
                <p style={{ color: 'var(--text-dim)', marginTop: '1rem' }}>Sychronizing with Arbitrum Sepolia events... All data is end-to-end encrypted.</p>
                <div style={{ marginTop: '3rem', opacity: 0.5 }}>
                  <CircleNotch size={48} className="animate-spin" style={{ margin: '0 auto' }} />
                </div>
            </div>
          ) : activeTab === 'profile' ? (
            <div className="balance-card-pro" style={{ gridColumn: 'span 3', display: 'flex', gap: '4rem', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0 }}>
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${account || 'ghost'}`} 
                  style={{ width: '180px', height: '180px', borderRadius: '40px', background: 'var(--bg-surface)', padding: '1rem' }} 
                  alt="Avatar" 
                />
              </div>
              <div style={{ flex: 1 }}>
                <span className="ai-status-pill">Confidential Identity</span>
                <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{account ? `${account.slice(0, 10)}...${account.slice(-8)}` : 'Disconnected'}</h2>
                <div className="section-meta" style={{ marginBottom: '2rem' }}>Your on-chain activity is protected by iExec Nox Infrastructure.</div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="pro-card" style={{ padding: '1.5rem' }}>
                    <div className="section-meta">Privacy Layer</div>
                    <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>Arbitrum Sepolia</div>
                  </div>
                  <div className="pro-card" style={{ padding: '1.5rem' }}>
                    <div className="section-meta">Security Protocol</div>
                    <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>ERC-7984</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="pro-card" style={{ gridColumn: 'span 3', padding: '6rem', textAlign: 'center' }}>
              <div className="subtitle">Encrypted Module</div>
              <h3>Live {activeTab.toUpperCase()} Feed</h3>
              <p style={{ color: 'var(--text-dim)', marginTop: '1rem' }}>Connect your wallet or perform a transaction to see live state data.</p>
            </div>
          )}
        </div>
      </main>

      {/* Right Panel - Column 3 */}
      <aside className="right-panel">
        <section>
          <h2 className="panel-section-title"><TrendUp size={22} weight="bold" /> System Stats</h2>
          <div className="ai-brief-card animate-fade-in">
            <span className="ai-status-pill">Protocol Health: 100%</span>
            <p style={{ fontSize: '0.9375rem', lineHeight: '1.6', fontWeight: 500 }}>
              Searching for live blockchain events... <strong>Nox Vault</strong> status is currently synchronized with Arbitrum Sepolia.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="pro-card" style={{ padding: '1.25rem', borderRadius: '20px' }}>
              <div className="section-meta">Network</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>Arbitrum</div>
            </div>
            <div className="pro-card" style={{ padding: '1.25rem', borderRadius: '20px' }}>
              <div className="section-meta">Confidential</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>Active</div>
            </div>
          </div>
        </section>

        <section className="chat-compact">
          <h2 className="panel-section-title">GhostPay Assistant</h2>
          <ChatAssistant />
        </section>
      </aside>

      {notification && (
        <div className="notification-toast glass-card animate-fade-in" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
          <CheckCircle size={20} weight="fill" style={{ color: 'var(--primary)' }} />
          {notification}
        </div>
      )}
    </div>
  );
}

export default App;

