import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { Trash2, AlertCircle, Plus, Search } from 'lucide-react';

const InventoryView = () => {
    const { t, inventory, deleteProduct, goTo } = usePantry();

    return (
        <div className="container" style={{ paddingBottom: '120px' }}>
            <header className="pt-8 pb-6">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{t('despensa')}</h1>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => goTo('add-product')}
                        style={{
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 16px rgba(var(--primary-rgb), 0.3)'
                        }}
                    >
                        <Plus size={24} />
                    </motion.button>
                </div>

                {/* Search Mockup */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                    <input
                        type="text"
                        placeholder="Buscar ingredientes..."
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3.5rem',
                            borderRadius: '1rem',
                            background: 'var(--glass)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)',
                            outline: 'none'
                        }}
                    />
                </div>
            </header>

            {/* Expiry Categories */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '4px' }} className="hide-scrollbar">
                {['Todos', 'Urgentes', 'Frescos', 'Secos'].map((cat, i) => (
                    <span
                        key={cat}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '12px',
                            background: i === 0 ? 'var(--primary)' : 'var(--glass)',
                            color: i === 0 ? 'white' : 'var(--text-muted)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            border: '1px solid var(--border-color)'
                        }}
                    >
                        {cat.toUpperCase()}
                    </span>
                ))}
            </div>

            {/* Inventory List */}
            <div style={{ display: 'grid', gap: '1rem' }}>
                <AnimatePresence>
                    {inventory.map((item, index) => (
                        <motion.div
                            key={item.id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            className="premium-card"
                            style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
                        >
                            <div style={{ fontSize: '2rem', width: '50px', height: '50px', background: 'rgba(var(--primary-rgb), 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {item.icon || '📦'}
                            </div>

                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1rem', marginBottom: '2px' }}>{item.name}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: item.exp <= 2 ? 'var(--status-red)' : item.exp <= 5 ? 'var(--status-yellow)' : 'var(--status-green)'
                                    }}></span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                        {t('caduca_en').replace('{count}', item.exp)}
                                    </span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1, color: 'var(--status-red)' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => deleteProduct(item.id)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}
                            >
                                <Trash2 size={20} />
                            </motion.button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {inventory.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', opacity: 0.3 }}>
                        <AlertCircle size={48} style={{ margin: '0 auto 1rem' }} />
                        <p>Tu despensa está vacía.<br />¡Escanea tu compra!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryView;
