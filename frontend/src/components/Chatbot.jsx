import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Namaste! I am your AI Inventory Assistant. How can I help you analyze your products today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Oops, I am having trouble connecting to the backend right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', width: '60px', height: '60px',
          borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
          color: 'white', border: 'none', cursor: 'pointer', display: isOpen ? 'none' : 'flex',
          alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-subtle)', zIndex: 1000
        }}
      >
        <MessageSquare size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', width: '350px', height: '500px',
          backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-subtle)', display: 'flex', flexDirection: 'column', zIndex: 1000, overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ padding: '16px', background: 'var(--primary-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={20} />
              <span style={{ fontWeight: '600' }}>IP-SAKTI AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%', background: msg.role === 'user' ? 'rgba(46, 125, 50, 0.2)' : 'rgba(0,0,0,0.1)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {msg.content}
              </div>
            ))}
            {loading && <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.8rem' }}>AI is typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px', borderTop: '1px solid var(--border-color)' }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
              <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about your inventory..." style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)', outline: 'none' }} />
              <button type="submit" disabled={loading} style={{ background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
