import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

// Componente SVG para logo de Google
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export default function AuthModal({ isOpen, onClose, defaultIsLogin = false }) {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(defaultIsLogin);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        setIsLogin(defaultIsLogin);
        setError('');
        setSuccessMsg('');
        setEmail('');
        setPassword('');
        setFullName('');
    }, [isOpen, defaultIsLogin]);

    const handleGoogleAuth = async () => {
        try {
            setLoading(true);
            setError('');
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/',
                    queryParams: {
                        prompt: 'select_account',
                    }
                }
            });
            if (error) throw error;
        } catch (err) {
            console.error("Error connecting with Google:", err);
            setError("Error al conectar con Google. Por favor, inténtalo de nuevo.");
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            setSuccessMsg('');

            if (isLogin) {
                const { error, data } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                if (data?.session) {
                    onClose();
                    navigate('/');
                }
            } else {
                if (!fullName.trim()) {
                    throw new Error("Por favor ingresa tu nombre completo.");
                }
                const { error, data } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName.trim()
                        },
                        emailRedirectTo: window.location.origin + '/'
                    }
                });
                if (error) throw error;

                if (data?.user?.identities?.length === 0) {
                    setError("Este correo ya está registrado.");
                } else if (!data?.session) {
                    setSuccessMsg("¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.");
                } else {
                    onClose();
                    navigate('/');
                }
            }
        } catch (err) {
            let msg = err.message;
            if (msg.includes('Invalid login credentials')) msg = "Credenciales incorrectas.";
            else if (msg.includes('Password should be at least')) msg = "La contraseña debe tener al menos 6 caracteres.";
            else msg = "Ocurrió un error. Verifica tus datos e inténtalo de nuevo.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                    onClick={() => !loading && onClose()}
                />

                {/* Modal Container */}
                <Motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                    className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                >
                    {/* Decorative Top Gradient */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500" />

                    <button
                        onClick={() => !loading && onClose()}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8 sm:p-10">
                        <div className="text-center mb-8">
                            <img src="/logo.png" alt="Instant Pantry Logo" className="w-12 h-12 rounded-2xl mx-auto mb-4 shadow-lg shadow-emerald-500/30 object-cover" />
                            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta gratis'}
                            </h2>
                            <p className="text-gray-500 mt-2 text-sm">
                                {isLogin ? 'Inicia sesión para acceder a tu despensa' : 'Únete a Instant Pantry y revoluciona tu cocina.'}
                            </p>
                        </div>

                        {error && (
                            <Motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-6 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 flex items-start gap-2"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>{error}</p>
                            </Motion.div>
                        )}

                        {successMsg && (
                            <Motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-6 bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-xl border border-emerald-100 flex items-start gap-2"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>{successMsg}</p>
                            </Motion.div>
                        )}

                        {/* Google Oauth */}
                        <button
                            type="button"
                            onClick={handleGoogleAuth}
                            disabled={loading}
                            className="w-full relative flex flex-row items-center justify-center px-4 py-3.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-2xl transition-all shadow-sm mb-6 disabled:opacity-70 disabled:cursor-not-allowed group hover:border-gray-300"
                        >
                            <GoogleIcon />
                            Continuar con Google
                        </button>

                        <div className="relative flex items-center mb-6">
                            <div className="w-full border-t border-gray-200"></div>
                            <span className="bg-white px-3 text-sm text-gray-400 font-medium absolute left-1/2 -translate-x-1/2">O ingresa con Email</span>
                        </div>

                        {/* Email Form */}
                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Nombre Completo</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <div className="h-5 w-5 text-gray-400 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all"
                                            placeholder="Tu nombre"
                                        />
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Contraseña</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-shadow-sm transition-all shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                                        <ChevronRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                        setSuccessMsg('');
                                    }}
                                    className="ml-1.5 text-emerald-600 hover:text-emerald-700 font-bold underline decoration-2 underline-offset-2"
                                    type="button"
                                >
                                    {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
                                </button>
                            </p>
                        </div>
                    </div>
                </Motion.div>
            </div>
        </AnimatePresence>
    );
}
