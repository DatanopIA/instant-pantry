import React from 'react';
import { usePantry } from '../../lib/PantryContext';
import { ArrowLeft, Save, Heart, Zap } from 'lucide-react';

const DietView = () => {
    const { t, goTo, dietSettings, setDietSettings } = usePantry();

    const dietaryTypes = ['Omnívora', 'Vegetariana', 'Vegana', 'Keto', 'Paleo', 'Gluten Free'];

    return (
        <div className="container" style={{ paddingBottom: '40px' }}>
            <header className="pt-8 pb-8 flex justify-between items-center">
                <motion.button onClick={() => goTo('profile')} style={{ background: 'var(--glass)', border: '1px solid var(--border-color)', color: 'var(--text-main)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowLeft size={20} />
                </motion.button>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t('dieta').toUpperCase()}</h1>
                <div style={{ width: '40px' }}></div>
            </header>

            <div style={{ display: 'grid', gap: '2.5rem' }}>
                <Section title="TIPO DE ALIMENTACIÓN">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {dietaryTypes.map(type => (
                            <motion.button
                                key={type}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setDietSettings({ ...dietSettings, type })}
                                style={{
                                    padding: '1.25rem',
                                    borderRadius: '1.25rem',
                                    background: dietSettings.type === type ? 'var(--primary)' : 'var(--glass)',
                                    color: dietSettings.type === type ? 'white' : 'var(--text-main)',
                                    border: '1px solid var(--border-color)',
                                    fontWeight: 700,
                                    fontSize: '0.85rem'
                                }}
                            >
                                {type}
                            </motion.button>
                        ))}
                    </div>
                </Section>

                <Section title="OBJETIVO CALÓRICO DIARIO">
                    <div style={{ display: 'grid', gap: '1rem', padding: '1.5rem', background: 'var(--glass)', borderRadius: '1.5rem', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>{dietSettings.dailyCalories}</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.5 }}>kcal / día</span>
                        </div>
                        <input
                            type="range"
                            min="1200"
                            max="4000"
                            step="50"
                            value={dietSettings.dailyCalories}
                            onChange={(e) => setDietSettings({ ...dietSettings, dailyCalories: parseInt(e.target.value) })}
                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                        />
                    </div>
                </Section>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => goTo('profile')}
                    className="btn-primary"
                    style={{ padding: '1.25rem', borderRadius: '1.5rem', fontWeight: 800, fontSize: '1rem', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                    <Save size={20} /> GUARDAR PREFERENCIAS
                </motion.button>
            </div>
        </div>
    );
};

const Section = ({ title, children }) => (
    <div style={{ display: 'grid', gap: '1rem' }}>
        <h3 style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', marginLeft: '4px' }}>{title}</h3>
        {children}
    </div>
);

export default DietView;
