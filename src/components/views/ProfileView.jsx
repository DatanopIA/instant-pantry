import React from 'react';
import { usePantry } from '../../lib/PantryContext';
import {
    Settings,
    Moon,
    Globe,
    LogOut,
    User,
    ChevronRight,
    Camera,
    Award,
    Star,
    ArrowLeft,
    Gem,
    Shield,
    HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileView = () => {
    const {
        user,
        logout,
        language,
        setLanguage,
        theme,
        setTheme,
        profileImage,
        updateProfileImage,
        isPro,
        upgradeToPro,
        goTo
    } = usePantry();
    const fileInputRef = React.useRef(null);

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

    return (
        <div className="container" style={{ paddingBottom: '120px' }}>
            <header className="pt-8 pb-8 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem', cursor: 'pointer' }}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--glass)', border: '2px solid var(--primary)', padding: '4px', overflow: 'hidden' }}>
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'rgba(var(--primary-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={60} color="var(--primary)" />
                            </div>
                        )}
                    </div>
                    <div style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--primary)', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-color)' }}>
                        <Camera size={14} />
                    </div>
                    {isPro && (
                        <div style={{ position: 'absolute', top: '0', left: '0', background: 'var(--terrakotta)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-color)', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                            <Gem size={16} />
                        </div>
                    )}
                </motion.div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>{user?.name || 'Chef Gourmet'}</h1>
                <p style={{ fontSize: '0.85rem', opacity: 0.6, fontWeight: 600 }}>{user?.email || 'usuario@pantry.ia'}</p>

                {isPro ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(216, 140, 81, 0.1)', color: 'var(--terrakotta)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, marginTop: '1rem', border: '1px solid rgba(216, 140, 81, 0.2)' }}>
                        {t('pro_activo')}
                    </div>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary"
                        onClick={upgradeToPro}
                        style={{ marginTop: '1.25rem', padding: '0.8rem 1.5rem', borderRadius: '12px', fontSize: '0.8rem', border: 'none' }}
                    >
                        {t('mejorar_pro')}
                    </motion.button>
                )}
            </header>

            {/* Menu Sections */}
            <div style={{ display: 'grid', gap: '1rem' }}>
                <Section title={t('configuracion')}>
                    <MenuItem icon={<Settings size={20} />} label={t('preferencia_dieta')} onClick={() => goTo('diet-settings')} />
                    <MenuItem
                        icon={<Globe size={20} />}
                        label={t('idioma')}
                        value={language === 'es' ? 'Español' : language === 'en' ? 'English' : 'Català'}
                        onClick={() => {
                            const nextLang = language === 'es' ? 'en' : language === 'en' ? 'ca' : 'es';
                            setLanguage(nextLang);
                        }}
                    />
                    <MenuItem
                        icon={<Moon size={20} />}
                        label={t('modo_oscuro')}
                        toggle
                        checked={theme === 'dark'}
                        onChange={() => {
                            setTheme(theme === 'dark' ? 'light' : 'dark');
                        }}
                    />
                </Section>

                <Section title={t('cuenta')}>
                    <MenuItem icon={<Shield size={20} />} label={t('privacidad')} onClick={() => alert('Tu privacidad es nuestra prioridad.')} />
                    <MenuItem icon={<HelpCircle size={20} />} label={t('ayuda')} onClick={() => alert('Soporte: soporte@instantpantry.ia')} />
                    <MenuItem icon={<LogOut size={20} />} label={t('cerrar_sesion')} danger onClick={handleLogout} />
                </Section>

                <div style={{ textAlign: 'center', padding: '2rem 0', opacity: 0.3 }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px' }}>INSTANT PANTRY V1.1.0 BY DATANOPIA</p>
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, children }) => (
    <div style={{ marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', marginLeft: '1rem', marginBottom: '0.75rem' }}>{title}</h3>
        <div className="glass-panel" style={{ borderRadius: '1.5rem', overflow: 'hidden', padding: '0.5rem' }}>
            {children}
        </div>
    </div>
);

const MenuItem = ({ icon, label, value, onClick, danger, toggle, checked, onChange, lock }) => (
    <div
        onClick={lock ? null : onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            cursor: lock ? 'not-allowed' : 'pointer',
            opacity: lock ? 0.5 : 1
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: danger ? 'var(--status-red)' : 'var(--text-main)' }}>
            {icon}
            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{label}</span>
            {lock && <Gem size={12} style={{ color: 'var(--terrakotta)' }} />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {value && <span style={{ fontSize: '0.85rem', opacity: 0.4 }}>{value}</span>}
            {toggle ? (
                <label className="switch">
                    <input type="checkbox" checked={checked} onChange={onChange} disabled={lock} />
                    <span className="slider round"></span>
                </label>
            ) : (
                <ChevronRight size={18} style={{ opacity: 0.3 }} />
            )}
        </div>
    </div>
);

export default ProfileView;
