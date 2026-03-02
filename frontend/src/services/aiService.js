import axios from 'axios';
import { inventoryService } from './inventoryService';
import { supabase } from '../utils/supabase';

const API_URL = import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : (import.meta.env.PROD ? '' : 'http://localhost:3000');

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
    }
};
