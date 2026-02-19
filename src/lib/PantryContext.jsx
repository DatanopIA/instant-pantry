import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { translations } from '../constants/translations';

const PantryContext = createContext();

export const PantryProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('home');
    const [prevView, setPrevView] = useState('home');
    const [inventory, setInventory] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [language, setLanguage] = useState('es');
    const [theme, setTheme] = useState('light');
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [userDiets, setUserDiets] = useState({ vegano: false, sin_gluten: false, keto: false, sin_lactosa: false });
    const [isPro, setIsPro] = useState(false);

    // Translation helper
    const t = useCallback((key) => {
        return translations[language][key] || key;
    }, [language]);

    const goTo = (newView) => {
        setPrevView(view);
        setView(newView);
        window.scrollTo(0, 0);
    };

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/inventory');
            const data = await res.json();
            setInventory(data || []);
        } catch (err) {
            console.error('Error fetching inventory:', err);
        }
    };

    const fetchRecipes = async () => {
        try {
            const res = await fetch('/api/recipes');
            const data = await res.json();
            setRecipes(data || []);
        } catch (err) {
            console.error('Error fetching recipes:', err);
        }
    };

    const checkSubscription = async (email) => {
        try {
            const res = await fetch(`/api/subscription/${email}`);
            const data = await res.json();
            setIsPro(data.tier === 'pro');
        } catch (err) {
            console.error('Error checking subscription:', err);
        }
    };

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                setProfileImage(session.user.user_metadata?.avatar_url);
                await checkSubscription(session.user.email);
            }

            await Promise.all([fetchItems(), fetchRecipes()]);
            setIsLoading(false);
        };

        init();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session) {
                setProfileImage(session.user.user_metadata?.avatar_url);
                checkSubscription(session.user.email);
            } else {
                setIsPro(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const addProductToInventory = async (product) => {
        if (!isPro && inventory.length >= 15) {
            alert("⚠️ Límite de Despensa alcanzado (15 productos). ¡Mejora a PRO para añadir alimentos ilimitados!");
            goTo('profile');
            return false;
        }
        try {
            const res = await fetch('/api/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            const data = await res.json();
            if (data.id) {
                setInventory(prev => [...prev, data]);
                return true;
            }
            return false;
        } catch (err) {
            console.error('Error adding product:', err);
            return false;
        }
    };

    const upgradeToPro = async () => {
        if (!user) {
            alert("Inicia sesión para mejorar tu cuenta.");
            return;
        }
        try {
            const res = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: 'price_smart_monthly', // ID de Stripe Pro
                    userEmail: user.email
                })
            });
            const { url } = await res.json();
            if (url) window.location.href = url;
        } catch (err) {
            console.error('Checkout error:', err);
            // Fallback para demo
            const mockConfirm = confirm("⚠️ [MODO DEMO] No se ha configurado la Secret de Stripe. ¿Quieres simular un pago exitoso para activar el modo PRO?");
            if (mockConfirm) {
                // Simular webhook local
                await fetch('/api/webhook', {
                    method: 'POST',
                    body: JSON.stringify({
                        type: 'checkout.session.completed',
                        data: { object: { customer_email: user.email, metadata: { user_tier: 'pro' } } }
                    })
                });
                setIsPro(true);
                alert("🎉 ¡Suscripción Pro activada correctamente!");
            }
        }
    };

    const value = {
        user, setUser,
        view, goTo, prevView,
        inventory, setInventory, addProductToInventory, deleteProduct,
        recipes, setRecipes,
        selectedRecipe, setSelectedRecipe,
        language, setLanguage, t,
        theme, setTheme,
        isLoading,
        isAuthenticating, setIsAuthenticating,
        profileImage, setProfileImage,
        userDiets, setUserDiets,
        isPro, setIsPro,
        upgradeToPro
    };

    return <PantryContext.Provider value={value}>{children}</PantryContext.Provider>;
};

export const usePantry = () => {
    const context = useContext(PantryContext);
    if (!context) throw new Error('usePantry must be used within a PantryProvider');
    return context;
};
