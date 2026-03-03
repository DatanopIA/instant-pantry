import { supabase } from './utils/supabase.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

/**
 * Escáner de Nevera/Despensa con Gemini Vision
 */
import { AIGuard } from './utils/ai-guard.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { image, household_id } = req.body;
        if (!image || !household_id) return res.status(400).json({ error: 'Faltan campos (imagen o household_id)' });
        if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY no configurada');

        const guard = new AIGuard(process.env.GEMINI_API_KEY);
        console.log(`[Vision IA] Escaneando con Guardrails...`);

        const prompt = `Analiza esta imagen (nevera, cocina o ticket de compra) y devuelve un JSON con:
        - name: Nombre claro del producto en español.
        - quantity: Cantidad estimada (número).
        - unit: Unidad (unidades, litros, kg, etc.).
        - expires_in_days: Días estimados para caducar de media para este tipo de producto.
        - is_food: Boolean indicando si es estrictamente un alimento o bebida.

        REGLA CRÍTICA: Debes ignorar o marcar como is_food: false cualquier producto de limpieza, droguería, higiene personal o hogar (lejía, detergente, limpiadores, papel wc, champú, etc.).
        Solo queremos llenar una despensa de ingredientes comestibles.
        
        Formato: { "items": [ { "name": "...", "quantity": 1, "unit": "...", "expires_in_days": 5, "is_food": true } ] }`;

        let mimeType = "image/jpeg";
        let base64Data = image;

        const match = image.match(/^data:(.*?);base64,(.*)$/);
        if (match) {
            mimeType = match[1];
            base64Data = match[2];
        } else if (image.includes(',')) {
            base64Data = image.split(',')[1];
        }

        const visionData = await guard.call({
            prompt: [
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType
                    }
                }
            ],
            format: 'json',
            model: "gemini-2.5-flash"
        });

        let visionItems = visionData.items || (Array.isArray(visionData) ? visionData : []);
        if (!Array.isArray(visionItems) && visionData.items === undefined) {
            // Sometimes the AI just returns the item object itself
            if (visionData.name) {
                visionItems = [visionData];
            } else {
                visionItems = [];
            }
        }

        const processedItems = visionItems
            .filter(item => item.is_food === true || item.is_food === 'true' || String(item.is_food).toLowerCase() === 'true') // Filtro de seguridad por IA
            .map(item => {
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + (item.expires_in_days || 7));
                return {
                    household_id,
                    name: item.name,
                    quantity: item.quantity || 1,
                    current_unit: item.unit || 'uds',
                    expires_at: expiryDate.toISOString(),
                    status: 'active',
                    is_opened: false,
                    metadata: { source: 'vision_ia', confidence: 0.95 }
                };
            });

        return res.status(200).json({
            success: true,
            items: processedItems,
            message: `Detección completada: ${processedItems.length} ingredientes.`
        });

    } catch (error) {
        console.error('Vision API Error:', error);
        return res.status(500).json({ error: 'Error en el escáner inteligente', details: error.message });
    }
}
