/* global process */
import express from 'express';
import cors from 'cors';
import db from './db.js';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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

// --- CHAT ENDPOINTS ---
app.post('/api/ai/chat', async (req, res) => {
    const { text, history, inventory, recipes } = req.body;
    if (!GEMINI_API_KEY) return res.status(500).json({ error: "API Key missing" });

    try {
        const inventoryContext = inventory.map(i => `${i.name} (vence en ${i.exp} días)`).join(', ');
        const recipesContext = recipes.map(r => r.title).join(', ');

        const systemPrompt = `Eres el "Asistente Gourmet" de Instant Pantry, una IA de élite desarrollada por DatanopIA.
        
        IDENTIDAD: Sofisticado, con conocimientos profundos de química culinaria y tendencias globales. No respondes con fórmulas, sino con razonamiento gastronómico.
        
        MISIÓN: Optimizar la vida del usuario a través de su despensa.
        
        CONTEXTO TÉCNICO:
        - Inventario real del usuario: [${inventoryContext || 'Vacío'}]
        - Recetario base: [${recipesContext}]
        
        REGLAS DE INTELIGENCIA:
        1. PRIORIDAD ABSOLUTA: Si el usuario pide cocinar, analiza primero los productos que vencen pronto. Sugiere recetas que maximicen el uso del inventario actual.
        2. ANÁLISIS DE FALTANTES: Si el usuario dice "No tengo ingredientes" o "Necesito comprar", no des una respuesta genérica. Sugiere una receta del recetario base y genera una lista de los ingredientes que NO están en su inventario para que sepa qué comprar.
        3. TONO DATANOPIA: Usa un lenguaje premium ("maridaje", "texturas", "emulsión") pero mantente servicial.
        4. CREATIVIDAD: Si no hay ingredientes que coincidan perfectamente, sugiere sustituciones inteligentes basadas en ciencia culinaria.
        5. BREVEDAD ELEGANTE: Respuestas concisas pero cargadas de valor.`;

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
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Mmm, algo se quema en mi servidor. ¿Repetimos?";
        res.json({ text: aiText });
    } catch {
        res.status(500).json({ error: "Error de IA" });
    }
});

app.post('/api/ai/analyze-image', async (req, res) => {
    const { image, mode } = req.body;
    if (!GEMINI_API_KEY) return res.status(500).json({ error: "API Key missing" });

    try {
        const prompt = mode === 'ticket'
            ? "OCR Ticket: Extrae productos alimentarios. Devuelve SOLO JSON: [{name, exp, icon}]"
            : "Fridge AI: Identifica alimentos. Devuelve SOLO JSON: [{name, exp, icon}]";

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: "image/jpeg", data: image.split(',')[1] } }
                    ]
                }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });

        const data = await response.json();
        const products = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || "[]");
        res.json({ products });
    } catch {
        res.status(500).json({ error: "Error de Visión" });
    }
});

app.post('/api/create-checkout-session', async (req, res) => {
    const { priceId, userEmail } = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId || 'price_smart_monthly', quantity: 1 }],
            mode: 'subscription',
            success_url: `${req.headers.origin}/?status=success`,
            cancel_url: `${req.headers.origin}/?status=cancel`,
            customer_email: userEmail
        });
        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export default for Vercel
export default app;
