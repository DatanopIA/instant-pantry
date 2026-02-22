import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { Clock, Filter, Search, ChevronRight, AlertTriangle, CheckCircle2, Star } from 'lucide-react';

const RecipeView = () => {
    const { t, recipes, inventory, setSelectedRecipe, goTo } = usePantry();
    const [searchQuery, setSearchQuery] = useState('');

    const getMissingIngredients = (recipeIngredients) => {
        if (!recipeIngredients) return [];
        return recipeIngredients.filter(ing =>
            !inventory.some(item =>
                ing.toLowerCase().includes(item.name.toLowerCase()) ||
                item.name.toLowerCase().includes(ing.toLowerCase())
            )
        );
    };

    const filteredRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="container" style={{ paddingBottom: '120px' }}>
            {/* Header */}
            <header className="pt-8 pb-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}
                >
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px', background: 'linear-gradient(45deg, var(--text-main), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {t('recetario').toUpperCase()}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px' }}>
                            {t('recomendado').toUpperCase()}
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => goTo('diet')}
                        style={{ width: '50px', height: '50px', borderRadius: '18px', background: 'var(--glass)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                    >
                        <Filter size={22} />
                    </motion.button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ position: 'relative' }}
                >
                    <Search style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.7 }} size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('buscar_recetas')}
                        style={{ width: '100%', padding: '1.4rem 1.4rem 1.4rem 3.5rem', borderRadius: '1.8rem', border: '1px solid var(--border-color)', background: 'var(--glass)', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 600, boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)' }}
                    />
                </motion.div>
            </header>

            {/* Recipes Grid */}
            <div style={{ display: 'grid', gap: '1.8rem', marginTop: '1rem' }}>
                <AnimatePresence mode="popLayout">
                    {filteredRecipes.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--glass)', borderRadius: '2.5rem', border: '1px dashed var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
                        >
                            <Search size={48} style={{ opacity: 0.2 }} />
                            <div>
                                <p style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: '1.1rem' }}>{t('no_recetas_encontradas') || 'No se han encontrado recetas'}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Prueba con otros términos o ajusta tu dieta.</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { setSearchQuery(''); goTo('diet'); }}
                                style={{ marginTop: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: '1rem', background: 'var(--primary)', color: 'white', fontWeight: 800, border: 'none' }}
                            >
                                {t('preferencias')}
                            </motion.button>
                        </motion.div>
                    ) : (
                        filteredRecipes.map((recipe, index) => {
                            const missing = getMissingIngredients(recipe.ingredients);
                            const totalIng = recipe.ingredients?.length || 0;
                            const matchCount = totalIng - missing.length;
                            const matchPercentage = totalIng > 0 ? (matchCount / totalIng) * 100 : 0;
                            const needsShopping = missing.length > 0;

                            return (
                                <motion.div
                                    key={recipe.id || index}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                    className="premium-card"
                                    style={{ padding: 0, overflow: 'hidden', position: 'relative', cursor: 'pointer', border: '1px solid var(--border-color)' }}
                                    onClick={() => {
                                        setSelectedRecipe(recipe);
                                        goTo('recipe-detail');
                                    }}
                                >
                                    <div style={{ width: '100%', height: '180px', background: '#222', position: 'relative' }}>
                                        <img
                                            src={recipe.img}
                                            alt={recipe.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1000&auto=format&fit=crop";
                                            }}
                                        />

                                        {/* Premium Overlay */}
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent, rgba(0,0,0,0.6))' }}></div>

                                        {/* Status Tag */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '15px',
                                            left: '15px',
                                            background: needsShopping ? 'var(--terrakotta)' : 'var(--status-green)',
                                            padding: '6px 12px',
                                            borderRadius: '10px',
                                            color: 'white',
                                            fontSize: '0.7rem',
                                            fontWeight: 900,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {needsShopping ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                                            {needsShopping ? t('falta_algo') || 'FALTAN ITEMS' : t('listo_para_cocinar') || '¡LISTO!'}
                                        </div>

                                        {/* Match Badge */}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '15px',
                                            right: '15px',
                                            background: 'rgba(0,0,0,0.7)',
                                            backdropFilter: 'blur(10px)',
                                            padding: '6px 12px',
                                            borderRadius: '12px',
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            fontWeight: 800,
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            <span style={{ color: 'var(--primary)' }}>{matchCount}</span>/{totalIng} {t('ingredientes') || 'Ingredientes'}
                                        </div>
                                    </div>

                                    <div style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', gap: '4px', marginBottom: '0.6rem' }}>
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill={s <= 4 ? "var(--primary)" : "none"} color="var(--primary)" strokeWidth={3} />)}
                                        </div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontWeight: 800, lineHeight: 1.2, color: 'var(--text-main)' }}>
                                            {recipe.title}
                                        </h3>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} color="var(--primary)" /> {recipe.time}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Star size={14} color="var(--primary)" /> {recipe.cal || '450 kcal'}</span>
                                            </div>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '12px',
                                                background: 'var(--glass)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid var(--border-color)',
                                                color: 'var(--primary)'
                                            }}>
                                                <ChevronRight size={20} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Premium Progress Bar */}
                                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.03)' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${matchPercentage}%` }}
                                            style={{
                                                height: '100%',
                                                background: needsShopping ? 'linear-gradient(90deg, var(--primary), var(--terrakotta))' : 'var(--status-green)',
                                                boxShadow: '0 0 10px rgba(var(--primary-rgb), 0.3)'
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RecipeView;
