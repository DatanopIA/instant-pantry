import Stripe from 'stripe';
import { supabaseAdmin } from '../../../../src/utils/supabase.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Mapeo de IDs de Precio de Stripe a niveles de Supabase
const PRICE_TO_TIER = {
    'price_1T6qllAj0eTKFibn3PwvicWE': 'pro', // Instant Pantry Plus (4,99 €)
    'price_1T6qmcAj0eTKFibnTmaoXg8l': 'pro_plus', // Instant Chef Elite (9,99 €)
    // Testing prices (optional, keeping for fallback testing if needed but maybe better to replace)
    'price_1T5T70PHmuhIo9pAd49ZsFrQ': 'pro',
    'price_1T5T7jPHmuhIo9pARIWkf2nJ': 'pro_plus'
};

export const config = {
    api: {
        bodyParser: false, // Necesario para verificar la firma de Stripe
    },
};

async function getRawBody(readable) {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Método no permitido');
    }

    const sig = req.headers['stripe-signature'];
    const rawBody = await getRawBody(req);

    let event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
        console.error(`❌ Error de firma de Webhook: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Manejo de eventos
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const householdId = session.client_reference_id;

                // Si no hay householdId en client_reference_id, buscamos en metadata
                const targetId = householdId || session.metadata?.householdId;

                if (!targetId) {
                    console.error('⚠️ No se encontró householdId en la sesión de Stripe');
                    break;
                }

                // Obtener el ID del precio del item comprado
                const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
                const priceId = lineItems.data[0]?.price?.id;
                const tier = PRICE_TO_TIER[priceId] || 'free';

                console.log(`✅ Pago completado para Hogar ${targetId}. Nivel: ${tier}`);

                // Actualizar Supabase
                const { error } = await supabaseAdmin
                    .from('households')
                    .update({
                        subscription_tier: tier,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', targetId);

                if (error) throw error;
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const householdId = subscription.metadata?.householdId;

                if (householdId) {
                    console.log(`📉 Suscripción cancelada para el hogar ${householdId}`);
                    await supabaseAdmin
                        .from('households')
                        .update({ subscription_tier: 'free' })
                        .eq('id', householdId);
                }
                break;
            }

            default:
                console.log(`ℹ️ Evento no manejado: ${event.type}`);
        }

        res.json({ received: true });
    } catch (err) {
        console.error(`❌ Error procesando evento de Stripe: ${err.message}`);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
