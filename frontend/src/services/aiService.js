import axios from 'axios';
import { inventoryService } from './inventoryService';
import { supabase } from '../utils/supabase';

const API_URL = import.meta.env.DEV
    ? (import.meta.env.VITE_API_URL || 'http://localhost:3000')
    : 'https://instant-pantry.vercel.app';

export const aiService = {
    /**
     * Envía el historial de mensajes al Chef IA para obtener una respuesta coherente.
     * @param {Array} messages - Historial de mensajes [{role: 'user'|'assistant', content: string}]
     * @param {Array} pantryContext - Lista de ingredientes actuales en la despensa
     */
    async chatWithChef(messages, pantryContext = []) {
        // FILTRADO: Solo ingredientes comestibles
        const foodItems = pantryContext.filter(item =>
            inventoryService.isFoodItem(item.products_master?.name || item.name, item.products_master?.category)
        );

        const pantryNames = foodItems.map(i => i.products_master?.name || i.name);

        try {
            // Llamada al backend de Gemini (Node.js) con rol de Chef IA
            const fullUrl = `${API_URL}/api/ai/chat`;
            console.log('[Chef Debug] Calling URL:', fullUrl);

            const response = await axios.post(fullUrl, {
                messages,
                pantry: pantryNames
            }, { timeout: 30000 });

            if (response.data && response.data.content) {
                return response.data;
            }
            throw new Error('Respuesta inválida del servidor de IA');

        } catch (error) {
            console.error('AI Service Error (Full):', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                config: error.config?.url
            });

            // Fallback más inteligente y natural si falla el backend

            // (Evitamos las respuestas predefinidas que frustraban al usuario)
            return {
                content: "Vaya, se me ha empañado el cristal de los fogones (el servicio de IA no responde). ¿Podemos intentarlo de nuevo en un momento o quieres que probemos con una de mis sugerencias básicas?"
            };
        }
    },

    /**
     * Guarda una receta generada por la IA en la base de datos.
     */
    async saveRecipe(recipeData) {
        const { data, error } = await supabase
            .from('saved_recipes')
            .insert([{
                household_id: import.meta.env.VITE_TEST_HOUSEHOLD_ID,
                title: recipeData.title,
                ingredients: recipeData.ingredients || [],
                instructions: recipeData.instructions,
                image_url: recipeData.image_url,
                category: recipeData.category || 'IA Suggestion',
                difficulty: recipeData.difficulty || 'Fácil',
                time: recipeData.time || '20 min'
            }])
            .select();

        if (error) throw error;
        return data;
    },

    /**
     * Analiza una receta existente y devuelve sus macros.
     */
    async analyzeNutrition(recipeTitle, ingredients) {
        try {
            const fullUrl = `${API_URL}/api/ai/nutrition`;
            const response = await axios.post(fullUrl, { recipeTitle, ingredients }, { timeout: 30000 });
            return response.data;
        } catch (error) {
            console.error('AI Nutrition Error:', error);
            throw new Error('No pudimos analizar la receta');
        }
    },

    /**
     * Genera un menú familiar basado en la despensa.
     */
    async generateFamilyMenu(pantryContext = [], days = 7, members = 2) {
        const foodItems = pantryContext.filter(item =>
            inventoryService.isFoodItem(item.products_master?.name || item.name, item.products_master?.category)
        );
        const pantryNames = foodItems.map(i => i.products_master?.name || i.name);

        try {
            const fullUrl = `${API_URL}/api/ai/family-menu`;
            const response = await axios.post(fullUrl, { pantry: pantryNames, days, members }, { timeout: 45000 });
            return response.data;
        } catch (error) {
            console.error('AI Family Menu Error:', error);
            throw new Error('No pudimos generar el menú familiar');
        }
    },

    /**
     * Genera recetas basadas exclusivamente en la despensa.
     */
    async generatePantryRecipes(pantryContext = [], count = 5) {
        const foodItems = pantryContext.filter(item =>
            inventoryService.isFoodItem(item.products_master?.name || item.name, item.products_master?.category)
        );
        const pantryNames = foodItems.map(i => i.products_master?.name || i.name);

        try {
            const fullUrl = `${API_URL}/api/ai/pantry-recipes`;
            const response = await axios.post(fullUrl, { pantry: pantryNames, count }, { timeout: 45000 });
            return response.data;
        } catch (error) {
            console.error('AI Pantry Recipes Error:', error);
            throw new Error('No pudimos generar recetas para tu despensa');
        }
    }
};
