import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();
import { AIGuard } from '../../utils/ai-guard.js';

/**
 * Endpoint de Chat para el Chef IA
 * Utiliza Gemini 1.5 Flash para ofrecer respuestas inteligentes y creativas.
 */
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { messages, pantry } = req.body;

        if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY no configurada');

        const guard = new AIGuard(process.env.GEMINI_API_KEY);

        const systemInstruction = `Eres Chef IA, la inteligencia culinaria de vanguardia de "Instant Pantry".
Tu personalidad: Chef experto, inspirador, práctico y muy directo.
TONO: Habla siempre de "tú" al usuario (trato informal, cercano pero profesional).

CONTEXTO DE DESPENSA ACTUAL DEL USUARIO: ${pantry && pantry.length > 0 ? pantry.join(', ') : 'Vacía'}

Normas de formato y estilo (CRÍTICO):
1. Ve DIRECTO AL GRANO. No enumeres, recites ni repitas los ingredientes que el usuario tiene en la despensa, asume que ambos los conocéis y ve directamente al menú.
2. No escribas bloques de texto densos. Usa párrafos cortos (máximo 2 frases).
3. Usa saltos de línea DOBLES entre secciones.
4. Estructura ideal: Saludo rápido, propuesta de receta atractiva (usando lo que hay), tip de chef conciso.
5. Usa **negrita** SOLO para el nombre de los platos.

ACCIÓN ESPECIAL (GUARDADO):
Si el usuario te pide EXPLÍCITAMENTE "guardar esta receta" o "añadir a la biblioteca":
1. Responde confirmando el guardado de forma elegante.
2. Al final de tu respuesta, añade EXACTAMENTE este bloque oculto (sin código markdown, tal cual):
[RECIPE_ACTION:SAVE] { "title": "Nombre", "ingredients": ["..."], "instructions": "Pasos...", "time": "20 min", "difficulty": "Fácil", "category": "Categoría" }

Responde siempre en Español de España.`;

        // Formatear para Gemini
        let formattedMessages = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        if (formattedMessages.length > 0 && formattedMessages[0].role === 'model') {
            formattedMessages.shift();
        }

        console.log(`[Chef IA] Chat iniciado con capacidad de Guardado...`);

        const responseText = await guard.call({
            messages: { contents: formattedMessages },
            systemInstruction,
            model: "gemini-2.5-flash"
        });

        // Detectar si hay una acción de guardado
        const actionMatch = responseText.match(/\[RECIPE_ACTION:SAVE\]\s*(\{[\s\S]*?\})/);
        let recipeData = null;
        let cleanResponse = responseText;

        if (actionMatch) {
            try {
                recipeData = JSON.parse(actionMatch[1]);
                cleanResponse = responseText.replace(/\[RECIPE_ACTION:SAVE\].*$/, '').trim();
            } catch (e) {
                console.error("Error parseando receta para guardar:", e);
            }
        }

        return res.status(200).json({
            content: cleanResponse,
            action: recipeData ? { type: 'SAVE_RECIPE', data: recipeData } : null
        });

    } catch (error) {
        console.error('Chef IA Error:', error);
        return res.status(500).json({
            error: 'El Chef se ha tomado un descanso inesperado',
            details: error.message
        });
    }
}
