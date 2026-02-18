import React, { useState, useEffect, useRef, useCallback } from 'react'
import './index.css'
import { supabase } from './lib/supabase'

const API_BASE = '/api'

const translations = {
  es: {
    inicio: 'INICIO', despensa: 'DESPENSA', recetas: 'RECETAS', iachef: 'IA CHEF',
    bienvenido: 'BIENVENIDO A', perfil: 'Perfil', dieta: 'Ajustes de Dieta', idioma: 'Idioma',
    logros: 'Logros', tema: 'Tema', cerrar_sesion: 'Cerrar Sesión', guardar: 'Guardar',
    volver: 'Volver', premium: 'Miembro Premium', racha: 'Racha', recetas_completadas: 'Recetas',
    sugerencia_dia: 'Sugerencia del Día', ver_todas: 'Ver todas', estado_despensa: 'Estado de Despensa',
    articulos: 'Artículos', por_comprar: 'Por comprar', buscar_recetas: 'Buscar recetas...',
    sin_recetas: 'No se encontraron recetas.', cargando: 'Cargando Pantry Gourmet...',
    ingredientes: 'Ingredientes', nutricion_inteligente: 'NutricIÓN Inteligente',
    despensa_status_msg: 'Tienes {count} productos cerca de caducar',
    vence_pronto: 'Vence pronto', lista_compra: 'Lista de Compra', inventario_title: 'Inventario',
    total: 'Total', vence: 'Vence', agotado: 'Agotado', buscar_alimentos: 'Buscar alimentos...',
    todo: 'Todo', no_articulos: 'No hay artículos en esta lista', ver_toda_despensa: 'Ver toda la despensa',
    recetario: 'Recetario', inspiracion: 'Inspiración Gourmet', recomendado: 'Recomendaciones para ti',
    ia_asistente: 'Asistente IA', chef_virtual: 'Chef Virtual', hoy: 'HOY',
    preguntar_ia: 'Pregunta sobre tu despensa...', pref_alimentarias: 'Preferencias Alimentarias',
    nuevo_producto: 'Nuevo Producto', nombre_producto: 'Nombre del Producto', fecha_vencimiento: 'Fecha de Caducidad',
    caduca_en: 'Caduca en {count} días', añadir: 'Añadir a la Despensa', guardando: 'Guardando...',
    footer_add: 'El producto se añadirá automáticamente a tu lista.', procesando: 'Procesando Ticket...',
    encuadra: 'Encuadra tu ticket',
    logro1_title: 'Chef Principiante', logro1_desc: 'Cocina tus primeras 5 recetas',
    logro2_title: 'Cero Desperdicio', logro2_desc: 'Usa 10 productos antes de caducar',
    logro3_title: 'Explorador Gourmet', logro3_desc: 'Prueba recetas de 3 países distintos',
    oscuro: 'Oscuro', claro: 'Claro',
    vegano: 'Vegano', sin_gluten: 'Sin Gluten', keto: 'Keto', sin_lactosa: 'Sin Lactosa',
    favoritos: 'Favoritos', favorito: 'Favorito', restablecer: 'Restablecer Sugerencias',
    exclusive_pro: 'Función exclusiva para usuarios Smart Pantry',
    cargando_pantry: 'Cargando Pantry Gourmet...',
    tienes_todo: 'Tienes todos los ingredientes',
    falta_uno: 'Falta 1 ingrediente',
    faltan_varios: 'Faltan {count} ingredientes',
    saludo_ia: '¡Hola! Soy tu Asistente de Instant Pantry, desarrollado por DatanopIA. ¿En qué puedo ayudarte con tu despensa hoy?'
  },
  en: {
    inicio: 'HOME', despensa: 'PANTRY', recetas: 'RECIPES', iachef: 'AI CHEF',
    bienvenido: 'WELCOME TO', perfil: 'Profile', dieta: 'Diet Settings', idioma: 'Language',
    logros: 'Achievements', tema: 'Theme', cerrar_sesion: 'Log Out', guardar: 'Save',
    volver: 'Back', premium: 'Premium Member', racha: 'Streak', recetas_completadas: 'Recipes',
    sugerencia_dia: 'Suggestion of the Day', ver_todas: 'See all', estado_despensa: 'Pantry Status',
    articulos: 'Items', por_comprar: 'To buy', buscar_recetas: 'Search recipes...',
    sin_recetas: 'No recipes found.', cargando: 'Loading Gourmet Pantry...',
    ingredientes: 'Ingredients', nutricion_inteligente: 'Smart Nutrition',
    despensa_status_msg: 'You have {count} items nearing expiry',
    vence_pronto: 'Expiring soon', lista_compra: 'Shopping List', inventario_title: 'Inventory',
    total: 'Total', vence: 'Expiring', agotado: 'Out of Stock', buscar_alimentos: 'Search food...',
    todo: 'All', no_articulos: 'No items in this list', ver_toda_despensa: 'View all pantry',
    recetario: 'Recipe Book', inspiracion: 'Gourmet Inspiration', recomendado: 'Recommendations for you',
    ia_asistente: 'AI Assistant', chef_virtual: 'Virtual Chef', hoy: 'TODAY',
    preguntar_ia: 'Ask about your pantry...', pref_alimentarias: 'Dietary Preferences',
    nuevo_producto: 'New Product', nombre_producto: 'Product Name', fecha_vencimiento: 'Expiry Date',
    caduca_en: 'Expires in {count} days', añadir: 'Add to Pantry', guardando: 'Saving...',
    footer_add: 'Product will be added automatically to your list.', procesando: 'Processing Receipt...',
    encuadra: 'Frame your receipt',
    logro1_title: 'Beginner Chef', logro1_desc: 'Cook your first 5 recipes',
    logro2_title: 'Zero Waste', logro2_desc: 'Use 10 products before they expire',
    logro3_title: 'Gourmet Explorer', logro3_desc: 'Try recipes from 3 different countries',
    oscuro: 'Dark', claro: 'Light',
    vegano: 'Vegan', sin_gluten: 'Gluten Free', keto: 'Keto', sin_lactosa: 'Lactose Free',
    favoritos: 'Favorites', favorito: 'Favorite', restablecer: 'Reset Suggestions',
    exclusive_pro: 'Exclusive feature for Smart Pantry users',
    cargando_pantry: 'Loading Gourmet Pantry...',
    tienes_todo: 'You have all the ingredients',
    falta_uno: '1 ingredient missing',
    faltan_varios: '{count} ingredients missing',
    saludo_ia: 'Hello! I am your Instant Pantry Assistant, developed by DatanopIA. How can I help you with your pantry today?'
  },
  ca: {
    inicio: 'INICI', despensa: 'REPOST', recetas: 'RECEPTES', iachef: 'IA CHEF',
    bienvenido: 'BENVINGUT A', perfil: 'Perfil', dieta: 'Ajustos de Dieta', idioma: 'Idioma',
    logros: 'Assoliments', tema: 'Tema', cerrar_sesion: 'Tancar Sessió', guardar: 'Desar',
    volver: 'Tornar', premium: 'Membre Premium', racha: 'Ratxa', recetas_completadas: 'Receptes',
    sugerencia_dia: 'Suggeriment del Dia', ver_todas: 'Veure totes', estado_despensa: 'Estat del Repost',
    articulos: 'Articles', por_comprar: 'Per comprar', buscar_recetas: 'Cercar receptes...',
    sin_recetas: 'No s\'han trobat receptes.', cargando: 'Carregant Repost Gourmet...',
    ingredientes: 'Ingredients', nutricion_inteligente: 'Nutrició Intel·ligent',
    despensa_status_msg: 'Tens {count} productes a punt de caducar',
    vence_pronto: 'Caduca aviat', lista_compra: 'Llista de Compra', inventario_title: 'Inventari',
    total: 'Total', vence: 'Caduca', agotado: 'Esgotat', buscar_alimentos: 'Cercar aliments...',
    todo: 'Tot', no_articulos: 'No hi ha articles en aquesta llista', ver_toda_despensa: 'Veure tot el repost',
    recetario: 'Receptari', inspiracion: 'Inspiració Gourmet', recomendado: 'Recomanacions per a tu',
    ia_asistente: 'Assistent IA', chef_virtual: 'Xef Virtual', hoy: 'AVUI',
    preguntar_ia: 'Pregunta sobre el teu repost...', pref_alimentarias: 'Preferències Alimentàries',
    nuevo_producto: 'Nou Producte', nombre_producto: 'Nom del Producte', fecha_vencimiento: 'Data de Caducitat',
    caduca_en: 'Caduca en {count} dies', añadir: 'Afegir al Repost', guardando: 'Desant...',
    footer_add: 'El producte s\'afegirà automàticament a la teva llista.', procesando: 'Processant Tiquet...',
    encuadra: 'Enquadra el teu tiquet',
    logro1_title: 'Xef Començant', logro1_desc: 'Cuina les teves primeres 5 receptes',
    logro2_title: 'Zero Deixalles', logro2_desc: 'Usa 10 productes abans de caducar',
    logro3_title: 'Explorador Gourmet', logro3_desc: 'Prova receptes de 3 països diferents',
    oscuro: 'Fosc', claro: 'Clar',
    vegano: 'Vegà', sin_gluten: 'Sense Gluten', keto: 'Keto', sin_lactosa: 'Sense Lactosa',
    favoritos: 'Favorits', favorito: 'Preferit', restablecer: 'Restablir Sugeriments',
    exclusive_pro: 'Funció exclusiva per a usuaris Smart Pantry',
    cargando_pantry: 'Carregant Pantry Gourmet...',
    tienes_todo: 'Tens tots els ingredients',
    falta_uno: 'Falta 1 ingredient',
    faltan_varios: 'Falten {count} ingredients',
    saludo_ia: 'Hola! Soc el teu Assistent d\'Instant Pantry, desenvolupat per DatanopIA. En què puc ajudar-te amb el teu repost avui?'
  }
}

