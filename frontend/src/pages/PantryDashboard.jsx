import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Sparkles, ChevronRight, Clock } from 'lucide-react';
import { inventoryService } from '../services/inventoryService';
import { supabase } from '../utils/supabase';
import RecipeModal from '../components/RecipeModal';

const getDailySuggestion = (items) => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);

    const newUserSuggestions = [
        {
            title: "Tostada de Aguacate",
            description: "¿Te apetece empezar con esta receta rápida y deliciosa?",
            actionText: "Empezar",
            image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=150",
            ingredients: ["Aguacate", "Rebanada de pan", "Aceite de oliva", "Sal", "Zumo de limón"],
            instructions: ["1. Tuesta el pan a tu gusto.", "2. Corta el aguacate por la mitad y retira el hueso.", "3. Machaca el aguacate en un bol con un tenedor.", "4. Añade sal, un chorrito de aceite de oliva y unas gotas de limón.", "5. Extiende la mezcla sobre el pan tostado."],
            time: "5 min",
            difficulty: "Fácil"
        },
        {
            title: "Pancakes de Avena",
            description: "Un desayuno perfecto para comenzar a usar tu despensa.",
            actionText: "Descubrir",
            image: "https://images.unsplash.com/photo-1528207776546-32248a4c050d?auto=format&fit=crop&q=80&w=150",
            ingredients: ["Avena", "Leche", "Huevo", "Plátano", "Canela"],
            instructions: ["1. Tritura la avena hasta obtener harina.", "2. Machaca el plátano y mezcla con el huevo y la leche.", "3. Incorpora la avena y la canela a la mezcla húmeda.", "4. Cocina en una sartén con un poco de mantequilla o aceite."],
            time: "15 min",
            difficulty: "Fácil"
        },
        {
            title: "Pasta al Pesto",
            description: "Añade ingredientes a tu despensa para crear recetas como esta.",
            actionText: "Ver receta",
            image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=150",
            ingredients: ["Pasta", "Albahaca fresca", "Piñones", "Queso Parmesano", "Ajo", "Aceite de oliva"],
            instructions: ["1. Cuece la pasta según las instrucciones del paquete.", "2. Bate la albahaca, piñones, ajo, parmesano y aceite de oliva.", "3. Escurre la pasta.", "4. Mezcla la pasta caliente con el pesto."],
            time: "20 min",
            difficulty: "Fácil"
        }
    ];

    const existingUserSuggestions = [
        {
            title: "Tostada de Aguacate",
            category: "Desayuno / Cena",
            description: "Basado en tu despensa: Tostada de aguacate ideal para desayunar o cenar.",
            actionText: "Ver receta",
            image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=150",
            ingredients: ["Aguacate", "Rebanada de pan", "Aceite de oliva", "Sal", "Zumo de limón"],
            instructions: ["1. Tuesta el pan a tu gusto.", "2. Corta el aguacate por la mitad y retira el hueso.", "3. Machaca el aguacate en un bol con un tenedor.", "4. Añade sal, un chorrito de aceite de oliva y unas gotas de limón.", "5. Extiende la mezcla sobre el pan tostado."],
            time: "5 min",
            difficulty: "Fácil"
        },
        {
            title: "Ensalada Fresca",
            category: "Comida / Cena",
            description: "Basado en tu despensa: Ensalada fresca y saludable usando tus vegetales.",
            actionText: "Preparar",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=150",
            ingredients: ["Lechuga o espinacas", "Tomate", "Pepino", "Cebolla", "Aceite de oliva", "Vinagre balsámico", "Sal"],
            instructions: ["1. Lava y seca bien las hojas verdes.", "2. Corta el tomate, pepino y cebolla en rodajas o dados.", "3. Mezcla todos los vegetales en un bol grande.", "4. Aliña con aceite de oliva, vinagre balsámico y sal al gusto."],
            time: "10 min",
            difficulty: "Fácil"
        },
        {
            title: "Revuelto Rápido",
            category: "Comida / Cena",
            description: "Basado en tu despensa: Aprovecha los huevos que tienes en un revuelto rápido.",
            actionText: "Cocinar",
            image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=150",
            ingredients: ["Huevos", "Sal", "Aceite", "Restos de vegetales o queso"],
            instructions: ["1. Bate los huevos en un bol con un poco de sal.", "2. Calienta el aceite en una sartén a fuego medio.", "3. Si usas vegetales, saltéalos ligeramente primero.", "4. Añade los huevos batidos y remueve suavemente hasta que cuajen a tu gusto."],
            time: "10 min",
            difficulty: "Fácil"
        },
        {
            title: "Salteado de Verduras",
            category: "Comida / Cena",
            description: "Basado en tu despensa: Salteado de verduras para aprovechar al máximo lo guardado.",
            actionText: "Ver pasos",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=150",
            ingredients: ["Verduras variadas", "Salsa de soja", "Aceite de sésamo", "Ajo", "Jengibre (opcional)"],
            instructions: ["1. Corta todas las verduras en trozos de tamaño similar.", "2. Calienta el aceite en un wok o sartén grande con el ajo picado.", "3. Añade las verduras más duras primero (ej. zanahoria) y luego el resto.", "4. Saltea a fuego fuerte y sazona con salsa de soja."],
            time: "15 min",
            difficulty: "Media"
        }
    ];

    if (!items || items.length === 0) {
        return newUserSuggestions[dayOfYear % newUserSuggestions.length];
    } else {
        return existingUserSuggestions[dayOfYear % existingUserSuggestions.length];
    }
};

