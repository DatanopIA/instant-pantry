import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { translations } from './translations';

const PantryContext = createContext();

// Recetas de ejemplo para que la app no se vea vacía
const FEATURED_RECIPES = [
    {
        id: 'feat-1',
        title: 'Pasta al Pesto de Albahaca',
        time: '20 min',
        cal: '450 kcal',
        img: 'https://images.unsplash.com/photo-1591986122435-01bd9b101662?q=80&w=1000&auto=format&fit=crop',
        tags: ['Vegetariano', 'Rápido'],
        ingredients: ['Pasta', 'Albahaca', 'Piñones', 'Queso Parmesano', 'Aceite de Oliva']
    },
    {
        id: 'feat-2',
        title: 'Bowl de Pollo y Aguacate',
        time: '25 min',
        cal: '520 kcal',
        img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop',
        tags: ['Saludable', 'Proteína'],
        ingredients: ['Pollo', 'Aguacate', 'Arroz', 'Tomates', 'Espinacas']
    },
    {
        id: 'feat-3',
        title: 'Salmón con Verduras',
        time: '30 min',
        cal: '480 kcal',
        img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1000&auto=format&fit=crop',
        tags: ['Gourmet', 'Omega-3'],
        ingredients: ['Salmón', 'Brócoli', 'Zanahorias', 'Limón', 'Mantequilla']
    }
];

export const PantryProvider = ({ children }) => {
    // Lazy initializers for state
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('pantry_user');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return null;
            }
        }
        return null;
    });

    const [view, setView] = useState(user ? 'home' : 'landing');
    const [prevView, setPrevView] = useState('home');

    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('pantry_inventory');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return [];
            }
        }
        return [];
    });

    const [recipes, setRecipes] = useState(FEATURED_RECIPES);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [language, setLanguage] = useState(() => localStorage.getItem('pantry_lang') || 'es');
    const [theme, setTheme] = useState(() => localStorage.getItem('pantry_theme') || 'light');
    const [profileImage, setProfileImage] = useState(() => localStorage.getItem('pantry_profile_image'));
    const [isPro, setIsPro] = useState(false);
    const [dietSettings, setDietSettings] = useState(() => {
        const saved = localStorage.getItem('pantry_diet');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return { vegetarian: false, vegan: false, glutenFree: false, keto: false };
            }
        }
        return { vegetarian: false, vegan: false, glutenFree: false, keto: false };
    });

    const checkSubscription = useCallback(async (email) => {
        if (!email) return;
        try {
            const res = await fetch(`/api/subscription-status?email=${encodeURIComponent(email)}`);
            if (res.ok) {
                const data = await res.json();
                setIsPro(data.isPro);
            }
        } catch (err) {
            console.error('Sub status error:', err);
        }
    }, []);

    const login = useCallback((userData) => {
        console.log('Context: Logging in user', userData.email);
        setUser(userData);
        localStorage.setItem('pantry_user', JSON.stringify(userData));
        setView('home');
        checkSubscription(userData.email);
    }, [checkSubscription]);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem('pantry_user');
        setView('landing');
    }, []);

    // Escuchar cambios de autenticación de Supabase
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const userData = {
                    email: session.user.email,
                    name: session.user.user_metadata.full_name || session.user.email.split('@')[0],
                    id: session.user.id
                };
                login(userData);
            }
        };
        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                const userData = {
                    email: session.user.email,
                    name: session.user.user_metadata.full_name || session.user.email.split('@')[0],
                    id: session.user.id
                };
                login(userData);
            }
        });

        return () => subscription?.unsubscribe();
    }, [login]);

    // Check subscription on mount if user exists
    useEffect(() => {
        if (user?.email) {
            checkSubscription(user.email);
        }
    }, [user?.email, checkSubscription]);

    // Persistence to localStorage
    useEffect(() => {
        localStorage.setItem('pantry_inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('pantry_lang', language);
    }, [language]);

    useEffect(() => {
        localStorage.setItem('pantry_theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('pantry_diet', JSON.stringify(dietSettings));
    }, [dietSettings]);

    const goTo = (newView) => {
        setPrevView(view);
        setView(newView);
        window.scrollTo(0, 0);
    };

    const addProductToInventory = (product) => {
        const newProduct = {
            id: Date.now().toString(),
            ...product,
            quantity: 1,
            addedAt: new Date()
        };
        setInventory(prev => [newProduct, ...prev]);
        return newProduct;
    };

    const removeProduct = (id) => {
        setInventory(prev => prev.filter(item => item.id !== id));
    };

    const updateProduct = (id, updates) => {
        setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const updateProfileImage = (newImage) => {
        setProfileImage(newImage);
        localStorage.setItem('pantry_profile_image', newImage);
    };

    const upgradeToPro = async () => {
        try {
            const res = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user?.email })
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                const mockConfirm = confirm("¡Vaya! El sistema de pagos real requiere configuración de Stripe. ¿Quieres activar el modo PRO de prueba gratis ahora mismo?");
                if (mockConfirm) {
                    setIsPro(true);
                }
            }
        } catch (err) {
            console.error('Stripe error:', err);
            const mockConfirm = confirm("Error de conexión. ¿Quieres activar el modo PRO local de prueba?");
            if (mockConfirm) setIsPro(true);
        }
    };

    const t = (key, params = {}) => {
        let text = translations[language]?.[key] || key;
        Object.keys(params).forEach(p => {
            text = text.replace(`{${p}}`, params[p]);
        });
        return text;
    };

    return (
        <PantryContext.Provider value={{
            view, goTo, prevView,
            user, login, logout,
            inventory, addProductToInventory, removeProduct, updateProduct,
            recipes, setRecipes, featuredRecipes: FEATURED_RECIPES,
            selectedRecipe, setSelectedRecipe,
            language, setLanguage,
            theme, setTheme,
            profileImage, updateProfileImage,
            isPro, upgradeToPro,
            dietSettings, setDietSettings,
            t
        }}>
            {children}
        </PantryContext.Provider>
    );
};

export const usePantry = () => useContext(PantryContext);
