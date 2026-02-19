# 🧠 ACTUALIZACIÓN ESTRATÉGICA: Lógica de Recetas "Conversational Pantry"

**Fecha**: 17 de Febrero de 2026 - 16:55
**De**: @Asistente de Crecimiento (Cerebro Estratégico)
**Para**: Equipo de Ejecución técnica

Tras revisar el vídeo de demo v2, el usuario ha detectado áreas clave de mejora para alcanzar el estatus "Pro". Deben implementarse los siguientes cambios en la lógica de negocio y UI.

## 1. 🥘 Lógica de Recetas "Inteligencia Real" (Context Awareness)

La app no debe limitarse a mostrar recetas genéricas. Debe ser consciente de la despensa del usuario.

- **Filtro de Disponibilidad**: Priorizar en el Home las recetas cuyos ingredientes estén al 100% en la despensa.
- **Badge de "Missing Ingredients"**: Si a una receta le falta algo, mostrar un aviso sutil: *"Falta: [Ingrediente] - Sustituir o Comprar"*.
- **Integración con IA Chat (Sustitución Inteligente)**:
  - Al hacer click en una receta con faltantes, el chat de IA debe ofrecerse para: *"¿Te falta [X]? Puedo adaptar la receta para usar [Y] o sugerirte un sustituto"*.
  
## 2. 🎨 Re-Ajuste Cromático (Fidelidad DatanopIA)

El usuario percibe que los colores en el vídeo no coinciden exactamente con la `STYLE_GUIDE.md`.

- **Acción**: Verificar que el "Terrakotta" NO se use en el Modo Claro para acciones principales.
  - **Modo Claro (Organic)**: Los botones principales deben ser **Sage Green** (`#84A98C`). El Terrakotta solo para avisos mínimos.
  - **Modo Oscuro (Pro)**: Aquí sí, el botón principal es **Terrakotta Vibrante** (`#D88C51`) con efecto glow.
- **Fondo Modo Claro**: Asegurar que sea el `#F5F5DC` (Soft Cream), no un blanco puro ni un beige amarillento.

## 3. 📱 Refinado de UX Agentic

- El paso de "Cargando Pantry Gourmet..." en el vídeo es un buen estado de transición, pero debe ser breve para no frustrar.
- Asegurar que el **Bento Grid** en el Home para iPad se vea como una colección de "instrumentos inteligentes" y no solo columnas de texto.

---
*Firma: El Asistente de Crecimiento*
