import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Loader2 } from 'lucide-react';
import api from '../services/api';
import DewateringMascot from './DewateringMascot';

const DewateringChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: '¡Hola! Soy el Ingeniero Virtual de Dewatering Solutions. ¿En qué le puedo ayudar hoy con nuestros equipos o procesos?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Send chat history (excluding the first welcome message if we want to save tokens, but let's send it all)
      const history = messages.slice(1).map(m => ({ role: m.role, text: m.text }));
      
      const response = await api.post('/chat', {
        message: userMessage,
        history: history
      });

      setMessages(prev => [...prev, { role: 'model', text: response.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Lo siento, hubo un error al procesar su consulta. Por favor intente más tarde o contacte a soporte.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante para abrir el chat */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 15px rgba(54, 124, 252, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageSquare size={28} />
        </button>
      )}

      {/* Ventana de Chat Flotante */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '380px',
          height: '600px',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 9999,
          border: '1px solid var(--border-color)'
        }}>
          {/* Header del Chat */}
          <div style={{
            background: 'var(--accent-gradient)',
            color: 'white',
            padding: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <DewateringMascot isPasswordFocused={false} hasError={false} mouseX={0} mouseY={0} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Ingeniero Virtual</h3>
                <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 6, height: 6, backgroundColor: '#4ade80', borderRadius: '50%', display: 'inline-block' }}></span>
                  En línea
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Área de mensajes */}
          <div style={{
            flex: 1,
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: '8px'
              }}>
                {msg.role === 'model' && (
                  <div style={{ 
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                  }}>
                    <MessageSquare size={14} color="var(--accent-primary)" />
                  </div>
                )}
                
                <div style={{
                  maxWidth: '75%',
                  padding: '0.85rem 1rem',
                  borderRadius: '16px',
                  backgroundColor: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-primary)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                  borderBottomLeftRadius: msg.role === 'model' ? '4px' : '16px',
                  border: msg.role === 'model' ? '1px solid var(--border-color)' : 'none'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <Loader2 size={14} color="var(--accent-primary)" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                </div>
                <div style={{
                  padding: '0.5rem 1rem', borderRadius: '16px', backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)'
                }}>
                  Analizando...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-primary)',
            borderTop: '1px solid var(--border-color)'
          }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Escribe tu consulta técnica..."
                style={{
                  flex: 1,
                  padding: '0.85rem 1rem',
                  borderRadius: '99px',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: input.trim() && !isLoading ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: input.trim() && !isLoading ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                <Send size={18} style={{ marginLeft: '2px' }} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DewateringChatbot;
