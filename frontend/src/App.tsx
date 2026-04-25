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
  EyeSlash
} from "@phosphor-icons/react";
import ChatAssistant from './components/ChatAssistant';
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

    <footer style={{ padding: '4rem', color: 'var(--text-dim)', fontSize: '0.9rem', borderTop: '1px solid var(--glass-border)', width: '100%', textAlign: 'center' }}>
      &copy; 2026 GhostPay Protocol • Built for iExec Vibe Coding Challenge
    </footer>
  </div>
);

function App() {
  const [view, setView] = useState<'employer' | 'employee'>('employer');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'payrolls' | 'history' | 'contacts' | 'profile' | 'settings'>('dashboard');
  const [notification, setNotification] = useState<string | null>(null);
  
  const [bulkInput, setBulkInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isShadowMode, setIsShadowMode] = useState(false);
  const [contacts, setContacts] = useState<{name: string, address: string}[]>(() => {
    const saved = localStorage.getItem('ghostpay_contacts');
    return saved ? JSON.parse(saved) : [];
  });

  const { 
    account, 
    balance, 
    history,
    connect, 
    isConnected, 
    isPending, 
    distributePayroll,
    reclaimFunds,
    refreshBalance 
  } = useGhostPay();

  useEffect(() => {
    localStorage.setItem('ghostpay_contacts', JSON.stringify(contacts));
  }, [contacts]);

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
              <EyeSlash size={20} weight={isShadowMode ? "fill" : "bold"} />
              <span>SHADOW MODE</span>
            </button>
          </div>
          <button className={`btn-connect-pro ${isConnected ? 'connected' : ''}`} onClick={connect}>
            <Wallet size={20} weight="bold" />
            {isConnected ? `${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>

        <section className="section-header animate-fade-in">
          <div className="section-meta">GhostPay Live Protocol</div>
          <h1>
            {activeTab === 'dashboard' ? 'Protocol Insight' : 
             activeTab === 'payrolls' ? 'Payroll Dispatch' :
             activeTab === 'history' ? 'Transaction Audit' : 
             activeTab === 'contacts' ? 'Vault Contacts' : 'Confidential Profile'}
          </h1>
        </section>

        <div className="cards-layout animate-fade-in">
          {activeTab === 'dashboard' ? (
            view === 'employer' ? (
              <>
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
                    <div className="section-meta">Historical Volume</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, margin: '5px 0', color: 'var(--primary)' }}>
                      ${history.reduce((acc, tx) => acc + (tx.type === 'claim' ? parseFloat(tx.amount || '0') : 0), 0).toLocaleString()}
                    </div>
                    <MiniChart color="var(--primary)" delay={1} />
                  </div>
                  <div className="pro-card" style={{ padding: '1.5rem', overflow: 'visible' }}>
                    <div className="section-meta">Privacy Health</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, margin: '5px 0', color: 'var(--success)' }}>100%</div>
                    <MiniChart color="var(--success)" delay={1.5} />
                  </div>
                </div>

                <div className="pro-card" style={{ gridColumn: 'span 2', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="section-meta">Total Protocol Volume</div>
                  <div style={{ fontSize: '4rem', fontWeight: 900, margin: '0.5rem 0', color: 'var(--primary)', lineHeight: 1 }}>
                    ${history.reduce((acc, tx) => acc + (tx.type === 'claim' ? parseFloat(tx.amount || '0') : 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--success)', fontWeight: 700 }}>+Real-time synced</div>
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
                            {isShadowMode ? <div className="masked-data" style={{ width: '60px' }}></div> : (tx.type === 'payroll' ? `${tx.count} Recipients` : `+$${tx.amount}`)}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Verified</div>
                        </div>
                      </div>
                    )) : <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>No protocol events found.</div>}
                  </div>
                </div>
              </>
            ) : (
              <div className="balance-card-pro" style={{ gridColumn: 'span 3' }}>
                <span className="ai-status-pill"><ShieldCheck size={14} weight="bold" /> Nox Protocol Active</span>
                <div className="section-meta" style={{ marginTop: '1.5rem' }}>Your Confidential Balance</div>
                <div className="balance-pro-value">{balance} <span className="currency">cUSDC</span></div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    className="btn-connect-pro" 
                    style={{ padding: '16px 40px', background: 'var(--primary)', color: 'var(--bg-deep)' }} 
                    onClick={() => reclaimFunds(balance)} 
                    disabled={!isConnected || isPending || parseFloat(balance) <= 0}
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
                <button className="btn-connect-pro" onClick={() => { const name = prompt("Name:"); const address = prompt("Address:"); if (name && address) setContacts([...contacts, { name, address }]); }}><Users size={20} weight="bold" /> Add Contact</button>
              </div>
              <div className="cards-layout" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {contacts.length > 0 ? contacts.map((contact, i) => (
                  <div key={i} className="pro-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}><strong>{contact.name}</strong><button style={{ background: 'transparent', border: 'none', color: 'var(--accent-orange)' }} onClick={() => setContacts(contacts.filter((_, idx) => idx !== i))}>Remove</button></div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>{isShadowMode ? <div className="masked-data" style={{ width: '100%' }}></div> : contact.address}</div>
                  </div>
                )) : <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>No contacts saved.</div>}
              </div>
            </div>
          ) : activeTab === 'history' ? (
            <div className="pro-card" style={{ gridColumn: 'span 3', padding: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}><h3>Live Transaction Audit</h3><div className="ai-status-pill">Etherscan Verified</div></div>
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
            <div className="balance-card-pro" style={{ gridColumn: 'span 3', display: 'flex', gap: '4rem' }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${account || 'ghost'}`} style={{ width: '180px', borderRadius: '40px', background: 'var(--bg-surface)', padding: '1rem' }} />
              <div><span className="ai-status-pill">Confidential Identity</span><h2 style={{ fontSize: '2.5rem' }}>{account ? `${account.slice(0, 10)}...` : 'Disconnected'}</h2><p style={{ color: 'var(--text-dim)' }}>Protected by iExec Nox Infrastructure.</p></div>
            </div>
          ) : (
            <div className="pro-card" style={{ gridColumn: 'span 3', padding: '6rem', textAlign: 'center' }}><h3>Module Locked</h3><p>Verify your cryptographic identity to access this segment.</p></div>
          )}
        </div>
      </main>

      <aside className="right-panel">
        <section><h2 className="panel-section-title"><TrendUp size={22} weight="bold" /> Stats</h2><div className="ai-brief-card"><span className="ai-status-pill">Health: 100%</span><p>Connected to Arbitrum Sepolia via Nox Vault.</p></div></section>
        <section className="chat-compact"><h2 className="panel-section-title">GhostAssistant</h2><ChatAssistant history={history} view={view} /></section>
      </aside>
    </div>
  );
}

export default App;
