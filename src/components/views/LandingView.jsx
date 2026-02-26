import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { ArrowRight, CookingPot, ShieldCheck, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AuroraBackground } from '../ui/AuroraBackground';

const LandingView = () => {
    const { loginGuest } = usePantry();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOTP({
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
        <AuroraBackground>
            {/* Main Wrapper: h-screen + overflow-hidden to prevent scroll on mobile */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto h-screen overflow-hidden px-6 py-4 md:px-12 md:py-8 flex flex-col">

                {/* Header: Compact for mobile */}
                <header className="flex justify-between items-center mb-4 md:mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                    >
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                            <CookingPot size={18} className="md:w-[22px] md:h-[22px]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.2em] text-main leading-none">Instant Pantry</span>
                            <span className="text-[8px] md:text-[9px] font-bold text-primary-light uppercase tracking-widest mt-0.5">Master 2026</span>
                        </div>
                    </motion.div>

                    <div className="hidden md:flex gap-8 items-center text-[10px] font-black uppercase tracking-widest text-muted">
                        <span className="cursor-pointer hover:text-primary transition-colors">Características</span>
                        <span className="cursor-pointer hover:text-primary transition-colors">Club Gourmet</span>
                    </div>
                </header>

                {/* Content: Asymmetric Layout */}
                <main className="flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 lg:gap-20 min-h-0">

                    {/* Visual Section: Sized for no-scroll on mobile */}
                    <div className="w-full lg:flex-1 flex items-center justify-center max-h-[35vh] lg:max-h-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full aspect-square max-w-[280px] md:max-w-[450px] lg:max-w-[600px] flex items-center justify-center"
                        >
                            <div className="absolute inset-0 bg-primary-soft/20 rounded-full blur-[60px] md:blur-[100px] -z-1" />

                            <div className="landing-image-circle border-4 border-white shadow-premium">
                                <img
                                    src="/gourmet-landing.png"
                                    alt="Gourmet Ingredients"
                                    className="scale-110"
                                />
                            </div>

                            {/* Floating Card: Hidden on very small mobile if needed, but styled to fit */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-4 -right-4 md:top-10 md:right-0 glass-panel p-3 md:p-5 rounded-2xl shadow-premium z-20 flex flex-col gap-1"
                            >
                                <div className="flex text-primary gap-0.5">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                                </div>
                                <span className="text-[8px] md:text-[10px] font-black uppercase text-main tracking-widest">Master IA</span>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Form Section: Optimized for vertical space */}
                    <div className="w-full lg:flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 md:gap-8 max-w-[450px]">
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col gap-2 md:gap-4"
                        >
                            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                                Inteligencia Culinaria
                            </span>
                            <h1 className="text-4xl md:text-7xl font-black text-main leading-[1] tracking-tighter">
                                Tu cocina, <br />
                                <span className="text-primary-light italic">rediseñada.</span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex flex-col gap-4"
                        >
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={loginGuest}
                                    className="btn-primary w-full md:w-auto py-3.5 px-8"
                                >
                                    Acceso Invitado
                                    <ArrowRight size={18} />
                                </button>

                                <div className="flex flex-col gap-2 pt-2 border-t border-border-color">
                                    <button
                                        onClick={handleGoogleLogin}
                                        disabled={loading}
                                        className="btn-secondary w-full py-3 text-xs"
                                    >
                                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
                                        Google Login
                                    </button>

                                    <form onSubmit={handleLogin} className="flex flex-col gap-2">
                                        <input
                                            type="email"
                                            placeholder="Introduce tu Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full py-3 px-5 rounded-xl bg-white/80 border border-border-color focus:border-primary outline-none text-xs font-bold shadow-sm"
                                        />
                                        <button
                                            disabled={loading}
                                            type="submit"
                                            className="w-full py-3 rounded-xl bg-zinc-900 text-white font-black text-[9px] uppercase tracking-[0.2em]"
                                        >
                                            {loading ? 'Preparando...' : 'Enlace Mágico'}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Trust Badge: Compact */}
                            <div className="flex items-center justify-center lg:justify-start gap-2 opacity-60">
                                <ShieldCheck size={14} className="text-primary-light" />
                                <span className="text-[8px] font-bold uppercase tracking-widest text-muted">Encriptación Grado Militar</span>
                            </div>
                        </motion.div>
                    </div>
                </main>

                {/* Footer: Single line on mobile */}
                <footer className="mt-8 py-4 flex flex-row items-center justify-between text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-40 border-t border-border-color/10">
                    <p>© 2026 DatanopIA Labs.</p>
                    <div className="flex gap-4">
                        <span>Privacidad</span>
                        <span>Términos</span>
                    </div>
                </footer>
            </div>
        </AuroraBackground>
    );
};

export default LandingView;
