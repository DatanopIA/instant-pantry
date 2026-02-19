import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Heart, Scan, Utensils } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const LandingView = () => {
    const { setUser, setIsPro, theme } = usePantry();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            title: "ESCANEO AGÉNTICO",
            desc: "Visión artificial que reconoce cada ingrediente en segundos.",
            icon: <Scan size={32} />,
            color: "#84A98C"
        },
        {
            title: "IA CHEF GOURMET",
            desc: "Recetas de estrella Michelin con lo que ya tienes en casa.",
            icon: <Utensils size={32} />,
            color: "#D88C51"
        },
        {
            title: "IMPACTO POSITIVO",
            desc: "Reduce el desperdicio alimentario mientras ahorras tiempo.",
            icon: <Zap size={32} />,
            color: "#A4C3A2"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: window.location.origin },
            });
            if (error) throw error;
            alert('¡Revisa tu email para el enlace de acceso gourmet!');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="landing-outer" style={{
            minHeight: '100vh',
            background: 'var(--bg-color)',
            color: 'var(--text-main)',
            position: 'relative',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Background Effects */}
            <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.15) 0%, transparent 70%)', filter: 'blur(120px)', zIndex: 0 }} />
            <div style={{ position: 'fixed', bottom: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(188, 108, 37, 0.1) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }} />

            <div className="landing-container" style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '1200px',
                padding: '2rem',
                display: 'grid',
                gridTemplateColumns: 'minmax(300px, 1fr) 400px',
                gap: '4rem',
                alignItems: 'center',
                minHeight: '100vh'
            }}>

                {/* Visual Side / Carousel */}
                <div className="landing-visual" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="brand-badge"
                        style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                    >
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Sparkles size={20} />
                        </div>
                        <span style={{ fontWeight: 900, letterSpacing: '2px', fontSize: '0.9rem', opacity: 0.8 }}>VANGUARD OS</span>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h1 style={{ fontSize: '4.5rem', fontWeight: 950, lineHeight: 0.9, letterSpacing: '-4px', marginBottom: '1.5rem' }}>
                                COCINA <br />
                                <span style={{
                                    background: `linear-gradient(135deg, var(--primary) 0%, #E9EDC9 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: 'inline-block'
                                }}>
                                    {steps[activeStep].title.split(' ')[0]}
                                </span> <br />
                                {steps[activeStep].title.split(' ').slice(1).join(' ')}
                            </h1>
                            <p style={{ fontSize: '1.4rem', lineHeight: 1.4, color: 'var(--text-muted)', maxWidth: '500px', marginBottom: '3rem' }}>
                                {steps[activeStep].desc}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Progress indicators for carousel */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveStep(i)}
                                style={{
                                    width: i === activeStep ? '40px' : '10px',
                                    height: '6px',
                                    borderRadius: '3px',
                                    background: i === activeStep ? 'var(--primary)' : 'var(--border-color)',
                                    transition: 'all 0.4s ease',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Interaction Side / Login */}
                <div className="landing-interaction">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="premium-card"
                        style={{
                            padding: '2.5rem',
                            borderRadius: '2.5rem',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.4)',
                            width: '100%'
                        }}
                    >
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'left' }}>Comienza tu <br />viaje culinario.</h2>

                        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1.2rem' }}>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1.25rem 1.75rem',
                                        borderRadius: '1.5rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-main)',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                type="submit"
                                style={{
                                    background: 'var(--primary)',
                                    color: '#000',
                                    padding: '1.25rem',
                                    borderRadius: '1.5rem',
                                    fontWeight: 900,
                                    fontSize: '1rem',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    cursor: 'pointer',
                                    boxShadow: '0 20px 40px rgba(var(--primary-rgb), 0.2)'
                                }}
                            >
                                {loading ? 'PREPARANDO...' : 'RECLAMAR MI ACCESO'}
                                <ArrowRight size={20} />
                            </motion.button>
                        </form>

                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <button
                                onClick={() => {
                                    const demoUser = { id: 'demo-123', email: 'gourmet@demo.com', user_metadata: { full_name: 'Gourmet Demo' } };
                                    setUser(demoUser);
                                    setIsPro(true);
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--primary)',
                                    fontSize: '0.8rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    opacity: 0.9,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    width: '100%'
                                }}
                            >
                                <Sparkles size={14} /> EXPLORAR COMO DEMO
                            </button>
                        </div>

                        <div style={{
                            marginTop: '2.5rem',
                            paddingTop: '2rem',
                            borderTop: '1px solid var(--border-color)',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem'
                        }}>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 900, fontSize: '1.2rem' }}>92%</div>
                                <div style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.5, letterSpacing: '1px' }}>EFICIENCIA</div>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 900, fontSize: '1.2rem' }}>2.0</div>
                                <div style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.5, letterSpacing: '1px' }}>GEMINI ULTIMATE</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Mobile Responsive adjustments (CSS in JS style for simplicity) */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 900px) {
                    .landing-container {
                        grid-template-columns: 1fr;
                        padding-top: 6rem;
                        gap: 2rem;
                        text-align: center;
                    }
                    .landing-visual h1 { fontSize: 3.5rem !important; }
                    .landing-visual p { margin-left: auto; margin-right: auto; }
                    .landing-visual .brand-badge { justify-content: center; }
                    .landing-visual .progress-dots { justify-content: center; }
                    .landing-interaction { margin-bottom: 4rem; }
                }
            `}} />
        </div>
    );
};

export default LandingView;
