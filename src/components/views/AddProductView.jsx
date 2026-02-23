import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { ArrowLeft, Save, Plus } from 'lucide-react';

const AddProductView = () => {
    const { goTo, addProductToInventory } = usePantry();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [exp, setExp] = useState(7);
    const [icon, setIcon] = useState('🍎');

    const handleSave = async () => {
        if (!name.trim() || isLoading) return;
        setIsLoading(true);
        try {
            await addProductToInventory({
                name,
                exp: parseInt(exp),
                icon,
                status: exp > 5 ? 'green' : exp > 2 ? 'yellow' : 'red'
            });
            goTo('inventory');
        } catch (error) {
            console.error("Error saving product:", error);
            // Podríamos añadir un toast o mensaje de error aquí
        } finally {
            setIsLoading(false);
        }
    };

    const icons = ['🍎', '🥦', '🥩', '🥚', '🥛', '🍞', '🧀', '🍗', '🥬', '🍫'];

    return (
        <div className="container" style={{ paddingBottom: '40px' }}>
            <header className="pt-8 pb-8 flex justify-between items-center">
                <motion.button onClick={() => goTo('inventory')} style={{ background: 'var(--glass)', border: '1px solid var(--border-color)', color: 'var(--text-main)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowLeft size={20} />
                </motion.button>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>AÑADIR PRODUCTO</h1>
                <div style={{ width: '40px' }}></div>
            </header>

            <div style={{ display: 'grid', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', width: '100px', height: '100px', borderRadius: '2rem', background: 'var(--glass)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                        {icon}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {icons.map(i => (
                            <button key={i} onClick={() => setIcon(i)} style={{ fontSize: '1.5rem', background: icon === i ? 'rgba(var(--primary-rgb), 0.2)' : 'transparent', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '8px', cursor: 'pointer' }}>{i}</button>
                        ))}
                    </div>
                </div>

                <Section label="NOMBRE DEL PRODUCTO">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Tomates Cherry"
                        className="premium-input"
                        autoFocus
                    />
                </Section>

                <Section label="FECHA DE CADUCIDAD">
                    <input
                        type="date"
                        value={new Date(Date.now() + exp * 86400000).toISOString().split('T')[0]}
                        onChange={(e) => {
                            const selectedDate = new Date(e.target.value);
                            const today = new Date();
                            const diffTime = Math.abs(selectedDate - today);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            setExp(diffDays);
                        }}
                        className="premium-input"
                        style={{ color: 'var(--primary)', fontWeight: 800 }}
                    />
                    <p style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '5px' }}>Faltan {exp} días para caducar</p>
                </Section>

                <motion.button
                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                    onClick={handleSave}
                    disabled={isLoading}
                    className="btn-primary"
                    style={{
                        padding: '1.25rem',
                        borderRadius: '1.5rem',
                        fontWeight: 800,
                        fontSize: '1rem',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        marginTop: '1rem',
                        opacity: isLoading ? 0.7 : 1,
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? (
                        <div className="dot-animate" style={{ fontSize: '1.2rem' }}>...</div>
                    ) : (
                        <>
                            <Save size={20} /> GUARDAR EN DESPENSA
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
};

const Section = ({ label, children }) => (
    <div style={{ display: 'grid', gap: '10px' }}>
        <label style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.5, letterSpacing: '1px', marginLeft: '4px' }}>{label}</label>
        {children}
    </div>
);

export default AddProductView;
