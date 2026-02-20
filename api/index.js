import express from 'express';
import cors from 'cors';
import db from './db.js';
import dotenv from 'dotenv';
import Stripe from 'stripe';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const app = express();
const PORT = 3001;

app.use(cors());

// Webhook endpoint must stay ABOVE express.json() to get raw body
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        if (stripe && endpointSecret && sig) {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } else {
            // Mock or Manual update if keys are missing
            console.log("⚠️ No Stripe Webhook Secret or Signature - Using manual test mode");
            const body = JSON.parse(req.body.toString());
            event = { type: body.type, data: body.data };
        }
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const email = session.customer_email;
        const tier = session.metadata?.user_tier || 'pro';

        console.log(`💰 Payment confirmed for ${email}. Upgrading to ${tier}.`);

        try {
            db.prepare('INSERT OR REPLACE INTO users (email, tier) VALUES (?, ?)').run(email, tier);
        } catch (error) {
            console.error('Database update error:', error);
        }
    }

    res.json({ received: true });
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log('API Status: Gemini Key', GEMINI_API_KEY ? 'is present' : 'is missing');

// --- INVENTORY ENDPOINTS ---

app.get('/api/inventory', (req, res) => {
    try {
        const items = db.prepare('SELECT * FROM inventory ORDER BY exp ASC').all();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/inventory', (req, res) => {
    const { name, exp, icon, status } = req.body;
    try {
        const info = db.prepare('INSERT INTO inventory (name, exp, icon, status) VALUES (?, ?, ?, ?)').run(name, exp, icon, status || 'green');
        res.json({ id: info.lastInsertRowid, name, exp, icon, status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/inventory/:id', (req, res) => {
    try {
        db.prepare('DELETE FROM inventory WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- RECIPES ENDPOINTS ---

app.get('/api/recipes', (req, res) => {
    try {
        const recipes = db.prepare('SELECT * FROM recipes').all();
        const formattedRecipes = recipes.map(r => ({
            ...r,
            tags: r.tags ? JSON.parse(r.tags) : [],
            ingredients: r.ingredients ? JSON.parse(r.ingredients) : [],
            steps: r.steps ? JSON.parse(r.steps) : []
        }));
        res.json(formattedRecipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/recipes/:id/favorite', (req, res) => {
    const { is_favorite } = req.body;
    try {
        db.prepare('UPDATE recipes SET is_favorite = ? WHERE id = ?').run(is_favorite ? 1 : 0, req.params.id);
        res.json({ success: true, is_favorite });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- CHAT ENDPOINTS ---

app.get('/api/messages', (req, res) => {
    try {
        const messages = db.prepare('SELECT * FROM messages ORDER BY timestamp ASC').all();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/messages', (req, res) => {
    const { text, sender } = req.body;
    try {
        db.prepare('INSERT INTO messages (text, sender) VALUES (?, ?)').run(text, sender);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Real AI Chat Endpoint with Gemini
app.post('/api/ai/chat', async (req, res) => {
    const { text, history, inventory = [], recipes = [], dietSettings = {}, language = 'es' } = req.body;
    console.log('Chat request received:', text, 'Language:', language);

    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'TU_API_KEY_AQUI_GEMINI') {
        return res.json({
            text: language === 'es'
                ? "⚠️ [MODO DEMO] Hola, para activar mi inteligencia completa, por favor introduce una GEMINI_API_KEY válida."
                : language === 'en'
                    ? "⚠️ [DEMO MODE] Hello, to activate my full intelligence, please provide a valid GEMINI_API_KEY."
                    : "⚠️ [MODE DEMO] Hola, per activar la meva intel·ligència completa, si us plau introdueix una GEMINI_API_KEY vàlida."
        });
    }

    try {
        const inventoryContext = inventory.map(i => `${i.name} (vence en ${i.exp} días)`).join(', ');
        const recipesContext = recipes.map(r => r.title).join(', ');
        const dietType = dietSettings.type || 'Omnívora';

        const systemPrompt = `Eres el "Chef de Casa" de Instant Pantry. Tu personalidad es cálida, entusiasta y muy humana.
        
        Sigue estas instrucciones estrictamente:
        1. RESPONDE SIEMPRE EN EL IDIOMA: ${language === 'es' ? 'Español' : language === 'en' ? 'Inglés' : 'Catalán'}.
        2. Tienes en cuenta las PREFERENCIAS DIETÉTICAS del usuario: ${dietType}. 
           - Si el usuario es vegetariano o vegano, no sugieras carne.
           - Si el usuario tiene alergias o dietas especiales (Keto, Gluten Free), tómalas en cuenta.
        3. NO SEAS ROBÓTICO: Usa expresiones naturales como "¡Vaya!", "¡Qué buena pinta!".
        4. BREVEDAD Y DIÁLOGO: Tus respuestas iniciales deben ser cortas (máximo 2-3 frases). Termina SIEMPRE con una pregunta abierta.
        5. ZERO WASTE: Tu misión es que no se tire nada. Menciona productos próximos a caducar.
        6. CONTEXTO ACTUAL:
           - DESPENSA: ${inventoryContext}
           - RECETAS PERSONALIZADAS: ${recipesContext}
        7. Si el usuario te saluda, dile algo como: "¡Hola! Qué alegría verte. He estado echando un ojo a tu nevera y tienes cosas interesantes. ¿Cocinamos algo rico?".`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: systemPrompt }] },
                    ...history.map(m => ({
                        role: m.sender === 'user' ? 'user' : 'model',
                        parts: [{ text: m.text }]
                    })),
                    { role: 'user', parts: [{ text }] }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error('Gemini API Error details:', data.error);

            // Handle leaked API key error specifically
            if (data.error.message && data.error.message.includes('leaked')) {
                const leakedMsg = {
                    es: "⚠️ [ERROR CRÍTICO] Tu clave de API de Gemini ha sido filtrada y bloqueada por seguridad. Por favor, genera una nueva en Google AI Studio (https://aistudio.google.com/) y actualiza el archivo .env.",
                    en: "⚠️ [CRITICAL ERROR] Your Gemini API key has been leaked and blocked for security. Please generate a new one at Google AI Studio (https://aistudio.google.com/) and update your .env file.",
                    ca: "⚠️ [ERROR CRÍTIC] La teva clau d'API de Gemini ha estat filtrada i bloquejada per seguretat. Si us plau, genera una de nova a Google AI Studio (https://aistudio.google.com/) i actualitza el fitxer .env."
                };
                return res.json({ text: leakedMsg[language] || leakedMsg['es'] });
            }

            return res.json({ text: `⚠️ Error: ${data.error.message}` });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text ||
            (language === 'en' ? "Sorry, my culinary connection failed. Shall we try again?" :
                language === 'ca' ? "Ho sento, la meva connexió culinària ha fallat. Ho provem de nou?" :
                    "Lo siento, mi conexión culinaria ha fallado un momento. ¿Podemos intentarlo de nuevo?");

        res.json({ text: aiText });
    } catch (error) {
        console.error('Gemini Error:', error);
        res.status(500).json({ error: "Error conectando con la IA" });
    }
});

// Real Vision Endpoint (OCR & Fridge Analysis)
app.post('/api/ai/analyze-image', async (req, res) => {
    const { image, mode } = req.body; // image as base64

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: "API Key missing" });
    }

    try {
        const prompt = mode === 'ticket'
            ? "Eres un sistema OCR experto en tickets de supermercado. Extrae una lista de productos alimentarios de este ticket. Devuelve SOLO un array JSON de objetos con {name: string, exp: number (estimado de días para vencer), icon: string (emoji)}. Ejemplo: [{\"name\": \"Leche\", \"exp\": 7, \"icon\": \"🥛\"}]"
            : "Eres un experto en visión artificial para cocina. Analiza esta imagen de una nevera o despensa e identifica los alimentos visibles. Devuelve SOLO un array JSON de objetos con {name: string, exp: number (estimado de días para vencer), icon: string (emoji)}. Ejemplo: [{\"name\": \"Manzanas\", \"exp\": 14, \"icon\": \"🍎\"}]";

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: image.split(',')[1] // Remove data:image/jpeg;base64,
                            }
                        }
                    ]
                }],
                generationConfig: {
                    response_mime_type: "application/json",
                }
            })
        });

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

        // Ensure it's valid JSON
        let products = [];
        try {
            products = JSON.parse(aiResponse);
        } catch (e) {
            console.error("Failed to parse AI JSON:", aiResponse);
            // Fallback: search for something that looks like an array in the text
            const match = aiResponse.match(/\[.*\]/s);
            if (match) products = JSON.parse(match[0]);
        }

        res.json({ products });
    } catch (error) {
        console.error('Gemini Vision Error:', error);
        res.status(500).json({ error: "Error procesando la imagen" });
    }
});

// --- USER & SUBSCRIPTION ENDPOINTS ---

app.get('/api/subscription/:email', (req, res) => {
    const { email } = req.params;
    try {
        const user = db.prepare('SELECT tier FROM users WHERE email = ?').get(email);
        res.json({ tier: user ? user.tier : 'free' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/subscription-status', (req, res) => {
    const { email } = req.query;
    try {
        const user = db.prepare('SELECT tier FROM users WHERE email = ?').get(email);
        res.json({ isPro: user ? user.tier === 'pro' : false });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- STRIPE PAYMENTS ENDPOINTS ---

app.post('/api/create-checkout-session', async (req, res) => {
    const { priceId, userEmail } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId || 'price_smart_monthly_placeholder', // Reemplazar con ID real de Stripe
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}&status=success`,
            cancel_url: `${req.headers.origin}/?status=cancel`,
            customer_email: userEmail,
            metadata: {
                user_tier: 'pro'
            }
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Session Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Para despliegue local (opcional)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

export default app;
