import React from 'react';
import { motion } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { Clock, Zap, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const RecipeDetailView = () => {
    const { t, selectedRecipe, inventory, goTo, sendMessage } = usePantry();

    if (!selectedRecipe) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="container"
            style={{ paddingBottom: '40px' }}
        >
            <header className="pt-8 pb-6 flex justify-between items-center relative">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => goTo('recipes')}
                    style={{
                        background: 'var(--glass)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-main)',
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <ArrowLeft size={20} />
                </motion.button>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>DETALLE</h1>
                <div style={{ width: '3rem' }}></div>
            </header>

            <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--card-bg)', borderRadius: '2rem', border: '1px solid var(--border-color)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                {/* Hero Image */}
                <div style={{ position: 'relative', width: '100%', height: '350px', background: '#1a1a1a' }}>
                    <img
                        src={selectedRecipe.img}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt={selectedRecipe.title}
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80\u0026w=1000\u0026auto=format\u0026fit=crop";
                        }}
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '150px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
                        <span style={{ background: 'var(--primary)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.6rem', fontWeight: 800, color: 'white', letterSpacing: '1px' }}>GOURMET</span>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginTop: '8px', lineHeight: 1.1 }}>{selectedRecipe.title}</h2>
                    </div>
                </div>

                <div style={{ padding: '2rem' }}>
                    {/* Stats Bar */}
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1.5rem', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tiempo</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, marginTop: '4px' }}>
                                <Clock size={16} color="var(--primary)" /> {selectedRecipe.time}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Calorías</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, marginTop: '4px' }}>
                                <Zap size={16} color="var(--primary)" /> {selectedRecipe.cal || '450 kcal'}
                            </div>
                        </div>
                    </div>

                    {/* Ingredients Section */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Ingredientes <span style={{ opacity: 0.3, fontSize: '0.9rem' }}>({selectedRecipe.ingredients?.length})</span>
                        </h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {selectedRecipe.ingredients?.map((ing, i) => {
                                const missing = !inventory.some(item =>
                                    ing.toLowerCase().includes(item.name.toLowerCase()) ||
                                    item.name.toLowerCase().includes(ing.toLowerCase())
                                );

                                return (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {missing ? <AlertCircle size={18} color="var(--terrakotta)" /> : <CheckCircle2 size={18} color="var(--status-green)" />}
                                            <span style={{ fontSize: '0.95rem', color: missing ? 'var(--text-main)' : 'var(--text-muted)', textDecoration: missing ? 'none' : 'line-through' }}>{ing}</span>
                                        </div>

                                        {missing && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    goTo('chat');
                                                    sendMessage(`Hola Chef, me falta "${ing}" para preparar la receta "${selectedRecipe.title}". ¿Por qué alimento gourmet me recomiendas substituirlo?`);
                                                }}
                                                style={{
                                                    background: 'rgba(var(--primary-rgb), 0.1)',
                                                    color: 'var(--primary)',
                                                    border: '1px solid rgba(var(--primary-rgb), 0.2)',
                                                    padding: '4px 10px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 800
                                                }}
                                            >
                                                SUBSTITUIR
                                            </motion.button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Steps Section */}
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Preparación Pasivo/Gourmet</h3>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {selectedRecipe.steps?.map((step, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{
                                        flexShrink: 0,
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.8rem',
                                        fontWeight: 800,
                                        boxShadow: '0 4px 10px rgba(var(--primary-rgb), 0.3)'
                                    }}>
                                        {i + 1}
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default RecipeDetailView;
