import React from 'react';

const Header = ({ title, subtitle, profileImage, onProfileClick }) => (
    <header className="pt-8 pb-6 px-0 flex justify-between items-end relative animate-fade-in">
        <div>
            <p className="text-primary" style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '4px'
            }}>{subtitle}</p>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{title}</h1>
        </div>
        <div
            onClick={onProfileClick}
            className="profile-shimmer"
            style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '50%',
                background: 'var(--glass)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(12px)',
                padding: profileImage ? '0' : '2px'
            }}
        >
            {profileImage ? (
                <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                <span className="material-icons-round notranslate" translate="no" style={{ color: 'var(--text-main)', fontSize: '1.8rem' }}>person</span>
            )}
        </div>
    </header>
);

export default Header;
