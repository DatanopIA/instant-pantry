import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { supabase } from '../utils/supabase.js';
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

        // 1. Intentar buscar en la base de datos local (global_recipes) primero
        try {
            const { data: globalRecipes } = await supabase.from('global_recipes').select('*');
            if (globalRecipes && globalRecipes.length > 0) {
                const pantryItems = (pantry || []).map(p => p.toLowerCase());

                // Puntuar recetas según ingredientes coincidentes
                const scored = globalRecipes.map(r => {
                    let matchCount = 0;
                    if (pantryItems.length > 0 && Array.isArray(r.ingredients)) {
                        r.ingredients.forEach(ing => {
                            const ingLow = ing.toLowerCase();
                            if (pantryItems.some(p => ingLow.includes(p) || p.includes(ingLow))) {
                                matchCount++;
                            }
                        });
                    }
                    // Dar un poco de aleatoriedad para que no salgan siempre las mismas recetas
                    return { ...r, matchCount: matchCount + Math.random() * 0.5 };
                });

                scored.sort((a, b) => b.matchCount - a.matchCount);

                const validRecipes = scored.filter(r => r.matchCount >= 3).slice(0, count).map(r => ({
                    id: r.id,
                    title: r.title,
                    image: r.image_url || '',
                    time: r.prep_time || '20 min',
                    difficulty: r.difficulty || 'Media',
                    ingredients: r.ingredients || [],
                    category: r.category || 'Sugerencia'
                }));

                console.log(`[Cache Hit] Sirviendo ${validRecipes.length} recetas desde base de datos local con 3 o más matches.`);
                return res.status(200).json(validRecipes);
            }
        } catch (dbErr) {
            console.error('Error buscando recetas en cache:', dbErr);
        }

        // Si no hay recetas con >= 3 ingredientes, no llamamos a IA para ahorrar tokens
        return res.status(200).json([]);

    } catch (error) {
        console.error('Pantry Recipes API Error:', error);
        return res.status(500).json({
            error: 'No pudimos buscar recetas para tu despensa',
            details: error.message
        });
    }
}
