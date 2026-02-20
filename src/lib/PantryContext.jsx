import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { translations } from './translations';
import { ALL_RECIPES } from './recipes';

const PantryContext = createContext();

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

    const [language, setLanguage] = useState(() => localStorage.getItem('pantry_lang') || 'es');
    const [theme, setTheme] = useState(() => localStorage.getItem('pantry_theme') || 'light');
    const [profileImage, setProfileImage] = useState(() => localStorage.getItem('pantry_profile_image'));
    const [isPro, setIsPro] = useState(false);

    const [dietSettings, setDietSettings] = useState(() => {
        const saved = localStorage.getItem('pantry_diet');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return {
                    type: parsed.type || 'Omnívora',
                    dailyCalories: parsed.dailyCalories || 2000,
                    vegetarian: parsed.vegetarian || false,
                    vegan: parsed.vegan || false,
                    glutenFree: parsed.glutenFree || false,
                    keto: parsed.keto || false
                };
            } catch (e) {
                return { type: 'Omnívora', dailyCalories: 2000, vegetarian: false, vegan: false, glutenFree: false, keto: false };
            }
        }
        return { type: 'Omnívora', dailyCalories: 2000, vegetarian: false, vegan: false, glutenFree: false, keto: false };
    });

    // Recipes logic
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    // Filter recipes based on language and diet
    useEffect(() => {
        console.log(`Filtering recipes for lang: ${language}, diet: ${dietSettings.type}`);

        // 1. Get recipes for current language (fallback to 'es')
        const langRecipes = ALL_RECIPES[language] || ALL_RECIPES['es'];

        // 2. Filter by diet type
        const filtered = langRecipes.filter(recipe => {
            const dietType = dietSettings.type;

            // If Omnivore, show everything
            if (dietType === 'Omnívora' || dietType === 'Omnivore') return true;

            // Map tags to match diet types
            const tags = recipe.tags.map(t => t.toLowerCase());

            if ((dietType === 'Vegetariana' || dietType === 'Vegetarian') && tags.includes('vegetariana') || tags.includes('vegetarian')) return true;
            if ((dietType === 'Vegana' || dietType === 'Vegan') && tags.includes('vegana') || tags.includes('vegan')) return true;
            if ((dietType === 'Gluten Free' || dietType === 'Sin Gluten') && tags.includes('gluten free') || tags.includes('sin gluten')) return true;
            if (dietType === 'Keto' && tags.includes('keto')) return true;
            if (dietType === 'Paleo' && tags.includes('paleo')) return true;

            // If it's a specific vegan recipe but user is vegetarian, it's also okay
            if ((dietType === 'Vegetariana' || dietType === 'Vegetarian') && (tags.includes('vegana') || tags.includes('vegan'))) return true;

            return false;
        });

        // If no recipes matches, at least show the first few of that language so it's not empty
        setRecipes(filtered.length > 0 ? filtered : langRecipes.slice(0, 3));
    }, [language, dietSettings.type]);

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

    useEffect(() => {
        if (user?.email) {
            checkSubscription(user.email);
        }
    }, [user?.email, checkSubscription]);

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
            recipes, setRecipes, featuredRecipes: recipes,
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
