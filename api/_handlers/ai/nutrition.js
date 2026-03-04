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
        const { recipeTitle, ingredients } = req.body;

        if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY no configurada');

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Analiza nutricionalmente la siguiente receta:
Nombre: "${recipeTitle}"
Ingredientes: ${ingredients.join(', ')}

Proporciona EXACTAMENTE un objeto JSON válido con la siguiente estructura (estimada para 1 ración), sin código markdown alrededor, ni explicaciones extra. Valores como strings con su unidad (ej: "450 kcal", "25 g").
Estructura a rellenar:
{
    "calories": "",
    "protein": "",
    "carbs": "",
    "fat": "",
    "healthScore": 0, // número del 1 al 10, donde 10 es lo más saludable
    "tags": [] // array de 3 strings máximo, ej: ["Alto en proteínas", "Bajo en grasas"]
}`;

        const result = await model.generateContent(prompt);
        let text = result.response.text();

        // Limpiar el markdown si Gemini lo envuelve en ```json ... ```
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            text = jsonMatch[0];
        }

        const nutritionData = JSON.parse(text);

        return res.status(200).json(nutritionData);

    } catch (error) {
        console.error('Nutrition API Error:', error);
        return res.status(500).json({
            error: 'No pudimos analizar la receta',
            details: error.message
        });
    }
}
