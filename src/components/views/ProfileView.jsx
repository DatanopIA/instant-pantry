import React from 'react';
import { motion } from 'framer-motion';
import {
    ChevronRight, Globe, Moon, Sun,
    Bell, User, Shield, HelpCircle, ArrowRight,
    LogOut, Settings, CreditCard, Award
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
        user
    } = usePantry();

    const handleLogout = async () => {
        await logout();
        window.location.reload();
    };

    const MenuItem = ({ icon, label, value, onClick, toggle, checked, danger }) => (
        <motion.div
            whileHover={{ x: 5, background: 'rgba(var(--primary-rgb), 0.05)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="premium-card"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem',
                marginBottom: '0.75rem',
                cursor: 'pointer',
                borderRadius: '1.5rem',
                border: '1px solid var(--border-color)',
                background: 'var(--card-bg)'
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
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        background: 'var(--glass)',
                        border: '1px solid rgba(var(--primary-rgb), 0.2)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    }}>
                        {profileImage ? (
                            <img src={profileImage} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                <User size={40} />
                            </div>
                        )}
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
                    {t('configuracion')}
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
                    label={t('alertas_hoy', { count: 3 })}
                    value="Push & Email Synchronized"
                />
            </div>

            {/* Legacy / Account Section */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', opacity: 0.4, marginBottom: '1.25rem', paddingLeft: '0.5rem', textTransform: 'uppercase' }}>
                    {t('preferencias')}
                </h3>
                <MenuItem icon={<Settings />} label={t('pref_alimentarias')} onClick={() => goTo('diet-settings')} />
                <MenuItem icon={<Shield />} label={t('privacidad')} />
                <MenuItem icon={<HelpCircle />} label={t('ayuda')} />
            </div>
        </div>
    );
};

export default ProfileView;

