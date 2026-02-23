import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePantry } from '../../lib/PantryContext';
import { apiFetch } from '../../lib/api';
import { X, Camera, Receipt, Box, Sparkles, Check, Trash2, Plus } from 'lucide-react';

const ScannerView = () => {
    const { goTo, prevView, addProductToInventory } = usePantry();
    const [isScanning, setIsScanning] = useState(false);
    const [scanMode, setScanMode] = useState('ticket'); // 'ticket' or 'fridge'
    const [detectedProducts, setDetectedProducts] = useState(null);
    const scanInputRef = useRef(null);

    const resizeImage = (base64Str, maxWidth = 1024, maxHeight = 1024) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                // Comprimir a JPEG al 80% de calidad
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
        });
    };

    const handleScanImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsScanning(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const originalBase64 = reader.result;
            try {
                // Optimización: Redimensionar y comprimir antes de enviar a la IA
                const compressedBase64 = await resizeImage(originalBase64);

                const data = await apiFetch('/api/ai/analyze-image', {
                    method: 'POST',
                    body: JSON.stringify({ image: compressedBase64, mode: scanMode })
                });

                if (data.products && data.products.length > 0) {
                    setDetectedProducts(data.products.map(p => ({ ...p, selected: true })));
                } else {
                    alert('No se pudieron detectar productos. Inténtalo con otra foto.');
                }
            } catch (err) {
                console.error('Scan error:', err);
                alert('Error al procesar la imagen con la IA.');
            } finally {
                setIsScanning(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const [isConfirming, setIsConfirming] = useState(false);

    const handleConfirmProducts = async () => {
        if (isConfirming) return;
        setIsConfirming(true);
        try {
            const toAdd = detectedProducts.filter(p => p.selected);
            let addedCount = 0;
            let limitReached = false;

            for (const product of toAdd) {
                const success = await addProductToInventory({
                    name: product.name,
                    exp: product.exp || 7,
                    icon: product.icon || '📦',
                    status: (product.exp || 7) > 5 ? 'green' : (product.exp || 7) > 2 ? 'yellow' : 'red'
                });

                if (success) {
                    addedCount++;
                } else {
                    limitReached = true;
                    break;
                }
            }

            if (addedCount > 0 || limitReached) {
                setDetectedProducts(null);
                goTo('inventory');
            }
        } finally {
            setIsConfirming(false);
        }
    };

    const toggleProductSelection = (index) => {
        const updated = [...detectedProducts];
        updated[index].selected = !updated[index].selected;
        setDetectedProducts(updated);
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
                style={{ position: 'absolute', top: '40px', left: '25px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '12px', borderRadius: '50%', cursor: 'pointer', zIndex: 50 }}
            >
                <X size={24} />
            </motion.button>

            {/* Mode Selector */}
            <div style={{ position: 'absolute', top: '100px', display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '2rem', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', zIndex: 50 }}>
                <button
                    onClick={() => setScanMode('ticket')}
                    style={{
                        padding: '0.8rem 1.5rem',
                        borderRadius: '1.5rem',
                        border: 'none',
                        background: scanMode === 'ticket' ? 'var(--primary)' : 'transparent',
                        color: '#fff',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.8rem',
                        transition: 'all 0.3s'
                    }}
                >
                    <Receipt size={18} /> TIQUET
                </button>
                <button
                    onClick={() => setScanMode('fridge')}
                    style={{
                        padding: '0.8rem 1.5rem',
                        borderRadius: '1.5rem',
                        border: 'none',
                        background: scanMode === 'fridge' ? 'var(--primary)' : 'transparent',
                        color: '#fff',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.8rem',
                        transition: 'all 0.3s'
                    }}
                >
                    <Box size={18} /> NEVERA
                </button>
            </div>

            <div style={{ position: 'relative' }}>
                <AnimatePresence>
                    {isScanning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'absolute', inset: -20, background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 200, borderRadius: '2.5rem', backdropFilter: 'blur(15px)' }}
                        >
                            <div style={{ position: 'relative' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                    style={{ width: '80px', height: '80px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}
                                />
                                <Sparkles size={32} color="var(--primary)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                            </div>
                            <p style={{ marginTop: '2rem', fontWeight: 900, letterSpacing: '4px', color: 'var(--primary)', fontSize: '1.1rem' }}>SISTEMA IA</p>
                            <p style={{ fontSize: '0.9rem', opacity: 0.6, marginTop: '0.5rem' }}>ANALIZANDO {scanMode === 'ticket' ? 'TIQUET' : 'NEVERA'}...</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="premium-border" style={{ width: '320px', height: '480px', borderRadius: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                    {/* Scanning animation line */}
                    <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                        style={{ position: 'absolute', left: 0, right: 0, height: '3px', background: 'linear-gradient(to right, transparent, var(--primary), transparent)', boxShadow: '0 0 20px var(--primary)', zIndex: 10 }}
                    />

                    <div style={{ position: 'absolute', width: '50px', height: '50px', borderTop: '4px solid var(--primary)', borderLeft: '4px solid var(--primary)', top: '25px', left: '25px', borderRadius: '1.5rem 0 0 0', opacity: 0.5 }}></div>
                    <div style={{ position: 'absolute', width: '50px', height: '50px', borderTop: '4px solid var(--primary)', borderRight: '4px solid var(--primary)', top: '25px', right: '25px', borderRadius: '0 1.5rem 0 0', opacity: 0.5 }}></div>
                    <div style={{ position: 'absolute', width: '50px', height: '50px', borderBottom: '4px solid var(--primary)', borderLeft: '4px solid var(--primary)', bottom: '25px', left: '25px', borderRadius: '0 0 0 1.5rem', opacity: 0.5 }}></div>
                    <div style={{ position: 'absolute', width: '50px', height: '50px', borderBottom: '4px solid var(--primary)', borderRight: '4px solid var(--primary)', bottom: '25px', right: '25px', borderRadius: '0 0 1.5rem 0', opacity: 0.5 }}></div>

                    {scanMode === 'ticket' ? <Receipt size={80} style={{ opacity: 0.1 }} /> : <Box size={80} style={{ opacity: 0.1 }} />}
                    <p style={{ opacity: 0.4, marginTop: '2rem', textAlign: 'center', padding: '0 3rem', fontSize: '0.9rem', lineHeight: '1.5', fontWeight: 600 }}>
                        {scanMode === 'ticket' ? 'Escanea tu ticket de compra para añadir productos automáticamente' : 'Captura el interior de tu nevera para actualizar el inventario'}
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

            {!detectedProducts && (
                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(var(--primary-rgb), 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{ marginTop: '3.5rem', height: '90px', width: '90px', borderRadius: '50%', border: '5px solid #fff', background: 'transparent', padding: '8px', cursor: isScanning ? 'default' : 'pointer', boxShadow: '0 15px 40px rgba(0,0,0,0.6)', zIndex: 50 }}
                    disabled={isScanning}
                    onClick={() => scanInputRef.current?.click()}
                >
                    <div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Camera size={36} color="#000" />
                    </div>
                </motion.button>
            )}

            {!detectedProducts && (
                <p style={{ marginTop: '2rem', fontSize: '0.85rem', opacity: 0.7, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>Toca para capturar</p>
            )}

            {/* Validation List Modal */}
            <AnimatePresence>
                {detectedProducts && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: '#0a0a0a',
                            zIndex: 1000,
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem' }}>Resultados IA</h2>
                                <p style={{ opacity: 0.6, fontWeight: 600 }}>Coteja y añade a tu despensa</p>
                            </div>
                            <button onClick={() => setDetectedProducts(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '15px', borderRadius: '50%' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '2rem', paddingRight: '10px' }}>
                            {detectedProducts.map((product, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20, delay: idx * 0.1 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={() => toggleProductSelection(idx)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.5rem',
                                        background: product.selected ? 'rgba(var(--primary-rgb), 0.1)' : 'rgba(255,255,255,0.03)',
                                        padding: '1.2rem',
                                        borderRadius: '1.5rem',
                                        marginBottom: '1rem',
                                        border: `1px solid ${product.selected ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ fontSize: '1.5rem' }}>{product.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>{product.name}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 600 }}>≈ vda media: {product.exp} días</div>
                                    </div>
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '8px',
                                        border: '2px solid var(--primary)',
                                        background: product.selected ? 'var(--primary)' : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {product.selected && <Check size={18} color="#fff" />}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setDetectedProducts(null)}
                                style={{ flex: 1, padding: '1.2rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                            >
                                DESCARTAR
                            </button>
                            <button
                                onClick={handleConfirmProducts}
                                disabled={isConfirming}
                                style={{
                                    flex: 2,
                                    padding: '1.2rem',
                                    borderRadius: '1.5rem',
                                    background: 'var(--primary)',
                                    color: '#fff',
                                    border: 'none',
                                    fontWeight: 900,
                                    cursor: isConfirming ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 10px 30px rgba(var(--primary-rgb), 0.3)',
                                    opacity: isConfirming ? 0.7 : 1
                                }}
                            >
                                {isConfirming ? 'AÑADIENDO...' : `AÑADIR SELECCIONADOS (${detectedProducts.filter(p => p.selected).length})`}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ScannerView;
