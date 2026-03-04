import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function fixImages() {
    console.log('Fetching all recipes to apply professional food images...');
    const { data: recipes, error } = await supabase.from('global_recipes').select('id, title');

    if (error) {
        console.error('Error fetching recipes:', error);
        return;
    }

    console.log(`Found ${recipes.length} recipes. Starting update with LoremFlickr (Reliable Food Images)...`);

    let updated = 0;
    for (const recipe of recipes) {
        // Usamos LoremFlickr con el tag 'food' y el nombre del plato para mayor precisión visual
        const cleanTitle = recipe.title.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ").slice(0, 3).join(",");
        const imageUrl = `https://loremflickr.com/800/600/food,${cleanTitle}/all`;

        const { error: updateError } = await supabase
            .from('global_recipes')
            .update({ image_url: imageUrl })
            .eq('id', recipe.id);

        if (updateError) {
            console.error(`Error updating recipe ${recipe.id}:`, updateError);
        } else {
            updated++;
            if (updated % 25 === 0) console.log(`Progress: ${updated}/${recipes.length} updated...`);
        }

        // Small delay to prevent bursting too many connections
        await new Promise(r => setTimeout(r, 50));
    }

    console.log(`✅ Success! Updated ${updated} recipes with reliable food images.`);
}

fixImages();
