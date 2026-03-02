import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Camera, ChefHat, LineChart, ListChecks, ChevronRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import AuthModal from '../components/AuthModal';

const FEATURES = [
    {
        icon: <Camera className="w-10 h-10 text-emerald-600" />,
        title: 'Escaneo con IA',
        description: 'Sube tu ticket de compra y nuestra Inteligencia Artificial clasifica y añade los productos a tu despensa al instante.',
        color: 'from-emerald-50/90 to-white/90',
        borderColor: 'border-emerald-100'
    },
    {
        icon: <ChefHat className="w-10 h-10 text-blue-600" />,
        title: 'Chef Personal',
        description: 'Genera recetas automáticas y deliciosas con los ingredientes que están a punto de caducar. Cero desperdicio.',
        color: 'from-blue-50/90 to-white/90',
        borderColor: 'border-blue-100'
    },
    {
        icon: <LineChart className="w-10 h-10 text-purple-600" />,
        title: 'Analíticas Inteligentes',
        description: 'Visualiza tus gastos, estadísticas de consumo y ahorra más de 50€ al mes tomando mejores decisiones.',
        color: 'from-purple-50/90 to-white/90',
        borderColor: 'border-purple-100'
    },
    {
        icon: <ListChecks className="w-10 h-10 text-amber-600" />,
        title: 'Lista Automática',
        description: 'Cuando acabas un producto de la despensa, se añade automáticamente a tu lista de la compra sincronizada.',
        color: 'from-amber-50/90 to-white/90',
        borderColor: 'border-amber-100'
    }
];

