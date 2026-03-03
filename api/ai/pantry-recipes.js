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
        const { pantry, count = 5 } = req.body;

        if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY no configurada');

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Actúa como un Chef experto en cocina de aprovechamiento. 
Tu misión es proponer exactamente ${count} recetas distintas y creativas utilizando **estricta y exclusivamente** la siguiente lista de ingredientes que hay en la despensa: ${pantry && pantry.length > 0 ? pantry.join(', ') : 'Despensa vacía, en este caso puedes sugerir 5 recetas básicas con ingredientes muy comunes que cualquiera suele tener'}. 

Para cada receta, devuelve el siguiente formato, respondiendo SOLO con un JSON Array válido:
[
  {
    "id": "Un id único tipo string inventado, ej: p1",
    "title": "Nombre de la receta",
    "image": "URL realista de Unsplash sobre el plato propuesto, usa palabras clave en inglés de los ingredientes principales para que la imagen sea fiel a la receta. Ejemplo: https://images.unsplash.com/photo-123456?auto=format&fit=crop&q=80&w=400. Intenta usar una URL que contenga términos generales de comida o del ingrediente",
    "time": "Tiempo en minutos, ej: 15 min",
    "difficulty": "Dificultad, ej: Fácil, Media",
    "ingredients": ["Ingrediente 1", "Ingrediente 2"],
    "category": "Una categoría corta, ej: Cena rápida, Postre"
  }
]

Asegúrate de que las recetas propuestas realmente tengan sentido culinario y coincidan plenamente con los ingredientes indicados de la despensa (puedes asumir un mínimo de sal, aceite y agua). DEBES DEVOLVER EXACTAMENTE UN ARRAY JSON. No utilices Markdown alrededor del JSON.`;

        const result = await model.generateContent(prompt);
        let text = result.response.text();

        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            text = jsonMatch[0];
        }

        const recipesData = JSON.parse(text);

        return res.status(200).json(recipesData);

    } catch (error) {
        console.error('Pantry Recipes API Error:', error);
        return res.status(500).json({
            error: 'No pudimos generar las recetas para tu despensa',
            details: error.message
        });
    }
}
