import React from 'react';
import { usePantry } from '../lib/PantryContext';

const RecipeCard = ({ recipe, onClick }) => {
    const { t } = usePantry();
    const missingCount = recipe.missingIngredients?.length || 0;

    return (
        <div
            onClick={() => onClick(recipe)}
            className="magazine-card animate-slide-up"
            style={{ cursor: 'pointer' }}
        >
            <img
                src={recipe.img || `https://source.unsplash.com/800x1000/?food,${recipe.title}`}
                alt={recipe.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '40px 24px 24px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
                    color: 'white'
                }}
            >
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    {recipe.tags?.slice(0, 2).map(tag => (
                        <span key={tag} style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            background: 'rgba(255,255,255,0.2)',
                            padding: '4px 10px',
                            borderRadius: '100px',
                            backdropFilter: 'blur(4px)',
                            textTransform: 'uppercase'
                        }}>
                            {tag}
                        </span>
                    ))}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px', lineHeight: 1.1 }}>{recipe.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', opacity: 0.9 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span className="material-icons-round" style={{ fontSize: '16px' }}>schedule</span>
                        {recipe.time}
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: missingCount === 0 ? '#4ade80' : '#fbbf24'
                    }}>
                        <span className="material-icons-round" style={{ fontSize: '16px' }}>
                            {missingCount === 0 ? 'check_circle' : 'inventory_2'}
                        </span>
                        {missingCount === 0
                            ? t('tienes_todo')
                            : missingCount === 1
                                ? t('falta_uno')
                                : t('faltan_varios', { count: missingCount })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};


export default RecipeCard;
