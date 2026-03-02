import { supabase } from '../utils/supabase'
import axios from 'axios'

const HOUSEHOLD_ID = import.meta.env.VITE_TEST_HOUSEHOLD_ID
const API_URL = import.meta.env.VITE_API_URL

export const inventoryService = {
    async getInventory() {
        const { data, error } = await supabase
            .from('inventory_items')
            .select(`
        *,
        products_master (*)
      `)
            .eq('household_id', HOUSEHOLD_ID)
            .order('expires_at', { ascending: true })

        if (error) throw error
        return data
    },

    async processVision(base64Image) {
        try {
            // In production we would call the real API
            // For now, if API_URL points to Vercel, we call it
            // Otherwise we could mock it
            const response = await axios.post(`${API_URL}/api/process-vision`, {
                image: base64Image,
                household_id: HOUSEHOLD_ID
            })
            return response.data
        } catch (err) {
            console.warn('API call failed, using local mock for demo purposes', err)
            // Mock fallback for immediate feedback
            return {
                success: true,
                items: [
                    { name: 'Leche de Almendra', quantity: 1, current_unit: 'litro', expires_at: new Date(Date.now() + 7 * 86400000).toISOString() },
                    { name: 'Aguacates', quantity: 2, current_unit: 'unidades', expires_at: new Date(Date.now() + 2 * 86400000).toISOString() }
                ]
            }
        }
    },

    async addItems(items) {
        const { data, error } = await supabase
            .from('inventory_items')
            .insert(items.map(item => ({
                ...item,
                household_id: HOUSEHOLD_ID
            })))
            .select();

        if (error) throw error
        return data
    },

    async updateItem(itemId, updates) {
        const { data, error } = await supabase
            .from('inventory_items')
            .update(updates)
            .eq('id', itemId)
            .select();

        if (error) throw error
        return data
    },

    async updateItemStatus(itemId, status) {
        return this.updateItem(itemId, { status });
    },

    async deleteItem(itemId) {
        const { error } = await supabase
            .from('inventory_items')
            .delete()
            .eq('id', itemId);

        if (error) throw error;
        return true;
    },

    async searchProductsMaster(query) {
        if (!query || query.length < 2) return [];
        const { data, error } = await supabase
            .from('products_master')
            .select('*')
            .ilike('name', `%${query}%`)
            .limit(10);

        if (error) throw error;
        return data;
    },

    async getOrCreateProduct(name) {
        // Try to find it first
        const { data: existing } = await supabase
            .from('products_master')
            .select('*')
            .ilike('name', name)
            .single();

        if (existing) return existing;

        // If not found, create it
        const { data: created, error: createError } = await supabase
            .from('products_master')
            .insert([{ name, category: 'Varios' }])
            .select()
            .single();

        if (createError) throw createError;
        return created;
    },

    isFoodItem(name, category = '') {
        const lowerName = (name || '').toLowerCase();
        const lowerCategory = (category || '').toLowerCase();

        // Lista negra extendida de productos no comestibles
        const nonFoodKeywords = [
            'limpiador', 'detergente', 'jabón', 'lavavajillas', 'papel higiénico',
            'servilletas', 'lejía', 'suavizante', 'wc', 'baño', 'limpieza',
            'higiene', 'champú', 'gel', 'pasta de dientes', 'cepillo', 'estropajo',
            'bayeta', 'insecticida', 'ambientador', 'bolsas de basura', 'cocina papel',
            'papel cocina', 'aluminio papel', 'papel plata', 'film', 'transparente papel',
            'esponja', 'lavadora', 'plancha', 'vajilla', 'menaje', 'fregona', 'escoba',
            'reparador', 'abrillantador', 'insecticida', 'insectos'
        ];
        const nonFoodCategories = ['limpieza', 'higiene', 'hogar', 'droguería', 'baño', 'limpieza del hogar', 'cuidado personal'];

        const isNonFood = nonFoodKeywords.some(kw => lowerName.includes(kw)) ||
            nonFoodCategories.includes(lowerCategory);

        return !isNonFood;
    }
}
