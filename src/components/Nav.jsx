import React from 'react';

const Nav = ({ activeView, onViewChange, tabs, language }) => (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 animate-slide-up">
        <div
            style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
            }}
        >
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onViewChange(tab.id)}
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '10px 0',
                        borderRadius: '16px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: activeView === tab.id ? 'var(--primary)' : 'transparent',
                        color: activeView === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                        border: 'none',
                        cursor: 'pointer',
                        transform: activeView === tab.id ? 'scale(1.05)' : 'scale(1)',
                    }}
                >
                    <span className="material-icons-round notranslate" translate="no" style={{ fontSize: '24px' }}>{tab.icon}</span>
                    <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.02em' }}>
                        {tab.label}
                    </span>
                </button>
            ))}
        </div>
    </nav>
);

export default Nav;
