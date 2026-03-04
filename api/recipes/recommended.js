import { supabase } from '../utils/supabase.js';

function getDailySeed() {
    const today = new Date();
    // Seed is YYYYMMDD string
    return `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
}

// Simple seeded random to pick consistent items per day
function seededRandom(seed) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { data: globalRecipes, error } = await supabase.from('global_recipes').select('*');
        if (error) throw error;

        if (!globalRecipes || globalRecipes.length === 0) {
            return res.status(200).json([]);
        }

        const seedString = getDailySeed();
        let seed = 0;
        for (let i = 0; i < seedString.length; i++) {
            seed += seedString.charCodeAt(i);
        }

        // Shuffle with seed
        for (let i = globalRecipes.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom(seed++) * (i + 1));
            const temp = globalRecipes[i];
            globalRecipes[i] = globalRecipes[j];
            globalRecipes[j] = temp;
        }

        // Return top 5
        const dailyRecommended = globalRecipes.slice(0, 5).map(r => ({
            id: r.id,
            title: r.title,
            image: r.image_url || '',
            time: r.prep_time || '20 min',
            difficulty: r.difficulty || 'Media',
            ingredients: r.ingredients || [],
            category: r.category || 'Recomendación del día'
        }));

        return res.status(200).json(dailyRecommended);
    } catch (error) {
        console.error('Error fetching recommended recipes:', error);
        return res.status(500).json({ error: 'No se pudieron cargar las recetas' });
    }
}
