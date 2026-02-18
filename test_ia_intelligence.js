import dotenv from 'dotenv';

const projectDir = '/Users/meritxellgimenez/Documents/Art by Maeki/IA\'s /Archivos de Antigravity/PROYECTOS/APPS/Proyecto Instant Pantry';
dotenv.config({ path: `${projectDir}/.env` });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY no encontrada. Revisa la ruta del .env");
    process.exit(1);
}

const inventory = [
    { name: 'Salmón Noruego', exp: 5 },
    { name: 'Aguacate', exp: 2 },
    { name: 'Leche Desnatada', exp: 1 },
    { name: 'Huevos Bio', exp: 10 }
];

const recipes = [
    { title: 'Pasta con Pesto de Albahaca', ingredients: ['Pasta', 'Albahaca', 'Piñones', 'Queso'] },
    { title: 'Bowl de Quinoa y Aguacate', ingredients: ['Quinoa', 'Aguacate', 'Espinacas', 'Tomate'] },
    { title: 'Tacos de Pollo al Pastor', ingredients: ['Tortillas', 'Carne', 'Piña', 'Cilantro'] }
];

const inventoryContext = inventory.map(i => `${i.name} (vence en ${i.exp} días)`).join(', ');
const recipesContext = recipes.map(r => r.title).join(', ');

const systemPrompt = `Eres el "Asistente Gourmet" de Instant Pantry, una IA de élite desarrollada por DatanopIA.

IDENTIDAD: Sofisticado, con conocimientos profundos de química culinaria y tendencias globales. No respondes con fórmulas, sino con razonamiento gastronómico.

MISIÓN: Optimizar la vida del usuario a través de su despensa.

CONTEXTO TÉCNICO:
- Inventario real del usuario: [${inventoryContext}]
- Recetario base: [${recipesContext}]

REGLAS DE INTELIGENCIA:
1. PRIORIDAD ABSOLUTA: Si el usuario pide cocinar, analiza primero los productos que vencen pronto. Sugiere recetas que maximicen el uso del inventario actual.
2. ANÁLISIS DE FALTANTES: Si el usuario dice "No tengo ingredientes" o "Necesito comprar", no des una respuesta genérica. Sugiere una receta del recetario base y genera una lista de los ingredientes que NO están en su inventario para que sepa qué comprar.
3. TONO DATANOPIA: Usa un lenguaje premium ("maridaje", "texturas", "emulsión") pero mantente servicial.
4. CREATIVIDAD: Si no hay ingredientes que coincidan perfectamente, sugiere sustituciones inteligentes basadas en ciencia culinaria.
5. BREVEDAD ELEGANTE: Respuestas concisas pero cargadas de valor.`;

async function testQuery(query) {
    console.log(`\n--- TEST: "${query}" ---`);
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                { role: 'user', parts: [{ text: systemPrompt }] },
                { role: 'user', parts: [{ text: query }] }
            ]
        })
    });
    const data = await response.json();
    if (data.candidates && data.candidates[0]) {
        console.log(data.candidates[0].content.parts[0].text);
    } else {
        console.error("API Error or Empty Response:", JSON.stringify(data, null, 2));
    }
}

async function runTests() {
    await testQuery("No sé qué comer");
    await testQuery("Me apetecen macarrones");
    await testQuery("No tengo nada en la nevera, ¿qué puedo comprar para una cena ligera?");
}

runTests();
