import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
    const [dietSettings, setDietSettings] = useState(() => {
        const saved = localStorage.getItem('pantry_diet_settings');
        return saved ? JSON.parse(saved) : { type: 'Omnívora', dailyCalories: 2000 };
    });
    const diet = dietSettings.type;
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
        localStorage.setItem('pantry_diet_settings', JSON.stringify(dietSettings));
    }, [dietSettings]);

    useEffect(() => {
        localStorage.setItem('pantry_notifications', notificationsEnabled);
        if (notificationsEnabled && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, [notificationsEnabled]);

    useEffect(() => {
        if (notificationsEnabled) {
            // Mock notification setup
            console.log(t('notificaciones_activadas') || "Notificaciones habilitadas");
        }
    }, [notificationsEnabled, t]);

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
    }, [inventory, notificationsEnabled, t]); // Escuchar cambios en inventario, permisos y traducciones

    useEffect(() => {
        if (!user) return;
        const checkSub = async () => {
            try {
                const res = await fetch(`/api/subscription-status?email=${encodeURIComponent(user.email)}`);
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
            if (diet === 'Omnívora') return true;

            const dietLower = diet.toLowerCase();
            const tags = (recipe.tags || []).map(t => t.toLowerCase());

            // Lógica de exclusión estricta
            if (dietLower.includes('vegan') && !tags.some(t => t.includes('vegan'))) return false;
            if (dietLower.includes('vegetar') && !tags.some(t => t.includes('vegetar') || t.includes('vegan'))) return false;
            if (dietLower.includes('keto') && !tags.some(t => t.includes('keto'))) return false;
            if (dietLower.includes('gluten') && !tags.some(t => t.includes('gluten'))) return false;
            if (dietLower.includes('paleo') && !tags.some(t => t.includes('paleo'))) return false;
            if (dietLower.includes('lacto') && !tags.some(t => t.includes('lacto'))) return false;

            return true;
        });

        console.log(`[PantryContext] Filtered: ${filtered.length} recipes match ${diet}`);
        setRecipes(filtered);
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

    const t = useCallback((key, params = {}) => {
        const dict = translations[language] || translations['es'] || {};
        let text = dict[key] || translations['es']?.[key] || key;

        Object.keys(params).forEach(p => {
            text = text.replace(`{${p}}`, params[p]);
        });
        return text;
    }, [language]);

    const value = {
        user, loading, language, setLanguage, theme, setTheme,
        inventory, setInventory, view, goTo, prevView,
        profileImage, setProfileImage, isPro, setIsPro,
        recipes, dietSettings, setDietSettings, diet, logout, t,
        selectedRecipe, setSelectedRecipe,
        notificationsEnabled, setNotificationsEnabled,
        addProductToInventory: async (product) => {
            // Check limits for Free users
            if (!isPro && inventory.length >= 15) {
                alert(t('limite_superado') || "Has alcanzado el límite de 15 productos. ¡Pásate a Pro para tener inventario ilimitado!");
                return false;
            }

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
                return true;
            } catch (e) {
                console.error("Error syncing inventory:", e);
                return true; // Still return true as it's added locally
            }
        },
        deleteProduct: async (id) => {
            setInventory(prev => prev.filter(item => item.id !== id));
            try {
                await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
            } catch (e) {
                console.error("Error deleting product:", e);
            }
        },
        toggleFavorite: async (recipeId, currentStatus) => {
            setRecipes(prev => prev.map(r =>
                r.id === recipeId ? { ...r, is_favorite: !currentStatus } : r
            ));
            try {
                await fetch(`/api/recipes/${recipeId}/favorite`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_favorite: !currentStatus })
                });
            } catch (e) {
                console.error("Error toggling favorite:", e);
            }
        },
        updateProfileImage: (img) => {
            setProfileImage(img);
            localStorage.setItem('pantry_profile_image', img);
        },
        upgradeToPro: async () => {
            const email = user?.email || 'guest@example.com';
            try {
                const res = await fetch('/api/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userEmail: email,
                        priceId: 'price_smart_monthly'
                    })
                });
                const data = await res.json();
                if (data.url) {
                    window.location.href = data.url;
                }
            } catch (e) {
                console.error("Payment error:", e);
                alert("Error al conectar con Stripe. Verifica tu conexión o configuración.");
                setIsPro(true);
            }
        }
    };

    return (
        <PantryContext.Provider value={value} >
            {children}
        </PantryContext.Provider >
    );
};

export const usePantry = () => useContext(PantryContext);
