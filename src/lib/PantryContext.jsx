import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from './supabase';
import { ALL_RECIPES } from './recipes';
import { translations } from './translations';
window.DEBUG_TRANSLATIONS = translations;

const PantryContext = createContext();

export const PantryProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState(() => localStorage.getItem('pantry_lang') || 'es');
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('pantry_theme');
        return (saved && saved !== 'dark') ? saved : 'light';
    });
    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('pantry_inventory');
        return saved ? JSON.parse(saved) : [];
    });
    const [view, setView] = useState('home');
    const [prevView, setPrevView] = useState('home');
    const [profileImage, setProfileImage] = useState(() => localStorage.getItem('pantry_profile_image'));
    const [isPro, setIsPro] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [diet, setDiet] = useState(() => localStorage.getItem('pantry_diet') || 'Omnívora');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
        const saved = localStorage.getItem('pantry_notifications');
        return saved === 'true';
    });

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        localStorage.setItem('pantry_lang', language);
    }, [language]);

    useEffect(() => {
        localStorage.setItem('pantry_theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('pantry_inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('pantry_diet', diet);
    }, [diet]);

    useEffect(() => {
        localStorage.setItem('pantry_notifications', notificationsEnabled);
        if (notificationsEnabled && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, [notificationsEnabled]);

    useEffect(() => {
        if (notificationsEnabled && inventory.length > 0) {
            const expiringSoon = inventory.filter(item => item.status === 'red' || (item.exp && item.exp <= 2));
            if (expiringSoon.length > 0 && Notification.permission === 'granted') {
                const title = t('vence_pronto');
                const body = t('despensa_status_msg', { count: expiringSoon.length });
                new Notification(title, {
                    body,
                    icon: '/favicon.ico',
                    badge: '/favicon.ico'
                });
            }
        }
    }, [inventory]); // Solo disparamos cuando cambia el inventario

    useEffect(() => {
        if (!user) return;
        const checkSub = async () => {
            try {
                const res = await fetch('/api/subscription-status');
                const data = await res.json();
                setIsPro(data.isPro);
            } catch (e) {
                setIsPro(true); // Mock Pro for testing
            }
        };
        checkSub();
    }, [user]);

    useEffect(() => {
        const currentLang = language === 'en' ? 'en' : language === 'ca' ? 'ca' : 'es';
        const langRecipes = ALL_RECIPES[currentLang] || ALL_RECIPES['es'];

        console.log(`[PantryContext] Filtering recipes for lang: ${currentLang}, diet: ${diet}`);

        const filtered = langRecipes.filter(recipe => {
            if (diet === 'Vegano' && !recipe.tags?.some(t => t.toLowerCase() === 'vegano' || t.toLowerCase() === 'vegan')) return false;
            if (diet === 'Sin Gluten' && !recipe.tags?.some(t => t.toLowerCase().includes('gluten'))) return false;
            if (diet === 'Keto' && !recipe.tags?.some(t => t.toLowerCase() === 'keto')) return false;
            return true;
        });

        setRecipes(filtered.length > 0 ? filtered : langRecipes.slice(0, 5));
    }, [language, diet]);

    const goTo = (newView) => {
        setPrevView(view);
        setView(newView);
        window.scrollTo(0, 0);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setView('landing');
    };

    const t = (key, params = {}) => {
        const dict = translations[language] || translations['es'] || {};
        let text = dict[key] || translations['es']?.[key] || key;

        Object.keys(params).forEach(p => {
            text = text.replace(`{${p}}`, params[p]);
        });
        return text;
    };

    const value = {
        user, loading, language, setLanguage, theme, setTheme,
        inventory, setInventory, view, goTo, prevView,
        profileImage, setProfileImage, isPro, setIsPro,
        recipes, diet, setDiet, logout, t,
        selectedRecipe, setSelectedRecipe,
        notificationsEnabled, setNotificationsEnabled,
        addProductToInventory: async (product) => {
            const newItem = {
                id: Date.now() + Math.random(),
                ...product,
                status: product.status || 'green'
            };
            setInventory(prev => [newItem, ...prev]);

            // Sync with backend if needed
            try {
                await fetch('/api/inventory', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newItem)
                });
            } catch (e) {
                console.error("Error syncing inventory:", e);
            }
        },
        updateProfileImage: (img) => {
            setProfileImage(img);
            localStorage.setItem('pantry_profile_image', img);
        },
        upgradeToPro: async () => {
            if (!user) return;
            try {
                const res = await fetch('/api/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userEmail: user.email,
                        priceId: 'price_smart_monthly' // Debería coincidir con el ID real de Stripe
                    })
                });
                const data = await res.json();
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    // Fallback para demo si no hay Stripe configurado
                    setIsPro(true);
                }
            } catch (e) {
                console.error("Payment error:", e);
                setIsPro(true);
            }
        }
    };

    return (
        <PantryContext.Provider value={value}>
            {children}
        </PantryContext.Provider>
    );
};

export const usePantry = () => useContext(PantryContext);
