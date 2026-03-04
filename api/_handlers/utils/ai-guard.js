import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Guardrail System (v2026)
 * Proporciona resiliencia, validación y reintentos para las llamadas a la IA.
 */
export class AIGuard {
    constructor(apiKey, config = {}) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.config = {
            maxRetries: 3,
            initialDelay: 1000,
            model: "gemini-2.5-flash",
            ...config
        };
    }

    /**
     * Ejecuta una llamada a la IA con guardrails de seguridad y reintentos.
     */
    async call(options) {
        let lastError;
        for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
            try {
                const model = this.genAI.getGenerativeModel({
                    model: options.model || this.config.model,
                    systemInstruction: options.systemInstruction
                });

                const result = await model.generateContent(options.prompt || options.messages);
                const response = await result.response;
                const text = response.text();

                // 1. VALIDACIÓN: ¿Es el formato esperado?
                if (options.format === 'json') {
                    return this._ensureJson(text);
                }

                return text;

            } catch (error) {
                lastError = error;
                console.warn(`[Guardrail] Intento ${attempt} fallido: ${error.message}`);

                // Si es un error de seguridad o cuota, quizás no valga la pena reintentar inmediatamente
                if (error.message.includes('429')) {
                    await new Promise(r => setTimeout(r, this.config.initialDelay * attempt * 2));
                } else {
                    await new Promise(r => setTimeout(r, this.config.initialDelay));
                }
            }
        }
        throw new Error(`Guardrail falló tras ${this.config.maxRetries} intentos: ${lastError.message}`);
    }

    /**
     * Intenta extraer y limpiar JSON del texto, incluso si la IA devuelve markdown o texto extra.
     */
    _ensureJson(text) {
        try {
            // Eliminar bloques de código markdown si existen
            const cleaned = text.replace(/```json|```/g, '').trim();
            const start = cleaned.indexOf('{');
            const end = cleaned.lastIndexOf('}');

            if (start === -1 || end === -1) {
                throw new Error("No se encontró estructura JSON en la respuesta");
            }

            const jsonStr = cleaned.substring(start, end + 1);
            return JSON.parse(jsonStr);
        } catch (e) {
            console.error("[Guardrail] Error parseando JSON:", text);
            throw new Error(`Error de formato en la respuesta de IA: ${e.message}`);
        }
    }
}
