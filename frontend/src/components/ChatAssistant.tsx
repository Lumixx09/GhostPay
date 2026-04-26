import React, { useState, useEffect, useRef, useMemo } from 'react';
import { fetchAIResponse } from '../services/chainGPT';
import type { ChatMessage } from '../services/chainGPT';
import {
  Robot,
  PaperPlaneTilt,
  DotsThreeVertical,
} from '@phosphor-icons/react';
import type { Transaction } from '../hooks/useGhostPay';

interface ChatAssistantProps {
  history: Transaction[];
  view: 'employer' | 'employee';
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ history, view }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'GhostPay Analyst online. I see your live protocol events. Ask me anything about your payroll volume or history!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const payrolls = history.filter((tx) => tx.type === 'payroll');
      const claims = history.filter((tx) => tx.type === 'claim');
      // Confidential events have no plaintext amount; only known amounts (e.g.
      // surfaced via finalizeUnwrap) contribute to the visible volume figure.
      const totalVolume = claims.reduce(
        (acc, tx) => acc + parseFloat(tx.amount || '0'),
        0,
      );

      const historySummary =
        history.length > 0
          ? `Protocol Status: ${payrolls.length} distributions and ${claims.length} claim requests. Visible volume: $${totalVolume.toLocaleString()}. Latest: ${history[0].type} at ${history[0].timestamp}.`
          : 'The protocol has no events yet.';

      const systemContext = `You are the GhostPay Analytics Engine. ${historySummary} GhostPay uses iExec Nox confidential computing for confidential payroll on Arbitrum Sepolia. Per-employee amounts are encrypted on-chain and cannot be revealed unless the employee finalizes an unwrap. The user is currently in ${view} view. Answer with protocol intelligence. `;
      const prompt = systemContext + input;
      const aiAnswer = await fetchAIResponse(prompt, messages);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: aiAnswer },
      ]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I had trouble reaching the AI service. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoise the rotating insights so they're not re-allocated each render —
  // and so the rotation interval below has a stable reference to depend on.
  const insights = useMemo(
    () => [
      'iExec Nox: Confidential Enclave #402 Operating at Peak Privacy.',
      'Network Sync: Arbitrum Sepolia Block confirmations holding steady.',
      'Pro-Tip: Nox encryption reduces your public traceable footprint by 100%.',
      'Analytics: Protocol volume is trending up — Nox streamlining enabled.',
    ],
    [],
  );
  const [insightIndex, setInsightIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % insights.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [insights.length]);

  return (
    <div className="chat-window-pro animate-fade-in">
      <div className="chat-header-pro" style={{ borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            className="gpt-icon-container"
            style={{ width: '36px', height: '36px', borderRadius: '10px' }}
          >
            <Robot size={20} weight="bold" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
              GhostPay AI
            </div>
            <div
              className="ai-status-pill"
              style={{ margin: 0, padding: '2px 8px', fontSize: '10px' }}
            >
              Analyzing
            </div>
          </div>
        </div>
        <DotsThreeVertical size={20} weight="bold" color="var(--text-dim)" />
      </div>

      <div
        style={{
          padding: '0 1.5rem 1rem 1.5rem',
          borderBottom: '1px solid var(--glass-border)',
        }}
      >
        <div
          style={{
            background: 'rgba(99, 102, 241, 0.05)',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            color: 'var(--primary)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <div
            className="animate-pulse"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--primary)',
            }}
          />
          <span style={{ fontWeight: 600 }}>INSIGHT:</span>{' '}
          {insights[insightIndex]}
        </div>
      </div>

      <div className="chat-messages-pro">
        {messages.map((msg, i) => (
          <div key={i} className={`bubble-pro ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="bubble-pro assistant animate-pulse">...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-pro">
        <input
          type="text"
          placeholder="Ask about payroll..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          disabled={isLoading}
        />
        <button
          className="sidebar-icon"
          onClick={handleSend}
          disabled={isLoading}
          style={{
            width: '44px',
            height: '44px',
            background: 'var(--primary)',
            color: 'var(--bg-deep)',
          }}
        >
          <PaperPlaneTilt size={20} weight="bold" />
        </button>
      </div>
    </div>
  );
};

export default ChatAssistant;
