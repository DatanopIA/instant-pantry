import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseInstance = null

try {
    if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    } else {
        console.error('Invalid Supabase configuration. Using mock/null client.')
        // Create a dummy client that doesn't throw but doesn't work
        supabaseInstance = {
            auth: {
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
                signInWithOAuth: () => Promise.resolve({ error: new Error('Supabase not configured') }),
                signOut: () => Promise.resolve({ error: null })
            }
        }
    }
} catch (e) {
    console.error('Critical error initializing Supabase:', e)
    supabaseInstance = {
        auth: {
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithOAuth: () => Promise.resolve({ error: e }),
            signOut: () => Promise.resolve({ error: null })
        }
    }
}

export const supabase = supabaseInstance
