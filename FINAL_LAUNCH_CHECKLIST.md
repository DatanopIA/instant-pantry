# 🏁 PROTOCOLO DE LANZAMIENTO FINAL: GO-LIVE CHECKLIST

**Fecha**: 17 de Febrero de 2026
**De**: @Asistente de Crecimiento (Cerebro Estratégico)
**Para**: Equipo de Ejecución, Auditor e Ingeniero de Estabilidad

Este protocolo se activa en el momento en que el usuario da el **OK FINAL** a la interfaz. A partir de ese momento, el equipo tiene prohibido detenerse hasta que los 5 pilares de funcionalidad estén verificados o implementados.

---

## 🏗️ PILAR 1: Autenticación y Perfiles (Supabase)

- [ ] **Onboarding Inicial**: ¿Es lo primero que ve un usuario nuevo?
- [ ] **Social Login**: ¿Funciona el botón "Continuar con Google"?
- [ ] **Tier de Usuario**: ¿Se registra correctamente el `user_tier` (free/pro) al crear la cuenta?
- [ ] **Persistencia**: ¿La sesión se mantiene iniciada al recargar?

## 💸 PILAR 2: Monetización y Niveles de Valor (DatanopIA Tier System)

- [x] **Checkout Bridge**: ¿El botón "Mejorar Plan" abre la pasarela de Stripe? (Simulación funcional integrada)
- [x] **Lógica de Desbloqueo**: ¿Al recibir la señal de pago, la app cambia automáticamente al **Modo Oscuro Pro**?
- [x] **Verificación de Límites (Business Logic)**:
  - [x] **Plan Free**: ¿Se bloquea la adición de alimentos después del item nº 15? ¿Aparece el CTA para suscribirse?
  - [x] **Plan Smart (PRO)**: ¿Permite añadir alimentos ilimitados y generar recetas ilimitadas?
  - [x] **Alertas Inteligentes**: ¿Están activadas las notificaciones de caducidad solo para usuarios PRO?
- [x] **Gestión de Suscripción**: ¿Desde el perfil se puede acceder al Portal de Cliente de Stripe? (Simulación funcional)

## 🍲 PILAR 3: Motor de Recetas y Escaneo Inteligente (Computer Vision)

- [x] **Escaneo de Tickets (OCR)**: ¿Es capaz la app de extraer alimentos de una foto de un ticket de supermercado real? (Implementado con Gemini Vision)
- [x] **Reconocimiento de Nevera (Visual)**: ¿Puede el usuario hacer una foto al interior de la nevera y que el sistema identifique al menos 3-5 productos clave? (Implementado con Gemini Vision)
- [x] **Filtro de Despensa**: ¿Las recetas recomendadas usan los ingredientes reales del inventario?
- [x] **Avisos de Faltantes**: ¿Aparece el badge de "Missing Ingredient" si falta algo?
- [x] **Sustitución IA**: ¿El chat responde correctamente a "Cámbiamelo por X"?
- [x] **Imágenes Estables**: ¿Están todos los assets generados por Nano Banana/Image Gen?

## 🎨 PILAR 4: Fidelidad Visual (DatanopIA Standard)

- [ ] **Modo Claro (Organic)**: Fondos Soft Cream + Botones **Sage Green**.
- [ ] **Modo Oscuro (Pro)**: Fondos Ebony Charcoal + Botones **Terrakotta con Glow**.
- [ ] **Responsive check**: ¿Bento Grid dinámico funcionando en iPad y Contenedor centrado en móvil?

## 🚀 PILAR 5: Infraestructura de Producción

- [ ] **Repo GitHub**: ¿Sincronizado con la organización `DatanopIA`?
- [ ] **Deployment Vercel**: ¿URL de producción activa y sin errores de consola?
- [ ] **GEO Tags**: ¿Están los metadatos SEO/GEO inyectados para ser recomendados por IAs?

---

## 🚨 ORDEN FINAL DE INTEGRACIÓN

Si durante la revisión de este protocolo se detecta que alguna funcionalidad (ej. el sistema de pagos o el login) no está integrada, **EL EQUIPO DE EJECUCIÓN TIENE ORDEN DE PROCEDER A LA INTEGRACIÓN INMEDIATA** siguiendo los archivos `AUTH_PAYMENTS_ARCH.md` y `DEPLOYMENT_GUIDE.md` antes de reportar el fin de la misión.

**NO SE ACEPTA UNA APP QUE SOLO SEA "UI". Debe ser un Producto Monetizable.**

---
*Firma: El Asistente de Crecimiento*
