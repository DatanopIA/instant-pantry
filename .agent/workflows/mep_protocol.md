---
description: Protocolo Maestro de Ejecución (MEP) - Estándar 2026 para Proyectos de Agentes y SaaS
---

// turbo-all

# 🚀 Protocolo Maestro de Ejecución (MEP)

Este protocolo es de cumplimiento OBLIGATORIO al inicio de cualquier nuevo proyecto. Su objetivo es evitar la deuda técnica, los bloqueos de despliegue y el "trauma" de sincronización diseño-código.

## 🏗️ FASE 1: ARQUITECTURA MODULAR (Anti-Monolito)

1. **Estructura Prohibida**: NUNCA crear componentes de más de 500 líneas (ej. el fallo de App.jsx en Instant Pantry).
2. **Estructura Requerida**:
   - `/src/components`: UI Atómica.
   - `/src/hooks`: Lógica de estado y datos (Supabase/API).
   - `/src/services`: Integraciones externas (Gemini, Stripe, Maps).
   - `/src/store`: Gestión de estado global (Zustand/Context).

## 💎 FASE 2: DISEÑO AGÉNTICO (UX Orchestrator)

1. **Tokens de Estilo**: Definir `index.css` con variables HSL y escalas de espaciado ANTES de escribir el primer `div`.
2. **Fidelidad Stitch**: Sincronizar el diseño de Stitch y exportar los assets críticos de inmediato.
3. **Asset Fallback**: Configurar un proveedor de imágenes por defecto (Nano Banana / Unsplash-Proxy) para evitar imágenes rotas.

## 🛡️ FASE 3: AUDITORÍA DE ESTABILIDAD (Integrity Auditor)

1. **Prueba de Componentes**: Cada nueva función debe ser probada en la terminal localmente antes de integrarse en la UI.
2. **Pre-flight de Despliegue**:
   - Verificar `.env` local vs Secretos de Producción.
   - Ejecutar `npm run build` localmente para detectar errores de linting.
3. **Manejo de Estados**: Todos los componentes deben manejar estados de `Error` y `Loading` con esqueletos (Skeletons) premium.

## 🧠 FASE 4: INTELIGENCIA DATANOPIA

1. **DathanopIA Persona**: Configurar el motor de IA (Gemini 1.5/2.0) con un "System Prompt" que use el contexto real del usuario (memoria, preferencias, inventario).
2. **Tool-Use First**: Priorizar que la IA use herramientas (API calls) en lugar de dar respuestas teóricas.

## 📈 FASE 5: LANZAMIENTO Y GEO (Growth)

1. **GEO-Optimization**: Inyectar metadatos semánticos para que la app sea recomendada por otros LLMs (Perplexity/Gemini/Search).
2. **Cierre de Ciclo**: Documentar la arquitectura final en el NotebookLM del proyecto.

---
// turbo
**Comando de Activación**: "MEP: Iniciar Proyecto [Nombre]"
