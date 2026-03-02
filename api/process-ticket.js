import { processReceiptImage } from '../src/services/ai_service.js';
import { InventoryService } from '../src/services/inventory_service.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { image, householdId } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'Imagen base64 requerida' });
        }

        // 1. Procesar la imagen con Gemini
        // Limpiamos el prefijo base64 si existe
        const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, "");
        const aiResult = await processReceiptImage(cleanBase64);

        // 2. Guardar en inventario (Usar Household de prueba si no viene uno)
        const targetHousehold = householdId || process.env.TEST_HOUSEHOLD_ID;

        let inventoryResults = [];
        if (targetHousehold && aiResult.items) {
            inventoryResults = await InventoryService.addScannedItemsToInventory(
                targetHousehold,
                aiResult.items
            );
        }

        return res.status(200).json({
            success: true,
            data: aiResult,
            inventory: inventoryResults
        });
    } catch (error) {
        console.error('Error en process-ticket:', error);
        return res.status(500).json({
            error: 'Error interno procesando el ticket',
            details: error.message
        });
    }
}
