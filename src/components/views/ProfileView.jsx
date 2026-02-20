import React from 'react';
import { motion } from 'framer-motion';
import {
    ChevronRight, Globe, Moon, Sun,
    Bell, User, Shield, HelpCircle, ArrowRight,
    LogOut
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
        logout
    } = usePantry();

    const handleLogout = async () => {
        await logout();
        window.location.reload();
    };

    const MenuItem = ({ icon, label, value, onClick, toggle, checked, danger }) => (
        <div
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                background: 'var(--glass)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                marginBottom: '0.75rem'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    color: danger ? 'var(--status-red)' : 'var(--primary)',
                    background: danger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(var(--primary-rgb), 0.1)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icon}
                </div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: danger ? 'var(--status-red)' : 'var(--text-main)' }}>
                        {label}
                    </div>
                    {value && <div style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 600 }}>{value}</div>}
                </div>
            </div>

            {toggle ? (
                <div style={{
                    width: '40px',
                    height: '24px',
                    background: checked ? 'var(--primary)' : 'var(--border-color)',
                    borderRadius: '12px',
                    position: 'relative',
                    transition: 'all 0.3s'
                }}>
                    <div style={{
                        width: '18px',
                        height: '18px',
                        background: 'white',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '3px',
                        left: checked ? '19px' : '3px',
                        transition: 'all 0.3s'
                    }} />
                </div>
            ) : (
                <ChevronRight size={18} style={{ opacity: 0.3 }} />
            )}
        </div>
    );

    return (
        <div className="container" style={{ paddingBottom: '120px' }}>
            <header className="pt-8 pb-6 flex justify-between items-center">
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{t('profile')}</h1>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    style={{ background: 'none', border: 'none', color: 'var(--status-red)', fontWeight: 800, fontSize: '0.9rem' }}
                >
                    <LogOut size={18} style={{ display: 'inline', marginRight: '6px' }} />
                    {t('cerrar_sesion')}
                </motion.button>
            </header>

            {!isPro && (
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={upgradeToPro}
                    style={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        padding: '1.25rem 1.5rem',
                        borderRadius: '20px',
                        marginBottom: '2.5rem',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 10px 30px rgba(255, 215, 0, 0.2)'
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '4px' }}>{t('mejorar_pro')}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 600 }}>{t('exclusive_pro')}</div>
                    </div>
                    <ArrowRight size={24} />
                </motion.div>
            )}

            {/* Config Section */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', opacity: 0.4, marginBottom: '1.25rem', paddingLeft: '0.5rem', textTransform: 'uppercase' }}>
                    {t('configuracion')}
                </h3>
                <MenuItem
                    icon={<Globe size={18} />}
                    label={t('idioma')}
                    value={language === 'es' ? 'Español' : language === 'en' ? 'English' : 'Català'}
                    onClick={() => {
                        const nextLang = language === 'es' ? 'en' : language === 'en' ? 'ca' : 'es';
                        setLanguage(nextLang);
                    }}
                />
                <MenuItem
                    icon={theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                    label={t('modo_oscuro')}
                    toggle
                    checked={theme === 'dark'}
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                />
                <MenuItem
                    icon={<Bell size={18} />}
                    label={t('alertas_hoy', { count: 3 })}
                    value="Push & Email"
                />
            </div>

            {/* Account Section */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', opacity: 0.4, marginBottom: '1.25rem', paddingLeft: '0.5rem', textTransform: 'uppercase' }}>
                    {t('cuenta')}
                </h3>
                <MenuItem icon={<User size={18} />} label={t('pref_alimentarias')} onClick={() => goTo('diet-settings')} />
                <MenuItem icon={<Shield size={18} />} label={t('privacidad')} />
                <MenuItem icon={<HelpCircle size={18} />} label={t('ayuda')} />
            </div>
        </div>
    );
};

export default ProfileView;
