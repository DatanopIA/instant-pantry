import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { X, Camera, Receipt, Box, Sparkles } from 'lucide-react';

const ScannerView = () => {
    const { t, goTo, prevView, addProductToInventory } = usePantry();
    const [isScanning, setIsScanning] = useState(false);
    const [scanMode, setScanMode] = useState('ticket'); // 'ticket' or 'fridge'
    const scanInputRef = useRef(null);

    const handleScanImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsScanning(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result;
            try {
                const res = await fetch('/api/ai/analyze-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64Image, mode: scanMode })
                });
                const data = await res.json();

                if (data.products && data.products.length > 0) {
                    for (const product of data.products) {
                        await addProductToInventory({
                            name: product.name,
                            exp: product.exp || 7,
                            icon: product.icon || '📦',
                            status: (product.exp || 7) > 5 ? 'green' : (product.exp || 7) > 2 ? 'yellow' : 'red'
                        });
                    }
                    alert(`¡Exito! Se han detectado y añadido ${data.products.length} productos.`);
                } else {
                    alert('No se pudieron detectar productos. Inténtalo con otra foto.');
                }
            } catch (err) {
                console.error('Scan error:', err);
                alert('Error al procesar la imagen con la IA.');
            } finally {
                setIsScanning(false);
                goTo('inventory');
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="container" style={{
            flexDirection: 'column',
            background: '#000',
            color: '#fff',
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => goTo(prevView)}
                style={{ position: 'absolute', top: '40px', left: '25px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '12px', borderRadius: '50%', cursor: 'pointer' }}
            >
                <X size={24} />
            </motion.button>

            {/* Mode Selector */}
            <div style={{ position: 'absolute', top: '100px', display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '2rem', backdropFilter: 'blur(20px)' }}>
                <button
                    onClick={() => setScanMode('ticket')}
                    style={{
                        padding: '0.6rem 1.2rem',
                        borderRadius: '1.5rem',
                        border: 'none',
                        background: scanMode === 'ticket' ? 'var(--primary)' : 'transparent',
                        color: '#fff',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.75rem'
                    }}
                >
                    <Receipt size={16} /> TIQUET
                </button>
                <button
                    onClick={() => setScanMode('fridge')}
                    style={{
                        padding: '0.6rem 1.2rem',
                        borderRadius: '1.5rem',
                        border: 'none',
                        background: scanMode === 'fridge' ? 'var(--primary)' : 'transparent',
                        color: '#fff',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.75rem'
                    }}
                >
                    <Box size={16} /> NEVERA
                </button>
            </div>

            <div style={{ position: 'relative' }}>
                <AnimatePresence>
                    {isScanning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'absolute', inset: -20, background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20, borderRadius: '2.5rem', backdropFilter: 'blur(10px)' }}
                        >
                            <div style={{ position: 'relative' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                    style={{ width: '60px', height: '60px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}
                                />
                                <Sparkles size={24} color="var(--primary)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                            </div>
                            <p style={{ marginTop: '1.5rem', fontWeight: 800, letterSpacing: '2px', color: 'var(--primary)' }}>SISTEMA IA ANALIZANDO</p>
                            <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{scanMode.toUpperCase()} DETECTADO</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="premium-border" style={{ width: '300px', height: '450px', borderRadius: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}>
                    {/* Scanning animation line */}
                    <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, transparent, var(--primary), transparent)', boxShadow: '0 0 15px var(--primary)', zIndex: 10 }}
                    />

                    <div style={{ position: 'absolute', width: '40px', height: '40px', borderTop: '4px solid var(--primary)', borderLeft: '4px solid var(--primary)', top: '20px', left: '20px', borderRadius: '1rem 0 0 0' }}></div>
                    <div style={{ position: 'absolute', width: '40px', height: '40px', borderTop: '4px solid var(--primary)', borderRight: '4px solid var(--primary)', top: '20px', right: '20px', borderRadius: '0 1rem 0 0' }}></div>
                    <div style={{ position: 'absolute', width: '40px', height: '40px', borderBottom: '4px solid var(--primary)', borderLeft: '4px solid var(--primary)', bottom: '20px', left: '20px', borderRadius: '0 0 0 1rem' }}></div>
                    <div style={{ position: 'absolute', width: '40px', height: '40px', borderBottom: '4px solid var(--primary)', borderRight: '4px solid var(--primary)', bottom: '20px', right: '20px', borderRadius: '0 0 1rem 0' }}></div>

                    <Receipt size={64} style={{ opacity: 0.1, color: 'white' }} />
                    <p style={{ opacity: 0.5, marginTop: '1.5rem', textAlign: 'center', padding: '0 2rem', fontSize: '0.9rem' }}>
                        {scanMode === 'ticket' ? 'Coloca el tiquet dentro del recuadro' : 'Muestra el interior de tu nevera'}
                    </p>
                </div>
            </div>

            <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={scanInputRef}
                onChange={handleScanImage}
                style={{ display: 'none' }}
            />

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                style={{ marginTop: '3rem', height: '80px', width: '80px', borderRadius: '50%', border: '4px solid #fff', background: 'transparent', padding: '6px', cursor: isScanning ? 'default' : 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                disabled={isScanning}
                onClick={() => scanInputRef.current?.click()}
            >
                <div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Camera size={32} color="#000" />
                </div>
            </motion.button>

            <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', opacity: 0.6, fontWeight: 700, letterSpacing: '1px' }}>TOCA PARA CAPTURAR</p>
        </div>
    );
};

export default ScannerView;
