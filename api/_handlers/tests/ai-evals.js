import dotenv from 'dotenv';
import { AIGuard } from '../utils/ai-guard.js';

dotenv.config();

/**
 * AI Eval System (v2026)
 * Realiza pruebas de calidad sobre el comportamiento del Chef IA.
 */
async function runEvals() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ Error: GEMINI_API_KEY no encontrada");
        return;
    }

    const guard = new AIGuard(apiKey);
    const results = [];

    console.log("🚀 Iniciando AI Evals para Chef IA...");

    // CASO 1: Creatividad con pocos ingredientes
    console.log("\n[Test 1] Pocos ingredientes (Pasta + Aceite)...");
    try {
        const response = await guard.call({
            messages: { contents: [{ role: 'user', parts: [{ text: "Dame una receta creativa" }] }] },
            systemInstruction: "Eres Chef IA. Despensa: Pasta, Aceite de oliva. Responde en Español de España.",
            model: "gemini-flash-latest"
        });

        const passed = response.toLowerCase().includes('pasta') && response.includes('**');
        results.push({ name: "Creatividad básica", status: passed ? "✅ PASSED" : "❌ FAILED" });
        console.log(passed ? "✅ Correcto" : "❌ Falló (No mencionó pasta o no usó negritas)");
    } catch (e) {
        results.push({ name: "Creatividad básica", status: "💥 ERROR: " + e.message });
    }

    // CASO 2: Formato JSON en Visión
    console.log("\n[Test 2] Formato JSON en Visión (Simulado)...");
    try {
        const response = await guard.call({
            prompt: [{ text: "Analiza esta lista de compra imaginaria y devuelve JSON: Leche, Huevos, Pan." }],
            format: 'json',
            model: "gemini-flash-latest"
        });

        const passed = Array.isArray(response.items) && response.items.length > 0;
        results.push({ name: "Esquema JSON Visión", status: passed ? "✅ PASSED" : "❌ FAILED" });
        console.log(passed ? "✅ Correcto" : "❌ Falló (Estructura JSON inválida)");
    } catch (e) {
        results.push({ name: "Esquema JSON Visión", status: "💥 ERROR: " + e.message });
    }

    console.log("\n--- RESUMEN DE EVALS ---");
    console.table(results);
}

runEvals();
