import { supabase } from './supabase';

/**
 * Servicio unificado para peticiones a la API.
 * Incluye automáticamente el token de autenticación de Supabase.
 */
export const apiFetch = async (url, options = {}) => {
    // 1. Obtener la sesión actual para extraer el token JWT
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    // 2. Configurar cabeceras
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // 3. Inyectar el token en el header Authorization si el usuario está logueado
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // 4. Ejecutar la petición
    const response = await fetch(url, {
        ...options,
        headers,
    });

    // 5. Manejo de errores simplificado
    if (!response.ok) {
        let errorMessage = `Error HTTP: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch (e) {
            // No es JSON o no tiene campo 'error'
        }
        throw new Error(errorMessage);
    }

    // Si la respuesta es 204 No Content, retornar null
    if (response.status === 204) return null;

    return response.json();
};
