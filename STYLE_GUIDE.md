# 🎨 GUÍA DE ESTILO DEFINITIVA (V2): Instant Pantry & DatanopIA

Este documento es el estándar visual mandatorio para el desarrollo. Implementar usando variables CSS o Tailwind config para permitir el cambio de modo.

## 1. Identidad de Marca & Logotipo

* **Logotipo**: Un icono minimalista que combina una hoja orgánica (Verde Sage) con un marco de escaneado digital (Charcoal).
* **Concepto**: Equilibrio perfecto entre naturaleza y tecnología IA.

## 2. Modos de Interfaz

### 🌞 MODO CLARO (Default / Organic Pro)

* **Fondo Principal**: `#F5F5DC` (Soft Cream)
* **Texto Principal**: `#2F3E46` (Charcoal) - Legibilidad máxima.
* **Acentos y Botones de Acción (CTA)**: `#84A98C` (Sage Green) - *Estilo orgánico y profesional.*
* **Alertas/Highlights**: `#BC6C25` (Terrakotta Suave) - *Uso muy puntual para advertencias.*

### 🌑 MODO OSCURO (Exclusivo PRO / Smart Pantry)

* **Fondo Principal**: `#1A1D1E` (Ebony Charcoal)
* **Tarjetas/Superficies**: `#2F3E46` con transparencia (Glassmorphism).
* **Texto Principal**: `#F5F5DC` (Soft Cream)
* **Acentos de Marca**: `#B2D8B7` (Neon Sage - vibrante para visualización de datos).
* **Acciones Críticas (CTA)**: `#D88C51` (Terrakotta Vibrante) - *Para resaltar sobre el negro.*

## 2. Tipografía y Jerarquía

* **Fuente**: `Outfit` (Headings) e `Inter` (Body).

* **Escala**: Títulos en 24px-32px, Cuerpo en 16px-18px.
* **Peso**: Bold para Headings, Regular para contenido.

## 3. Lógica de Componentes (Agénticos 2026)

* **Botones de Acción**: En modo claro son **Sage Green**. En modo oscuro (Pro) son **Terrakotta**. Deben tener un ligero "glow" en modo oscuro.

* **Glassmorphism**: `backdrop-filter: blur(16px)` + borde sutil de 1px.
* **Bento Grids**: Esquinas redondeadas de `24px`. Espaciado (gap) consistente de `16px`.

## 4. Implementación Técnica

* El Modo Oscuro debe estar deshabilitado por defecto.

* Solo se activa si el flag `user_tier === 'pro'` es verdadero en el perfil de Supabase.
* En el perfil de usuario (Plan Free), mostrar el switch de Dark Mode pero deshabilitado con un mensaje: *"Función exclusiva para usuarios Smart Pantry"*.

---
*Aprobado por DatanopIA - 17 de Febrero de 2026*
