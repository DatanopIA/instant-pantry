# 🎯 PLAN DE MEJORA: INSTANT PANTRY VANGUARD (NIVEL REVISTA)

## 1. 🚨 REPORTE DE ERRORES (AUDITORÍA CIEGA + FEEDBACK)

### 🔴 CRÍTICOS (Funcionalidad)

- [ ] **IA Chef Offline**: El backend falla al conectar con Gemini 2.0. Mensaje de error genérico en UI.
- [ ] **Escáner Ciego**: La visión artificial (tickets/alimentos) no procesa imágenes por fallo en el motor de IA.
- [ ] **Desconexión Stripe/Auth**: El usuario paga pero el Tier Pro no se actualiza automáticamente (Falta Webhook).
- [ ] **Monolito Técnico**: `App.jsx` (+2000 líneas) es inmanejable y propenso a errores colaterales.

### 🟡 ESTÉTICOS (Premium Branding)

- [ ] **Diseño Plano**: Falta el estilo "Liquid Glass" y profundidad táctil.
- [ ] **Carrusel Básico**: La navegación de sugerencias no es fluida ni parece de "revista".
- [ ] **Imágenes Rofas**: Uso de placeholders feos si falla la imagen de la receta.
- [ ] **Tipografía de Sistema**: La marca no se siente premium (Fallo en carga de fuentes Outfit).

---

## 2. 🛠️ SOLUCIONES Y MEJORAS

- **Resurrección del Motor IA**: Configurar Gemini 2.0 Flash con fallbacks automáticos.
- **Micro-Arquitectura**: Refactorizar en componentes: `HomeView`, `RecipeDetail`, `ScannerView`, `ProfileView`.
- **Estética Vanguardia**: Implementar Framer Motion para animaciones y CSS para Liquid Glass.
- **Stripe Live**: Activación de la pasarela real con sincronización de Supabase.

---

## 3. 📋 PLAN DE TRABAJO (ASIGNACIÓN SKILLS)

| Skill | Tarea Principal | Estado |
| :--- | :--- | :--- |
| **Integrity Auditor** | Escaneo de errores, Refactorización del Monolito y Test de 0 errores. | 🔄 En progreso |
| **UX Orchestrator** | Diseño de UI "Revista", Animaciones Carrusel y Tipografía. | 🔄 En progreso |
| **Stability Architect** | Integración Stripe, Webhooks y Estabilidad de la IA. | ✅ Corregido (Backend) |
| **Execution Deployer** | Implementación del código y Despliegue en Vercel. | ⏳ Pendiente |

---

## 4. 🚀 CRONOGRAMA DE EJECUCIÓN

1. **Fase 1**: Refactorización y Estabilización de la IA (Resucitar el Escáner).
2. **Fase 2**: Rediseño Visual "Liquid Glass" y Carrusel.
3. **Fase 3**: Integración de Stripe y Webhooks.
4. **Fase 4**: Auditoría final y limpieza de código.
5. **Fase 5**: Despliegue y lanzamiento.

**EJECUCIÓN INICIADA.**
