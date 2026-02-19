import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { Send, Sparkles, Trash2, User, Bot } from 'lucide-react';

const AIChatView = () => {
    const { t, inventory, recipes, language } = usePantry();
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: t('saludo_ia'), time: new Date() }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const sendMessage = async (overrideText = null) => {
        const text = overrideText || inputText;
        if (!text.trim()) return;

        const newMessage = { id: Date.now(), sender: 'user', text, time: new Date() };
        setMessages(prev => [...prev, newMessage]);
        if (!overrideText) setInputText('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    history: messages.map(m => ({ sender: m.sender, text: m.text })),
                    inventory,
                    recipes
                })
            });
            const data = await response.json();

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                text: data.text || "Lo siento, mi conexión gourmet ha fallado brevemente.",
                time: new Date()
            }]);
        } catch (err) {
            console.error('Chat error:', err);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '100px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header className="pt-8 pb-4 flex justify-between items-center">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={20} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>CHEF VIRTUAL</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-green)' }}></div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.6 }}>CONECTADO CON GEMINI 2.0</span>
                        </div>
                    </div>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMessages([{ id: 1, sender: 'bot', text: t('saludo_ia'), time: new Date() }])}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}
                >
                    <Trash2 size={20} />
                </motion.button>
            </header>

            {/* Chat Messages */}
            <div
                ref={scrollRef}
                style={{ flex: 1, overflowY: 'auto', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                className="hide-scrollbar"
            >
                <AnimatePresence>
                    {messages.map((m) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            style={{
                                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                display: 'flex',
                                gap: '10px',
                                flexDirection: m.sender === 'user' ? 'row-reverse' : 'row'
                            }}
                        >
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: m.sender === 'user' ? 'var(--glass)' : 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                border: '1px solid var(--border-color)'
                            }}>
                                {m.sender === 'user' ? <User size={16} /> : <Bot size={16} color="white" />}
                            </div>
                            <div style={{
                                padding: '1rem',
                                borderRadius: m.sender === 'user' ? '1.25rem 0.25rem 1.25rem 1.25rem' : '0.25rem 1.25rem 1.25rem 1.25rem',
                                background: m.sender === 'user' ? 'var(--primary)' : 'var(--glass)',
                                color: m.sender === 'user' ? 'white' : 'var(--text-main)',
                                border: '1px solid var(--border-color)',
                                fontSize: '0.95rem',
                                lineHeight: 1.5,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}>
                                {m.text}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bot size={16} color="white" />
                        </div>
                        <div className="glass-panel" style={{ padding: '0.75rem 1.25rem', borderRadius: '0.25rem 1.25rem 1.25rem 1.25rem' }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <span className="dot-animate" style={{ fontSize: '1.2rem', lineHeight: 1 }}>.</span>
                                <span className="dot-animate" style={{ fontSize: '1.2rem', lineHeight: 1, animationDelay: '0.2s' }}>.</span>
                                <span className="dot-animate" style={{ fontSize: '1.2rem', lineHeight: 1, animationDelay: '0.4s' }}>.</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Sugerencias Rápidas */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '0.5rem 0', marginBottom: '0.5rem' }} className="hide-scrollbar">
                {[
                    { text: "¿Qué cocino hoy?", icon: "🍳" },
                    { text: "¿Qué va a caducar?", icon: "⏰" },
                    { text: "Dime una receta rápida", icon: "⚡" },
                    { text: "Planifica mi semana", icon: "📅" }
                ].map((chip) => (
                    <motion.button
                        key={chip.text}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => sendMessage(chip.text)}
                        style={{
                            flexShrink: 0,
                            padding: '0.6rem 1rem',
                            borderRadius: '1rem',
                            background: 'var(--glass)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <span>{chip.icon}</span> {chip.text}
                    </motion.button>
                ))}
            </div>

            {/* Input Area */}
            <div style={{ padding: '1rem 0 2rem 0' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder={t('preguntar_ia')}
                        style={{
                            width: '100%',
                            padding: '1.25rem 4rem 1.25rem 1.5rem',
                            borderRadius: '1.5rem',
                            background: 'var(--glass)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            outline: 'none',
                            fontSize: '1rem',
                            backdropFilter: 'blur(20px)'
                        }}
                    />
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => sendMessage()}
                        style={{
                            position: 'absolute',
                            right: '8px',
                            width: '44px',
                            height: '44px',
                            borderRadius: '1rem',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <Send size={20} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default AIChatView;
