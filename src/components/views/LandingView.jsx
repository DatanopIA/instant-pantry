import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { Sparkles, ArrowRight, Scan, Utensils, Zap, Globe } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const LandingView = () => {
    const { setUser, setIsPro } = usePantry();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            title: "¿CANSADO DE TIRAR COMIDA?",
            desc: "No desperdicies más. Nuestra IA detecta lo que tienes y te ayuda a aprovecharlo al máximo.",
            icon: <Scan size={32} />,
            color: "#84A98C"
        },
        {
            title: "¿NO SABES QUÉ COCINAR?",
            desc: "Tu chef IA personal diseña recetas exclusivas con los ingredientes que ya están en tu despensa.",
            icon: <Utensils size={32} />,
            color: "#D88C51"
        },
        {
            title: "AHORRA TIEMPO Y DINERO",
            desc: "Organización inteligente que te avisa antes de que tus alimentos caduquen.",
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
        if (e) e.preventDefault();
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

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin }
            });
            if (error) throw error;
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
            alignItems: 'center',
            padding: '1rem'
        }}>
            {/* Background Effects */}
            <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.15) 0%, transparent 70%)', filter: 'blur(120px)', zIndex: 0 }} />

            <div className="landing-container" style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '1200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '3rem',
                minHeight: '90vh',
                padding: '2rem 1rem'
            }}>

                {/* Visual Side / Carousel */}
                <div className="landing-visual" style={{
                    width: '100%',
                    maxWidth: '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    textAlign: 'center',
                    alignItems: 'center'
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="brand-badge"
                        style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                    >
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Sparkles size={20} />
                        </div>
                        <span style={{ fontWeight: 900, letterSpacing: '2px', fontSize: '0.9rem', opacity: 0.8 }}>INSTANT PANTRY</span>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h1 style={{
                                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                                fontWeight: 950,
                                lineHeight: 1.1,
                                letterSpacing: '-2px',
                                marginBottom: '1.5rem'
                            }}>
                                <span style={{
                                    background: `linear-gradient(135deg, var(--primary) 0%, #E9EDC9 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: 'inline-block'
                                }}>
                                    {steps[activeStep].title}
                                </span>
                            </h1>
                            <p style={{ fontSize: '1.2rem', lineHeight: 1.5, color: 'var(--text-muted)', maxWidth: '500px', marginBottom: '2rem' }}>
                                {steps[activeStep].desc}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveStep(i)}
                                style={{
                                    width: i === activeStep ? '30px' : '8px',
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
                <div className="landing-interaction" style={{ width: '100%', maxWidth: '450px' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="premium-card"
                        style={{
                            padding: '2rem',
                            borderRadius: '2.5rem',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.4)',
                            width: '100%'
                        }}
                    >
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>Entra ahora y <br />empieza a cocinar.</h2>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    padding: '1.1rem',
                                    borderRadius: '1.25rem',
                                    background: 'var(--glass)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-main)',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    fontSize: '0.95rem'
                                }}
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
                                Continuar con Google
                            </motion.button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                                <span style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 700 }}>o con email</span>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                            </div>

                            <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1rem' }}>
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1.1rem',
                                        borderRadius: '1.25rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-main)',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                    type="submit"
                                    style={{
                                        background: 'var(--primary)',
                                        color: '#000',
                                        padding: '1.1rem',
                                        borderRadius: '1.25rem',
                                        fontWeight: 900,
                                        fontSize: '0.9rem',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {loading ? 'CARGANDO...' : 'ENVIAR ENLACE'}
                                    <ArrowRight size={20} />
                                </motion.button>
                            </form>
                        </div>

                        <div style={{
                            marginTop: '2rem',
                            paddingTop: '1.5rem',
                            borderTop: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: 900, fontSize: '1rem' }}>+10k</div>
                                <div style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.5 }}>RECETAS</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: 900, fontSize: '1rem' }}>4.9/5</div>
                                <div style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.5 }}>VALORACIÓN</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                <Globe size={14} style={{ opacity: 0.5 }} />
                                <span style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.5 }}>MULTIDIOMA</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Responsive styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (min-width: 1024px) {
                    .landing-container {
                        flex-direction: row !important;
                        gap: 5rem !important;
                        text-align: left !important;
                    }
                    .landing-visual {
                        text-align: left !important;
                        align-items: flex-start !important;
                    }
                }
                @media (max-width: 600px) {
                    .landing-visual h1 { fontSize: 2.5rem !important; }
                    .premium-card { padding: 1.5rem !important; }
                }
            `}} />
        </div>
    );
};

export default LandingView;
