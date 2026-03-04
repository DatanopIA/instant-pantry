import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Importar handlers
import chatHandler from './_handlers/ai/chat.js';
import visionHandler from './_handlers/process-vision.js';
import nutritionHandler from './_handlers/ai/nutrition.js';
import familyMenuHandler from './_handlers/ai/family-menu.js';
import pantryRecipesHandler from './_handlers/ai/pantry-recipes.js';
import recommendedRecipesHandler from './_handlers/recipes/recommended.js';
import stripeHandler from './_handlers/webhooks/stripe.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Webhook de Stripe: Necesita el cuerpo en RAW para la firma
// Lo ponemos ANTES de express.json()
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeHandler);

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url} from ${req.headers.origin || 'unknown'}`);
    next();
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.json({ limit: '50mb' })); // Aumentar límite para imágenes

// Rutas
app.get('/api', (req, res) => {
    res.json({ message: "Instant Pantry API is running." });
});

app.post('/api/ai/chat', (req, res, next) => {
    console.log('[API] Procesando chat body:', JSON.stringify(req.body).substring(0, 50));
    next();
}, chatHandler);
app.post('/api/process-vision', visionHandler);

app.post('/api/ai/nutrition', nutritionHandler);
app.post('/api/ai/family-menu', familyMenuHandler);
app.post('/api/ai/pantry-recipes', pantryRecipesHandler);
app.get('/api/recipes/recommended', recommendedRecipesHandler);

// Iniciar servidor solo si no estamos en Vercel (opcional, Vercel ignora el listen)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
    });
}

export default app;

