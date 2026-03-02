import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, User, Lock, Users, Home, Bell,
    Scale, Store, Trash2, ShieldCheck, Mail,
    CheckCircle2, Copy, QrCode, UserPlus,
    X, Save, AlertTriangle
} from 'lucide-react';

const AccountSettings = () => {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(null);
    const [modal, setModal] = useState(null);

    // States for personalized data
    const [householdName, setHouseholdName] = useState('Mansión Giménez');
    const [userName, setUserName] = useState('Alex Johnson');
    const [userEmail, setUserEmail] = useState('alex@example.com');
    const [units, setUnits] = useState('Sistema Métrico (kg, l)');
    const [expiryDays, setExpiryDays] = useState('3 días antes');
    const [favoriteStore, setFavoriteStore] = useState('Mercadona');

    const triggerToast = (message) => {
        setShowToast(message);
        setTimeout(() => setShowToast(null), 3000);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        triggerToast('Código copiado al portapapeles');
    };

    const handleAction = (item) => {
        switch (item.label) {
            case 'Nombre del Hogar':
                setModal({ type: 'input', field: 'householdName', title: 'Nombre del Hogar', value: householdName });
                break;
            case 'Editar Perfil':
                setModal({ type: 'input', field: 'userName', title: 'Editar Nombre', value: userName });
                break;
            case 'Cambiar Correo':
                setModal({ type: 'input', field: 'userEmail', title: 'Cambiar Correo', value: userEmail, inputType: 'email' });
                break;
            case 'Cambiar Contraseña':
                setModal({ type: 'password', title: 'Cambiar Contraseña' });
                break;
            case 'Invitar Propietarios':
                setModal({ type: 'invite', title: 'Invitar Propietarios' });
                break;
            case 'Unidades de Medida':
                setModal({ type: 'select', field: 'units', title: 'Unidades de Medida', options: ['Sistema Métrico (kg, l)', 'Sistema Imperial (lb, oz)'], value: units });
                break;
            case 'Alertas de Caducidad':
                setModal({ type: 'select', field: 'expiryDays', title: 'Aviso de Caducidad', options: ['1 día antes', '3 días antes', '5 días antes', '1 semana antes'], value: expiryDays });
                break;
            case 'Supermercado Favorito':
                setModal({ type: 'input', field: 'favoriteStore', title: 'Súper Favorito', value: favoriteStore });
                break;
            case 'Eliminar Cuenta':
                setModal({ type: 'delete', title: 'Eliminar Cuenta' });
                break;
            case 'Miembros de la Familia':
                setModal({ type: 'info', title: 'Miembros', content: 'Actualmente hay 3 miembros con acceso: Alex (Propietario), María y Juan.' });
                break;
            default:
                triggerToast('Función actualizada');
        }
    };

    const sections = [
        {
            id: 'profile',
            title: 'Perfil y Seguridad',
            items: [
                { label: 'Editar Perfil', icon: User, detail: userName },
                { label: 'Cambiar Correo', icon: Mail, detail: userEmail },
                { label: 'Cambiar Contraseña', icon: Lock, detail: '••••••••' },
            ]
        },
        {
            id: 'household',
            title: 'Gestión del Hogar',
            items: [
                { label: 'Nombre del Hogar', icon: Home, detail: householdName },
                { label: 'Miembros de la Familia', icon: Users, detail: '3 personas activas' },
                { label: 'Invitar Propietarios', icon: UserPlus, detail: 'QR / Enlace' },
            ]
        },
        {
            id: 'pantry',
            title: 'Preferencias de Despensa',
            items: [
                { label: 'Unidades de Medida', icon: Scale, detail: units },
                { label: 'Alertas de Caducidad', icon: Bell, detail: expiryDays },
                { label: 'Supermercado Favorito', icon: Store, detail: favoriteStore },
            ]
        },
        {
            id: 'privacy',
            title: 'Privacidad y Datos',
            items: [
                { label: 'Eliminar Cuenta', icon: Trash2, detail: 'Acción irreversible', color: 'text-red-500' },
            ]
        }
    ];

    const saveChanges = (field, newValue) => {
        if (field === 'householdName') setHouseholdName(newValue);
        if (field === 'userName') setUserName(newValue);
        if (field === 'userEmail') setUserEmail(newValue);
        if (field === 'units') setUnits(newValue);
        if (field === 'expiryDays') setExpiryDays(newValue);
        if (field === 'favoriteStore') setFavoriteStore(newValue);
        setModal(null);
        triggerToast('Cambios guardados correctamente');
    };

    return (
        <div className="px-5 pt-8 pb-32">
            {/* Header */}
            <header className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/profile')}
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 dark:text-white" />
                </button>
                <h1 className="text-xl font-bold dark:text-white">Configuración de Cuenta</h1>
            </header>

            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-2 border border-white/10"
                    >
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium">{showToast}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="space-y-6">
                {sections.map((section) => (
                    <div key={section.id} className="space-y-3">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                            {section.title}
                        </h2>
                        <div className="bg-white dark:bg-gray-800 rounded-[24px] border border-gray-100 dark:border-gray-700/50 overflow-hidden shadow-sm">
                            {section.items.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAction(item)}
                                    className="w-full flex items-center justify-between p-4 border-b last:border-none border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${item.color ? 'bg-red-50 dark:bg-red-500/10' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                            <item.icon className={`w-4 h-4 ${item.color || 'text-gray-500 dark:text-gray-300'}`} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-sm font-bold ${item.color || 'dark:text-white'}`}>{item.label}</p>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400">{item.detail}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-1 rounded-md">
                                        <ChevronLeft className="w-3 h-3 text-gray-300 rotate-180" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Invitation Card */}
            <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 rounded-[32px] border border-primary/20 relative overflow-hidden group">
                <div className="relative z-10 text-center">
                    <h3 className="font-bold text-primary mb-1 text-sm">¿Necesitas ayuda compartida?</h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-4 px-4">Usa tu código familiar único para conectar despensas.</p>
                    <div className="flex items-center justify-center gap-2">
                        <code className="bg-white dark:bg-gray-900 px-4 py-2 rounded-xl text-sm font-mono font-bold tracking-[0.2em] shadow-inner dark:text-white border border-primary/10">
                            PANTRY-42
                        </code>
                        <button
                            onClick={() => copyToClipboard('PANTRY-42')}
                            className="p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-primary/10 hover:bg-primary hover:text-white transition-all active:scale-90"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
            </div>

            {/* Modals */}
            <AnimatePresence>
                {modal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setModal(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white dark:bg-gray-900 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border border-white/20"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold dark:text-white leading-tight">{modal.title}</h3>
                                    <button onClick={() => setModal(null)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                                        <X className="w-4 h-4 dark:text-white" />
                                    </button>
                                </div>

                                {modal.type === 'input' ? (
                                    <div className="space-y-4">
                                        <input
                                            autoFocus
                                            type={modal.inputType || 'text'}
                                            value={modal.value}
                                            onChange={(e) => setModal({ ...modal, value: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-2 border-transparent focus:border-primary outline-none transition-all dark:text-white font-bold"
                                        />
                                        <button
                                            onClick={() => saveChanges(modal.field, modal.value)}
                                            className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                                        >
                                            <Save className="w-5 h-5" />
                                            Guardar Cambios
                                        </button>
                                    </div>
                                ) : modal.type === 'select' ? (
                                    <div className="space-y-2">
                                        {modal.options.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => saveChanges(modal.field, opt)}
                                                className={`w-full p-4 rounded-2xl text-left font-bold transition-all ${modal.value === opt ? 'bg-primary text-white' : 'bg-gray-50 dark:bg-gray-800 dark:text-white'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                ) : modal.type === 'password' ? (
                                    <div className="space-y-4">
                                        <input type="password" placeholder="Contraseña actual" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none dark:text-white" />
                                        <input type="password" placeholder="Nueva contraseña" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none outline-none dark:text-white" />
                                        <button
                                            onClick={() => { setModal(null); triggerToast('Contraseña actualizada'); }}
                                            className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
                                        >
                                            Actualizar Contraseña
                                        </button>
                                    </div>
                                ) : modal.type === 'invite' ? (
                                    <div className="text-center space-y-6">
                                        <div className="flex justify-center p-4 bg-white rounded-2xl">
                                            <QrCode className="w-32 h-32 text-gray-900" />
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Escanea o copia el enlace para invitar a otro usuario a tu hogar.</p>
                                        <button
                                            onClick={() => copyToClipboard('https://instantpantry.app/join/PANTRY-42')}
                                            className="w-full py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                                        >
                                            <Copy className="w-4 h-4" />
                                            Copiar Enlace
                                        </button>
                                    </div>
                                ) : modal.type === 'delete' ? (
                                    <div className="text-center space-y-6">
                                        <div className="flex justify-center text-red-500">
                                            <AlertTriangle className="w-16 h-16" />
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">¿Estás completamente seguro? Perderás todo tu inventario y datos de forma permanente.</p>
                                        <div className="flex flex-col gap-2">
                                            <button onClick={() => { setModal(null); triggerToast('Cuenta eliminada'); }} className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all">Eliminar definitivamente</button>
                                            <button onClick={() => setModal(null)} className="w-full py-4 bg-gray-100 dark:bg-gray-800 dark:text-white font-bold rounded-2xl active:scale-95 transition-all">Cancelar</button>
                                        </div>
                                    </div>
                                ) : modal.type === 'info' ? (
                                    <div className="space-y-6 text-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{modal.content}</p>
                                        <button onClick={() => setModal(null)} className="w-full py-4 bg-primary text-white font-bold rounded-2xl active:scale-95 transition-all">Cerrar</button>
                                    </div>
                                ) : null}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AccountSettings;
