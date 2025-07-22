import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';

interface ChatMessage {
  id: number;
  query: string;
  response: string;
  timestamp: string;
}

interface PDF {
  id: number;
  title: string;
  filename: string;
}

interface ChatParams {
  pdfId: string;
  [key: string]: string | undefined;
}

// Extracted styles
const styles = {
  container: {
    minHeight: '100vh', width: '100vw', position: 'relative' as const,
    background: 'radial-gradient(ellipse at 60% 40%, rgba(96,165,250,0.12) 0%, rgba(36,40,80,0.95) 70%), linear-gradient(135deg, #232b4d 0%, #1e2746 100%)',
    display: 'flex', alignItems: 'stretch', justifyContent: 'center', overflow: 'hidden',
    fontFamily: 'Playfair Display, serif'
  },
  chatContainer: {
    width: '100%', maxWidth: 900, minHeight: 600, margin: '2rem auto',
    background: 'rgba(255,255,255,0.10)', borderRadius: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    border: '1.5px solid rgba(255,255,255,0.18)', overflow: 'hidden', display: 'flex', flexDirection: 'column' as const,
    zIndex: 2, backdropFilter: 'blur(18px)', color: '#e0eaff', animation: 'fadeIn 0.8s',
    height: 'calc(100vh - 4rem)', fontFamily: 'Playfair Display, serif'
  },
  header: {
    padding: '1.5rem 2rem', borderBottom: '1.5px solid rgba(255,255,255,0.10)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'transparent', flexShrink: 0
  },
  backLink: { color: '#60a5fa', fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none' },
  title: { color: '#e0eaff', fontWeight: 700, fontSize: '1.4rem', margin: 0 },
  messagesContainer: {
    flex: 1, minHeight: 0, overflowY: 'auto' as const, padding: '2rem',
    display: 'flex', flexDirection: 'column' as const, gap: '1.25rem', background: 'transparent'
  },
  emptyState: { color: '#b4c9ff', textAlign: 'center' as const },
  emptyIcon: { width: '4rem', height: '4rem', marginBottom: '1rem', color: '#60a5fa' },
  userMessage: {
    display: 'flex', alignItems: 'flex-end', gap: '0.75rem', maxWidth: '75%',
    alignSelf: 'flex-end', flexDirection: 'row-reverse' as const
  },
  userBubble: {
    padding: '0.75rem 1.25rem', borderRadius: '1.25rem', background: '#6366f1',
    color: '#fff', fontWeight: 500, fontSize: '1.08rem', borderBottomRightRadius: '0.25rem', marginLeft: 8
  },
  botMessage: {
    display: 'flex', alignItems: 'flex-end', gap: '0.75rem', maxWidth: '75%', alignSelf: 'flex-start'
  },
  botBubble: {
    padding: '0.75rem 1.25rem', borderRadius: '1.25rem', background: 'rgba(80,80,90,0.18)',
    color: '#e0eaff', fontWeight: 500, fontSize: '1.08rem', border: '1px solid #333',
    borderBottomLeftRadius: '0.25rem', marginRight: 8, whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const, fontFamily: 'Playfair Display, serif', margin: 0,
    backgroundClip: 'padding-box' as const, overflowX: 'auto' as const
  },
  form: {
    display: 'flex', padding: '1.5rem 2rem', borderTop: '1.5px solid rgba(255,255,255,0.10)',
    background: 'transparent', gap: '0.75rem', alignItems: 'center'
  },
  input: {
    flexGrow: 1, borderRadius: '2rem', border: '1px solid #333', background: 'rgba(80,80,90,0.18)',
    color: '#e0eaff', padding: '0.9rem 1.25rem', fontSize: '1rem', margin: 0, outline: 'none',
    boxShadow: 'none', backdropFilter: 'blur(2px)', fontFamily: 'Playfair Display, serif'
  },
  sendBtn: {
    borderRadius: 12, background: 'rgba(17, 24, 39, 0.9)', fontFamily: 'Playfair Display, serif', fontWeight: 500,
    letterSpacing: '0.02em', fontSize: '1rem', padding: '0.75rem 1.5rem', border: '1px solid rgba(255, 255, 255, 0.25)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', transition: 'all 0.2s ease', outline: 'none'
  },
  error: { padding: '0 1.5rem', color: '#f87171' }
};

const UserAvatar = () => (
  <div className="message-avatar user-avatar">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  </div>
);

const BotAvatar = () => (
  <div className="message-avatar bot-avatar">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.5 1.591L5.22 12.5m13.5 0l-4.04-4.04a2.25 2.25 0 00-1.591-.5H9.75V3.104m0 5.714h-1.5a1.5 1.5 0 00-1.5 1.5v4.5a1.5 1.5 0 001.5 1.5h1.5m0-6.75h.008v.008H9.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  </div>
);

const TypingIndicator = () => (
  <div className="typing-indicator">
    <span></span>
    <span></span>
    <span></span>
  </div>
);

const Chat: React.FC = () => {
  const { pdfId } = useParams<ChatParams>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfInfo, setPdfInfo] = useState<PDF | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPdfInfo({ id: Number(pdfId), title: `PDF Chat`, filename: '' });
  }, [pdfId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    const optimisticUserMessage: ChatMessage = {
      id: Date.now(),
      query: query,
      response: '',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticUserMessage]);
    setQuery('');

    try {
      const res = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: optimisticUserMessage.query }),
      });
      const data = await res.json();
      setMessages(prevMessages => prevMessages.map(msg =>
        msg.id === optimisticUserMessage.id
          ? { ...msg, response: data.answer || 'Sorry, no answer found.' }
          : msg
      ));
    } catch (err) {
      setError('Failed to get a response. Please try again.');
      setMessages(prev => prev.filter(msg => msg.id !== optimisticUserMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const handleBtnHover = (e: React.MouseEvent<HTMLButtonElement>, isHover: boolean) => {
    if (!(loading || !query.trim())) {
      if (isHover) {
        e.currentTarget.style.background = 'rgba(31, 41, 55, 0.95)';
        e.currentTarget.style.color = '#f9fafb';
        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.35)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      } else {
        e.currentTarget.style.background = 'rgba(17, 24, 39, 0.9)';
        e.currentTarget.style.color = '#e5e7eb';
        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.25)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
      }
    }
  };

  const handleBtnFocus = (e: React.FocusEvent<HTMLButtonElement>, isFocus: boolean) => {
    if (!(loading || !query.trim())) {
      e.currentTarget.style.boxShadow = isFocus 
        ? '0 0 0 2px rgba(255, 255, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)' 
        : '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
  };

  const isDisabled = loading || !query.trim();

  return (
    <div style={styles.container}>
      <div style={styles.chatContainer}>
        <div style={styles.header}>
          <Link to="/dashboard" style={styles.backLink}>← Back</Link>
          <h1 style={styles.title}>{pdfInfo ? pdfInfo.title : 'Chat'}</h1>
        </div>
        
        <div style={styles.messagesContainer}>
          {messages.length === 0 && !loading ? (
            <div style={styles.emptyState}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={styles.emptyIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>Ask anything</h3>
              <p>Start a conversation by typing your question below.</p>
            </div>
          ) : (
            messages.map((message) => (
              <React.Fragment key={message.id}>
                <div style={styles.userMessage}>
                  <div style={styles.userBubble}>{message.query}</div>
                  <UserAvatar />
                </div>
                {message.response && (
                  <div style={styles.botMessage}>
                    <BotAvatar />
                    <pre style={styles.botBubble}>{message.response}</pre>
                  </div>
                )}
              </React.Fragment>
            ))
          )}
          
          {loading && (
            <div style={styles.botMessage}>
              <BotAvatar />
              <div style={styles.botBubble}>
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {error && <p style={styles.error}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
            disabled={loading}
            style={styles.input}
          />
          <button 
            type="submit" 
            disabled={isDisabled}
            style={{
              ...styles.sendBtn,
              color: isDisabled ? '#b4c9ff' : '#38bdf8',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.5 : 1
            }}
            onMouseOver={(e) => handleBtnHover(e, true)}
            onMouseOut={(e) => handleBtnHover(e, false)}
            onFocus={(e) => handleBtnFocus(e, true)}
            onBlur={(e) => handleBtnFocus(e, false)}
          >
            Send
          </button>
        </form>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Chat;
