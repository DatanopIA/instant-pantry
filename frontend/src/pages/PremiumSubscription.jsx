import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Zap, ShieldCheck, ArrowLeft } from 'lucide-react';

const PremiumSubscription = () => {
    const navigate = useNavigate();
    const [selectedTier, setSelectedTier] = useState('plus');

    const tiers = [
        {
            id: 'free',
            name: 'Pantry Básico',
            description: 'Para quienes empiezan a organizar su cocina.',
            price: '0,00',
            features: [
                'Inventario manual',
                '5 recetas sugeridas al mes',
                'Alertas de caducidad básicas',
            ],
            icon: <ShieldCheck className="w-5 h-5 text-gray-400" />,
            tag: null,
            checkoutUrl: '/'
        },
        {
            id: 'plus',
            name: 'Pantry Plus',
            description: 'Escáner inteligente y organización total.',
            price: '4,99',
            features: [
                'Escáner de visión IA ilimitado',
                'Recetas personalizadas ilimitadas',
                'Gestión de listas de compra',
                'Sincronización en 2 dispositivos',
            ],
            icon: <Zap className="w-5 h-5 text-primary" />,
            tag: 'Popular',
            checkoutUrl: 'https://buy.stripe.com/test_3cI8wR2vE3dZ3GM88S0x200'
        },
        {
            id: 'chef',
            name: 'Chef Elite',
            description: 'La experiencia definitiva con análisis nutricional.',
            price: '9,99',
            features: [
                'Todo lo anterior',
                'Análisis nutricional detallado',
                'Planificación de menús familiar',
                'Soporte prioritario',
                'Integración con wearables',
            ],
            icon: <Star className="w-5 h-5 text-amber-500" />,
            tag: 'Mejor Valor',
            checkoutUrl: 'https://buy.stripe.com/test_28E8wR1rAg0L2CI0Gq0x201'
        }
    ];

    const handleCheckout = () => {
        const selected = tiers.find(t => t.id === selectedTier);
        if (selected.id === 'free') {
            navigate('/');
            return;
        }
        window.open(selected.checkoutUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 animate-fade-in relative overflow-hidden">
            {/* Back Button */}
            <div className="max-w-4xl mx-auto mb-8 px-2">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all duration-300 group rounded-xl hover:bg-white/50 dark:hover:bg-white/5 active:scale-95"
                >
                    <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700/50 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">Volver</span>
                </button>
            </div>

            <div className="max-w-4xl mx-auto text-center mb-16">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                    Eleva tu Cocina al <span className="text-primary">Siguiente Nivel</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Ahorra tiempo, reduce el desperdicio y cocina como un experto con nuestras herramientas inteligentes.
                </p>
                <div className="inline-block mt-8 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold">
                    Suscripción Mensual
                </div>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
                {tiers.map((tier) => (
                    <div
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id)}
                        className={`group relative p-6 cursor-pointer transition-all duration-300 rounded-2xl glass-panel border-2 ${selectedTier === tier.id
                            ? 'border-primary ring-4 ring-primary/10 scale-[1.02]'
                            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                    >
                        {tier.tag && (
                            <span className="absolute -top-3 left-6 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-lg">
                                {tier.tag}
                            </span>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${selectedTier === tier.id ? 'bg-primary/20 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                    {tier.icon}
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {tier.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {tier.description}
                                    </p>
                                </div>
                            </div>

                            <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{tier.price}€</span>
                                    <span className="text-sm text-gray-500">/mes</span>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${selectedTier === tier.id ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'
                                    }`}>
                                    {selectedTier === tier.id && <Check className="w-4 h-4 text-white" />}
                                </div>
                            </div>
                        </div>

                        {/* Feature List (Expanded on selection) */}
                        <div className={`mt-6 overflow-hidden transition-all duration-500 ease-in-out ${selectedTier === tier.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-gray-200 dark:border-gray-700/50">
                                {tier.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Check className="w-4 h-4 text-primary shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {tier.id !== 'free' && (
                                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/50 flex flex-col sm:flex-row justify-end items-center gap-4">
                                    <span className="text-sm text-gray-500 hidden sm:block">
                                        Pago seguro mediante Stripe
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(tier.checkoutUrl, '_blank');
                                        }}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-6 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-primary/20 transform hover:-translate-y-0.5"
                                    >
                                        <span>Suscribirme a {tier.name}</span>
                                        <Zap className="w-4 h-4 fill-current" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <div className="pt-8">
                    <button
                        onClick={handleCheckout}
                        className="w-full py-4 px-8 bg-primary hover:bg-primary-dark text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 transform hover:scale-[1.01] transition-all duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/50"
                    >
                        Comenzar con {tiers.find(t => t.id === selectedTier).name}
                    </button>
                    <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-500">
                        Paga de forma segura. Cancela en cualquier momento sin compromisos.
                    </p>
                </div>
            </div>

            {/* Background decorative elements */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-[120px]" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent rounded-full blur-[120px]" />
            </div>
        </div>
    );
};

export default PremiumSubscription;
