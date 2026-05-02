import { useState, useRef, useEffect } from 'react';
import type { ChainConfig } from '../config/chains';

interface NetworkSelectorProps {
  activeChain: ChainConfig;
  availableChains: ChainConfig[];
  onSwitch: (chain: ChainConfig) => Promise<void>;
  disabled?: boolean;
}

export default function NetworkSelector({ activeChain, availableChains, onSwitch, disabled }: NetworkSelectorProps) {
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSwitch = async (chain: ChainConfig) => {
    if (chain.id === activeChain.id) { setOpen(false); return; }
    setSwitching(true);
    setOpen(false);
    try {
      await onSwitch(chain);
    } catch (e) {
      console.error('Chain switch failed:', e);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled || switching}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${activeChain.color}44`,
          borderRadius: '12px', padding: '7px 14px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          color: 'white', fontWeight: 700, fontSize: '0.78rem',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLElement).style.borderColor = activeChain.color; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${activeChain.color}44`; }}
      >
        <span
          style={{
            width: 9, height: 9, borderRadius: '50%',
            background: activeChain.color,
            boxShadow: `0 0 6px ${activeChain.color}`,
            display: 'inline-block', flexShrink: 0,
            animation: switching ? 'pulse 0.8s infinite' : 'none',
          }}
        />
        {switching ? 'Switching...' : activeChain.shortName}
        <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: 'var(--glass-bg, #0f172a)', border: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
          borderRadius: '16px', padding: '8px', minWidth: '220px',
          zIndex: 9999, boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 700, padding: '4px 8px 8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Select Network
          </div>
          {availableChains.map(chain => (
            <button
              key={chain.id}
              onClick={() => handleSwitch(chain)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                width: '100%', padding: '10px 12px',
                background: chain.id === activeChain.id ? `${chain.color}15` : 'transparent',
                border: chain.id === activeChain.id ? `1px solid ${chain.color}33` : '1px solid transparent',
                borderRadius: '10px', cursor: 'pointer', color: 'white',
                textAlign: 'left', transition: 'all 0.15s', marginBottom: '4px',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${chain.color}15`; }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = chain.id === activeChain.id ? `${chain.color}15` : 'transparent';
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: chain.color, boxShadow: `0 0 5px ${chain.color}`, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{chain.name}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '1px' }}>
                  {chain.isTestnet ? 'Testnet' : 'Mainnet'} · {chain.nativeCurrency.symbol}
                  {!chain.ghostPayAddress && <span style={{ color: '#f59e0b', marginLeft: 6 }}>· Not deployed</span>}
                </div>
              </div>
              {chain.id === activeChain.id && <span style={{ color: chain.color, fontSize: '0.75rem' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
