import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Shield, Bell, CreditCard, ChevronRight, BarChart3, PieChart, Activity, LogOut, CheckCircle2, Upload, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useSubscription } from '../hooks/useSubscription';
import { inventoryService } from '../services/inventoryService';

const ProfileAnalytics = () => {
    const navigate = useNavigate();
    const { plan } = useSubscription();

    const planNames = {
        free: 'Pantry Básico',
        plus: 'Pantry Plus',
        chef: 'Chef Elite'
    };

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [showToast, setShowToast] = useState(null);
    const [profilePic, setProfilePic] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user?.user_metadata?.avatar_url) {
                setProfilePic(user.user_metadata.avatar_url);
            } else {
                setProfilePic("https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.user_metadata?.full_name || 'Usuario') + "&background=10B981&color=fff");
            }
        };
        const fetchInventory = async () => {
            try {
                const data = await inventoryService.getInventory();
                setItems(data || []);
            } catch (err) {
                console.error('Error fetching inventory:', err);
            }
        };
        fetchUser();
        fetchInventory();
    }, []);

    const triggerToast = (message, type = 'success') => {
        setShowToast({ message, type });
        setTimeout(() => setShowToast(null), 3000);
    };

    const activeItemsCount = items.filter(i => i.status === 'active').length;
    const consumedItemsCount = items.filter(i => i.status === 'consumed').length;

    // Estimación de ahorro basada en items consumidos (ej. $12.50 por item para simular valor real)
    const ahorroMensual = (consumedItemsCount * 12.50).toFixed(2);

    // Eficiencia: % de artículos no caducados sobre el total activo
    const expiredCount = items.filter(i => i.status === 'active' && i.expires_at && new Date(i.expires_at) < new Date()).length;
    const efficiency = activeItemsCount === 0 ? 100 : Math.max(0, Math.round(((activeItemsCount - expiredCount) / activeItemsCount) * 100));

    const stats = [
        { label: 'Artículos Totales', value: activeItemsCount.toString(), icon: Activity, color: 'text-blue-500' },
        { label: 'Ahorro Mensual', value: `$${ahorroMensual}`, icon: BarChart3, color: 'text-green-500' },
        { label: 'Eficiencia', value: `${efficiency}%`, icon: PieChart, color: 'text-purple-500' },
    ];

    const handleAction = (item) => {
        switch (item.label) {
            case 'Notificaciones':
                setNotificationsEnabled(!notificationsEnabled);
                triggerToast(`Notificaciones ${!notificationsEnabled ? 'activadas' : 'desactivadas'}`);
                break;
            case 'Privacidad y Seguridad':
                navigate('/privacy');
                break;
            case 'Suscripción Premium':
                navigate('/premium');
                break;
            case 'Configuración de Cuenta':
                navigate('/settings/account');
                break;
            default:
                break;
        }
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validar tamaño del archivo (2MB = 2,097,152 bytes)
        const MAX_SIZE = 2 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            triggerToast('La imagen es demasiado grande. Máximo 2MB soportados.', 'error');
            return;
        }

        // Crear preview local
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePic(reader.result);
        };
        reader.readAsDataURL(file);

        // Simular subida al backend
        setIsUploading(true);
        try {
            // Aquí iría la llamada real al endpoint que crearemos
            // const response = await fetch('/api/profile/upload', { ... });
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulación
            triggerToast('Foto de perfil actualizada correctamente');
        } catch (error) {
            triggerToast('Error al subir la imagen', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleLogout = async () => {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            await supabase.auth.signOut();
            window.location.href = '/';
        }
    };

    const menuItems = [
        { label: 'Notificaciones', icon: Bell, detail: notificationsEnabled ? 'Activado' : 'Desactivado' },
        { label: 'Privacidad y Seguridad', icon: Shield, detail: 'Protegido' },
        { label: 'Suscripción Premium', icon: CreditCard, detail: 'Plan Anual' },
        { label: 'Configuración de Cuenta', icon: Settings, detail: '' },
    ];

    return (
        <div className="px-5 pt-8 pb-32">
            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-2 border border-white/10"
                    >
                        {showToast.type === 'error' ? (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                        ) : (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                        )}
                        <span className="text-sm font-medium">{showToast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="flex flex-col items-center mb-8">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
                <div
                    className="relative mb-4 group cursor-pointer"
                    onClick={handleFileClick}
                >
                    <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img
                            className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-40' : 'opacity-100'}`}
                            src={profilePic}
                            alt="Profile"
                        />
                        {isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-gray-800 group-hover:scale-110 transition-transform">
                        <Upload className="w-4 h-4" />
                    </div>
                </div>
                <h2 className="text-xl font-bold dark:text-white">{user?.user_metadata?.full_name || 'Usuario'}</h2>
                <p className={`text-sm font-bold mt-1 ${plan === 'chef' ? 'text-amber-500' : plan === 'plus' ? 'text-primary' : 'text-gray-500'}`}>
                    {planNames[plan] || 'Pantry Básico'}
                </p>
            </header>

            {/* Analytics Grid */}
            <section className="grid grid-cols-3 gap-3 mb-8">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow cursor-default"
                    >
                        <stat.icon className={`w-5 h-5 mb-2 ${stat.color}`} />
                        <span className="text-lg font-bold dark:text-white">{stat.value}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-tighter">{stat.label}</span>
                    </motion.div>
                ))}
            </section>

            {/* Settings Menu */}
            <section className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700/50 overflow-hidden shadow-sm mb-6">
                {menuItems.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAction(item)}
                        className="w-full flex items-center justify-between p-5 border-b last:border-none border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl text-gray-500 dark:text-white group-hover:bg-primary/10 transition-colors">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-sm dark:text-white">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs ${item.label === 'Notificaciones' && !notificationsEnabled ? 'text-red-400' : 'text-gray-400'}`}>
                                {item.detail}
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                        </div>
                    </button>
                ))}
            </section>

            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-4 text-sm hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-colors"
            >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
            </button>
        </div>
    );
};

export default ProfileAnalytics;
