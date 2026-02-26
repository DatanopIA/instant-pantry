# 🚂 Guía de Despliegue en Railway - Instant Pantry Pro

La aplicación ha sido preparada para funcionar como un servidor unificado en Railway.

## 1. Configuración de Variables de Entorno

Debes añadir las siguientes variables en el panel de Railway (Dashboard > Settings > Variables):

| Variable | Descripción |
|----------|-------------|
| `PORT` | 3001 (Railway lo asignará automáticamente, pero puedes forzarlo) |
| `SUPABASE_URL` | URL de tu proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Key de servicio para bypass de RLS en webhooks |
| `SUPABASE_ANON_KEY` | Key anónima de Supabase |
| `GEMINI_API_KEY` | Tu clave de Google AI |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe |
| `STRIPE_PRICE_ID` | ID del precio de la suscripción Pro |
| `STRIPE_WEBHOOK_SECRET` | Secreto del webhook de Stripe (opcional pero recomendado) |

## 2. Comandos de Despliegue

Railway detectará automáticamente el `package.json` y ejecutará:

- **Build**: `npm run build` (genera la carpeta `dist/`)
- **Start**: `npm run start` (ejecuta `node api/index.js`)

## 3. Ventajas de esta configuración

- Solo necesitas un servicio en Railway para todo el proyecto.
- Los archivos estáticos del frontend se sirven directamente desde Node.js.
- Compatible con el enrutamiento de React (SPA).
