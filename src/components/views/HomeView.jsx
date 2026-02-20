import React from 'react';
import { motion } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { Sparkles, Clock, Flame, ChevronRight, Apple, Zap } from 'lucide-react';

const HomeView = () => {
    const { t, goTo, profileImage, inventory, recipes, setSelectedRecipe, theme } = usePantry();

    const urgentItems = inventory
        .filter(item => item.exp <= 3)
        .sort((a, b) => a.exp - b.exp)
        .slice(0, 3);

    const suggestedRecipes = recipes.slice(0, 2);

    return (
        <div className="container" style={{ paddingBottom: '120px' }}>
            <header className="pt-8 pb-8 flex justify-between items-center">
                <div className="stagger-in">
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.6, letterSpacing: '2px', color: 'var(--text-muted)' }}>
                        {t('hoy').toUpperCase()}
                    </p>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.1 }}>
                        {t('bienvenido')} <span style={{ color: 'var(--primary)' }}>PANTRY</span>
                    </h1>
                </div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => goTo('profile')}
                    style={{
                        width: '3.5rem',
                        height: '3.5rem',
                        borderRadius: '50%',
                        background: 'var(--glass)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                >
                    {profileImage ? (
                        <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span className="material-icons-round" style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>person</span>
                    )}
                </motion.div>
            </header>

            {/* Bento Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {/* Status Card - Full Width with Mesh Background */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel"
                    style={{
                        gridColumn: 'span 2',
                        padding: '2rem',
                        borderRadius: '2rem',
                        position: 'relative',
                        overflow: 'hidden',
                        background: 'rgba(var(--primary-rgb), 0.05)',
                        border: '1px solid rgba(var(--primary-rgb), 0.1)'
                    }}
                >
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{ width: '10px', height: '10px', borderRadius: '50%', background: urgentItems.length > 0 ? 'var(--status-red)' : 'var(--status-green)', boxShadow: `0 0 10px ${urgentItems.length > 0 ? 'var(--status-red)' : 'var(--status-green)'}` }}
                            ></motion.div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '2px', opacity: 0.8, color: 'var(--primary)' }}>{t('analisis_vanguard')}</span>
                        </div>
                        <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontWeight: 900, lineHeight: 1.1 }}>
                            {urgentItems.length > 0
                                ? t('protocolo_rescate', { count: urgentItems.length })
                                : t('ecosistema_equilibrio')}
                        </h3>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary"
                            style={{ fontSize: '0.85rem', padding: '0.8rem 1.5rem', borderRadius: '1rem', border: 'none' }}
                            onClick={() => goTo('inventory')}
                        >
                            {t('inspeccionar_despensa')}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Expiry Alert Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="premium-card"
                    style={{ padding: '1.5rem', borderRadius: '1.75rem', background: 'rgba(248, 113, 113, 0.05)' }}
                >
                    <Clock size={20} style={{ color: 'var(--status-red)', marginBottom: '1rem' }} />
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', fontWeight: 800 }}>{t('caducidad')}</h4>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 600 }}>{t('alertas_hoy', { count: urgentItems.length })}</p>
                </motion.div>

                {/* Efficiency Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="premium-card"
                    style={{ padding: '1.5rem', borderRadius: '1.75rem', background: 'rgba(var(--primary-rgb), 0.05)' }}
                >
                    <Zap size={20} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', fontWeight: 800 }}>{t('eficiencia')}</h4>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 600 }}>{t('zero_waste')}</p>
                </motion.div>
            </div>

            {/* Premium Recipe Carousel */}
            <section style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{t('cocinar_ahora')}</h2>
                    <motion.div
                        whileHover={{ x: 5 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800 }}
                        onClick={() => goTo('recipes')}
                    >
                        {t('explorar')} <ChevronRight size={16} />
                    </motion.div>
                </div>

                <div className="carousel-container hide-scrollbar">
                    {recipes.slice(0, 5).map((recipe, index) => (
                        <motion.div
                            key={recipe.id}
                            className="carousel-item"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (index * 0.1) }}
                            onClick={() => {
                                setSelectedRecipe(recipe);
                                goTo('recipe-detail');
                            }}
                        >
                            <div className="premium-card" style={{ padding: 0, height: '300px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '65%', position: 'relative', overflow: 'hidden' }}>
                                    <img
                                        src={recipe.img}
                                        alt={recipe.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop";
                                        }}
                                    />
                                    <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px' }}>
                                        {recipe.tags?.[0]?.toUpperCase() || t('moderno')}
                                    </div>
                                </div>
                                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', lineHeight: 1.2 }}>{recipe.title}</h3>
                                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.75rem', opacity: 0.6, fontWeight: 700 }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <Clock size={14} /> {recipe.time}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <Flame size={14} /> {recipe.cal || '450 kcal'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    <motion.div
                        className="carousel-item"
                        style={{ flex: '0 0 50%' }}
                        onClick={() => goTo('recipes')}
                    >
                        <div className="premium-card" style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--glass)', border: '2px dashed var(--border-color)' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'white' }}>
                                <ChevronRight size={24} />
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem', opacity: 0.6 }}>{t('ver_todo')}</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* AI Assistant Quick Access */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => goTo('chat')}
                style={{
                    background: 'var(--charcoal)',
                    color: 'white',
                    padding: '1.5rem',
                    borderRadius: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.2)'
                }}
            >
                <div>
                    <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '4px' }}>{t('pregunta_chef')}</h3>
                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{t('optimiza_ingredientes')}</p>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={24} color="#84A98C" />
                </div>
            </motion.div>
        </div>
    );
};

export default HomeView;
