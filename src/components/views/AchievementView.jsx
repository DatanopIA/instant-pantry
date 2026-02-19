import React from 'react';
import { motion } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { ArrowLeft, Award, TrendingUp, Zap, Sparkles, Globe } from 'lucide-react';

const achievements = [
    { id: 1, name: 'Eco Guerrero', icon: '🌱', desc: 'Has evitado el desperdicio de 5kg de comida.', progress: 100 },
    { id: 2, name: 'Chef Veloz', icon: '⚡', desc: '10 recetas preparadas en menos de 15 min.', progress: 75 },
    { id: 3, name: 'Explorador Gourmet', icon: '🗺️', desc: 'Cocinadas recetas de 5 etnias diferentes.', progress: 40 },
    { id: 4, name: 'Visionario IA', icon: '👁️', desc: '20 tiquets escaneados correctamente.', progress: 90 }
];

const AchievementView = () => {
    const { goTo } = usePantry();

    return (
        <div className="container" style={{ paddingBottom: '40px' }}>
            <header className="pt-8 pb-8 flex justify-between items-center">
                <motion.button onClick={() => goTo('profile')} style={{ background: 'var(--glass)', border: '1px solid var(--border-color)', color: 'var(--text-main)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowLeft size={20} />
                </motion.button>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>MIS LOGROS</h1>
                <div style={{ width: '40px' }}></div>
            </header>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 1.5rem' }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'rgba(var(--primary-rgb), 0.1)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Award size={80} color="var(--primary)" />
                    </div>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                        style={{ position: 'absolute', inset: -10, border: '1px dashed var(--primary)', borderRadius: '50%', opacity: 0.3 }}
                    />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>MAESTRO DE COCINA</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Nivel 14 • 7,450 XP</p>

                <div style={{ maxWidth: '200px', margin: '1rem auto' }}>
                    <div style={{ height: '8px', background: 'var(--glass)', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '75%' }}
                            style={{ height: '100%', background: 'var(--primary)' }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {achievements.map((acc, i) => (
                    <motion.div
                        key={acc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="premium-card"
                        style={{ textAlign: 'center', padding: '1.5rem' }}
                    >
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{acc.icon}</div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.25rem' }}>{acc.name}</h4>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.3, marginBottom: '1rem' }}>{acc.desc}</p>

                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${acc.progress}%` }}
                                style={{ height: '100%', background: acc.progress === 100 ? 'var(--status-green)' : 'var(--primary)' }}
                            />
                        </div>
                        <span style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.4, marginTop: '4px', display: 'block' }}>{acc.progress}%</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AchievementView;
