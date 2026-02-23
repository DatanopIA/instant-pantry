import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import db from './db.js';
import { supabase } from './supabaseClient.js';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Intentar cargar variables de múltiples localizaciones para máxima compatibilidad local/Vercel
dotenv.config(); // Por defecto busca .env en el CWD (raíz en Vercel)
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Inicializar Stripe solo si hay clave
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

if (!stripe) {
    console.warn("⚠️ [STRIPE]: STRIPE_SECRET_KEY no detectada. Las funciones de pago estarán deshabilitadas.");
}

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'https://instant-pantry.vercel.app',
    'https://instant-pantry-pro.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir peticiones sin origen (como apps móviles o curl)
        if (!origin) return callback(null, true);

        // Permitir cualquier subdominio de vercel.app o localhost para facilitar previews
        const isAllowedVercel = origin.endsWith('.vercel.app');
        const isLocalhost = origin.includes('localhost');

        if (allowedOrigins.indexOf(origin) !== -1 || isAllowedVercel || isLocalhost) {
            return callback(null, true);
        } else {
            console.warn(`[CORS]: Origen bloqueado: ${origin}`);
            const msg = 'La política de CORS de este sitio no permite el acceso desde el origen especificado.';
            return callback(new Error(msg), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// --- MIDDLEWARE DE AUTENTICACIÓN ---
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();

    const token = authHeader.split(' ')[1];
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) req.user = user;
    } catch (e) {
        console.error("Auth error:", e);
    }
    next();
};

// --- ESQUEMAS DE VALIDACIÓN (ZOD) ---
const inventorySchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio").max(100, "Nombre demasiado largo"),
    exp: z.number().int().min(0, "La expiración no puede ser negativa").max(3650, "Expiración demasiado lejana"),
    icon: z.string().emoji("Debe ser un emoji").or(z.string().length(0)).optional().default("📦"),
    status: z.enum(['green', 'yellow', 'red']).optional().default('green'),
    user_email: z.string().email("Email inválido").optional()
});

const chatSchema = z.object({
    text: z.string().min(1, "El mensaje no puede estar vacío").max(1000, "Mensaje demasiado largo"),
    history: z.array(z.object({
        sender: z.enum(['user', 'ai', 'model', 'bot']),
        text: z.string()
    })).default([]),
    inventory: z.array(z.any()).optional().default([]),
    dietSettings: z.object({
        type: z.string().optional()
    }).optional().default({}),
    language: z.string().length(2).optional().default('es')
});

// Utility para respuestas de error estandarizadas
const sendError = (res, error, publicMessage = "Error interno del servidor", statusCode = 500) => {
    console.error(`[INTERNAL ERROR]:`, error); // Log completo para el desarrollador
    res.status(statusCode).json({
        error: process.env.NODE_ENV === 'production' ? publicMessage : error.message
    });
};

const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            error: "Error de validación de datos",
            details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        });
    }
};

// --- CONFIGURACIÓN DE RATE LIMITING ---
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 100, // 100 peticiones por ventana
    message: { error: "Demasiadas peticiones. Por favor, inténtalo de nuevo en 15 minutos." },
    standardHeaders: true,
    legacyHeaders: false,
});

const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    limit: 30, // 30 consultas por hora (ajustado de 20)
    message: { error: "Has alcanzado el límite de consultas de IA por hora." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Webhook endpoint (Mandatory signature in prod)
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        if (!stripe) throw new Error("Stripe not configured");

        if (endpointSecret && sig) {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } else if (process.env.NODE_ENV !== 'production' && !endpointSecret) {
            console.warn("⚠️ MODO DESARROLLO: Procesando webhook sin verificación de firma.");
            const body = JSON.parse(req.body.toString());
            event = { type: body.type, data: body.data };
        } else {
            throw new Error("Firma de Stripe ausente o secreto de webhook no configurado.");
        }
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const email = session.customer_email || session.customer_details?.email;
        const tier = session.metadata?.user_tier || 'pro';

        console.log(`💰 Payment confirmed for ${email}. Upgrading to ${tier}.`);

        try {
            await supabase.from('users').upsert({
                email,
                tier,
                updated_at: new Date().toISOString()
            }, { onConflict: 'email' });
        } catch (error) {
            console.error('Database update error:', error);
        }
    }

    res.json({ received: true });
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(authenticate);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// --- API ROUTES ---

app.get('/api/inventory', generalLimiter, async (req, res) => {
    const userEmail = req.user?.email;

    if (!userEmail) {
        return res.status(401).json({ error: "No autorizado. Inicie sesión para ver su inventario." });
    }
    try {
        const { data, error } = await supabase
            .from('inventory')
            .select('*')
            .eq('user_email', userEmail)
            .order('exp', { ascending: true });

        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        sendError(res, error, "No se pudo recuperar el inventario");
    }
});

app.post('/api/inventory', generalLimiter, validate(inventorySchema), async (req, res) => {
    const { name, exp, icon, status } = req.body;
    const email = req.user?.email;

    if (!email) {
        return res.status(401).json({ error: "No autorizado" });
    }

    try {
        const { data, error } = await supabase
            .from('inventory')
            .insert([{ name, exp, icon, status: status || 'green', user_email: email }])
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        sendError(res, error, "No se pudo añadir el item al inventario");
    }
});

app.delete('/api/inventory/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('inventory').delete().eq('id', id);
        if (error) throw error;

        if (process.env.NODE_ENV !== 'production') {
            try {
                db.prepare('DELETE FROM inventory WHERE id = ?').run(id);
            } catch (e) {
                console.error("Local DB sync error:", e);
            }
        }
        res.json({ success: true });
    } catch (error) {
        sendError(res, error, "No se pudo eliminar el item del inventario");
    }
});

