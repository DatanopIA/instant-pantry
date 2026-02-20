import React from 'react';
import { motion } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { Clock, Zap, Flame, Star, Filter } from 'lucide-react';

const RecipeView = () => {
    const { t, recipes, inventory, setSelectedRecipe, goTo } = usePantry();

    const getPantryMatchCount = (recipeIngredients) => {
        if (!recipeIngredients) return 0;
        return recipeIngredients.filter(ing =>
            inventory.some(item =>
                ing.toLowerCase().includes(item.name.toLowerCase()) ||
                item.name.toLowerCase().includes(ing.toLowerCase())
            )
        ).length;
    };

    return (
        <div className="container" style={{ paddingBottom: '120px' }}>
            <header className="pt-8 pb-6">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{t('recetas')}</h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        style={{
                            background: 'var(--glass)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            padding: '0.6rem 1rem',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 700
                        }}
                    >
                        <Filter size={16} /> {t('filtrar')}
                    </motion.button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {recipes.map((recipe, index) => {
                    const matchCount = getPantryMatchCount(recipe.ingredients);
                    const totalIng = recipe.ingredients?.length || 0;
                    const matchPercentage = totalIng > 0 ? (matchCount / totalIng) * 100 : 0;

                    return (
                        <motion.div
                            key={recipe.id || index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                            className="premium-card"
                            style={{ padding: 0, overflow: 'hidden', position: 'relative' }}
                            onClick={() => {
                                setSelectedRecipe(recipe);
                                goTo('recipe-detail');
                            }}
                        >
                            <div style={{ width: '100%', height: '140px', background: '#333' }}>
                                <img
                                    src={recipe.img}
                                    alt={recipe.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80\u0026w=1000\u0026auto=format\u0026fit=crop";
                                    }}
                                />

                                {/* Match Badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'rgba(0,0,0,0.6)',
                                    backdropFilter: 'blur(8px)',
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '0.6rem',
                                    fontWeight: 800
                                }}>
                                    {matchCount}/{totalIng} {t('items')}
                                </div>
                            </div>

                            <div style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '0.5rem' }}>
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={8} fill={s <= 4 ? "var(--primary)" : "none"} color="var(--primary)" strokeWidth={3} />)}
                                </div>
                                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', lineHeight: 1.2, height: '2.3rem', overflow: 'hidden' }}>
                                    {recipe.title}
                                </h3>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.65rem', opacity: 0.6 }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Clock size={10} /> {recipe.time}</span>
                                    </div>
                                    <div style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        background: 'var(--glass)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid var(--border-color)'
                                    }}>
                                        <ChevronRight size={14} color="var(--primary)" />
                                    </div>
                                </div>
                            </div>

                            {/* Progress bar of items owned */}
                            <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${matchPercentage}%` }}
                                    style={{ height: '100%', background: 'var(--primary)' }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

const ChevronRight = ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);

export default RecipeView;
