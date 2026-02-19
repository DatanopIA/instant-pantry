import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseInstance = null

const createMockSupabase = (errorMsg = 'Configuración de Supabase no válida') => ({
    auth: {
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        signInWithOTP: () => Promise.resolve({ error: new Error(errorMsg) }),
        signInWithOAuth: () => Promise.resolve({ error: new Error(errorMsg) }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    }
})

try {
    if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    } else {
        console.error('Invalid Supabase configuration. Using mock client.')
        supabaseInstance = createMockSupabase('Supabase no está configurado localmente. Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY a tu .env.')
    }
} catch (e) {
    console.error('Critical error initializing Supabase:', e)
    supabaseInstance = createMockSupabase('Error crítico al inicializar Supabase: ' + e.message)
}

export const supabase = supabaseInstance
