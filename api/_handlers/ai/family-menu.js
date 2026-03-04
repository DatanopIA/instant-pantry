import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { pantry, days = 7, members = 2 } = req.body;

        if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY no configurada');

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Actúa como un Chef nutricionista para la familia.
Genera un menú equilibrado para ${days} días, pensado para ${members} personas.
Tienes a tu disposición **como base** la siguiente despensa: ${pantry && pantry.length > 0 ? pantry.join(', ') : 'Despensa vacía, asume que podrán comprar algo básico.'}. Intenta maximizar el uso de esos productos.
    
Devuelve **ESTRICTAMENTE** y SOLO un objeto JSON con este formato (ejemplo para un día normal, pero genéralo para ${days} días):
{
    "title": "Un nombre creativo para el Menú (ej: Menú Mediterráneo con tu despensa)",
    "days": [
        {
            "day": "Lunes",
            "breakfast": "Avena con manzana",
            "lunch": "Arroz con pollo",
            "snack": "Yogur",
            "dinner": "Ensalada César"
        }
    ],
    "shoppingListNeeded": ["huevos", "leche"] // Ingredientes extra que quizás se necesiten comprar
}`;

        const result = await model.generateContent(prompt);
        let text = result.response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            text = jsonMatch[0];
        }

        const menuData = JSON.parse(text);

        return res.status(200).json(menuData);

    } catch (error) {
        console.error('Family Menu API Error:', error);
        return res.status(500).json({
            error: 'No pudimos generar el menú familiar',
            details: error.message
        });
    }
}