function App() {
  const [view, setView] = useState('home')
  const [prevView, setPrevView] = useState('home')
  const [theme, setTheme] = useState('light')
  const [profileImage, setProfileImage] = useState(null)
  const [userTier, setUserTier] = useState('free')
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true'
  })
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user_data')
      if (savedUser && savedUser !== 'undefined') {
        return JSON.parse(savedUser)
      }
    } catch (e) {
      console.error('Error parsing user data:', e)
    }
    return { email: 'usuario@example.com', name: 'Usuario Gourmet', id: 'usr_123' }
  })
  const [language, setLanguage] = useState('es')
  const [inventory, setInventory] = useState([])
  const [recipes, setRecipes] = useState([])
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [recipeCategory, setRecipeCategory] = useState('Todo')
  const [userDiets, setUserDiets] = useState({
    vegano: false,
    sin_gluten: false,
    keto: false,
    sin_lactosa: false
  })
  const [refreshSeed, setRefreshSeed] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [inventoryFilter, setInventoryFilter] = useState('all')
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  // Auth states for security UX
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [showGoogleAccounts, setShowGoogleAccounts] = useState(false)
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const t = useCallback((key) => translations[language][key] || key, [language]);

  const goTo = useCallback((viewName) => {
    window.scrollTo(0, 0)
    if (view !== 'add-product' && viewName === 'add-product') {
      setPrevView(view)
    }
    setView(viewName)
  }, [view])

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, view, isTyping])

  // Listen for Supabase Auth changes
  useEffect(() => {
    if (!supabase || !supabase.auth) return;

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          const userData = {
            email: session.user.email,
            name: session.user.user_metadata.full_name || session.user.email.split('@')[0],
            id: session.user.id
          }
          setIsLoggedIn(true)
          setUser(userData)
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('user_data', JSON.stringify(userData))
        } else if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false)
          setUserTier('free')
          setInventory([])
          localStorage.removeItem('isLoggedIn')
          localStorage.removeItem('user_data')
          localStorage.removeItem('onboarding_seen')
          setShowOnboarding(true)
          setOnboardingStep(0)
          setEmail('')
          setPassword('')
          if (typeof goTo === 'function') goTo('home')
        }
      })
      return () => subscription.unsubscribe()
    } catch (err) {
      console.error('Supabase Auth connection error:', err)
    }
  }, [goTo])

  const handleLogin = (userData = null) => {
    setIsAuthenticating(true)
    setShowGoogleAccounts(false)

    // Simular verificación segura para Email (Premium feel)
    setTimeout(() => {
      const defaultUser = {
        email: email || 'usuario@example.com',
        name: email ? email.split('@')[0] : 'Usuario Gourmet',
        id: 'usr_' + Math.random().toString(36).substr(2, 9)
      }
      const finalUser = userData || defaultUser
      setIsLoggedIn(true)
      setUser(finalUser)
      setIsAuthenticating(false)
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user_data', JSON.stringify(finalUser))
    }, 1500)
  }

  const handleLoginGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('Error logging in with Google:', error.message)
      alert('Error al conectar con Google. Por favor, verifica la configuración en Supabase.')
    }
  }

  useEffect(() => {
    if (view === 'chat' && messages.length === 0) {
      setMessages([{ text: t('saludo_ia'), sender: 'ai' }])
    }
  }, [view, messages.length, language, t])

  useEffect(() => {
    if (view === 'scanner') {
      setTimeout(() => {
        scanInputRef.current?.click();
      }, 500);
    }
  }, [view])

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserTier('free')
    setInventory([])
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user_data')
    localStorage.removeItem('onboarding_seen')
    setShowOnboarding(true)
    setOnboardingStep(0)
    setEmail('')
    setPassword('')
    goTo('home')
  }

  const toggleFavorite = async (recipe) => {
    const newStatus = recipe.is_favorite ? 0 : 1;
    try {
      await fetch(`${API_BASE}/recipes/${recipe.id}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorite: newStatus })
      });
      setRecipes(prev => prev.map(r => r.id === recipe.id ? { ...r, is_favorite: newStatus } : r));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, recRes, msgRes] = await Promise.all([
          fetch(`${API_BASE}/inventory`),
          fetch(`${API_BASE}/recipes`),
          fetch(`${API_BASE}/messages`)
        ])

        const invData = await invRes.json()
        const recData = await recRes.json()
        const msgData = await msgRes.json()

        setInventory(invData)
        setRecipes(recData)
        setMessages(msgData.length > 0 ? msgData : [{ text: '¡Hola! Soy tu Asistente Chef. ¿En qué receta gourmet piensas hoy?', sender: 'ai' }])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Handle Stripe Success Callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'success') {
      setUserTier('pro');
      setTheme('dark'); // El modo oscuro es premium
      setIsLoggedIn(true); // Aseguramos que está logueado al volver
      // Limpiar la URL sin recargar para estética "premium"
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);


  const addProductToInventory = async (product) => {
    // Audit Check: 15 items limit for Free users
    if (userTier === 'free' && inventory.length >= 15) {
      setShowUpgradeModal(true)
      return { error: 'limit_reached' }
    }

    try {
      const res = await fetch(`${API_BASE}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      })
      if (!res.ok) throw new Error("API Failure");
      const newProduct = await res.json()
      setInventory(prev => [...prev, newProduct])
      return true;
    } catch (error) {
      console.error('Error adding product:', error)
      // Fallback local en caso de que el backend falle (Vercel Cold Start / Error)
      const mockProduct = { id: Date.now(), ...product };
      setInventory(prev => [...prev, mockProduct]);
      return true;
    }
  }

  const checkDietMatch = (recipe) => {
    if (!recipe.tags) return true;
    const tags = recipe.tags.map(t => t.toLowerCase());

    if (userDiets.vegano && !tags.includes('vegana') && !tags.includes('vegano')) return false;
    if (userDiets.sin_gluten && !tags.includes('sin gluten') && !tags.includes('gluten-free')) return false;
    if (userDiets.keto && !tags.includes('keto')) return false;
    if (userDiets.sin_lactosa && !tags.includes('sin lactosa') && !tags.includes('lactose-free')) return false;

    return true;
  };

  const getMissingIngredients = (recipe) => {
    if (!recipe || !recipe.ingredients) return [];
    const invNames = inventory.map(i => i.name.toLowerCase());
    return recipe.ingredients.filter(ing => {
      const ingLower = ing.toLowerCase();
      // Búsqueda simple por contenido
      return !invNames.some(invName => ingLower.includes(invName) || invName.includes(ingLower));
    });
  };

  const deleteProduct = async (id) => {
    try {
      await fetch(`${API_BASE}/inventory/${id}`, { method: 'DELETE' })
      setInventory(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const getAIResponse = (text) => {
    const input = text.toLowerCase();
    const invNames = inventory.map(i => i.name.toLowerCase());

    // --- AGENTIC REASONING LOGIC ---

    // 1. INTENCIÓN: POSTRES Y DULCES (Mejorado)
    if (input.includes('postre') || input.includes('dulce') || input.includes('chocolate')) {
      // Intenta usar ingredientes del inventario para el postre
      const hasFruit = invNames.some(n => n.includes('fruta') || n.includes('manzana') || n.includes('fresa') || n.includes('aguacate'));
      const hasDairy = invNames.some(n => n.includes('leche') || n.includes('yogur') || n.includes('queso'));

      if (hasFruit && hasDairy) {
        return "He analizado tu despensa y, para un postre gourmet rápido, te recomiendo unos 'Vasitos de Fruta Fresca con Crema de Yogur y Miel'. Es una técnica francesa muy ligera. ¿Te gustaría que te guíe con los pasos?";
      }
      return "Para un postre de alta cocina en 15 minutos, te sugiero un 'Mousse de Chocolate Amargo Express' o unas 'Trufas de Cacao'. Son clásicos internacionales que nunca fallan. ¿Prefieres algo con chocolate o algo más frutal?";
    }

    // 2. INTENCIÓN: BÚSQUEDA / INFORMACIÓN EXTERNA (Simulado inteligente)
    if (input.includes('busca') || input.includes('internet') || input.includes('qué es') || input.includes('como se hace')) {
      return `Consultando mi base de datos de gastronomía internacional... He encontrado que lo que buscas está relacionado con la técnica de 'Cocina de Ensamblaje'. Consiste en elevar productos básicos de tu despensa usando especias exóticas o técnicas de emplatado minimalista. ¿Quieres que apliquemos esto a tu ${inventory.length > 0 ? inventory[0].name : 'próximo plato'}?`;
    }

    // 3. INTENCIÓN: SUBSTITUCIÓN (Refinado)
    if (input.includes('substituir') || input.includes('sustituir')) {
      const match = text.match(/"([^"]+)"/g) || text.match(/«([^»]+)»/g) || [input.split(' ').pop()];
      const ingredient = match[0].replace(/["«»]/g, '');
      const substitutions = {
        'leche': 'leche de almendras o yogur griego para mantener la cremosidad',
        'huevo': 'semillas de lino hidratadas o puré de manzana',
        'mantequilla': 'aceite de coco o aguacate maduro',
        'harina': 'harina de avena o almendras',
        'azúcar': 'miel, sirope de ágave o dátiles triturados',
        'pollo': 'tofu firme marinado o seitán',
        'queso': 'levadura nutricional o anacardos remojados',
        'arroz': 'quinoa o coliflor rallada'
      };

      const sub = Object.keys(substitutions).find(k => ingredient.toLowerCase().includes(k));
      if (sub) return `Para substituir "${ingredient}", la mejor opción técnica es ${substitutions[sub]}. Mantendrá la estructura gourmet de la receta original.`;
      return `El ingrediente "${ingredient}" es complejo. Podrías probar con una base de frutos secos triturados o una emulsión de aceite de oliva si buscas textura. ¿Quieres una alternativa más específica según tu inventario?`;
    }

    // 4. INTENCIÓN: RECETAS BASADAS EN INVENTARIO (Dinámico)
    if (input.includes('cocinar') || input.includes('hambre') || input.includes('hacer con')) {
      const bestMatch = recipes.find(r => invNames.some(inv => r.ingredients.some(ri => ri.toLowerCase().includes(inv))));
      if (bestMatch) {
        return `He revisado tus ${inventory.length} productos. Con tu "${invNames[0]}" podríamos preparar "${bestMatch.title}". ¿Te parece una buena idea o buscamos algo más ligero?`;
      }
      return "Tengo varias ideas. Podríamos improvisar un 'Bowl de Autor' con lo que tienes o buscar una receta rápida de 15 minutos. ¿En qué estilo te sientes hoy: Mediterráneo o Asiático?";
    }

    // 5. INTENCIÓN: SALUD Y NUTRICIÓN
    if (input.includes('caloría') || input.includes('kcal') || input.includes('sano')) {
      return "Mi enfoque es la 'Salud Gourmet'. Todas mis sugerencias equilibran el conteo calórico con el placer culinario. Por ejemplo, siempre priorizo grasas saludables como tu aguacate. ¿Quieres un análisis detallado de tu racha nutricional?";
    }

    // 6. FALLBACK INTELIGENTE (No genérico)
    if (input.length > 2) {
      return `Tu consulta sobre "${text}" es muy interesante desde el punto de vista de la neurogastronomía. Sugiere un interés por sabores complejos. ¿Te gustaría que explore cómo integrar ese concepto con los productos que tienes en tu despensa ahora mismo?`;
    }

    return t('saludo_ia');
  };

  const sendMessage = async (text) => {
    try {
      const newMessage = { text, sender: 'user' }
      setMessages(prev => [...prev, newMessage])
      setIsTyping(true)

      // Save user message to DB
      await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      })

      // Try Real AI (Gemini) via Backend
      let aiText = "";
      try {
        const aiResponse = await fetch(`${API_BASE}/ai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            history: messages,
            inventory,
            recipes
          })
        });
        const aiData = await aiResponse.json();
        aiText = aiData.text;
      } catch (err) {
        console.warn("Real AI failed, falling back to local logic:", err);
      } finally {
        setIsTyping(false)
      }

      // If Real AI didn't provide text or we're in demo mode, use Local Logic
      if (!aiText || aiText.includes("[MODO DEMO]")) {
        const localResponse = getAIResponse(text);
        aiText = (aiText && aiText.includes("[MODO DEMO]")) ? `${aiText}\n\n${localResponse}` : localResponse;
      }

      const aiResponseObj = { text: aiText, sender: 'ai' }

      setTimeout(async () => {
        setMessages(prev => [...prev, aiResponseObj])
        // Save AI message to DB
        await fetch(`${API_BASE}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(aiResponseObj)
        })
      }, 800)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const clearChat = async () => {
    try {
      await fetch(`${API_BASE}/messages`, { method: 'DELETE' })
      setMessages([])
    } catch (error) {
      console.error('Error clearing chat:', error)
    }
  }

  // --- HELPERS ---

  const renderAppHeader = (title, subtitle) => (
    <header className="pt-8 pb-6 px-0 flex justify-between items-end relative">
      <div>
        <p className="text-primary" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{subtitle}</p>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>{title}</h1>
      </div>
      <div
        onClick={() => goTo('profile')}
        style={{
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          background: 'var(--glass)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: profileImage ? '0' : '2px'
        }}
      >
        {profileImage ? (
          <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span className="material-icons-round notranslate" translate="no" style={{ color: 'var(--text-main)', fontSize: '1.8rem' }}>person</span>
        )}
      </div>
    </header>
  )

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // --- RENDERS ---

  const renderHome = () => {
    const sampleRecipes = [
      { id: 's1', title: 'Pasta con Pesto de Albahaca', time: '15 min', img: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=800', ingredients: ['Pasta', 'Albahaca', 'Piñones', 'Queso'], tags: ['Italiana', 'Rápida'] },
      { id: 's2', title: 'Bowl de Quinoa y Aguacate', time: '20 min', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', ingredients: ['Quinoa', 'Aguacate', 'Espinacas', 'Tomate'], tags: ['Saludable', 'Vegana'] },
      { id: 's3', title: 'Tacos de Polto al Pastor', time: '30 min', img: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800', ingredients: ['Tortillas', 'Carne', 'Piña', 'Cilantro'], tags: ['Mexicana', 'Gourmet'] }
    ];

    const currentRecipes = recipes.length > 0 ? recipes : sampleRecipes;
    const dietMatched = currentRecipes.filter(checkDietMatch);

    // Si no hay sugerencias por falta de inventario o dieta, rotamos por todas las disponibles
    const featured = dietMatched.length > 0
      ? dietMatched[refreshSeed % dietMatched.length]
      : (currentRecipes.length > 0 ? currentRecipes[refreshSeed % currentRecipes.length] : null);

    const missingItems = featured ? getMissingIngredients(featured) : [];

    return (
      <div className="container animate-fade-in" style={{ paddingBottom: '120px' }}>
        {/* Universal Header */}
        {renderAppHeader('Instant Pantry', t('nutricion_inteligente'))}

        {/* Welcome Message */}
        <section className="mb-0 pt-10" style={{ paddingBottom: '2.5rem' }}>
          <h2 style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400, letterSpacing: '0.05em', marginBottom: '8px' }}>{t('bienvenido')}</h2>
          <h1 style={{ color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>Instant <span style={{ color: 'var(--primary)' }}>Pantry</span></h1>
        </section>

        {/* Pantry Alert Card */}
        <section className="mb-10" onClick={() => { setInventoryFilter('vence'); setView('inventory'); }} style={{ cursor: 'pointer' }}>
          <div className="premium-border" style={{ background: 'rgba(var(--primary-rgb), 0.05)', borderRadius: '0.75rem', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{t('estado_despensa')}</span>
              <p style={{ color: 'var(--text-main)', fontSize: '1rem' }}>
                {t('despensa_status_msg').replace('{count}', inventory.filter(i => i.status !== 'green').length)}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', background: 'rgba(255, 138, 0, 0.2)' }}>
              <span className="material-icons-round notranslate" translate="no" style={{ color: 'var(--accent-orange)' }}>priority_high</span>
            </div>
          </div>
        </section>

        {/* Featured Suggestion Section */}
        <section className="mb-10">
          <div className="flex-between mb-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 600 }}>{t('sugerencia_dia')}</h3>
              <button
                onClick={(e) => { e.stopPropagation(); setRefreshSeed(s => s + 1); }}
                style={{ background: 'var(--glass)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '4px 12px', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <span className="material-icons-round notranslate" style={{ fontSize: '1rem' }}>refresh</span>
                {t('restablecer')}
              </button>
            </div>
            <span className="text-primary" style={{ fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }} onClick={() => goTo('recipes')}>{t('ver_todas')}</span>
          </div>

          <div style={{ minHeight: '300px', position: 'relative' }}>
            {featured ? (
              <div
                className="relative w-full rounded-xl overflow-hidden group premium-glow"
                style={{ aspectRatio: '4/3', cursor: 'pointer' }}
                onClick={() => { setSelectedRecipe(featured); setView('recipe-detail'); }}
              >
                <img
                  alt={featured.title}
                  src={featured.img}
                  onError={(e) => {
                    if (e.target.dataset.error) return;
                    e.target.dataset.error = "true";
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2'/%3E%3Cpath d='M7 2v20'/%3E%3Cpath d='M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7'/%3E%3C/svg%3E";
                    e.target.style.opacity = '0.2';
                    e.target.style.objectFit = 'center';
                  }}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}></div>

                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.25rem', right: '1.25rem', zIndex: 10 }}>
                  <div className="glass-panel p-5 rounded-3xl" style={{ backdropFilter: 'blur(24px)', background: 'var(--nav-bg)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ background: 'var(--primary)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, color: 'white', textTransform: 'uppercase' }}>Sugerencia</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="material-icons-round notranslate" translate="no" style={{ fontSize: '1rem' }}>schedule</span> {featured.time}
                          </span>
                        </div>
                        <h4 style={{ color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px', lineHeight: 1.1 }}>{featured.title}</h4>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(featured); }}
                        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <span className="material-icons-round notranslate" style={{ color: featured.is_favorite ? '#ff4b2b' : 'white', fontSize: '24px' }}>
                          {featured.is_favorite ? 'favorite' : 'favorite_border'}
                        </span>
                      </button>
                    </div>
                    {missingItems.length === 0 ? (
                      <p style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 600, paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span className="material-icons-round notranslate" style={{ fontSize: '1rem' }}>check_circle</span> 100% Chef Listo
                      </p>
                    ) : (
                      <p style={{ color: '#D88C51', fontSize: '0.85rem', fontWeight: 600, paddingBottom: '0.5rem' }}>
                        Falta: {missingItems[0]} {missingItems.length > 1 ? `+${missingItems.length - 1}` : ''} - Sustituir o Comprar
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card flex-center" style={{ height: '300px', background: 'var(--glass)', border: '1px dashed var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('sin_recetas')}</span>
              </div>
            )}
          </div>
        </section>

        {/* Quick Stats Grid */}
        <section className="grid-2">
          <div
            style={{ background: 'var(--glass)', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => { setInventoryFilter('all'); setView('inventory'); }}
          >
            <div style={{ width: '2rem', height: '2rem', borderRadius: '0.25rem', background: 'rgba(var(--primary-rgb), 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-icons-round notranslate" style={{ color: 'var(--primary)', fontSize: '1.125rem' }}>inventory_2</span>
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-main)', fontWeight: 700, fontSize: '1.125rem' }}>{inventory.length}</span>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.625rem', textTransform: 'uppercase' }}>{t('articulos')}</span>
            </div>
          </div>
          <div
            style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => { setInventoryFilter('shoppable'); setView('inventory'); }}
          >
            <div style={{ width: '2rem', height: '2rem', borderRadius: '0.25rem', background: 'rgba(var(--primary-rgb), 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-icons-round notranslate" style={{ color: 'var(--primary)', fontSize: '1.125rem' }}>shopping_basket</span>
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-main)', fontWeight: 700, fontSize: '1.125rem' }}>{inventory.filter(i => i.status === 'red').length}</span>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.625rem', textTransform: 'uppercase' }}>{t('por_comprar')}</span>
            </div>
          </div>
        </section>
      </div>
    )
  }


  const renderInventory = () => (
    <div className="container animate-fade-in" style={{ paddingBottom: '120px' }}>
      {/* Universal Header */}
      {renderAppHeader(inventoryFilter === 'all' ? 'Despensa' : inventoryFilter === 'vence' ? 'Vence Pronto' : 'Lista de Compra', 'Inventario')}

      {/* Summary Stats Grid */}
      <div className="grid-3 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div className="bg-card-dark p-4 rounded-xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase' }}>Total</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{inventory.length}</p>
        </div>
        <div className="bg-card-dark p-4 rounded-xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <p style={{ color: 'rgba(var(--status-red-rgb, 248, 113, 113), 0.6)', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase' }}>Vence</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--status-red)' }}>{inventory.filter(i => i.status === 'red').length}</p>
        </div>
        <div className="bg-card-dark p-4 rounded-xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          <p style={{ color: 'rgba(var(--primary-rgb), 0.6)', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase' }}>Agotado</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>0</p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <span className="material-icons-round notranslate" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.25rem' }}>search</span>
        <input
          type="text"
          placeholder="Buscar alimentos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 16px 14px 48px',
            borderRadius: '16px',
            background: 'var(--glass)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border 0.2s'
          }}
        />
      </div>

      {/* Inventory List */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '10px' }}>
        {['all', 'vence', 'shoppable'].map(f => (
          <button
            key={f}
            onClick={() => setInventoryFilter(f)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              background: inventoryFilter === f ? 'var(--primary)' : 'var(--glass)',
              color: inventoryFilter === f ? 'white' : 'var(--text-main)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {f === 'all' ? t('todo') : f === 'vence' ? t('vence_pronto') : t('por_comprar')}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {inventory
          .filter(item => {
            const matchesFilter = inventoryFilter === 'vence' ? item.status !== 'green' :
              inventoryFilter === 'shoppable' ? item.status === 'red' : true;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
          }).length > 0 ? (
          inventory
            .filter(item => {
              const matchesFilter = inventoryFilter === 'vence' ? item.status !== 'green' :
                inventoryFilter === 'shoppable' ? item.status === 'red' : true;
              const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
              return matchesFilter && matchesSearch;
            })
            .map(item => (
              <div key={item.id} className="flex justify-between items-center p-4 rounded-lg" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', transition: 'transform 0.2s ease' }}>
                <div className="flex items-center gap-4">
                  <div style={{ width: '3rem', height: '3rem', background: 'rgba(var(--primary-rgb), 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1rem' }}>{item.name}</h3>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: item.status === 'green' ? 'var(--status-green)' : item.status === 'yellow' ? 'var(--status-yellow)' : 'var(--status-red)',
                        boxShadow: item.status !== 'green' ? `0 0 8px ${item.status === 'yellow' ? 'rgba(251,191,36,0.4)' : 'rgba(248,113,113,0.4)'}` : 'none'
                      }}></div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: item.status === 'green' ? 'var(--status-green)' : item.status === 'yellow' ? 'var(--status-yellow)' : 'var(--status-red)', fontWeight: 500 }}>
                      {item.status === 'green' ? 'Fresco' : `${item.exp} días`}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)' }}>500g</p>
                    <p style={{ fontSize: '0.625rem', color: 'rgba(255, 255, 255, 0.3)' }}>Nevera</p>
                  </div>
                  <button
                    onClick={() => deleteProduct(item.id)}
                    style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', padding: '4px' }}
                    className="hover:text-red-400 transition-colors"
                  >
                    <span className="material-icons-round notranslate" translate="no" style={{ fontSize: '1.25rem' }}>delete_outline</span>
                  </button>
                </div>
              </div>
            ))
        ) : (
          <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem', padding: '4rem 0', opacity: 0.5 }}>
            <span className="material-icons-round notranslate" style={{ fontSize: '4rem' }}>inventory</span>
            <p>{t('no_articulos')}</p>
            <button
              onClick={() => setInventoryFilter('all')}
              style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '8px 20px', borderRadius: '12px', cursor: 'pointer' }}
            >
              {t('ver_toda_despensa')}
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        className="premium-glow"
        style={{ position: 'fixed', right: '1.5rem', bottom: '110px', width: '4rem', height: '4rem', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-on-primary)', border: 'none', zIndex: 40 }}
        onClick={() => goTo('add-product')}
      >
        <span className="material-icons-round notranslate" translate="no" style={{ fontSize: '1.875rem' }}>add</span>
      </button>
    </div>
  )


  const renderRecipes = () => {
    const categories = ['Todo', 'Recomendados', 'Favoritos', 'Italiana', 'Japonesa', 'Argentina', 'Vegana']

    const getPantryMatchCount = (ingredients) => {
      if (!ingredients) return 0
      const inventoryNames = inventory.map(i => i.name.toLowerCase())
      return ingredients.filter(ing =>
        inventoryNames.some(inv => ing.toLowerCase().includes(inv) || inv.includes(ing.toLowerCase()))
      ).length
    }

    const sampleRecipes = [
      { id: 's1', title: 'Pasta con Pesto de Albahaca', time: '15 min', img: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=800', ingredients: ['Pasta', 'Albahaca', 'Piñones', 'Queso'], tags: ['Italiana', 'Rápida'], is_favorite: false },
      { id: 's2', title: 'Bowl de Quinoa y Aguacate', time: '20 min', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', ingredients: ['Quinoa', 'Aguacate', 'Espinacas', 'Tomate'], tags: ['Saludable', 'Vegana'], is_favorite: false },
      { id: 's3', title: 'Tacos de Pollo al Pastor', time: '30 min', img: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800', ingredients: ['Tortillas', 'Carne', 'Piña', 'Cilantro'], tags: ['Mexicana', 'Gourmet'], is_favorite: false }
    ];

    const currentRecipes = recipes.length > 0 ? recipes : sampleRecipes;

    const filteredRecipesBySearch = currentRecipes.filter(r =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.tags && r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    )

    const dietFilteredRecipes = filteredRecipesBySearch.filter(checkDietMatch);

    const recommendedRecipes = [...currentRecipes]
      .filter(checkDietMatch)
      .sort((a, b) =>
        getPantryMatchCount(b.ingredients) - getPantryMatchCount(a.ingredients)
      )

    const filteredRecipes = recipeCategory === 'Todo'
      ? dietFilteredRecipes
      : recipeCategory === 'Recomendados'
        ? recommendedRecipes.filter(r =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.tags && r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
        )
        : recipeCategory === 'Favoritos'
          ? dietFilteredRecipes.filter(r => r.is_favorite)
          : dietFilteredRecipes.filter(r => r.tags.includes(recipeCategory))

    const renderRecipeCard = (recipe) => {
      if (!recipe) return null
      // High-quality placeholder SVG (minimalist cooking icon)
      const fallbackImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2'/%3E%3Cpath d='M7 2v20'/%3E%3Cpath d='M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7'/%3E%3C/svg%3E";

      return (
        <div
          key={recipe.id}
          className="rounded-2xl overflow-hidden animate-fade-in"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onClick={() => { setSelectedRecipe(recipe); setView('recipe-detail'); }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ position: 'relative', height: '140px', width: '100%', flexShrink: 0, backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={recipe.img || fallbackImg}
              alt={recipe.title}
              loading="lazy"
              onError={(e) => {
                if (e.target.dataset.error) return; // Prevenir bucle infinito
                e.target.dataset.error = "true";
                console.warn(`Fallback image triggered for: ${recipe.title}`);
                e.target.src = fallbackImg;
                e.target.style.width = '48px';
                e.target.style.height = '48px';
                e.target.style.opacity = '0.3';
                e.target.parentElement.style.backgroundColor = 'var(--card-bg)';
                e.target.style.objectFit = 'contain';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease' }}
            />
            <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.6rem', color: 'white', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span className="material-icons-round notranslate" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>schedule</span>
              {recipe.time}
            </div>
            {getMissingIngredients(recipe).length === 0 ? (
              <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: '#4ade80', padding: '2px 8px', borderRadius: '12px', fontSize: '0.6rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span className="material-icons-round notranslate" style={{ fontSize: '1rem' }}>check_circle</span> 100%
              </div>
            ) : (
              <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(216, 140, 81, 0.9)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.6rem', fontWeight: 700, color: 'white' }}>
                {getMissingIngredients(recipe).length} {t('articulos')}
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(recipe); }}
              style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
            >
              <span className="material-icons-round notranslate" style={{ color: recipe.is_favorite ? '#ff4b2b' : 'white', fontSize: '18px' }}>
                {recipe.is_favorite ? 'favorite' : 'favorite_border'}
              </span>
            </button>
          </div>
          <div style={{ padding: '0.875rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.4rem', lineBreak: 'anywhere', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.4em' }}>
              {recipe.title}
            </h3>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '0.4rem' }}>
              {recipe.tags && recipe.tags.slice(0, 1).map(tag => (
                <span key={tag} style={{ fontSize: '0.55rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{tag}</span>
              ))}
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {getMissingIngredients(recipe).length === 0 ? (
                <>
                  <span className="material-icons-round notranslate" style={{ fontSize: '0.9rem', color: '#4ade80' }}>check_circle</span>
                  <span style={{ fontSize: '0.65rem', color: '#4ade80', fontWeight: 600 }}>{t('tienes_todo')}</span>
                </>
              ) : (
                <>
                  <span className="material-icons-round notranslate" style={{ fontSize: '0.9rem', color: '#D88C51' }}>shopping_cart</span>
                  <span style={{ fontSize: '0.65rem', color: '#D88C51', fontWeight: 600 }}>
                    {getMissingIngredients(recipe).length === 1
                      ? t('falta_uno')
                      : t('faltan_varios').replace('{count}', getMissingIngredients(recipe).length)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="container animate-fade-in" style={{ paddingBottom: '120px' }}>
        {/* Universal Header */}
        {renderAppHeader('Recetario', 'Inspiración Gourmet')}

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <span className="material-icons-round notranslate" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>search</span>
          <input
            type="text"
            placeholder={t('buscar_recetas')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              borderRadius: '16px',
              background: 'var(--glass)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Categories Scroller */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem', scrollbarWidth: 'none' }} className="hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setRecipeCategory(cat); setSearchQuery(''); }}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                background: recipeCategory === cat ? 'var(--primary)' : 'var(--glass)',
                color: recipeCategory === cat ? 'white' : 'var(--text-main)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gap: '2rem' }}>
          {recipes.length === 0 && isLoading ? (
            <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem', padding: '4rem 0', opacity: 0.5 }}>
              <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
              <p>{t('cargando_pantry')}</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem', padding: '4rem 0', opacity: 0.5 }}>
              <span className="material-icons-round notranslate" style={{ fontSize: '3rem' }}>restaurant_menu</span>
              <p>{t('sin_recetas')}</p>
            </div>
          ) : recipeCategory === 'Todo' && !searchQuery ? (
            categories.filter(c => c !== 'Todo').map(cat => {
              const recipesToShow = cat === 'Recomendados'
                ? recommendedRecipes.slice(0, 2) // Show top 2 recommended in 2 cols
                : recipes.filter(r => r.tags && r.tags.includes(cat)).slice(0, 2); // Show 2 for other categories

              if (recipesToShow.length === 0) return null;

              return (
                <div key={cat} style={{ marginBottom: '1rem' }}>
                  <div className="flex justify-between items-center mb-3">
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{cat}</h2>
                    <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => setRecipeCategory(cat)}>
                      {t('ver_todas')}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {recipesToShow.map(recipe => renderRecipeCard(recipe))}
                  </div>
                </div>
              )
            })
          ) : recipeCategory === 'Recomendados' ? (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div className="flex justify-between items-center">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t('recomendado')}</h2>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{filteredRecipes.length} {t('recetas').toLowerCase()}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                {filteredRecipes.map(recipe => renderRecipeCard(recipe))}
              </div>
              {filteredRecipes.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <span className="material-icons-round notranslate" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>restaurant_menu</span>
                  <p>No hemos encontrado recomendaciones para ti.</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div className="flex justify-between items-center">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  {searchQuery ? `Resultados para "${searchQuery}"` : recipeCategory}
                </h2>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{filteredRecipes.length} recetas</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                {filteredRecipes.map(recipe => renderRecipeCard(recipe))}
              </div>
              {filteredRecipes.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <span className="material-icons-round notranslate" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>restaurant_menu</span>
                  <p>No hemos encontrado recetas que coincidan.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }


  const renderAIChat = () => (
    <div className="animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Encabezado Fijo (Natural a través de Flexbox) */}
      <div style={{
        background: 'var(--bg-color)',
        zIndex: 10,
        padding: '1.5rem 1.5rem 0 1.5rem',
        flexShrink: 0,
        borderBottom: '1px solid var(--border-color)'
      }}>
        {renderAppHeader(t('ia_asistente'), t('chef_virtual'))}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingBottom: '1rem' }}>
          <div style={{ background: 'var(--glass)', padding: '0.4rem 0.8rem', borderRadius: '1rem', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t('hoy')}</div>
          <button
            onClick={clearChat}
            style={{
              background: 'var(--glass)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              fontSize: '0.7rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '20px',
              transition: 'var(--transition)'
            }}
          >
            <span>🗑️</span> {t('limpiar') || 'Limpiar Chat'}
          </button>
        </div>
      </div>

      {/* Area Scrollable de Mensajes */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1.5rem',
        paddingBottom: '220px' /* Espacio para el input flotante y la barra de navegación */
      }} className="scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
            background: m.sender === 'user' ? 'var(--primary)' : 'var(--glass)',
            color: m.sender === 'user' ? '#fff' : 'var(--text-main)',
            padding: '1rem 1.25rem',
            borderRadius: m.sender === 'user' ? '1.5rem 1.5rem 0 1.5rem' : '1.5rem 1.5rem 1.5rem 0',
            maxWidth: '85%',
            fontSize: '0.9375rem',
            lineHeight: 1.5,
            border: m.sender === 'user' ? 'none' : '1px solid var(--border-color)',
            boxShadow: m.sender === 'user' ? '0 4px 15px rgba(107, 142, 35, 0.2)' : 'none',
            whiteSpace: 'pre-line'
          }}>
            {m.text}
          </div>
        ))}

        {isTyping && (
          <div style={{
            alignSelf: 'flex-start',
            background: 'var(--glass)',
            padding: '0.8rem 1.25rem',
            borderRadius: '1.5rem 1.5rem 1.5rem 0',
            color: 'var(--text-main)',
            fontSize: '1.2rem',
            border: '1px solid var(--border-color)',
            marginBottom: '1rem',
            display: 'flex',
            gap: '4px'
          }}>
            <span className="dot-animate">.</span>
            <span className="dot-animate" style={{ animationDelay: '0.2s' }}>.</span>
            <span className="dot-animate" style={{ animationDelay: '0.4s' }}>.</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Floating Chat Input Bar */}
      <div style={{ position: 'fixed', bottom: '110px', left: '1rem', right: '1rem', zIndex: 50 }}>
        <form
          className="glass-panel"
          style={{ padding: '0.5rem', borderRadius: '2rem', display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--nav-bg)', backdropFilter: 'var(--ios-blur)', border: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}
          onSubmit={(e) => {
            e.preventDefault()
            const input = e.target.elements.message
            if (input.value) {
              sendMessage(input.value)
              input.value = ''
            }
          }}
        >
          <input
            name="message"
            type="text"
            placeholder={t('preguntar_ia')}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'inherit', padding: '0.5rem', outline: 'none' }}
          />
          <button type="submit" className="flex-center" style={{ background: 'var(--primary)', width: '40px', height: '40px', borderRadius: '50%', border: 'none', cursor: 'pointer' }}>
            <span className="material-icons-round notranslate" translate="no" style={{ color: 'var(--text-on-primary)' }}>send</span>
          </button>
        </form>
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="container animate-fade-in" style={{ paddingBottom: '120px' }}>
      <section className="flex-center" style={{ flexDirection: 'column', padding: '3rem 0' }}>
        <div
          className="premium-glow"
          onClick={() => document.getElementById('profile-upload').click()}
          style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', padding: '3px', background: 'linear-gradient(to tr, rgba(132, 169, 140, 0.4), var(--primary))', cursor: 'pointer' }}
        >
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '4px solid var(--bg-color)', overflow: 'hidden', background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {profileImage ? (
              <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '3rem', color: 'var(--text-main)', fontWeight: 700 }}>CR</span>
            )}
          </div>
          <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'var(--primary)', color: 'var(--text-on-primary)', padding: '6px', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', display: 'flex' }}>
            <span className="material-icons-round notranslate" translate="no" style={{ fontSize: '1.1rem' }}>add_a_photo</span>
          </div>
        </div>
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <h2 className="mt-2" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{user.name}</h2>
      </section>

      {userTier === 'free' && (
        <div className="premium-border" style={{ padding: '1.5rem', borderRadius: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(132, 169, 140, 0.1), rgba(216, 140, 81, 0.1))', border: '1px solid rgba(132, 169, 140, 0.3)' }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <div>
              <h4 style={{ margin: 0, color: 'var(--text-main)' }}>Plan Free</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Has usado {inventory.length}/15 productos</p>
            </div>
            <span className="material-icons-round notranslate" style={{ color: 'var(--primary)' }}>lock</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.25rem' }}>
            <div style={{ width: `${Math.min((inventory.length / 15) * 100, 100)}%`, height: '100%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></div>
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowUpgradeModal(true)}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700 }}
          >
            DESBLOQUEAR ILIMITADO
          </button>
        </div>
      )}

      {userTier === 'pro' && (
        <div className="card" style={{ padding: '1.25rem', borderRadius: '1.5rem', marginBottom: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--primary)' }}>
          <div className="flex-between">
            <div className="flex-center" style={{ gap: '12px' }}>
              <div style={{ background: 'rgba(var(--primary-rgb), 0.2)', padding: '10px', borderRadius: '12px' }}>
                <span className="material-icons-round notranslate" style={{ color: 'var(--primary)' }}>stars</span>
              </div>
              <div>
                <h4 style={{ margin: 0 }}>Smart Pantry Pro</h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Suscripción Activa</p>
              </div>
            </div>
            <button
              onClick={() => alert('Redirigiendo al Portal de Gestión de Stripe...')}
              style={{ padding: '6px 12px', borderRadius: '8px', background: 'var(--glass)', border: '1px solid var(--border-color)', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}
            >
              GESTIONAR
            </button>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: '0.5rem', borderRadius: '1.5rem', background: 'var(--card-bg)' }}>
        {[
          { icon: 'restaurant_menu', label: t('dieta'), action: () => setView('diet-settings') },
          {
            icon: 'language',
            label: t('idioma'),
            extra: language === 'es' ? 'Español' : language === 'en' ? 'English' : 'Català',
            action: () => {
              const langs = ['es', 'en', 'ca'];
              const next = langs[(langs.indexOf(language) + 1) % langs.length];
              setLanguage(next);
            }
          },
          {
            icon: theme === 'dark' ? 'dark_mode' : 'light_mode',
            label: t('tema'),
            extra: userTier !== 'pro' ? t('exclusive_pro') : (theme === 'dark' ? t('oscuro') : t('claro')),
            action: () => {
              if (userTier === 'pro') {
                setTheme(theme === 'dark' ? 'light' : 'dark');
              } else {
                setShowUpgradeModal(true);
              }
            }
          }
        ].map((item, idx, arr) => (
          <div key={item.label}>
            <div className="flex-between" onClick={item.action} style={{ padding: '1.25rem', cursor: 'pointer' }}>
              <div className="flex-center" style={{ gap: '1rem' }}>
                <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '8px', borderRadius: '12px' }}>
                  <span className="material-icons-round notranslate" translate="no" style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>{item.icon}</span>
                </div>
                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{item.label}</span>
              </div>
              <div className="flex-center" style={{ gap: '8px' }}>
                {item.extra && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.extra}</span>}
                <span className="material-icons-round notranslate" translate="no" style={{ opacity: 0.3, color: 'var(--text-main)' }}>chevron_right</span>
              </div>
            </div>
            {idx !== arr.length - 1 && <div style={{ height: '1px', background: 'var(--border-color)', margin: '0 1.25rem' }}></div>}
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
            handleLogout();
          }
        }}
        style={{ width: '100%', padding: '1.25rem', color: '#ff4d4d', fontWeight: 600, border: 'none', background: 'transparent', marginTop: '1.5rem', cursor: 'pointer' }}
      >
        {t('cerrar_sesion')}
      </button>
    </div >
  )

  const renderDietSettings = () => (
    <div className="container animate-fade-in" style={{ paddingBottom: '120px' }}>
      <header className="pt-8 pb-6 flex justify-between items-center">
        <button onClick={() => setView('profile')} style={{ background: 'var(--glass)', border: '1px solid var(--border-color)', color: 'var(--text-main)', width: '3rem', height: '3rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-icons-round notranslate">arrow_back</span>
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t('dieta')}</h1>
        <div style={{ width: '3rem' }}></div>
      </header>
      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>{t('pref_alimentarias')}</h3>
        {[
          { id: 'vegano', label: t('vegano') },
          { id: 'sin_gluten', label: t('sin_gluten') },
          { id: 'keto', label: t('keto') },
          { id: 'sin_lactosa', label: t('sin_lactosa') }
        ].map(diet => (
          <div key={diet.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <span>{diet.label}</span>
            <input
              type="checkbox"
              checked={userDiets[diet.id]}
              onChange={(e) => setUserDiets(prev => ({ ...prev, [diet.id]: e.target.checked }))}
              style={{ accentColor: 'var(--primary)', width: '20px', height: '20px' }}
            />
          </div>
        ))}
        <button className="btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1rem', borderRadius: '12px' }} onClick={() => setView('profile')}>
          {t('guardar')}
        </button>
      </div>
    </div>
  )

  const renderAchievements = () => (
    <div className="container animate-fade-in" style={{ paddingBottom: '120px' }}>
      <header className="pt-8 pb-6 flex justify-between items-center">
        <button onClick={() => setView('profile')} style={{ background: 'var(--glass)', border: '1px solid var(--border-color)', color: 'var(--text-main)', width: '3rem', height: '3rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-icons-round notranslate">arrow_back</span>
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t('logros')}</h1>
        <div style={{ width: '3rem' }}></div>
      </header>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {[
          { title: t('logro1_title'), desc: t('logro1_desc'), progress: 100, icon: '🍳' },
          { title: t('logro2_title'), desc: t('logro2_desc'), progress: 60, icon: '🌿' },
          { title: t('logro3_title'), desc: t('logro3_desc'), progress: 33, icon: '🌍' }
        ].map(a => (
          <div key={a.title} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ fontSize: '2.5rem' }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0 }}>{a.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 8px 0' }}>{a.desc}</p>
              <div style={{ width: '100%', height: '6px', background: 'rgba(var(--primary-rgb), 0.1)', borderRadius: '3px' }}>
                <div style={{ width: `${a.progress}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px' }}></div>
              </div>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>{a.progress}%</span>
          </div>
        ))}
      </div>
    </div>
  )

  const [newItem, setNewItem] = useState({ name: '', expiryDate: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanMode, setScanMode] = useState('ticket') // 'ticket' or 'fridge'
  const scanInputRef = useRef(null)

  const calculateDays = (dateStr) => {
    if (!dateStr) return 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(dateStr)
    expiry.setHours(0, 0, 0, 0)
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const getIconForProduct = (name) => {
    const n = name.toLowerCase()
    const mapping = {
      'manzana': '🍎', 'pera': '🍐', 'platano': '🍌', 'fruta': '🍎',
      'leche': '🥛', 'queso': '🧀', 'yogur': '🍦', 'lacteo': '🥛',
      'carne': '🥩', 'pollo': '🍗', 'filete': '🥩', 'cerdo': '🥩',
      'pan': '🍞', 'croissant': '🥐', 'bolleria': '🥐',
      'pescado': '🐟', 'salmon': '🐟', 'atun': '🐟',
      'verdura': '🥦', 'ensalada': '🥗', 'brocoli': '🥦', 'tomate': '🍅',
      'huevo': '🥚', 'arroz': '🍚', 'pasta': '🍝', 'aceite': '🫒',
      'agua': '💧', 'refresco': '🥤', 'vino': '🍷', 'cerveza': '🍺',
      'galleta': '🍪', 'chocolate': '🍫', 'jamon': '🍖'
    }
    for (const [key, icon] of Object.entries(mapping)) {
      if (n.includes(key)) return icon
    }
    return '📦' // Icono genérico para entrada manual que no coincide
  }

  const renderAddProduct = () => (
    <div className="container animate-fade-in" style={{ paddingBottom: '120px' }}>
      <header className="pt-8 pb-6 flex justify-between items-center relative">
        <button
          onClick={() => goTo(prevView)}
          style={{
            background: 'var(--glass)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <span className="material-icons-round notranslate" translate="no">arrow_back</span>
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{t('nuevo_producto')}</h1>
        <div
          onClick={() => goTo('profile')}
          style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: 'var(--glass)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', padding: profileImage ? '0' : '2px' }}
        >
          {profileImage ? (
            <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span className="material-icons-round notranslate" translate="no" style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>person</span>
          )}
        </div>
      </header>

      <div className="card animate-scale-in" style={{ padding: '2rem', background: 'var(--card-bg)', borderRadius: '1.5rem', border: '1px solid var(--border-color)' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{t('nombre_producto')}</label>
          <input
            type="text"
            placeholder="Ej. Manzanas, Leche..."
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{t('fecha_vencimiento')}</label>
          <input
            type="date"
            value={newItem.expiryDate}
            onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '1.25rem',
              outline: 'none',
              colorScheme: 'dark'
            }}
          />
        </div>

        {newItem.expiryDate && (
          <p style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center' }}>
            {t('caduca_en').replace('{count}', calculateDays(newItem.expiryDate))}
          </p>
        )}

        <button
          className="btn-primary w-full"
          style={{ borderRadius: '12px', padding: '1.25rem', fontSize: '1rem', fontWeight: 700, marginTop: '1rem' }}
          disabled={!newItem.name || !newItem.expiryDate || isSaving}
          onClick={async () => {
            if (!newItem.name || !newItem.expiryDate) return;
            setIsSaving(true)
            try {
              const days = calculateDays(newItem.expiryDate)
              const productIcon = getIconForProduct(newItem.name)
              const success = await addProductToInventory({
                name: newItem.name,
                exp: days,
                icon: productIcon,
                status: days > 5 ? 'green' : days > 2 ? 'yellow' : 'red'
              })

              if (success) {
                setNewItem({ name: '', expiryDate: '' })
                goTo('inventory')
              }
            } catch (err) {
              console.error("Error manual add:", err);
            } finally {
              setIsSaving(false)
            }
          }}
        >
          {isSaving ? t('guardando') : t('añadir')}
        </button>
      </div>

      <div style={{ textAlign: 'center', opacity: 0.5 }}>
        <p style={{ fontSize: '0.85rem' }}>{t('footer_add')}</p>
      </div>
    </div>
  )

  const handleScanImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsScanning(true)
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64Image = reader.result
      try {
        const res = await fetch(`${API_BASE}/ai/analyze-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image, mode: scanMode })
        })
        const data = await res.json()
        if (data.products && data.products.length > 0) {
          // Add all detected products
          for (const product of data.products) {
            await addProductToInventory({
              name: product.name,
              exp: product.exp || 7,
              icon: product.icon || '📦',
              status: (product.exp || 7) > 5 ? 'green' : (product.exp || 7) > 2 ? 'yellow' : 'red'
            })
          }
          alert(`¡Éxito! Se han detectado y añadido ${data.products.length} productos.`);
        } else {
          alert('No se pudieron detectar productos. Inténtalo con otra foto.');
        }
      } catch (err) {
        console.error('Scan error:', err)
        alert('Error al procesar la imagen con la IA.')
      } finally {
        setIsScanning(false)
        goTo('inventory')
      }
    }
    reader.readAsDataURL(file)
  }

  const renderScanner = () => (
    <div className="container animate-fade-in flex-center" style={{ flexDirection: 'column', background: '#000', color: '#fff', position: 'fixed', inset: 0, zIndex: 1000 }}>
      <button onClick={() => goTo(prevView)} style={{ position: 'absolute', top: '40px', left: '25px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
        <span className="material-icons-round notranslate" translate="no">close</span>
      </button>

      {/* Mode Selector */}
      <div style={{ position: 'absolute', top: '100px', display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '2rem' }}>
        <button
          onClick={() => setScanMode('ticket')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '1.5rem',
            border: 'none',
            background: scanMode === 'ticket' ? 'var(--primary)' : 'transparent',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          TIQUET OCR
        </button>
        <button
          onClick={() => setScanMode('fridge')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '1.5rem',
            border: 'none',
            background: scanMode === 'fridge' ? 'var(--primary)' : 'transparent',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          NEVERA VISION
        </button>
      </div>

      <div className="premium-border" style={{ width: '280px', height: '400px', borderRadius: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {isScanning && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '1rem', fontWeight: 600 }}>IA ANALIZANDO {scanMode === 'ticket' ? 'TIQUET' : 'NEVERA'}...</p>
          </div>
        )}
        <div style={{ position: 'absolute', width: '40px', height: '40px', borderTop: '4px solid var(--primary)', borderLeft: '4px solid var(--primary)', top: '20px', left: '20px', borderRadius: '1rem 0 0 0' }}></div>
        <div style={{ position: 'absolute', width: '40px', height: '40px', borderTop: '4px solid var(--primary)', borderRight: '4px solid var(--primary)', top: '20px', right: '20px', borderRadius: '0 1rem 0 0' }}></div>
        <div style={{ position: 'absolute', width: '40px', height: '40px', borderBottom: '4px solid var(--primary)', borderLeft: '4px solid var(--primary)', bottom: '20px', left: '20px', borderRadius: '0 0 0 1rem' }}></div>
        <div style={{ position: 'absolute', width: '40px', height: '40px', borderBottom: '4px solid var(--primary)', borderRight: '4px solid var(--primary)', bottom: '20px', right: '20px', borderRadius: '0 0 1rem 0' }}></div>
        <span className="material-icons-round notranslate" style={{ fontSize: '4rem', opacity: 0.1 }}>
          {scanMode === 'ticket' ? 'receipt_long' : 'kitchen'}
        </span>
        <p style={{ opacity: 0.5, marginTop: '1rem', textAlign: 'center', padding: '0 2rem' }}>
          {scanMode === 'ticket' ? 'Sube una foto de tu tiquet de compra' : 'Sube una foto de tu nevera abierta'}
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={scanInputRef}
        onChange={handleScanImage}
        style={{ display: 'none' }}
      />

      <button
        style={{ marginTop: '3rem', height: '80px', width: '80px', borderRadius: '50%', border: '4px solid #fff', background: 'transparent', padding: '5px', cursor: isScanning ? 'default' : 'pointer' }}
        disabled={isScanning}
        onClick={() => scanInputRef.current?.click()}
      >
        <div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-icons-round notranslate" style={{ color: '#000' }}>photo_camera</span>
        </div>
      </button>

      <p style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.5 }}>Toca para capturar con la cámara</p>
    </div>
  )


  const renderRecipeDetail = () => {
    if (!selectedRecipe) return null;
    return (
      <div className="container animate-fade-in" style={{ paddingBottom: '40px' }}>
        <header className="pt-8 pb-6 flex justify-between items-center relative">
          <button
            onClick={() => goTo('recipes')}
            style={{
              background: 'var(--glass)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <span className="material-icons-round notranslate" translate="no">arrow_back</span>
          </button>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Detalle de Receta</h1>
          <div
            onClick={() => goTo('profile')}
            style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: 'var(--glass)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', padding: profileImage ? '0' : '2px' }}
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span className="material-icons-round notranslate" translate="no" style={{ color: 'var(--text-main)', fontSize: '1.75rem' }}>person</span>
            )}
          </div>
        </header>
        {selectedRecipe && (
          <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--card-bg)', borderRadius: '1.5rem', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ position: 'relative', width: '100%', height: '300px', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={selectedRecipe.img}
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                alt={selectedRecipe.title}
                onError={(e) => {
                  if (e.target.dataset.error) return;
                  e.target.dataset.error = "true";
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2'/%3E%3Cpath d='M7 2v20'/%3E%3Cpath d='M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7'/%3E%3C/svg%3E";
                  e.target.style.width = '64px';
                  e.target.style.height = '64px';
                  e.target.style.opacity = '0.3';
                  e.target.style.objectFit = 'contain';
                }}
              />
            </div>
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span style={{ background: 'var(--primary)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, color: 'white' }}>GOURMET</span>
                {selectedRecipe.tags && selectedRecipe.tags.map(tag => (
                  <span key={tag} style={{ color: 'var(--text-muted)', fontSize: '0.75rem', border: '1px solid var(--border-color)', padding: '4px 12px', borderRadius: '8px' }}>{tag}</span>
                ))}
              </div>

              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-main)', lineHeight: 1.1 }}>{selectedRecipe.title}</h2>

              <div className="flex items-center gap-6 mb-8 py-4 border-y border-white/5" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex flex-col">
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700 }}>Tiempo</span>
                  <span className="flex items-center gap-1" style={{ fontWeight: 600 }}><span className="material-icons-round notranslate" style={{ fontSize: '1rem', color: 'var(--primary)' }}>schedule</span> {selectedRecipe.time}</span>
                </div>
                <div className="flex flex-col">
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700 }}>Calorías</span>
                  <span className="flex items-center gap-1" style={{ fontWeight: 600 }}><span className="material-icons-round notranslate" style={{ fontSize: '1rem', color: 'var(--primary)' }}>local_fire_department</span> {selectedRecipe.cal || '450 kcal'}</span>
                </div>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>Ingredientes Necesarios</h3>
                <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '10px' }}>
                  {(selectedRecipe.ingredients || []).map(ing => {
                    const missing = !inventory.some(item =>
                      ing.toLowerCase().includes(item.name.toLowerCase()) ||
                      item.name.toLowerCase().includes(ing.toLowerCase())
                    );
                    return (
                      <li key={ing} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        padding: '8px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.03)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: missing ? 'var(--text-main)' : 'var(--text-muted)', fontSize: '0.95rem' }}>
                          <span className="material-icons-round notranslate" style={{ color: missing ? '#D88C51' : 'var(--status-green)', fontSize: '1.25rem' }}>
                            {missing ? 'error_outline' : 'check_circle'}
                          </span>
                          {ing}
                        </div>
                        {missing && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '30px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#D88C51', fontWeight: 600 }}>Te falta este ingrediente</span>
                            <button
                              onClick={() => {
                                goTo('chat');
                                sendMessage(`Hola Chef, me falta "${ing}" para preparar la receta "${selectedRecipe.title}". ¿Por qué alimento gourmet me recomiendas substituirlo?`);
                              }}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                background: 'rgba(216, 140, 81, 0.1)',
                                border: '1px solid rgba(216, 140, 81, 0.3)',
                                color: '#D88C51',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => { e.target.style.background = 'rgba(216, 140, 81, 0.2)'; }}
                              onMouseLeave={(e) => { e.target.style.background = 'rgba(216, 140, 81, 0.1)'; }}
                            >
                              SUBSTITUIR
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>Paso a Paso</h3>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {(selectedRecipe.steps || []).map((step, index) => (
                    <div key={index} style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{
                        flexShrink: 0,
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 800
                      }}>
                        {index + 1}
                      </div>
                      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) return (
    <div className="flex-center" style={{ height: '100vh', background: 'var(--bg-color)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
      <p style={{ fontWeight: 600 }}>Cargando Pantry Gourmet...</p>
    </div>
  )

  const renderOnboarding = () => {
    const steps = [
      {
        icon: 'center_focus_weak',
        title: 'Tu despensa, bajo control inteligente',
        body: 'Escanea tus productos en segundos. Instant Pantry detecta fechas de caducidad y stock automáticamente.',
        cta: 'Probar Escáner',
        color: 'var(--primary)'
      },
      {
        icon: 'auto_awesome',
        title: 'Cocina con lo que ya tienes',
        body: 'Nuestra IA diseña recetas personalizadas para evitar el desperdicio y ahorrarte tiempo. Hoy sugiero: Quinoa Harvest Bowl.',
        cta: 'Ver Recetas',
        color: 'var(--accent-orange)'
      },
      {
        icon: 'stars',
        title: 'Únete a la comunidad DatanopIA',
        body: 'Desbloquea el Modo Oscuro, alertas inteligentes y despensa ilimitada con Smart Pantry Pro.',
        cta: 'Empezar Gratis',
        color: 'var(--charcoal)',
        showSocial: true
      }
    ]

    const step = steps[onboardingStep] || steps[0]
    if (!step) return null;

    return (
      <div className="container animate-fade-in" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem', background: 'var(--bg-color)', overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="logo-animation" style={{ marginBottom: '2rem' }}>
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '46px',
              background: onboardingStep === 2 ? 'var(--charcoal)' : 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              boxShadow: onboardingStep === 2 ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(var(--primary-rgb), 0.3)',
              position: 'relative'
            }}>
              <span className="material-icons-round notranslate" style={{ color: 'white', fontSize: '5rem' }}>{step.icon}</span>
              {onboardingStep === 0 && (
                <div style={{ position: 'absolute', inset: '-15px', border: '3px solid var(--primary)', borderRadius: '55px', opacity: 0.3, animation: 'pulse 2s infinite' }}></div>
              )}
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: onboardingStep === 2 ? 'var(--charcoal)' : 'var(--text-main)', marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-1px' }}>{step.title}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '320px', margin: '0 auto', lineHeight: 1.5, fontWeight: 500 }}>{step.body}</p>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: i === onboardingStep ? '32px' : '8px', height: '8px', borderRadius: '4px', background: i === onboardingStep ? 'var(--primary)' : 'var(--border-color)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}></div>
            ))}
          </div>
        </div>

        <div className="stagger-in" style={{ width: '100%', maxWidth: '340px', paddingBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            className="btn-primary"
            style={{
              width: '100%',
              padding: '1.4rem',
              borderRadius: '22px',
              fontSize: '1.15rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: onboardingStep === 2 ? '0 12px 24px rgba(0,0,0,0.2)' : '0 12px 24px rgba(var(--primary-rgb), 0.3)',
              border: 'none',
              background: onboardingStep === 2 ? 'var(--charcoal)' : 'var(--primary)',
              color: 'white'
            }}
            onClick={() => {
              if (onboardingStep < 2) {
                setOnboardingStep(s => s + 1)
              } else {
                localStorage.setItem('onboarding_seen', 'true')
                setShowOnboarding(false)
              }
            }}
          >
            {step.cta.toUpperCase()}
          </button>

          {step.showSocial && (
            <button className="btn-google" style={{ border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} onClick={() => handleLoginGoogle()}>
              <svg width="20" height="20" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.25h2.9c1.69-1.55 2.66-3.85 2.66-6.6z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.25c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.58-5.05-3.72H.92v2.33C2.4 15.11 5.48 18 9 18z" />
                <path fill="#FBBC05" d="M3.95 10.71c-.18-.54-.28-1.11-.28-1.71s.1-1.17.28-1.71V4.96H.92C.33 6.13 0 7.53 0 9s.33 2.87.92 4.04l3.03-2.33z" />
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L14.98 2.4C13.46.99 11.43 0 9 0 5.48 0 2.4 2.89.92 6.07l3.03 2.33c.71-2.14 2.7-3.72 5.05-3.72z" />
              </svg>
              Continuar con Google
            </button>
          )}

          <p
            onClick={() => {
              localStorage.setItem('onboarding_seen', 'true')
              setShowOnboarding(false)
            }}
            style={{ marginTop: '0.8rem', color: 'var(--text-muted)', fontSize: '0.95rem', cursor: 'pointer', fontWeight: 600 }}
          >
            Saltar introducción
          </p>
        </div>
      </div>
    )
  }

  const renderLanding = () => (
    <div className="container animate-fade-in" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem', background: 'var(--bg-color)' }}>
      <div className="logo-animation" style={{ marginBottom: '2.5rem' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1.5rem' }}>
          {/* Logo Premium SVG: Carrito + Hoja Sage + Línea Pulso */}
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="30" fill="var(--primary)" fillOpacity="0.1" />
            <path d="M25 35H35L40 65H75L80 45H40" stroke="var(--charcoal)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="45" cy="75" r="4" fill="var(--charcoal)" />
            <circle cx="70" cy="75" r="4" fill="var(--charcoal)" />
            <path d="M50 25C50 25 65 35 65 50C65 60 58 68 50 68C42 68 35 60 35 50C35 35 50 25 50 25Z" fill="var(--primary)" />
            <path d="M30 50H38L42 40L48 60L52 45L56 50H65" stroke="var(--charcoal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-1px' }}>
          Instant <span style={{ color: 'var(--primary)' }}>Pantry</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '300px', margin: '0 auto', lineHeight: 1.4 }}>
          de <span style={{ fontWeight: 700, color: 'var(--charcoal)' }}>DatanopIA</span>
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '280px', margin: '0.5rem auto', lineHeight: 1.4, opacity: 0.7 }}>
          Nutrición inteligente y gestión gourmet para tu hogar.
        </p>
      </div>

      <div className="stagger-in" style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ position: 'relative' }}>
          <span className="material-icons-round notranslate" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.2rem' }}>email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu email"
            style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', borderRadius: '18px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <span className="material-icons-round notranslate" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.2rem' }}>lock</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', borderRadius: '18px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
          />
        </div>

        <button
          className="btn-primary"
          style={{ width: '100%', padding: '1.25rem', borderRadius: '18px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(var(--primary-rgb), 0.25)', border: 'none' }}
          onClick={() => handleLogin()}
          disabled={!email || !password}
        >
          {isAuthenticating ? 'VERIFICANDO...' : 'ENTRAR CON SEGURIDAD'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>O</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
        </div>

        <button className="btn-google" style={{ display: 'flex !important', visibility: 'visible !important' }} onClick={() => handleLoginGoogle()}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.25h2.9c1.69-1.55 2.66-3.85 2.66-6.6z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.25c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.58-5.05-3.72H.92v2.33C2.4 15.11 5.48 18 9 18z" />
            <path fill="#FBBC05" d="M3.95 10.71c-.18-.54-.28-1.11-.28-1.71s.1-1.17.28-1.71V4.96H.92C.33 6.13 0 7.53 0 9s.33 2.87.92 4.04l3.03-2.33z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L14.98 2.4C13.46.99 11.43 0 9 0 5.48 0 2.4 2.89.92 6.07l3.03 2.33c.71-2.14 2.7-3.72 5.05-3.72z" />
          </svg>
          Continuar con Google
        </button>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.8rem' }}>
          Tus datos están protegidos por el cifrado de <span style={{ fontWeight: 700 }}>DatanopIA</span>.
        </p>
      </div>

      {/* Auth Overlays */}
      {showGoogleAccounts && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(8px)' }}>
          <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '360px', padding: '2rem', textAlign: 'left' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 800 }}>Elige una cuenta</h3>
            <div
              className="flex items-center gap-4 p-4 mb-3"
              style={{ background: 'rgba(var(--primary-rgb), 0.05)', borderRadius: '16px', cursor: 'pointer' }}
              onClick={() => handleLogin({ name: 'Datanopia User', email: 'user@datanopia.com', id: 'google_1' })}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>D</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Datanopia User</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>user@datanopia.com</div>
              </div>
            </div>
            <div
              className="flex items-center gap-4 p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border-color)', borderRadius: '16px', cursor: 'pointer' }}
            >
              <span className="material-icons-round">add_circle_outline</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Usar otra cuenta</span>
            </div>
            <button onClick={() => setShowGoogleAccounts(false)} style={{ marginTop: '2rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', width: '100%', textAlign: 'center' }}>Cancelar</button>
          </div>
        </div>
      )}

      {isAuthenticating && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-color)', zIndex: 11000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'fade-in 0.3s ease' }}>
          <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', marginBottom: '1.5rem' }}></div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Estableciendo conexión segura...</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Verificando credenciales en DatanopIA Cloud</p>
        </div>
      )}

      <div style={{ marginTop: 'auto', padding: '2rem 0', opacity: 0.6 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px' }}>
          PROYECTO OFICIAL <span style={{ color: 'var(--charcoal)' }}>DATANOPIA</span> &bull; 2026
        </p>
      </div>
    </div>
  )

  if (!isLoggedIn) {
    if (showOnboarding) {
      return <div className={`App ${theme}`} data-theme={theme}>{renderOnboarding()}</div>
    }
    return <div className={`App ${theme}`} data-theme={theme}>{renderLanding()}</div>
  }

  return (
    <div className={`App ${theme}`} data-theme={theme} style={{ background: 'var(--bg-color)', minHeight: '100vh', color: 'var(--text-main)' }}>
      {view === 'home' && renderHome()}
      {view === 'inventory' && renderInventory()}
      {view === 'add-product' && renderAddProduct()}
      {view === 'scanner' && renderScanner()}
      {view === 'chat' && renderAIChat()}
      {view === 'profile' && renderProfile()}
      {view === 'recipes' && renderRecipes()}
      {view === 'recipe-detail' && renderRecipeDetail()}
      {view === 'diet-settings' && renderDietSettings()}
      {view === 'achievements' && renderAchievements()}

      {/* Navigation Bar (iOS Style Premium) */}
      <nav className="ios-tab-bar" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', opacity: view === 'home' ? 1 : 0.4, minWidth: '45px' }} onClick={() => goTo('home')}>
          <span className="material-icons-round notranslate" translate="no" style={{ color: view === 'home' ? 'var(--primary)' : 'var(--text-main)', fontSize: '1.5rem' }}>home</span>
          <span style={{ fontSize: '0.6rem', fontWeight: 600, color: view === 'home' ? 'var(--primary)' : 'var(--text-main)' }}>{t('inicio')}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', opacity: view === 'inventory' ? 1 : 0.4, minWidth: '45px' }} onClick={() => goTo('inventory')}>
          <span className="material-icons-round notranslate" translate="no" style={{ color: view === 'inventory' ? 'var(--primary)' : 'var(--text-main)', fontSize: '1.5rem' }}>inventory_2</span>
          <span style={{ fontSize: '0.6rem', fontWeight: 600, color: view === 'inventory' ? 'var(--primary)' : 'var(--text-main)' }}>{t('despensa')}</span>
        </div>

        {/* Center Actions Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '-30px' }}>
          <div
            onClick={() => goTo('add-product')}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: view === 'add-product' ? 'var(--primary)' : 'var(--glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              boxShadow: view === 'add-product' ? '0 4px 12px rgba(var(--primary-rgb), 0.3)' : 'none'
            }}
          >
            <span className="material-icons-round notranslate" translate="no" style={{ color: view === 'add-product' ? 'white' : 'var(--text-main)', fontSize: '1.3rem' }}>add</span>
          </div>
          <div
            onClick={() => goTo('scanner')}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(var(--primary-rgb), 0.3)',
              cursor: 'pointer',
              border: '4px solid var(--bg-color)',
              flexShrink: 0
            }}
          >
            <span className="material-icons-round notranslate" translate="no" style={{ color: 'white', fontSize: '1.8rem' }}>camera_alt</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', opacity: view === 'recipes' ? 1 : 0.4, minWidth: '45px' }} onClick={() => goTo('recipes')}>
          <span className="material-icons-round notranslate" translate="no" style={{ color: view === 'recipes' ? 'var(--primary)' : 'var(--text-main)', fontSize: '1.5rem' }}>restaurant</span>
          <span style={{ fontSize: '0.6rem', fontWeight: 600, color: view === 'recipes' ? 'var(--primary)' : 'var(--text-main)' }}>{t('recetas')}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', opacity: view === 'chat' ? 1 : 0.4, minWidth: '45px' }} onClick={() => goTo('chat')}>
          <span className="material-icons-round notranslate" translate="no" style={{ color: view === 'chat' ? 'var(--primary)' : 'var(--text-main)', fontSize: '1.5rem' }}>smart_toy</span>
          <span style={{ fontSize: '0.6rem', fontWeight: 600, color: view === 'chat' ? 'var(--primary)' : 'var(--text-main)' }}>{t('iachef')}</span>
        </div>
      </nav>

      {showUpgradeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="card premium-glow animate-scale-in" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setShowUpgradeModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <span className="material-icons-round notranslate">close</span>
            </button>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>👑</div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Smart Pantry Pro</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Desbloquea inventario ilimitado, modo oscuro exclusivo y el Chef IA Gourmet sin restricciones.
            </p>
            <div style={{ marginBottom: '2.5rem', textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '1rem' }}>
              <div className="flex gap-3 mb-3">
                <span className="material-icons-round notranslate" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>check_circle</span>
                <span style={{ fontSize: '0.9rem' }}>Productos ilimitados</span>
              </div>
              <div className="flex gap-3 mb-3">
                <span className="material-icons-round notranslate" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>check_circle</span>
                <span style={{ fontSize: '0.9rem' }}>Sustituciones IA prioritarias</span>
              </div>
              <div className="flex gap-3">
                <span className="material-icons-round notranslate" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>check_circle</span>
                <span style={{ fontSize: '0.9rem' }}>Modo Oscuro Premium</span>
              </div>
            </div>
            <button
              className="btn-primary"
              style={{ width: '100%', padding: '1.25rem', borderRadius: '15px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer' }}
              onClick={async () => {
                try {
                  const res = await fetch(`${API_BASE}/create-checkout-session`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ priceId: 'price_smart_monthly', userEmail: user.email })
                  });
                  const data = await res.json();
                  if (data.url) {
                    window.location.href = data.url;
                  } else {
                    alert('Error conectando con la pasarela de pago.');
                  }
                } catch (err) {
                  console.error('Checkout error:', err);
                  alert('Error al procesar el pago. Inténtalo de nuevo.');
                }
              }}
            >
              SUSCRIBIRSE - 4.99€/mes
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>Cancela en cualquier momento desde tu perfil.</p>
          </div>
        </div>
      )}
      <div className="home-indicator"></div>
    </div>
  )
}

export default App
