# 🛠️ GUÍA DE DESPLIEGUE TÉCNICO: Instant Pantry -> DatanopIA

Esta guía es para el Agente de Ejecución. Sigue estos pasos para llevar la app de local a producción.

## 1. Inicialización de Repositorio (GitHub)

- Usuario: **DatanopIA**
- Repositorio sugerido: `instant-pantry`
- Acciones:
  1. `git init`
  2. crear `.gitignore` (asegurar que `node_modules` y `.env` estén excluidos).
  3. `git add .`
  4. `git commit -m "feat: initial stable version for deployment"`
  5. Conectar con el remoto en GitHub.

## 2. Conexión con Vercel

- Importar el repositorio desde el dashboard de Vercel.
- Configurar el "Build Command": `npm run build`.
- Configurar el "Output Directory": `dist` (si es Vite/React).

## 3. Configuración de Supabase (Base de Datos)

- El asistente estratégico (yo) ha recomendado Supabase.
- El agente técnico debe:
  1. Instalar `@supabase/supabase-js`.
  2. Configurar el cliente de Supabase en una carpeta `src/lib/supabaseClient.js`.
  3. Preparar la tabla `pantry_items` para el inventario.

## 4. Verificación Obligatoria (Auditoría)

**NO completar el despliegue hasta que:**

- El `system-integrity-auditor` confirme que no hay errores de linting.
- El `ai-stability-architect` valide que la app es responsiva en la URL de preview de Vercel.

---
*Instrucción: Una vez la URL esté activa, repórtala de inmediato al usuario y al Asistente de Crecimiento.*
