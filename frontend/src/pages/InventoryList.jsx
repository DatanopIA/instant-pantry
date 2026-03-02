import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Plus, Package, ShoppingCart, CheckCircle2, Archive,
    Sparkles, X, ChevronRight, Loader2, Trash2,
    ShoppingBasket, ShoppingBag, Calendar
} from 'lucide-react';
import { inventoryService } from '../services/inventoryService';

const InventoryList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('pantry'); // 'pantry' or 'shopping'
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, item: null, mode: 'consume' }); // modes: 'consume' (from check), 'delete' (from trash)
    const [dateModal, setDateModal] = useState({ isOpen: false, item: null, date: '' });

    // Search master products state
    const [searchResults, setSearchResults] = useState([]);
    const [searchingMaster, setSearchingMaster] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await inventoryService.getInventory();
            setItems(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle search master products
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (activeTab === 'shopping' && searchTerm.trim().length >= 2) {
                setSearchingMaster(true);
                try {
                    const results = await inventoryService.searchProductsMaster(searchTerm.trim());
                    setSearchResults(results);
                    setShowResults(true);
                } catch (err) {
                    console.error(err);
                } finally {
                    setSearchingMaster(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, activeTab]);

    const handleMarkConsumed = async (item) => {
        setConfirmModal({ isOpen: true, item, mode: 'consume' });
    };

    const handleDeleteClick = (item) => {
        setConfirmModal({ isOpen: true, item, mode: 'delete' });
    };

    const handlePermanentDelete = async () => {
        if (!confirmModal.item) return;
        try {
            await inventoryService.deleteItem(confirmModal.item.id);
            setItems(prev => prev.filter(i => i.id !== confirmModal.item.id));
            setConfirmModal({ isOpen: false, item: null, mode: 'consume' });
        } catch (err) {
            console.error(err);
        }
    };

    const confirmConsume = async () => {
        if (!confirmModal.item) return;
        try {
            await inventoryService.updateItemStatus(confirmModal.item.id, 'consumed');
            setItems(prev => prev.map(i =>
                i.id === confirmModal.item.id ? { ...i, status: 'consumed' } : i
            ));
            setConfirmModal({ isOpen: false, item: null, mode: 'consume' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleRestoreItem = (item) => {
        // Suggested date: 1 week from now
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 7);
        const dateStr = defaultDate.toISOString().split('T')[0];

        setDateModal({
            isOpen: true,
            item,
            date: dateStr
        });
    };

    const confirmRestore = async () => {
        if (!dateModal.item) return;
        try {
            const updates = {
                status: 'active',
                expires_at: dateModal.date || null
            };
            await inventoryService.updateItem(dateModal.item.id, updates);

            setItems(prev => prev.map(i =>
                i.id === dateModal.item.id ? { ...i, ...updates } : i
            ));
            setDateModal({ isOpen: false, item: null, date: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddFromSearch = async (product) => {
        if (!product) return;
        try {
            const newItem = {
                product_id: product.id,
                quantity: 1,
                current_unit: product.base_unit || 'unidades',
                status: 'consumed'
            };

            const results = await inventoryService.addItems([newItem]);
            if (results && results[0]) {
                const itemWithMaster = { ...results[0], products_master: product };
                setItems(prev => [itemWithMaster, ...prev]); // Add to top
            } else {
                await fetchData();
            }

            setSearchTerm('');
            setShowResults(false);
        } catch (err) {
            console.error("Error adding from search:", err);
            throw err;
        }
    };

    const handleManualAdd = async (customName) => {
        if (customName && typeof customName === 'object' && customName.nativeEvent) {
            customName.stopPropagation();
            customName = searchTerm;
        }

        const nameToAdd = (typeof customName === 'string' ? customName : searchTerm).trim();
        if (!nameToAdd || nameToAdd.length < 2) return;

        try {
            setSearchingMaster(true);
            const product = await inventoryService.getOrCreateProduct(nameToAdd);
            await handleAddFromSearch(product);
        } catch (err) {
            console.error("Error in manual add:", err);
        } finally {
            setSearchingMaster(false);
        }
    };

    const pantryItems = items.filter(item =>
        item.status === 'active' &&
        item.products_master?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const shoppingListItems = items.filter(item =>
        item.status === 'consumed'
    );

    const filteredShoppingItems = shoppingListItems.filter(item =>
        item.products_master?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const recommendedItems = [
        { id: 'rec1', name: 'Huevos Bio', category: 'Lácteos', base_unit: 'docena' },
        { id: 'rec2', name: 'Leche de Almendra', category: 'Lácteos', base_unit: 'litros' },
        { id: 'rec3', name: 'Aguacate Robusto', category: 'Fruta', base_unit: 'unidades' },
        { id: 'rec4', name: 'Pan Integral', category: 'Panadería', base_unit: 'unidades' },
    ];

    const pantryTotal = items.filter(item => item.status === 'active').length;
    const shoppingTotal = items.filter(item => item.status === 'consumed').length;
    const currentTotal = activeTab === 'pantry' ? pantryTotal : shoppingTotal;

    return (
        <div className="px-5 pt-8 min-h-screen pb-40" onClick={() => setShowResults(false)}>
            <header className="mb-6 relative z-50">
                <div className="flex justify-between items-end mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {activeTab === 'pantry' ? 'Mi Despensa' : 'Lista Compra'}
                    </h1>
                    <motion.span
                        key={`${activeTab}-${currentTotal}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm border border-primary/20"
                    >
                        {currentTotal} {currentTotal === 1 ? 'Artículo' : 'Artículos'}
                    </motion.span>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl flex mb-6">
                    <button
                        onClick={() => setActiveTab('pantry')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'pantry'
                            ? 'bg-white dark:bg-gray-700 shadow-sm text-primary'
                            : 'text-gray-500'
                            }`}
                    >
                        <Archive className="w-4 h-4" />
                        Despensa
                    </button>
                    <button
                        onClick={() => setActiveTab('shopping')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'shopping'
                            ? 'bg-white dark:bg-gray-700 shadow-sm text-primary'
                            : 'text-gray-500'
                            }`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        A comprar
                    </button>
                </div>

                <div className="flex gap-3 relative">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={activeTab === 'pantry' ? "Buscar en despensa..." : "Añadir a la compra..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => activeTab === 'shopping' && searchTerm.trim().length >= 2 && setShowResults(true)}
                            className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl py-3 pl-10 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-primary/50 transition-all dark:text-white"
                        />
                        {searchingMaster && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                            </div>
                        )}
                    </div>

                    <AnimatePresence>
                        {showResults && activeTab === 'shopping' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-14 left-0 right-0 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[100]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {searchResults.length > 0 ? (
                                    <div className="p-2 max-h-60 overflow-y-auto hide-scrollbar">
                                        {searchResults.map(prod => (
                                            <button
                                                key={prod.id}
                                                onClick={() => handleAddFromSearch(prod)}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl transition-all text-left group"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{prod.name}</p>
                                                    <p className="text-[10px] text-gray-400">{prod.category || 'Varios'} • {prod.base_unit || 'unidades'}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <p className="text-sm text-gray-500">¿No lo encuentras?</p>
                                        <button
                                            type="button"
                                            onClick={handleManualAdd}
                                            className="w-full bg-primary/5 dark:bg-primary/10 text-primary font-bold text-sm mt-4 flex items-center justify-between px-5 py-4 rounded-2xl hover:bg-primary/10 dark:hover:bg-primary/20 active:scale-95 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                                                    <Plus className="w-5 h-5" />
                                                </div>
                                                <span className="truncate max-w-[150px]">Añadir "{searchTerm}"</span>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-60">
                                                <span className="text-[10px] uppercase">Manual</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            <div className="space-y-6 relative z-10">
                <AnimatePresence mode="wait">
                    {activeTab === 'pantry' ? (
                        <motion.div
                            key="panty-tab"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-4"
                        >
                            {loading ? (
                                [1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)
                            ) : pantryItems.length > 0 ? (
                                pantryItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layoutId={item.id}
                                        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50 flex items-center gap-4 group"
                                    >
                                        <div className="w-16 h-16 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700">
                                            <img
                                                src={item.products_master?.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=100&auto=format&fit=crop'}
                                                alt={item.products_master?.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=100&auto=format&fit=crop';
                                                }}
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 dark:text-white truncate">{item.products_master?.name}</h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-lg">
                                                    {item.quantity} {item.current_unit}
                                                </span>
                                                <span className="text-[10px] text-gray-400">•</span>
                                                <span className={`text-[10px] font-medium ${item.expires_at ? 'text-orange-500' : 'text-gray-400'}`}>
                                                    {item.expires_at ? `Exp. ${new Date(item.expires_at).toLocaleDateString()}` : 'Sin fecha'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteClick(item); }}
                                                className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-gray-400 hover:text-red-500 active:scale-90 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-500/20"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleMarkConsumed(item); }}
                                                className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-gray-400 hover:text-primary active:scale-90 transition-all border border-transparent hover:border-primary/20"
                                            >
                                                <CheckCircle2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <EmptyState icon={Package} text="Tu despensa está vacía" subtext="Escanea o añade productos para empezar" />
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="shopping-tab"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-6"
                        >
                            {!searchTerm && (
                                <section>
                                    <div className="flex items-center gap-2 mb-4 px-1 text-primary">
                                        <Sparkles className="w-5 h-5 fill-primary" />
                                        <h2 className="text-sm font-bold uppercase tracking-wider">Recomendados</h2>
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                                        {recommendedItems.map(rec => (
                                            <div
                                                key={rec.id}
                                                onClick={() => handleManualAdd(rec.name)}
                                                className="flex-none w-40 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm group cursor-pointer active:scale-95 transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                    <Plus className="w-5 h-5 text-primary" />
                                                </div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{rec.name}</h4>
                                                <p className="text-[10px] text-gray-500">{rec.category}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <section>
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">A Comprar pronto</h2>
                                    <button className="text-xs font-bold text-primary flex items-center gap-1">Añadir todo <ChevronRight className="w-3 h-3" /></button>
                                </div>
                                <div className="space-y-3">
                                    {filteredShoppingItems.length > 0 ? (
                                        filteredShoppingItems.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layoutId={item.id}
                                                className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-4 group"
                                            >
                                                <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary overflow-hidden border border-primary/20">
                                                    <ShoppingBasket className="w-7 h-7" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{item.products_master?.name}</h3>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md uppercase">Agotado</span>
                                                        <span className="text-[10px] text-gray-400">• {item.products_master?.category || 'General'}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRestoreItem(item)}
                                                    className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-gray-400">No hay items que coincidan</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {dateModal.isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-12 sm:items-center sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDateModal({ ...dateModal, isOpen: false })}
                            className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            className="relative bg-white dark:bg-gray-900 w-full max-w-[400px] rounded-[32px] p-8 shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
                        >
                            <div className="absolute top-0 right-0 p-6">
                                <button onClick={() => setDateModal({ ...dateModal, isOpen: false })} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-6">
                                    <Calendar className="w-10 h-10" />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 list-item-none">
                                    Fecha de caducidad
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 text-center">
                                    ¿Cuándo caduca <span className="font-bold text-primary">{dateModal.item?.products_master?.name}</span>?
                                </p>

                                <div className="w-full mb-8">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                                        Fecha límite
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary text-gray-400">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="date"
                                            value={dateModal.date}
                                            onChange={(e) => setDateModal({ ...dateModal, date: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary/50 transition-all dark:text-white appearance-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col w-full gap-3">
                                    <button
                                        onClick={confirmRestore}
                                        className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-102 active:scale-98 transition-all"
                                    >
                                        Añadir a Despensa
                                    </button>
                                    <button
                                        onClick={() => setDateModal({ ...dateModal, isOpen: false })}
                                        className="w-full bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-center"
                                    >
                                        Omitir fecha
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {confirmModal.isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-12 sm:items-center sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmModal({ isOpen: false, item: null, mode: 'consume' })}
                            className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            className="relative bg-white dark:bg-gray-900 w-full max-w-[400px] rounded-[32px] p-8 shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
                        >
                            <div className="absolute top-0 right-0 p-6">
                                <button onClick={() => setConfirmModal({ isOpen: false, item: null, mode: 'consume' })} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className={`w-20 h-20 ${confirmModal.mode === 'delete' ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'} rounded-3xl flex items-center justify-center mb-6`}>
                                    {confirmModal.mode === 'delete' ? <Trash2 className="w-10 h-10" /> : <ShoppingCart className="w-10 h-10" />}
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {confirmModal.mode === 'delete' ? '¿Qué quieres hacer?' : '¿Se ha agotado?'}
                                </h3>

                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                                    {confirmModal.mode === 'delete' ? (
                                        <>Puedes añadir <span className="font-bold text-gray-900 dark:text-white">{confirmModal.item?.products_master?.name}</span> a la lista de la compra o eliminarlo por completo.</>
                                    ) : (
                                        <>Vamos a marcar <span className="font-bold text-primary">{confirmModal.item?.products_master?.name}</span> como consumido y añadirlo a tu lista de la compra.</>
                                    )}
                                </p>

                                <div className="flex flex-col w-full gap-3">
                                    <button
                                        onClick={confirmConsume}
                                        className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-102 active:scale-98 transition-all"
                                    >
                                        Se ha acabado (lista)
                                    </button>

                                    {confirmModal.mode === 'delete' && (
                                        <button
                                            onClick={handlePermanentDelete}
                                            className="w-full bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 py-4 rounded-2xl font-bold text-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-all border border-red-100 dark:border-red-900/30"
                                        >
                                            Sólo eliminar
                                        </button>
                                    )}

                                    <button
                                        onClick={() => setConfirmModal({ isOpen: false, item: null, mode: 'consume' })}
                                        className="w-full bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const EmptyState = ({ icon: Icon, text, subtext }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 opacity-50 px-8"
        >
            <Icon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{text}</h3>
            <p className="text-sm text-gray-500 mt-1">{subtext}</p>
        </motion.div>
    );
};

export default InventoryList;
