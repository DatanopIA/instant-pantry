import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { ArrowRight, CookingPot, ShieldCheck, Star, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AuroraBackground } from '../ui/AuroraBackground';

const LandingView = () => {
    const { loginGuest, goTo } = usePantry();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Verificación de salud: Asegurar que el contexto está cargado
    useEffect(() => {
        console.log("LandingView montada. usePantry disponible:", !!loginGuest);
    }, [loginGuest]);

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
        <AuroraBackground>
            {/* Main Wrapper: min-h-screen to allow enough space */}
            <div className="relative z-20 w-full max-w-[1400px] mx-auto min-h-screen px-6 py-6 md:px-12 md:py-12 flex flex-col justify-between">

                {/* Header Section */}
                <header className="flex justify-between items-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <CookingPot size={22} className="md:w-[26px] md:h-[26px]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-xs md:text-sm uppercase tracking-[0.3em] text-main leading-tight">Instant Pantry</span>
                            <span className="text-[9px] md:text-[10px] font-bold text-primary-light uppercase tracking-widest mt-0.5">Master Edition 2026</span>
                        </div>
                    </motion.div>

                    <nav className="hidden md:flex gap-10 items-center text-[11px] font-black uppercase tracking-widest text-muted">
                        <span className="cursor-pointer hover:text-primary transition-all duration-300">Explorar</span>
                        <span className="cursor-pointer hover:text-primary transition-all duration-300">Club Gourmet</span>
                    </nav>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-24">

                    {/* Hero Visual Section */}
                    <div className="w-full lg:flex-1 flex flex-col items-center justify-center relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full aspect-square max-w-[320px] md:max-w-[500px] lg:max-w-[650px]"
                        >
                            <div className="absolute inset-0 bg-primary-soft/30 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />

                            <div className="landing-image-circle border-[6px] border-white/80 backdrop-blur-sm shadow-premium relative z-10">
                                <img
                                    src="/gourmet-landing.png"
                                    alt="Gourmet Ingredients"
                                    className="scale-110 object-cover w-full h-full"
                                />
                            </div>

                            {/* Trust Badge Floating */}
                            <motion.div
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-4 right-0 md:top-12 md:right-4 glass-panel p-4 md:p-6 rounded-[2rem] shadow-premium z-20 flex flex-col gap-1 md:gap-2"
                            >
                                <div className="flex text-primary gap-1">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                                </div>
                                <span className="text-[9px] md:text-[11px] font-black uppercase text-main tracking-[0.2em]">Recetas Master IA</span>
                                <div className="w-full h-px bg-primary/10 mt-1" />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Authentication Section */}
                    <div className="w-full lg:flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-8 max-w-[480px]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col gap-4"
                        >
                            <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px] md:text-xs">
                                Innovación Culinaria
                            </span>
                            <h1 className="text-5xl md:text-8xl font-black text-main leading-[0.9] tracking-tighter">
                                Tu cocina, <br />
                                <span className="text-primary-light italic font-serif">rediseñada.</span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="w-full flex flex-col gap-6"
                        >
                            {/* Primary Action */}
                            <button
                                onClick={() => {
                                    console.log("Botón Invitado Clicked");
                                    loginGuest();
                                }}
                                className="btn-primary w-full py-5 rounded-[2rem] text-sm group"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    COMENZAR EXPERIENCIA INVITADO
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>

                            {/* Separator */}
                            <div className="relative flex items-center gap-4 py-2">
                                <div className="flex-1 h-px bg-border-color/50" />
                                <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">O accede con</span>
                                <div className="flex-1 h-px bg-border-color/50" />
                            </div>

                            {/* Secondary Actions */}
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-3 w-full py-4 rounded-[1.5rem] bg-white border border-border-color hover:border-primary/30 transition-all duration-300 font-bold text-xs shadow-sm"
                                >
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                    Continuar con Google
                                </button>

                                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" />
                                        <input
                                            type="email"
                                            placeholder="Introduce tu Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full py-4 pl-14 pr-5 rounded-[1.5rem] bg-white/60 backdrop-blur-md border border-border-color focus:border-primary focus:bg-white outline-none text-[13px] font-medium shadow-sm transition-all"
                                        />
                                    </div>
                                    <button
                                        disabled={loading || !email}
                                        type="submit"
                                        className="w-full py-4 rounded-[1.5rem] bg-main text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primary transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Procesando...' : 'Recibir Enlace Mágico'}
                                    </button>
                                </form>
                            </div>

                            {/* Trust Badge */}
                            <div className="flex items-center justify-center lg:justify-start gap-3 mt-2">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                                    <ShieldCheck size={16} className="text-primary" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary/70">Seguridad Gourmet</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </main>

                {/* Footer Section */}
                <footer className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-widest opacity-40 border-t border-border-color/20">
                    <p>© 2026 DatanopIA Labs. Inspirando cocinas inteligentes.</p>
                    <div className="flex gap-8">
                        <span className="cursor-pointer hover:opacity-100 transition-opacity">Privacidad</span>
                        <span className="cursor-pointer hover:opacity-100 transition-opacity">Términos</span>
                    </div>
                </footer>
            </div>
        </AuroraBackground>
    );
};

export default LandingView;
