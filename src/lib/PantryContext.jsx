import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { apiFetch } from './api';
import { ALL_RECIPES } from './recipes';
import { translations } from './translations';

const PantryContext = createContext();

export const PantryProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState(() => localStorage.getItem('pantry_lang') || 'es');
    const [theme, setTheme] = useState(() => localStorage.getItem('pantry_theme') || 'light');
    const [inventory, setInventory] = useState([]);
    const [view, setView] = useState('home');
    const [prevView, setPrevView] = useState('home');
    const [profileImage, setProfileImage] = useState(() => localStorage.getItem('pantry_profile_image'));
    const [isPro, setIsPro] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [dietSettings, setDietSettings] = useState(() => {
        const saved = localStorage.getItem('pantry_diet_settings');
        return saved ? JSON.parse(saved) : { type: 'Omnívora', dailyCalories: 2000 };
    });
    const diet = dietSettings.type;
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem('pantry_notifications') === 'true');

    // --- AUTH & INITIAL DATA ---
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                await fetchUserData(currentUser);
            } else {
                setInventory([]);
                setIsPro(false);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserData = async (currentUser) => {
        try {
            // 1. Fetch Subscription Status (JWT used for email identification)
            const subData = await apiFetch('/api/subscription-status');
            setIsPro(subData.isPro);

            // 2. Fetch Inventory (JWT used for email identification)
            const invData = await apiFetch('/api/inventory');
            setInventory(invData);
        } catch (e) {
            console.error("Error fetching user data:", e);
        }
    };

    // --- PERSISTENCE ---
    useEffect(() => { localStorage.setItem('pantry_lang', language); }, [language]);
    useEffect(() => {
        localStorage.setItem('pantry_theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
    useEffect(() => { localStorage.setItem('pantry_diet_settings', JSON.stringify(dietSettings)); }, [dietSettings]);
    useEffect(() => { localStorage.setItem('pantry_notifications', notificationsEnabled); }, [notificationsEnabled]);

    // --- RECIPE FILTERING ---
    useEffect(() => {
        const currentLang = language === 'en' ? 'en' : language === 'ca' ? 'ca' : 'es';
        const langRecipes = ALL_RECIPES[currentLang] || ALL_RECIPES['es'];

        const filtered = langRecipes.filter(recipe => {
            if (diet === 'Omnívora') return true;
            const dietLower = diet.toLowerCase();
            const tags = (recipe.tags || []).map(t => t.toLowerCase());

            if (dietLower.includes('vegan') && !tags.some(t => t.includes('vegan'))) return false;
            if (dietLower.includes('vegetar') && !tags.some(t => t.includes('vegetar') || t.includes('vegan'))) return false;
            if (dietLower.includes('keto') && !tags.some(t => t.includes('keto'))) return false;
            if (dietLower.includes('gluten') && !tags.some(t => t.includes('gluten'))) return false;
            return true;
        });
        setRecipes(filtered);
    }, [language, diet]);

    // --- ACTIONS ---
    const goTo = (newView) => {
        setPrevView(view);
        setView(newView);
        window.scrollTo(0, 0);
    };

    const t = useCallback((key, params = {}) => {
        const dict = translations[language] || translations['es'] || {};
        let text = dict[key] || translations['es']?.[key] || key;
        Object.keys(params).forEach(p => { text = text.replace(`{${p}}`, params[p]); });
        return text;
    }, [language]);

    const addProductToInventory = async (product) => {
        const LIMIT = 15;
        if (!isPro && inventory.length >= LIMIT) {
            alert(t('limite_superado') || "Límite alcanzado. ¡Pásate a Pro!");
            return false;
        }

        const newItem = {
            ...product,
            user_email: user?.email,
            status: product.status || 'green'
        };

        try {
            const savedItem = await apiFetch('/api/inventory', {
                method: 'POST',
                body: JSON.stringify(newItem)
            });
            setInventory(prev => [savedItem, ...prev]);
            return true;
        } catch (e) {
            console.error("Error syncing inventory:", e);
            return false;
        }
    };

    const deleteProduct = async (id) => {
        setInventory(prev => prev.filter(item => item.id !== id));
        try {
            await apiFetch(`/api/inventory/${id}`, { method: 'DELETE' });
        } catch (e) {
            console.error("Error deleting product:", e);
        }
    };

    const upgradeToPro = async () => {
        if (!user) {
            goTo('landing');
            return;
        }
        try {
            const data = await apiFetch('/api/create-checkout-session', {
                method: 'POST',
                body: JSON.stringify({ userEmail: user.email })
            });
            if (data.url) window.location.href = data.url;
        } catch (e) {
            console.error("Payment error:", e);
            alert("Error al conectar con Stripe.");
        }
    };

    const manageSubscription = async () => {
        if (!user) return;
        try {
            const data = await apiFetch('/api/create-portal-session', {
                method: 'POST',
                body: JSON.stringify({ userEmail: user.email })
            });
            if (data.url) window.location.href = data.url;
            else alert("No se pudo encontrar una suscripción activa.");
        } catch (e) {
            console.error("Portal error:", e);
            alert("Error al conectar con el portal de pagos.");
        }
    };

    const value = {
        user, loading, language, setLanguage, theme, setTheme,
        inventory, setInventory, view, goTo, prevView,
        profileImage, setProfileImage, isPro,
        recipes, dietSettings, setDietSettings, diet, t,
        selectedRecipe, setSelectedRecipe,
        notificationsEnabled, setNotificationsEnabled,
        addProductToInventory, deleteProduct, upgradeToPro, manageSubscription,
        logout: async () => {
            await supabase.auth.signOut();
            setUser(null);
            setInventory([]);
            setIsPro(false);
            setView('landing');
        }
    };

    return <PantryContext.Provider value={value}>{children}</PantryContext.Provider>;
};

export const usePantry = () => useContext(PantryContext);
