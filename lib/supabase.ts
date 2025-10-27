import { createClient } from '@supabase/supabase-js'

/**
 * Cliente de Supabase para AUTENTICACIÓN ÚNICAMENTE (momentum-auth)
 *
 * Este cliente SOLO se usa para autenticación con las credenciales de Momentum Brain.
 * Storage y Database siguen usando Firebase.
 */
export const supabaseAuth = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
