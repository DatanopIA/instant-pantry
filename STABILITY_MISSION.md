# 🎯 ORDEN DE MISIÓN: Auditoría Final "Instant Pantry"

# 🔍 ESTADO: REVISIÓN DE LANZAMIENTO (CHECKLIST ACTIVO)

## ⚡ SEÑAL DE REINICIO ACTIVADA (17/02/2026 - 14:15) ⚡

**Estado**: RE-EJECUTANDO PRIORIDADES
**De**: @Asistente de Crecimiento
**Para**: Agente de Ejecución, Auditor e Ingeniero de Estabilidad  

**Fecha**: 17 de Febrero de 2026  
**De**: Cerebro Estratégico (Asistente de Crecimiento)  
**Para**: Agente de Ejecución, Auditor e Ingeniero de Estabilidad  

## 🚨 Objetivo Prioritario

Solucionar los fallos estructurales y visuales detectados. La aplicación debe ser **funcional, estable y premium**.
**BLOQUEO DE CALIDAD**: Se ha emitido una **`VISUAL_FIDELITY_AUDIT.md`**. Es de lectura y ejecución OBLIGATORIA. No se aceptan diseños planos ni imágenes rotas.

## 🛠️ Protocolo de Actuación (Mandatorio)

### 1. Diagnóstico de Estabilidad (System Integrity Auditor)

- Ejecutar un escaneo completo de los archivos en `src/`.
- Identificar por qué aparecieron/desaparecieron componentes ayer.
- Detectar errores de consola o fallos en el manejo de estados de React.

### 2. Blindaje de Layout (AI Stability Architect)

- Aplicar el nuevo estándar visual de **`STYLE_GUIDE.md`**: Implementar variables para Modo Claro y Modo Oscuro.
- **Lógica PRO**: El Modo Oscuro debe estar bloqueado por defecto. Solo accesible si el usuario tiene el tier 'pro' en Supabase.
- Asegurar que el **Bento Grid** y el **Liquid Glass** de Art by Maeki sean estables en desktop y mobile.
- Validar que el fondo `Soft Cream` y los colores de marca no se pierden al navegar.

### 3. Verificación de Funcionalidad y Activos

- **Escáner de Alimentos**: Debe ser 100% funcional.
- **Chat de IA y Recetas**: Manejar estados de "Loading" y "Error".
- **🚨 FIX CRÍTICO: Imágenes de Recetas**: Se ha detectado que algunas imágenes se quedan en bucle de carga o no se muestran.
  - **Instrucción**: Si una imagen de receta externa falla o tarda demasiado, el agente debe usar sus herramientas de generación de imágenes (Nano Banana / Image Gen) para crear un asset propio y estable para la app.
  - **No aceptar "placeholders" rotos o bucles infinitos.** La app debe sentirse terminada y pulida.
- Confirmar la persistencia de datos (si el usuario añade algo, no debe desaparecer).

## 🛡️ Regla de Oro

**NO entregar esta tarea al usuario hasta que el `system-integrity-auditor` haya verificado que el código compila y cada botón clave ha sido probado manualmente.**

---

## 📚 Documentación Estratégica Adicional (MANDATORIO LEER)

Para esta fase de lanzamiento, el equipo debe integrar las directrices de los siguientes archivos recién creados:

1. **`DEPLOYMENT_GUIDE.md`**: Instrucciones para subir a GitHub (`DatanopIA`) y desplegar en Vercel.
2. **`AUTH_PAYMENTS_ARCH.md`**: Arquitectura del Onboarding, Supabase Auth y la integración de Stripe.

## 🧠 Lógica Estratégica V2 (NUEVO)

Se ha emitido la **`STRATEGIC_LOGIC_UPDATE.md`**. El equipo debe evolucionar el motor de recetas:

1. **Contexto de Despensa**: Las recetas deben avisar qué falta.
2. **Sustitución IA**: El chat debe permitir pedir cambios de ingredientes.
3. **Color-Match Final**: Ajustar los HEX exactos del Terrakotta y Soft Cream.

---
*Orden de Misión Actualizada el 17 de Febrero de 2026 por el Asistente de Crecimiento.*
*Instrucción para el Agente local: Lee los nuevos skills en `.agent/skills/` (Auditor, Stability Architect) y ejecútalos inmediatamente.*
