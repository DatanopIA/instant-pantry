import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { ChefHat, Scan, Zap, Sparkles, ChevronRight } from 'lucide-react';

const steps = [
    {
        icon: <Scan size={60} />,
        title: "Escanea tu compra",
        desc: "Usa nuestra IA Vision para añadir productos en segundos desde tus tiquets o directamente desde tu nevera.",
        color: "var(--primary)"
    },
    {
        icon: <ChefHat size={60} />,
        title: "Recetas Inteligentes",
        desc: "Te sugerimos recetas gourmet basadas exclusivamente en lo que ya tienes. Cocina más, desperdicia menos.",
        color: "var(--terrakotta)"
    },
    {
        icon: <Zap size={60} />,
        title: "Chef IA 24/7",
        desc: "Pregunta cualquier duda culinaria o pide substituciones creativas a tu asistente personal con Gemini 2.0.",
        color: "var(--status-green)"
    }
];

const OnboardingView = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const { setShowOnboarding } = usePantry();

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setShowOnboarding(false);
            localStorage.setItem('onboarding_complete', 'true');
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center' }}
                    >
                        <div style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '3rem',
                            background: 'var(--glass)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '3rem',
                            color: steps[currentStep].color,
                            border: '1px solid var(--border-color)',
                            boxShadow: `0 20px 40px rgba(0,0,0,0.2)`
                        }}>
                            {steps[currentStep].icon}
                        </div>

                        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
                            {steps[currentStep].title}
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '300px' }}>
                            {steps[currentStep].desc}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {steps.map((_, i) => (
                        <div key={i} style={{
                            width: i === currentStep ? '24px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            background: i === currentStep ? 'var(--primary)' : 'var(--border-color)',
                            transition: 'all 0.3s ease'
                        }} />
                    ))}
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="btn-primary"
                    style={{ width: '100%', padding: '1.5rem', borderRadius: '1.5rem', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none' }}
                >
                    {currentStep === steps.length - 1 ? 'EMPEZAR EXPERIENCIA' : 'CONTINUAR'}
                    <ChevronRight size={20} />
                </motion.button>

                <button
                    onClick={() => setShowOnboarding(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700 }}
                >
                    Saltar introducción
                </button>
            </div>

            {/* Background flare */}
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.1, zIndex: -1 }}></div>
            <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '250px', height: '250px', background: 'var(--terrakotta)', filter: 'blur(150px)', opacity: 0.1, zIndex: -1 }}></div>
        </div>
    );
};

export default OnboardingView;
