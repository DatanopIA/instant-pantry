import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { ArrowRight, Scan, Utensils, Zap, Globe, CookingPot } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AuroraBackground } from '../ui/AuroraBackground';
import { MagneticText } from '../ui/MagneticText';

const LandingView = () => {
    const { loginGuest } = usePantry();
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
    }, [steps.length]);

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
        <AuroraBackground className="min-h-screen">
            <div className="relative z-10 w-full max-w-[1400px] px-6 py-12 md:py-24 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24">

                {/* Brand & Content Side */}
                <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-8 md:gap-12">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#84A98C] flex items-center justify-center text-white shadow-lg shadow-[#84A98C]/20">
                            <CookingPot size={22} strokeWidth={2.5} />
                        </div>
                        <span className="font-black tracking-[0.2em] text-xs md:text-sm uppercase opacity-80">INSTANT PANTRY</span>
                    </motion.div>

                    <div className="flex flex-col gap-6 md:gap-10 min-h-[300px] md:min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col gap-6"
                            >
                                <div className="hidden md:block">
                                    <MagneticText
                                        text={steps[activeStep].title}
                                        hoverText="REVOLUCIÓN GOURMET"
                                        className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-zinc-900"
                                        circleSize={280}
                                        variant="inverted"
                                    />
                                </div>

                                <h1 className="md:hidden text-5xl font-black tracking-tighter leading-[0.9] text-zinc-900">
                                    {steps[activeStep].title}
                                </h1>

                                <p className="text-lg md:text-2xl text-zinc-600/80 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                    {steps[activeStep].desc}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-center lg:justify-start gap-3 mt-4">
                            {steps.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveStep(i)}
                                    className={`h-2 rounded-full transition-all duration-500 ${i === activeStep ? 'w-12 bg-[#84A98C]' : 'w-2 bg-zinc-200 hover:bg-zinc-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Interaction Side / Login */}
                <div className="w-full max-w-[480px] perspective-1000">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-white/80 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] border border-white/50 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden"
                    >
                        {/* Subtle Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#84A98C]/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10 flex flex-col gap-8">
                            <div className="flex flex-col gap-2 text-center">
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900">Bienvenido Chef</h2>
                                <p className="text-zinc-500 font-medium">Entra ahora y transforma tu cocina.</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={loginGuest}
                                    className="w-full py-4 rounded-2xl bg-[#84A98C]/10 border border-[#84A98C]/20 text-[#84A98C] font-black text-xs uppercase tracking-widest shadow-sm hover:bg-[#84A98C]/20 transition-all"
                                >
                                    Explorar como Invitado
                                </motion.button>

                                <div className="flex items-center gap-4 py-2">
                                    <div className="flex-1 h-px bg-zinc-100" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">o con tu cuenta</span>
                                    <div className="flex-1 h-px bg-zinc-100" />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-4 py-4 rounded-2xl bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-all font-bold text-zinc-700"
                                >
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                    Google
                                </motion.button>

                                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                                    <input
                                        type="email"
                                        placeholder="chef@tucocina.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full py-4 px-6 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-[#84A98C] focus:bg-white outline-none transition-all text-zinc-900 font-medium"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={loading}
                                        type="submit"
                                        className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-zinc-900/20"
                                    >
                                        {loading ? 'Preparando...' : 'Acceder'}
                                        <ArrowRight size={18} />
                                    </motion.button>
                                </form>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-zinc-50">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-lg font-black text-zinc-900">+10k</span>
                                    <span className="text-[9px] font-black uppercase text-zinc-400">Recetas</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 border-x border-zinc-100">
                                    <span className="text-lg font-black text-zinc-900">4.9/5</span>
                                    <span className="text-[9px] font-black uppercase text-zinc-400">Rating</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <Globe size={18} className="text-[#84A98C]" />
                                    <span className="text-[9px] font-black uppercase text-zinc-400">Global</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuroraBackground>
    );
};

export default LandingView;