// --- AI INTELLIGENCE ---

app.post('/api/ai/chat', aiLimiter, validate(chatSchema), async (req, res) => {
    const { text, history, inventory = [], dietSettings = {}, language = 'es' } = req.body;

    if (!GEMINI_API_KEY) {
        return res.json({ text: "⚠️ IA no configurada. Configure GEMINI_API_KEY." });
    }

    try {
        const inventoryContext = inventory.slice(0, 20).map(i => `${i.name} (vence en ${i.exp} días)`).join(', ');
        const dietType = dietSettings.type || 'Omnívora';

        const systemPrompt = `Eres el "Chef de Casa" de Instant Pantry. Personalidad: Cálida, experta y eficiente.
        Misión: Minimizar el desperdicio (Zero Waste) y maximizar el sabor.
        
        Reglas:
        1. Idioma: ${language}.
        2. Dieta: ${dietType}. No sugerir ingredientes incompatibles.
        3. Estilo: Breve (máximo 3 frases) y dialógico. Termina siempre con pregunta útil.
        4. Contexto: Despensa actual: ${inventoryContext}. Prioriza ingredientes por caducar.
        5. No eres un bot genérico, eres un asistente culinario personal.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [
                    ...history.slice(-6).map(m => ({
                        role: m.sender === 'user' ? 'user' : 'model',
                        parts: [{ text: m.text }]
                    })).filter(m => m.parts[0].text),
                    { role: 'user', parts: [{ text }] }
                ]
            })
        });

        const data = await response.json();
        let rawAiText = "";
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            rawAiText = data.candidates[0].content.parts[0].text;
        } else {
            console.error("Estructura de respuesta de IA inesperada:", JSON.stringify(data));
            rawAiText = "Lo siento, mi conexión culinaria ha fallado. ¿Podemos intentarlo de nuevo?";
        }

        const safeAiText = purify.sanitize(rawAiText);
        res.json({ text: safeAiText });
    } catch (error) {
        sendError(res, error, "Error procesando la consulta de IA");
    }
});

app.post('/api/ai/analyze-image', async (req, res) => {
    const { image, mode } = req.body;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: "API Key missing" });
    }

    try {
        const prompt = mode === 'ticket'
            ? "Extrae PRODUCTOS ALIMENTARIOS de este ticket. Devuelve SOLO un array JSON: [{\"name\": \"Producto\", \"exp\": 7, \"icon\": \"🍎\"}]"
            : "Identifica alimentos en esta imagen de nevera. Devuelve SOLO un array JSON: [{\"name\": \"Alimento\", \"exp\": 14, \"icon\": \"🥦\"}]";

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: "image/jpeg", data: image.includes(',') ? image.split(',')[1] : image } }
                    ]
                }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });

        const data = await response.json();
        const products = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || "[]");
        res.json({ products });
    } catch (error) {
        sendError(res, error, "Error analizando la imagen");
    }
});

// --- SUBSCRIPTIONS & STRIPE ---

app.get('/api/subscription-status', async (req, res) => {
    const email = req.user?.email;
    if (!email) return res.json({ isPro: false });

    try {
        const { data, error } = await supabase.from('users').select('tier').eq('email', email).maybeSingle();
        if (error) throw error;
        res.json({ isPro: data?.tier === 'pro' || data?.tier === 'enterprise' });
    } catch (error) {
        sendError(res, error, "Error obteniendo estado de suscripción");
    }
});

app.post('/api/create-checkout-session', async (req, res) => {
    const { priceId, userEmail, tier = 'pro' } = req.body;
    const finalEmail = userEmail || req.user?.email;

    if (!stripe) {
        console.error("❌ Stripe object is null. Check STRIPE_SECRET_KEY.");
        return res.status(500).json({ error: "Stripe no configurado en el servidor." });
    }

    try {
        const origin = req.headers.origin || 'https://instant-pantry.vercel.app';
        const price = priceId || process.env.STRIPE_PRICE_ID;

        console.log("🚀 Iniciando Checkout:", { email: finalEmail, price });

        if (!price) {
            throw new Error("STRIPE_PRICE_ID no configurado en variables de entorno.");
        }

        if (!finalEmail) {
            return res.status(400).json({ error: "Se requiere un email de usuario para la sesión." });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: price,
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}&status=success`,
            cancel_url: `${origin}/?status=cancel`,
            customer_email: finalEmail,
            metadata: {
                user_tier: tier,
                email: finalEmail
            },
            allow_promotion_codes: true,
        });

        console.log("✅ Sesión creada:", session.id);
        res.json({ url: session.url });
    } catch (error) {
        console.error("❌ Error en Stripe Checkout:", error);
        sendError(res, error, "No se pudo iniciar la pasarela de pago.");
    }
});

app.post('/api/create-portal-session', async (req, res) => {
    const userEmail = req.body.userEmail || req.user?.email;
    if (!stripe) return res.status(500).json({ error: "Stripe missing" });

    try {
        // Search for customer by email
        const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
        if (customers.data.length === 0) {
            return res.status(404).json({ error: "Cliente no encontrado en Stripe. Asegúrate de haber completado un pago primero." });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: customers.data[0].id,
            return_url: `${req.headers.origin || 'https://instant-pantry.vercel.app'}`,
        });

        res.json({ url: session.url });
    } catch (error) {
        sendError(res, error, "Error al acceder al portal de gestión");
    }
});

// Endpoint de prueba para verificar configuración de Stripe
app.get('/api/stripe-config', (req, res) => {
    res.json({
        configured: !!stripe,
        hasPriceId: !!process.env.STRIPE_PRICE_ID,
        nodeEnv: process.env.NODE_ENV
    });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Stable API running at http://localhost:${PORT}`));
}

export default app;
