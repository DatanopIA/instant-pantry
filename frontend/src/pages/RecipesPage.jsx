import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChefHat, Sparkles, Clock, Users, Flame, ChevronRight,
    Search, ArrowRight, Heart, Utensils, Star, BookOpen,
    X, Send, User, MessageCircle, RotateCcw, Lock, Calendar, Activity as ActivityIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../services/inventoryService';
import { aiService } from '../services/aiService';
import { supabase } from '../utils/supabase';
import RecipeModal from '../components/RecipeModal';
import FamilyMenuModal from '../components/FamilyMenuModal'; // Added import for FamilyMenuModal
import { useSubscription } from '../hooks/useSubscription';

const RecipesPage = () => {
    const [pantryItems, setPantryItems] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generatedPantryRecipes, setGeneratedPantryRecipes] = useState([]);
    const [loadingPantryRecipes, setLoadingPantryRecipes] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAllRecommended, setShowAllRecommended] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const initialMessages = [
        { role: 'assistant', content: '¡Hola! Soy tu Chef IA. Puedo ayudarte a crear recetas deliciosas con lo que tienes en tu despensa. ¿Qué te gustaría cocinar hoy?' }
    ];
    const [chatMessages, setChatMessages] = useState(initialMessages);
    const [isTyping, setIsTyping] = useState(false);

    const { features } = useSubscription();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showFamilyMenuModal, setShowFamilyMenuModal] = useState(false); // Added state for FamilyMenuModal
    const navigate = useNavigate();

    const handleClearChat = () => {
        setChatMessages(initialMessages);
    };

    const fetchLibrary = async () => {
        try {
            const { data } = await supabase
                .from('saved_recipes')
                .select('*')
                .order('created_at', { ascending: false });
            setSavedRecipes(data || []);
        } catch (err) {
            console.error("Error cargando biblioteca:", err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await inventoryService.getInventory();
                // We keep all active items from pantry
                const activeItems = data?.filter(i => i.status === 'active') || [];
                setPantryItems(activeItems);
                await fetchLibrary();

                if (activeItems.length > 0) {
                    setLoadingPantryRecipes(true);
                    try {
                        const recipes = await aiService.generatePantryRecipes(activeItems, 5);
                        setGeneratedPantryRecipes(recipes);
                    } catch (e) {
                        console.error('Error fetching pantry recipes', e);
                    } finally {
                        setLoadingPantryRecipes(false);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Mock data for global recommended recipes (5 items as requested)
    const globalRecommended = [
        {
            id: 'g1',
            title: 'Pasta al Pesto de Albahaca',
            image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=400',
            time: '20 min',
            difficulty: 'Fácil',
            rating: 4.8,
            ingredients: ['Pasta', 'Albahaca', 'Piñones', 'Queso Parmesano', 'Aceite de Oliva']
        },
        {
            id: 'g2',
            title: 'Bowl de Salmón y Aguacate',
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400',
            time: '25 min',
            difficulty: 'Media',
            rating: 4.9,
            ingredients: ['Salmón', 'Aguacate', 'Arroz', 'Espinacas', 'Sésamo']
        },
        {
            id: 'g3',
            title: 'Tacos de Pollo con Lima',
            image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=400',
            time: '30 min',
            difficulty: 'Fácil',
            rating: 4.7,
            ingredients: ['Pollo', 'Tortillas', 'Lima', 'Cilantro', 'Cebolla']
        },
        {
            id: 'g4',
            title: 'Curry de Garbanzos y Coco',
            image: 'https://images.unsplash.com/photo-1545203525-2965306e9314?auto=format&fit=crop&q=80&w=400',
            time: '35 min',
            difficulty: 'Media',
            rating: 4.6,
            ingredients: ['Garbanzos', 'Leche de coco', 'Curry', 'Espinacas', 'Arroz']
        },
        {
            id: 'g5',
            title: 'Shakshuka con Feta',
            image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&q=80&w=400',
            time: '20 min',
            difficulty: 'Fácil',
            rating: 4.9,
            ingredients: ['Huevos', 'Tomate', 'Pimiento', 'Cebolla', 'Queso Feta']
        }
    ];

    // Logic to calculate how many ingredients are available in pantry for each "personalized" recipe
    const getMatchScore = (recipe) => {
        const pantryNames = pantryItems.map(item => item.products_master?.name?.toLowerCase() || '');
        if (!pantryNames.length) return {
            count: 0,
            total: recipe.ingredients.length,
            missing: recipe.ingredients.length,
            matchPercent: 0,
            matchedList: [],
            missingList: recipe.ingredients
        };

        const matchedList = [];
        const missingList = [];

        recipe.ingredients.forEach(ing => {
            const isMatch = pantryNames.some(name => name.includes(ing.toLowerCase()) || ing.toLowerCase().includes(name));
            if (isMatch) matchedList.push(ing);
            else missingList.push(ing);
        });

        return {
            count: matchedList.length,
            total: recipe.ingredients.length,
            missing: missingList.length,
            matchPercent: Math.round((matchedList.length / recipe.ingredients.length) * 100),
            matchedList,
            missingList
        };
    };

    const personalizedRecipes = generatedPantryRecipes
        .map(recipe => ({ ...recipe, match: getMatchScore(recipe) }))
        .sort((a, b) => b.match.matchPercent - a.match.matchPercent);

    const visibleRecommended = showAllRecommended ? globalRecommended : globalRecommended.slice(0, 3);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const updatedMessages = [...chatMessages, { role: 'user', content: newMessage }];
        setChatMessages(updatedMessages);
        setNewMessage('');
        setIsTyping(true);

        try {
            const response = await aiService.chatWithChef(updatedMessages, pantryItems);

            // Manejar acciones automáticas (ej: Guardar Receta)
            if (response.action && response.action.type === 'SAVE_RECIPE') {
                console.log('[Chef Action] Guardando receta automáticamente...', response.action.data);
                await aiService.saveRecipe(response.action.data);
                await fetchLibrary();
                // Podríamos añadir un mensaje de sistema o una notificación aquí
            }

            setChatMessages(prev => [...prev, { role: 'assistant', content: response.content }]);
        } catch (error) {
            console.error('Error en el chat:', error);
            setChatMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, he tenido un pequeño problema. ¿Podrías repetirme eso?' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="px-5 pt-8 min-h-screen pb-40">
            <header className="mb-8">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                            Chef IA <span className="text-primary font-black">.</span>
                        </h1>
                        <p className="text-xs text-gray-400 font-medium">Inspiración para hoy</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-primary transition-colors">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="¿Qué te apetece cocinar hoy?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-gray-800 border-none rounded-[20px] py-4 pl-12 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-primary/50 transition-all dark:text-white font-medium"
                    />
                </div>
            </header>

            <div className="space-y-10">
                {/* MI BIBLIOTECA (Nueva sección) */}
                {savedRecipes.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <span className="p-1 px-3 bg-primary/10 text-primary rounded-lg text-sm">Biblioteca</span>
                                    Mis Recetas Guardadas
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Joyas culinarias que has guardado con el Chef</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedRecipes.map((recipe) => (
                                <motion.div
                                    key={recipe.id}
                                    whileHover={{ y: -5 }}
                                    onClick={() => setSelectedRecipe(recipe)}
                                    className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer"
                                >
                                    <div className="aspect-video bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
                                        <img
                                            src={recipe.image_url || `https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop`}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop';
                                            }}
                                        />
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            <span className="px-2 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 shadow-sm border border-white/20">
                                                {recipe.category || 'Chef IA'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-800 dark:text-white line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                                            {recipe.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">⏱️ {recipe.time}</span>
                                            <span className="flex items-center gap-1">👨‍🍳 {recipe.difficulty}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* RECOMENDADOS (Lo que ya existía) */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
                                <Utensils className="w-4 h-4" />
                            </div>
                            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Recetas Recomendadas</h2>
                        </div>
                        <button
                            onClick={() => setShowAllRecommended(!showAllRecommended)}
                            className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-widest transition-all active:scale-95"
                        >
                            {showAllRecommended ? 'Ver menos' : 'Ver todas'} <ChevronRight className={`w-3 h-3 transition-transform ${showAllRecommended ? 'rotate-90' : ''}`} />
                        </button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-5 px-5">
                        {visibleRecommended.map((recipe) => (
                            <motion.div
                                key={recipe.id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedRecipe(recipe)}
                                className="flex-none w-[280px] group cursor-pointer"
                            >
                                <div className="relative h-[180px] rounded-[32px] overflow-hidden mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-xl px-2 py-1 flex items-center gap-1 border border-white/30">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-[10px] font-bold text-white">{recipe.rating}</span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex gap-2">
                                            <span className="text-[8px] font-bold text-white bg-primary px-2 py-1 rounded-lg uppercase tracking-widest">{recipe.difficulty}</span>
                                            <span className="text-[8px] font-bold text-white bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg uppercase tracking-widest">{recipe.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors pr-4">{recipe.title}</h3>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Section 2: Personalized (Based on Pantry) */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <Sparkles className="w-4 h-4 fill-primary" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Para tu despensa</h2>
                                <p className="text-[10px] text-gray-400 font-medium">Basado en lo que ya tienes</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {(loading || loadingPantryRecipes) ? (
                            [1, 2, 3, 4, 5].map(i => <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />)
                        ) : personalizedRecipes.length > 0 ? (
                            personalizedRecipes.slice(0, 5).map((recipe) => (
                                <motion.div
                                    key={recipe.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => setSelectedRecipe(recipe)}
                                    className="bg-white dark:bg-gray-800/50 rounded-[28px] p-4 flex gap-4 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                                >
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[9px] font-bold text-primary/70 uppercase tracking-widest">{recipe.category}</span>
                                                <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold">
                                                    <Clock className="w-3 h-3" />
                                                    {recipe.time}
                                                </div>
                                            </div>
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{recipe.title}</h3>

                                            {/* Matches bar & Ingredients */}
                                            <div className="mt-2">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-[9px] text-gray-500 font-medium">
                                                        {recipe.match.count === recipe.match.total ? (
                                                            <span className="text-green-500 font-black flex items-center gap-1 uppercase tracking-tighter">
                                                                <Star className="w-2.5 h-2.5 fill-green-500" /> ¡Tienes todo!
                                                            </span>
                                                        ) : (
                                                            <span>Tienes <strong>{recipe.match.count}</strong> de <strong>{recipe.match.total}</strong> ingredientes</span>
                                                        )}
                                                    </p>
                                                    <span className="text-[9px] font-black text-primary">{recipe.match.matchPercent}%</span>
                                                </div>

                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                    {recipe.match.matchedList.map((ing, idx) => (
                                                        <span key={`matched-${idx}`} className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">
                                                            ✓ {ing}
                                                        </span>
                                                    ))}
                                                    {recipe.match.missingList.map((ing, idx) => (
                                                        <span key={`missing-${idx}`} className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-800/50">
                                                            ✕ {ing}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-1">
                                            <button className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:translate-x-1">
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                                <p className="text-sm text-gray-500 font-medium">Escanea tu despensa para recibir recomendaciones personalizadas</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* AI Chef Floating Banner */}
                <div className="relative rounded-[32px] overflow-hidden bg-gray-900 border border-gray-800 p-6 shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16" />
                    <div className="relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-4">
                            <ChefHat className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">¿Buscas algo específico?</h3>
                        <p className="text-sm text-gray-400 mb-6 font-medium">Nuestro Chef Inteligente puede crear recetas únicas con lo que tengas ahora mismo.</p>
                        <button
                            onClick={() => {
                                if (savedRecipes.length >= features.maxRecipes) {
                                    setShowUpgradeModal(true);
                                } else {
                                    setIsChatOpen(true);
                                }
                            }}
                            className="w-full bg-white text-gray-900 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            Consultar Chef IA <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Chef Elite Exclusive Features */}
                <section className="mt-12 bg-gray-50 dark:bg-gray-800/30 rounded-3xl p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-6">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Herramientas Chef Elite</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Family Menu Planning */}
                        <div className="relative overflow-hidden bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${features.canUseFamilyMenu ? 'bg-primary/20 text-primary' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 flex items-center gap-2">
                                        Planificador Familiar
                                        {!features.canUseFamilyMenu && <Lock className="w-3 h-3 text-gray-400" />}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Organiza las comidas de toda la familia para la semana.</p>

                                    {features.canUseFamilyMenu && (
                                        <button
                                            onClick={() => setShowFamilyMenuModal(true)} // Connected to FamilyMenuModal
                                            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-transform"
                                        >
                                            Generar Menú Semanal
                                        </button>
                                    )}
                                </div>
                            </div>
                            {!features.canUseFamilyMenu && (
                                <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[2px] flex items-center justify-center p-4">
                                    <button onClick={() => navigate('/premium')} className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg">
                                        Desbloquear Chef Elite
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Nutritional Analysis */}
                        <div className="relative overflow-hidden bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${features.canUseNutritionalAnalysis ? 'bg-primary/20 text-primary' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                                    <ActivityIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 flex items-center gap-2">
                                        Análisis Nutricional
                                        {!features.canUseNutritionalAnalysis && <Lock className="w-3 h-3 text-gray-400" />}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Detalles macro y micronutricionales de cada receta.</p>
                                </div>
                            </div>
                            {!features.canUseNutritionalAnalysis && (
                                <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[2px] flex items-center justify-center p-4">
                                    <button onClick={() => navigate('/premium')} className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg">
                                        Desbloquear Chef Elite
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {/* AI Chef Chat Modal */}
            <AnimatePresence>
                {isChatOpen && (
                    <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-12 sm:items-center sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsChatOpen(false)}
                            className="absolute inset-0 bg-gray-950/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.95 }}
                            className="relative bg-white dark:bg-gray-900 w-full max-w-[420px] h-[600px] rounded-[40px] shadow-3xl overflow-hidden flex flex-col border border-white/10"
                        >
                            {/* Header */}
                            <div className="p-6 bg-primary text-white flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <ChefHat className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg">Chef IA</h3>
                                        <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">En línea ahora</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleClearChat}
                                        title="Reiniciar chat"
                                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setIsChatOpen(false)}
                                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar bg-gray-50/50 dark:bg-gray-950/50">
                                {chatMessages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium ${msg.role === 'user'
                                            ? 'bg-primary text-white rounded-tr-none'
                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-tl-none'
                                            }`}>
                                            {msg.content.split('\n').filter(p => p.trim()).map((paragraph, pIdx) => (
                                                <p key={pIdx} className={pIdx > 0 ? 'mt-3' : ''}>
                                                    {paragraph.split('**').map((part, i) => (
                                                        i % 2 === 1 ? <strong key={i} className="font-black text-primary dark:text-primary">{part}</strong> : part
                                                    ))}
                                                </p>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl rounded-tl-none shadow-sm flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                                <div className="relative flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Pregúntale al chef..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-primary/50 dark:text-white"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                        className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <RecipeModal
                recipe={selectedRecipe}
                isOpen={!!selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
            />

            {/* Upgrade Modal para recetas limitadas */}
            <AnimatePresence>
                {showUpgradeModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowUpgradeModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl p-6 relative z-10 max-w-sm w-full shadow-2xl"
                        >
                            <button onClick={() => setShowUpgradeModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                    <ChefHat className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Límite Alcanzado</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    Has alcanzado el límite de {features.maxRecipes} recetas de tu plan gratuito. Sube de plan para recetas ilimitadas.
                                </p>
                                <button
                                    onClick={() => navigate('/premium')}
                                    className="w-full py-4 bg-primary text-white rounded-xl font-bold active:scale-95 transition-all shadow-lg shadow-primary/30"
                                >
                                    Ver Planes Premium
                                </button>
                                <button
                                    onClick={() => setShowUpgradeModal(false)}
                                    className="w-full py-3 mt-2 text-gray-500 font-bold active:scale-95 transition-all"
                                >
                                    Quizás más tarde
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <FamilyMenuModal
                isOpen={showFamilyMenuModal}
                onClose={() => setShowFamilyMenuModal(false)}
            />
        </div>
    );
};

export default RecipesPage;
