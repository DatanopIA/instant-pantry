# 📄 ESTRUCTURA TÉCNICA: AUTH & PAGOS (DatanopIA)

Este documento define la arquitectura necesaria para implementar el sistema de usuarios y monetización en Instant Pantry.

## 🔑 1. Sistema de Autenticación (Supabase Auth)

Para gestionar los niveles de precios, necesitamos identificar a cada usuario. Implementaremos una **Landing Page de bienvenida** con dos flujos:

1. **Login/Registro**: Ventana modal con diseño glassmorphism.
2. **Social Auth**: Botón "Continuar con Google" (altamente recomendado para reducir fricción).
3. **Persistencia**: El usuario no tendrá que loguearse cada vez; la sesión quedará guardada en el navegador.

## 💳 2. Integración de Pagos (Stripe Billing)

### Ubicación en la UI

Como bien sugeriste, la **Página de Perfil** es el lugar ideal para gestionar la suscripción:

- **Sección "Mi Plan"**: Muestra el nivel actual (Free, Smart o Family).
- **Botón "Mejorar Plan"**: Abre el **Stripe Checkout** (la pasarela segura de Stripe).
- **Portal de Cliente**: Botón para que el usuario pueda cancelar o cambiar su tarjeta sin que nosotros tengamos que programar nada (usando el portal pre-configurado de Stripe).

### Configuración del Dashboard (Pendiente)

Debemos crear los 3 productos en el dashboard de Stripe y obtener los `Price IDs`:

- `price_smart_monthly`: 4.99€
- `price_family_monthly`: 9.99€

## 🛠️ 3. Modificaciones en el Código (Para el Agente Técnico)

El equipo de ejecución deberá seguir estos pasos:

1. **Ruta Protegida**: Crear una página de `Landing` que sea lo primero que ve el usuario si no está logueado.
2. **Middleware de Supabase**: Asegurar que los datos de la despensa solo sean accesibles para el usuario dueño de la cuenta.
3. **Webhook de Stripe**: Configurar un "puente" que avise a la base de datos cuando alguien pague, para desbloquear las funciones premium de inmediato.

---
*Preparado por el Asistente de Crecimiento & Estrategia - 17 de Feb de 2026*
