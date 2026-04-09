import React, { useState, useEffect, useRef } from 'react';
import { fetchAIResponse } from '../services/chainGPT';
import type { ChatMessage } from '../services/chainGPT';
import { Robot, PaperPlaneTilt, DotsThreeVertical } from "@phosphor-icons/react";
import type { Transaction } from '../hooks/useGhostPay';

interface ChatAssistantProps {
  history: Transaction[];
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ history }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'GhostPay Analyst online. I see your live protocol events. Ask me anything about your payroll volume or history!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const historySummary = history.length > 0 
        ? `Recent protocol events: ${history.length} total. Latest transactions involve ${history.slice(0, 3).map(tx => tx.type + ' (' + (tx.count || tx.amount) + ')').join(', ')}.`
        : "No recent protocol events found.";
        
      const systemContext = `You are the GhostPay Analytics Engine. ${historySummary} GhostPay uses iExec Nox for confidential payroll. Answer with protocol intelligence. `;
      const prompt = systemContext + input;
      const aiAnswer = await fetchAIResponse(prompt, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: aiAnswer }]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-window-pro animate-fade-in">
      <div className="chat-header-pro">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="gpt-icon-container" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
            <Robot size={20} weight="bold" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>GhostPay AI</div>
            <div className="ai-status-pill" style={{ margin: 0, padding: '2px 8px', fontSize: '10px' }}>Analyzing</div>
          </div>
        </div>
        <DotsThreeVertical size={20} weight="bold" color="var(--text-dim)" />
      </div>

      <div className="chat-messages-pro">
        {messages.map((msg, i) => (
          <div key={i} className={`bubble-pro ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {isLoading && <div className="bubble-pro assistant animate-pulse">...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-pro">
        <input 
          type="text" 
          placeholder="Ask about payroll..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          className="sidebar-icon" 
          onClick={handleSend}
          style={{ width: '44px', height: '44px', background: 'var(--primary)', color: 'var(--bg-deep)' }}
        >
          <PaperPlaneTilt size={20} weight="bold" />
        </button>
      </div>
    </div>
  );
};

export default ChatAssistant;