export default function LandingPage() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(false);

    const openAuth = (loginMode) => {
        setIsLoginMode(loginMode);
        setIsAuthOpen(true);
    };

    // Escrol automático del carrusel cada 4.5 segundos
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % FEATURES.length);
        }, 4500);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-gray-900 selection:bg-emerald-500/30 overflow-x-hidden font-display relative">

            {/* Imagen de Fondo + Blur Overlay */}
            <div
                className="fixed inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Capa blanca semitransparente con desenfoque para que destaquen los elementos pero se intuya la cocina */}
                <div className="absolute inset-0 bg-white/75 backdrop-blur-md"></div>
                {/* Acento sutil de color verde en fondo */}
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-emerald-400/10 blur-[150px] rounded-full mix-blend-multiply" />
            </div>

            {/* Navbar Superior */}
            <nav className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Instant Pantry Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-emerald-500/20 object-cover" />
                    <span className="text-xl font-bold tracking-tight text-gray-800">Instant Pantry</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => openAuth(true)}
                        className="text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors"
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => openAuth(false)}
                        className="hidden sm:inline-flex text-sm font-bold bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-md"
                    >
                        Crear Cuenta
                    </button>
                </div>
            </nav>

            <main className="relative z-10 px-6 lg:px-12 pt-12 lg:pt-16 pb-20 max-w-7xl mx-auto">

                {/* HERO SECTION */}
                <div className="max-w-4xl mx-auto text-center space-y-8 mb-24 lg:mb-32">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-emerald-100 backdrop-blur-xl mb-4 shadow-sm"
                    >
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm text-emerald-800 font-medium tracking-wide">La IA aplicada a tu cocina</span>
                    </Motion.div>

                    <Motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                        className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-gray-900 leading-[1.1]"
                    >
                        Cocina brillante, <br className="hidden lg:block" /> sin complicaciones.
                    </Motion.h1>

                    <Motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        Gestiona tu despensa, evita el desperdicio y genera deliciosas recetas con un escaneo rápido. Todo envuelto en un diseño impecable.
                    </Motion.p>

                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
                    >
                        <button
                            onClick={() => openAuth(false)}
                            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-[0_12px_30px_-10px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 group transform hover:scale-105"
                        >
                            Probar Gratis Ahora
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-4 bg-white/80 hover:bg-white backdrop-blur-xl text-gray-800 font-semibold rounded-2xl border border-gray-200 shadow-sm transition-all shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)]"
                        >
                            Ver Planes
                        </button>
                    </Motion.div>
                </div>

                {/* CAROUSEL SECTION */}
                <div className="max-w-5xl mx-auto mb-32 relative z-20">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">Magia en cada rincón</h2>
                    </div>

                    <div className="relative aspect-[4/3] sm:aspect-[21/9] lg:aspect-[24/10] w-full rounded-[2.5rem] overflow-hidden bg-white/40 backdrop-blur-2xl border border-white/60 p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                        <AnimatePresence mode="wait">
                            <Motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                className={`w-full h-full rounded-[2rem] bg-gradient-to-br ${FEATURES[currentSlide].color} border ${FEATURES[currentSlide].borderColor} flex flex-col items-center justify-center text-center px-6 lg:px-20 relative overflow-hidden shadow-inner`}
                            >
                                {/* Círculo de luz decorativo */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(255,255,255,0.8)_0%,transparent_60%)] pointer-events-none" />

                                <div className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-6 border border-gray-100 z-10">
                                    {FEATURES[currentSlide].icon}
                                </div>
                                <h3 className="text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight text-gray-900 z-10 drop-shadow-sm">
                                    {FEATURES[currentSlide].title}
                                </h3>
                                <p className="text-gray-600 lg:text-xl max-w-2xl font-medium leading-relaxed z-10">
                                    {FEATURES[currentSlide].description}
                                </p>
                            </Motion.div>
                        </AnimatePresence>

                        {/* Carousel Indicators */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30 bg-white/60 backdrop-blur-xl px-5 py-3 rounded-full border border-white/80 shadow-sm">
                            {FEATURES.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-10 bg-emerald-500' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Ir a diapositiva ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* METRICS SECTION */}
                <div className="max-w-4xl mx-auto text-center mb-32 bg-white/60 border border-white/80 shadow-xl shadow-gray-200/50 rounded-[2.5rem] p-12 backdrop-blur-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200/50">
                        <div className="space-y-3 py-4 md:py-0">
                            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">50€+</div>
                            <div className="text-gray-600 font-bold uppercase tracking-wider text-sm">Ahorro Medio Mensual</div>
                        </div>
                        <div className="space-y-3 py-4 md:py-0">
                            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">10k+</div>
                            <div className="text-gray-600 font-bold uppercase tracking-wider text-sm">Escaneos IA Realizados</div>
                        </div>
                        <div className="space-y-3 py-4 md:py-0">
                            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">100%</div>
                            <div className="text-gray-600 font-bold uppercase tracking-wider text-sm">Control de tu Cocina</div>
                        </div>
                    </div>
                </div>

                {/* CTA / PRICING SECTION */}
                <div id="pricing" className="max-w-5xl mx-auto scroll-mt-24">
                    <div className="p-[1px] rounded-[2.5rem] bg-gradient-to-b from-emerald-200 to-white/50 shadow-2xl">
                        <div className="bg-white p-8 lg:p-14 rounded-[2.5rem] relative overflow-hidden h-full w-full">
                            {/* Blur highlights in card */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100 blur-[100px] rounded-full" />
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 blur-[100px] rounded-full" />

                            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                                <div className="flex-1 space-y-6 text-center md:text-left">
                                    <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto md:mx-0 drop-shadow-sm" />
                                    <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">Únete al movimiento.</h2>
                                    <p className="text-gray-600 text-lg leading-relaxed max-w-xl font-medium">
                                        Empieza hoy con nuestro plan gratuito para organizar tu despensa, o desbloquea todo el poder de las Recetas IA y estadísticas avanzadas con Premium.
                                    </p>
                                </div>

                                <div className="flex flex-col w-full md:w-auto gap-4">
                                    <button
                                        onClick={() => openAuth(false)}
                                        className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                                    >
                                        Crear Cuenta Gratis
                                    </button>
                                    <button
                                        onClick={() => navigate('/premium')}
                                        className="px-8 py-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-2xl border border-emerald-200 transition-all flex items-center justify-center gap-2 text-lg shadow-sm"
                                    >
                                        <Zap className="w-6 h-6 text-amber-500" />
                                        Descubrir Premium
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* FOOTER */}
            <footer className="border-t border-gray-200/60 py-10 mt-20 relative z-10 bg-white/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center gap-4">
                    <img src="/logo.png" alt="Instant Pantry Logo" className="w-8 h-8 rounded-lg shadow-sm object-cover" />
                    <p className="text-gray-500 text-sm font-medium">© {new Date().getFullYear()} Instant Pantry. Todos los derechos reservados.</p>
                </div>
            </footer>

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                defaultIsLogin={isLoginMode}
            />
        </div>
    );
}
