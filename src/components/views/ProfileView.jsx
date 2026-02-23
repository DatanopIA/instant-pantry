import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, Globe, Moon, Sun,
    Bell, User, Shield, HelpCircle, ArrowRight,
    LogOut, Settings, CreditCard, Award, Camera, Send, X
} from 'lucide-react';
import { usePantry } from '../../lib/PantryContext';

const ProfileView = () => {
    const {
        language,
        setLanguage,
        theme,
        setTheme,
        isPro,
        upgradeToPro,
        goTo,
        t,
        logout,
        profileImage,
        updateProfileImage,
        notificationsEnabled,
        setNotificationsEnabled,
        user,
        manageSubscription
    } = usePantry();

    const [showHelpModal, setShowHelpModal] = useState(false);
    const [helpMessage, setHelpMessage] = useState('');
    const imageInputRef = useRef(null);

    const handleLogout = async () => {
        await logout();
        window.location.reload();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePrivacyRedirect = () => {
        const country = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let url = 'https://www.google.com/search?q=privacy+policy+terms';

        if (country.includes('Europe/Madrid')) {
            url = 'https://www.aepd.es/es/derechos-y-deberes/conoce-tus-derechos';
        } else if (country.includes('America/Mexico_City')) {
            url = 'https://home.inai.org.mx/';
        } else if (country.includes('America/New_York') || country.includes('America/Los_Angeles')) {
            url = 'https://www.ftc.gov/business-guidance/privacy-security';
        } else {
            // General link for general terms
            url = 'https://es.wikipedia.org/wiki/Privacidad_en_Internet';
        }
        window.open(url, '_blank');
    };

    const handleHelpSubmit = (e) => {
        e.preventDefault();
        window.location.href = `mailto:info@artbymaeki.com?subject=Ayuda Instant Pantry&body=${encodeURIComponent(helpMessage)}`;
        setShowHelpModal(false);
        setHelpMessage('');
    };

    const MenuItem = ({ icon, label, value, onClick, toggle, checked, danger, disabled }) => (
        <motion.div
            whileHover={!disabled ? { x: 5, background: 'rgba(var(--primary-rgb), 0.05)' } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            onClick={!disabled ? onClick : undefined}
            className="premium-card"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem',
                marginBottom: '0.75rem',
                cursor: disabled ? 'not-allowed' : 'pointer',
                borderRadius: '1.5rem',
                border: '1px solid var(--border-color)',
                background: 'var(--card-bg)',
                opacity: disabled ? 0.5 : 1
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                    color: danger ? 'var(--status-red)' : 'var(--primary)',
                    background: danger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(var(--primary-rgb), 0.1)',
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {React.cloneElement(icon, { size: 20 })}
                </div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: danger ? 'var(--status-red)' : 'var(--text-main)' }}>
                        {label}
                    </div>
                    {value && <div style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 700, marginTop: '2px' }}>{value}</div>}
                </div>
            </div>

            {toggle ? (
                <div style={{
                    width: '44px',
                    height: '26px',
                    background: checked ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                    borderRadius: '13px',
                    position: 'relative',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: checked ? '0 0 15px rgba(var(--primary-rgb), 0.3)' : 'none'
                }}>
                    <motion.div
                        animate={{ x: checked ? 20 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        style={{
                            width: '22px',
                            height: '22px',
                            background: 'white',
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '2px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                    />
                </div>
            ) : (
                <ChevronRight size={18} style={{ opacity: 0.2 }} />
            )}
        </motion.div>
    );

    return (
        <div className="container" style={{ paddingBottom: '120px' }}>
            {/* Hidden Input for Image */}
            <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
            />

            {/* Header / Profile Hero */}
            <header className="pt-8 pb-8">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div className="stagger-in">
                        <p style={{ fontSize: '0.75rem', fontWeight: 900, opacity: 0.4, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                            {t('cuenta')}
                        </p>
                        <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>{t('profile')}</h1>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleLogout}
                        style={{
                            background: 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid rgba(239, 68, 68, 0.1)',
                            color: 'var(--status-red)',
                            padding: '10px',
                            borderRadius: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        <LogOut size={20} />
                    </motion.button>
                </div>

                <motion.div
                    className="premium-card"
                    style={{
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(var(--primary-rgb), 0.05) 100%)',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    <div
                        onClick={() => imageInputRef.current?.click()}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            background: 'var(--glass)',
                            border: '2px solid var(--primary)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                    >
                        {profileImage ? (
                            <img src={profileImage} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                <User size={40} />
                            </div>
                        )}
                        <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--primary)', color: 'white', padding: '4px', borderRadius: '8px 0 0 0' }}>
                            <Camera size={12} />
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '4px' }}>
                            {user?.email?.split('@')[0] || t('usuario_gourmet')}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                padding: '4px 10px',
                                background: isPro ? 'linear-gradient(90deg, #BC6C25, #DDA15E)' : 'rgba(0,0,0,0.05)',
                                color: isPro ? 'white' : 'var(--text-muted)',
                                borderRadius: '8px',
                                fontSize: '0.65rem',
                                fontWeight: 900,
                                letterSpacing: '1px'
                            }}>
                                {isPro ? 'STRIPE GOLD PRO' : 'FREE TIER'}
                            </div>
                            {isPro && <Award size={14} style={{ color: '#BC6C25' }} />}
                        </div>
                    </div>
                </motion.div>
                {isPro && (
                    <div style={{ marginTop: '1rem' }}>
                        <MenuItem
                            icon={<CreditCard />}
                            label={t('gestionar_suscripcion') || 'Gestionar Suscripción'}
                            value={t('cancelar_o_cambiar') || 'Portal de pagos de Stripe'}
                            onClick={manageSubscription}
                        />
                    </div>
                )}
            </header>

            {!isPro && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={upgradeToPro}
                    style={{
                        background: 'linear-gradient(135deg, var(--charcoal) 0%, #1a1a1a 100%)',
                        padding: '1.5rem',
                        borderRadius: '2rem',
                        marginBottom: '2.5rem',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ color: '#FFD700', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '8px' }}>{t('vanguard_plus').toUpperCase()}</div>
                        <div style={{ fontWeight: 900, fontSize: '1.3rem', marginBottom: '4px' }}>{t('mejorar_pro')}</div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.7, fontWeight: 500 }}>{t('exclusive_pro')}</div>
                    </div>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CreditCard size={24} color="#FFD700" />
                    </div>
                    <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)' }} />
                </motion.div>
            )}

            {/* Config Section */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', opacity: 0.4, marginBottom: '1.25rem', paddingLeft: '0.5rem', textTransform: 'uppercase' }}>
                    {t('configuracion') || 'Configuración'}
                </h3>
                <MenuItem
                    icon={<Globe />}
                    label={t('idioma')}
                    value={language === 'es' ? 'Español' : language === 'en' ? 'English' : 'Català'}
                    onClick={() => {
                        const nextLang = language === 'es' ? 'en' : language === 'en' ? 'ca' : 'es';
                        setLanguage(nextLang);
                    }}
                />
                <MenuItem
                    icon={theme === 'dark' ? <Moon /> : <Sun />}
                    label={t('modo_oscuro')}
                    toggle
                    checked={theme === 'dark'}
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                />
                <MenuItem
                    icon={<Bell />}
                    label={t('preferencias')}
                    value={isPro ? t('alertas_personalizadas') : t('solo_premium')}
                    disabled={!isPro}
                    toggle={isPro}
                    checked={notificationsEnabled}
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                />
            </div>

            {/* Legacy / Account Section */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', opacity: 0.4, marginBottom: '1.25rem', paddingLeft: '0.5rem', textTransform: 'uppercase' }}>
                    {t('preferencias') || 'Preferencias'}
                </h3>
                <MenuItem icon={<Settings />} label={t('pref_alimentarias')} onClick={() => goTo('diet-settings')} />
                <MenuItem icon={<Shield />} label={t('privacidad')} onClick={handlePrivacyRedirect} />
                <MenuItem icon={<HelpCircle />} label={t('ayuda')} onClick={() => setShowHelpModal(true)} />
            </div>

            {/* Help Modal */}
            <AnimatePresence>
                {showHelpModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            style={{ background: 'var(--card-bg)', width: '100%', maxWidth: '400px', borderRadius: '2rem', padding: '2rem', position: 'relative', border: '1px solid var(--border-color)' }}
                        >
                            <button onClick={() => setShowHelpModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-main)', opacity: 0.5 }}>
                                <X size={24} />
                            </button>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>Centro de Ayuda</h2>
                            <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '1.5rem' }}>Cuéntanos tu problema o duda y te responderemos en info@artbymaeki.com</p>

                            <form onSubmit={handleHelpSubmit}>
                                <textarea
                                    value={helpMessage}
                                    onChange={(e) => setHelpMessage(e.target.value)}
                                    placeholder="Escribe aquí tu mensaje..."
                                    style={{ width: '100%', height: '150px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '1rem', color: 'var(--text-main)', fontSize: '1rem', resize: 'none', marginBottom: '1.5rem' }}
                                    required
                                />
                                <button type="submit" style={{ width: '100%', background: 'var(--primary)', color: 'white', padding: '1.2rem', borderRadius: '1rem', border: 'none', fontWeight: 900, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <Send size={18} /> ENVIAR CONSULTA
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileView;