const PantryDashboard = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const data = await inventoryService.getInventory();
                setItems(data || []);
            } catch (err) {
                console.error('Error fetching inventory:', err);
            } finally {
                setLoading(false);
            }
        };
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
        fetchInventory();
    }, []);

    const expiringItems = items.filter(item => item.expires_at).slice(0, 3);
    const currentSuggestion = getDailySuggestion(items);

    const consumedItemsCount = items.filter(i => i.status === 'consumed').length;
    const ahorroMensual = (consumedItemsCount * 12.50).toFixed(2);
    const kgAhorrados = (consumedItemsCount * 0.4).toFixed(1);

    return (
        <div className="px-5 pt-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Buen día,</p>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user?.user_metadata?.full_name || 'Usuario'}
                    </h1>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group cursor-pointer"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary to-blue-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-200"></div>
                    <img
                        alt="User Profile"
                        className="relative w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 object-cover shadow-sm bg-gray-100"
                        src={user?.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.user_metadata?.full_name || 'Usuario') + "&background=10B981&color=fff"}
                    />
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-800 bg-primary"></span>
                </motion.div>
            </header>

            {/* Savings Card */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
            >
                <div className="bg-white dark:bg-gray-800 glass-panel shadow-glass rounded-3xl p-6 relative overflow-hidden group border border-gray-100 dark:border-gray-700/50">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex flex-col items-start">
                        <div className="flex items-center space-x-2 text-primary mb-1">
                            <Wallet className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Ahorros Mensuales</span>
                        </div>
                        <div className="flex items-baseline space-x-1">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">${ahorroMensual}</span>
                            {consumedItemsCount > 0 && (
                                <span className="text-sm text-green-500 font-medium flex items-center">
                                    <TrendingUp className="w-4 h-4 mr-0.5" />
                                    +12%
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">¡Has ahorrado {kgAhorrados}kg de desperdicio de alimentos!</p>
                    </div>
                </div>
            </motion.section>

            {/* Expiring Soon */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Vencimiento Pronto</h2>
                    <button className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1">
                        Ver todo <ChevronRight className="w-3 h-3" />
                    </button>
                </div>

                <div className="flex overflow-x-auto space-x-4 pb-4 hide-scrollbar -mx-5 px-5">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="flex-none w-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl h-48" />
                        ))
                    ) : expiringItems.length > 0 ? (
                        expiringItems.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex-none w-40 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-48 relative overflow-hidden group"
                            >
                                <div className="absolute top-2 right-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {Math.ceil((new Date(item.expires_at) - new Date()) / (1000 * 60 * 60 * 24))} Días
                                </div>
                                <div className="flex justify-center my-2 group-hover:scale-110 transition-transform">
                                    <img
                                        alt={item.products_master?.name}
                                        className="w-16 h-16 object-cover rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
                                        src={item.products_master?.image_url || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=100&auto=format&fit=crop`}
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=100&auto=format&fit=crop';
                                        }}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.products_master?.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">{item.metadata?.location || 'Alacena'}</p>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                        <div className="bg-red-500 h-1.5 rounded-full w-[90%]"></div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl w-full border border-dashed border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500">
                            Escanea tu refrigerador para empezar
                        </div>
                    )}
                </div>
            </section>

            {/* AI Suggestion */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
            >
                <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white opacity-20 rounded-full blur-xl animate-pulse"></div>
                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                            <span className="text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider">
                                <Sparkles className="w-3 h-3" />
                                Sugerencia IA
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="flex-1">
                            <h3 className="font-bold text-lg leading-tight mb-1">{currentSuggestion.title}</h3>
                            <p className="text-xs text-emerald-100 mb-3">{currentSuggestion.description}</p>
                            <button
                                onClick={() => setIsRecipeModalOpen(true)}
                                className="bg-white text-primary text-xs font-bold py-2.5 px-5 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all"
                            >
                                {currentSuggestion.actionText}
                            </button>
                        </div>
                        <img
                            alt="Recipe Suggestion"
                            className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-white/30"
                            src={currentSuggestion.image}
                        />
                    </div>
                </div>
            </motion.section>

            {/* Modal for AI Suggestion */}
            <RecipeModal
                recipe={currentSuggestion}
                isOpen={isRecipeModalOpen}
                onClose={() => setIsRecipeModalOpen(false)}
            />
        </div>
    );
};

export default PantryDashboard;
