import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Sparkles, ChevronRight, Clock } from 'lucide-react';
import { inventoryService } from '../services/inventoryService';
import { supabase } from '../utils/supabase';

const PantryDashboard = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

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
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">$142.50</span>
                            <span className="text-sm text-green-500 font-medium flex items-center">
                                <TrendingUp className="w-4 h-4 mr-0.5" />
                                +12%
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">¡Has ahorrado 4.2kg de desperdicio de alimentos!</p>
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
                            <h3 className="font-bold text-lg leading-tight mb-1">Tostada de Aguacate</h3>
                            <p className="text-xs text-emerald-100 mb-3">Usa tus aguacates y huevos que vencen pronto.</p>
                            <button className="bg-white text-primary text-xs font-bold py-2.5 px-5 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all">
                                Ver receta
                            </button>
                        </div>
                        <img
                            alt="Recipe"
                            className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-white/30"
                            src="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=150"
                        />
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default PantryDashboard;
