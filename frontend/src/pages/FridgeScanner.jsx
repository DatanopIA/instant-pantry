import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCw, Check, X, Loader2, ArrowLeft, Upload, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../services/inventoryService';
import { useSubscription } from '../hooks/useSubscription';

const FridgeScanner = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);

    const { features } = useSubscription();

    // Define functions before useEffect to avoid declaration errors
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const startCamera = async () => {
        if (!features.canUseScanner) return; // Prevent camera start if locked
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
        }
    };

    useEffect(() => {
        if (features.canUseScanner) {
            startCamera();
        }
        return () => stopCamera();
    }, [features.canUseScanner]);

    const takePhoto = async () => {
        const canvas = document.createElement('canvas');
        if (videoRef.current) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0);
            const image = canvas.toDataURL('image/jpeg');
            setCapturedImage(image);
            stopCamera();
            await processImage(image);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Data = reader.result;
            setCapturedImage(base64Data);
            stopCamera();
            await processImage(base64Data);
        };
        reader.readAsDataURL(file);
    };

    const processImage = async (image) => {
        setIsProcessing(true);
        try {
            const data = await inventoryService.processVision(image);
            // Filtrar solo alimentos antes de mostrar
            const filteredItems = data.items.filter(item => inventoryService.isFoodItem(item.name));

            setResults({
                items: filteredItems.map((item, idx) => ({
                    id: idx,
                    name: item.name,
                    confidence: 0.95,
                    expires_at: item.expires_at, // guardar original para DB
                    expiry: item.expires_at ? `${Math.ceil((new Date(item.expires_at) - new Date()) / 86400000)} días` : 'N/A'
                }))
            });
        } catch (err) {
            console.error('Error processing image:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleApply = async () => {
        setIsProcessing(true);
        try {
            // Guardado real de los artículos detectados
            const itemsToSave = await Promise.all(results.items.map(async (item) => {
                const product = await inventoryService.getOrCreateProduct(item.name);
                return {
                    product_id: product.id,
                    quantity: 1,
                    status: 'active',
                    expires_at: item.expires_at,
                    is_opened: false
                };
            }));

            await inventoryService.addItems(itemsToSave);
            navigate('/');
        } catch (err) {
            console.error('Error al guardar inventario:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="relative h-full flex flex-col bg-black overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-white font-medium">Escáner IA</h2>
                <div className="w-10"></div>
            </div>

            {/* Camera Preview */}
            <div className="relative flex-1 bg-gray-900 flex items-center justify-center">
                {!features.canUseScanner ? (
                    <div className="px-6 py-12 text-center bg-gray-900 flex flex-col items-center justify-center w-full h-full">
                        <Camera size={64} className="text-gray-500 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-4">Escáner IA Bloqueado</h3>
                        <p className="text-gray-400 mb-8 max-w-sm">
                            El escáner de visión IA es una función Premium. Actualiza a Pantry Plus para detectar automáticamente tus alimentos con foto.
                        </p>
                        <button
                            onClick={() => navigate('/premium')}
                            className="py-4 px-8 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all shadow-lg"
                        >
                            Ver Planes Premium
                        </button>
                    </div>
                ) : !capturedImage ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="h-full w-full object-cover"
                    />
                ) : capturedImage.startsWith('data:application/pdf') ? (
                    <div className="h-full w-full flex flex-col items-center justify-center text-white bg-gray-900 p-6">
                        <FileText size={64} className="mb-4 text-primary" />
                        <p className="text-xl font-bold">Documento cargado</p>
                        <p className="text-gray-400 mt-2 text-center text-sm">Escaneando contenido del PDF...</p>
                    </div>
                ) : (
                    <img src={capturedImage} alt="Captured" className="h-full w-full object-cover" />
                )}

                {/* Scan Frame Overlay */}
                {features.canUseScanner && !results && !isProcessing && (
                    <div className="absolute inset-x-8 inset-y-32 border-2 border-white/30 rounded-3xl pointer-events-none flex items-center justify-center">
                        <div className="w-full h-0.5 bg-primary/50 absolute animate-[pulse_2s_infinite]"></div>
                    </div>
                )}
            </div>

            {/* Results / Processing Panel */}
            <AnimatePresence>
                {(isProcessing || results) && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-[40px] p-6 z-30 max-h-[70%]"
                    >
                        {isProcessing ? (
                            <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                <Loader2 className="animate-spin text-primary" size={48} />
                                <p className="text-gray-500 dark:text-gray-400 font-medium">Analizando ingredientes...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold dark:text-white">Detección Finalizada</h3>
                                    <button onClick={() => { setResults(null); setCapturedImage(null); startCamera(); }} className="p-2 text-gray-400">
                                        <RefreshCw size={20} />
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                    {results.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                            <div>
                                                <p className="font-semibold dark:text-white">{item.name}</p>
                                                <p className="text-xs text-gray-500">Vence en {item.expiry}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded-full">{Math.round(item.confidence * 100)}%</span>
                                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                                                    <Check size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        onClick={() => { setResults(null); setCapturedImage(null); startCamera(); }}
                                        className="flex-1 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl font-semibold dark:text-white"
                                    >
                                        Repetir
                                    </button>
                                    <button
                                        onClick={handleApply}
                                        className="flex-1 py-4 bg-primary text-white rounded-2xl font-semibold shadow-lg shadow-primary/30"
                                    >
                                        Guardar Todo
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Capture & Upload Buttons */}
            {features.canUseScanner && !results && !isProcessing && (
                <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-6 z-20 px-8">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-14 h-14 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border-2 border-white/20 hover:bg-black/60 transition-colors shadow-lg"
                    >
                        <Upload size={24} />
                    </button>

                    <button
                        onClick={takePhoto}
                        className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 active:scale-90 transition-transform"
                    >
                        <div className="w-16 h-16 rounded-full border-2 border-black/5 flex items-center justify-center">
                            <Camera size={32} className="text-gray-900" />
                        </div>
                    </button>

                    <div className="w-14"></div> {/* Empty div to keep the center button centered */}

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                    />
                </div>
            )}
        </div>
    );
};

export default FridgeScanner;
