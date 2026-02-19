import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

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
    const [view, setView] = useState('landing');
    const [prevView, setPrevView] = useState('home');
    const [user, setUser] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [recipes, setRecipes] = useState(FEATURED_RECIPES);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [language, setLanguage] = useState('es');
    const [theme, setTheme] = useState('light');
    const [profileImage, setProfileImage] = useState(null);
    const [isPro, setIsPro] = useState(false);
    const [dietSettings, setDietSettings] = useState({
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        keto: false
    });

    // Escuchar cambios de autenticación de Supabase
    useEffect(() => {
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
    }, []);

    // Cargar datos al iniciar
    useEffect(() => {
        const savedInventory = localStorage.getItem('pantry_inventory');
        if (savedInventory) {
            try {
                const parsed = JSON.parse(savedInventory);
                if (Array.isArray(parsed)) setInventory(parsed);
            } catch (e) {
                console.error("Error loading inventory", e);
            }
        }

        const savedUser = localStorage.getItem('pantry_user');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                setUser(parsed);
                setView('home');
                checkSubscription(parsed.email);
            } catch (e) {
                console.error("Error loading user", e);
            }
        }

        const savedProfileImage = localStorage.getItem('pantry_profile_image');
        if (savedProfileImage) setProfileImage(savedProfileImage);

        const savedDiet = localStorage.getItem('pantry_diet');
        if (savedDiet) {
            try {
                setDietSettings(JSON.parse(savedDiet));
            } catch (e) {
                console.error("Error loading diet settings", e);
            }
        }
    }, []);

    // Guardar inventario cuando cambie
    useEffect(() => {
        if (inventory.length > 0) {
            localStorage.setItem('pantry_inventory', JSON.stringify(inventory));
        }
    }, [inventory]);

    // Guardar dieta cuando cambie
    useEffect(() => {
        localStorage.setItem('pantry_diet', JSON.stringify(dietSettings));
    }, [dietSettings]);

    const checkSubscription = async (email) => {
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
    };

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('pantry_user', JSON.stringify(userData));
        setView('home');
        checkSubscription(userData.email);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem('pantry_user');
        setView('landing');
    };

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

    const t = (key) => {
        const translations = {
            'es': {
                'bienvenido': 'HOLA,',
                'hoy': 'Hoy',
                'despensa': 'Despensa',
                'recetas': 'Recetas',
                'IA': 'Chat Chef',
                'perfil': 'Mi Perfil',
                'escanear': 'Escanear',
                'cocinar_ahora': 'COCINAR AHORA',
                'saludo_ia': '¡Hola! Soy tu Chef de Casa. He analizado tu despensa y estoy listo para ayudarte a cocinar algo delicioso y no desperdiciar nada. ¿Por dónde empezamos hoy?'
            },
            'en': {
                'bienvenido': 'HELLO,',
                'hoy': 'Today',
                'despensa': 'Pantry',
                'recetas': 'Recipes',
                'IA': 'AI Chef',
                'perfil': 'Profile',
                'escanear': 'Scan',
                'cocinar_ahora': 'COOK NOW',
                'saludo_ia': 'Hello! I am your House Chef. I have analyzed your pantry and I am ready to help you cook something delicious. Where do we start?'
            }
        };
        return translations[language]?.[key] || key;
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
