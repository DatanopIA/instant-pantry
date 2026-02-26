import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { ArrowRight, CookingPot, Mail, Globe, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const LandingView = () => {
    const { loginGuest } = usePantry();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        if (!email) return;
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOTP({
                email,
                options: { emailRedirectTo: window.location.origin },
            });
            if (error) throw error;
            alert('¡Revisa tu email para el enlace de acceso gourmet!');
        } catch (error) {
            console.error("Login Error:", error);
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
            console.error("Google Login Error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden selection:bg-primary/20">
            {/* Background Layer */}
            <div className="landing-hero-bg" />
            <div className="landing-overlay" />

            {/* Content Layer */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto min-h-screen flex flex-col px-6 md:px-12">

                {/* Header: Much more space from top */}
                <header className="pt-20 md:pt-28 pb-12 flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-premium">
                            <CookingPot size={26} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="font-black text-sm md:text-base uppercase tracking-[0.4em] text-main leading-none">Instant Pantry</h1>
                            <span className="text-[10px] font-bold text-primary tracking-widest mt-1 opacity-70">MASTER EDITION 2026</span>
                        </div>
                    </motion.div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 py-12">

                    {/* Left Side: Hero Text */}
                    <div className="w-full lg:flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 mb-8">
                                <Star size={14} className="text-primary fill-primary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-main">Top 1 Innovación Culinaria</span>
                            </div>

                            <h2 className="text-6xl md:text-[7rem] font-black text-main leading-[0.85] tracking-tighter mb-8">
                                Tu cocina, <br />
                                <span className="text-primary italic font-serif opacity-90">rediseñada.</span>
                            </h2>

                            <p className="text-sm md:text-base text-main/70 font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
                                Transforma tus ingredientes cotidianos en experiencias gourmet asistidas por IA. El futuro de la gastronomía en tu despensa.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Side: Auth Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="w-full max-w-[420px]"
                    >
                        <div className="premium-glass p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden group">
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />

                            <div className="relative z-10 flex flex-col gap-8">
                                <div className="text-center md:text-left">
                                    <h3 className="text-xl font-bold text-main">Bienvenido Chef</h3>
                                    <p className="text-xs text-muted font-medium mt-1">Selecciona tu método de acceso</p>
                                </div>

                                {/* Guest Action */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log("Guest Login Initiated");
                                        loginGuest();
                                    }}
                                    className="btn-primary w-full group relative z-50 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3 py-1">
                                        MODO INVITADO
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>

                                <div className="relative flex items-center gap-4 py-1">
                                    <div className="flex-1 h-px bg-main/10" />
                                    <span className="text-[9px] font-black text-muted uppercase tracking-widest">O con tu cuenta</span>
                                    <div className="flex-1 h-px bg-main/10" />
                                </div>

                                {/* Auth Options */}
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleGoogleLogin();
                                        }}
                                        disabled={loading}
                                        className="btn-secondary w-full relative z-50"
                                    >
                                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
                                        Continuar con Google
                                    </button>

                                    <form onSubmit={handleLogin} className="flex flex-col gap-3">
                                        <div className="relative">
                                            <Mail size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" />
                                            <input
                                                type="email"
                                                placeholder="Email del Chef"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full py-4 pl-12 pr-5 rounded-[1.2rem] bg-white/50 backdrop-blur-sm border border-white/80 focus:border-primary focus:bg-white/80 outline-none text-[12px] font-medium shadow-sm transition-all text-main"
                                            />
                                        </div>
                                        <button
                                            disabled={loading || !email}
                                            type="submit"
                                            className="w-full py-4 rounded-[1.2rem] bg-main text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary transition-all duration-300 disabled:opacity-50 relative z-50"
                                        >
                                            {loading ? 'Preparando...' : 'Acceso por Email'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </main>

                {/* Footer */}
                <footer className="py-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-2 opacity-40">
                        <Globe size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Global Master Access 2026</span>
                    </div>

                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-main/40">
                        <span className="cursor-pointer hover:text-primary transition-colors">Privacidad</span>
                        <span className="cursor-pointer hover:text-primary transition-colors">Club</span>
                        <span className="cursor-pointer hover:text-primary transition-colors">IA Lab</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingView;
