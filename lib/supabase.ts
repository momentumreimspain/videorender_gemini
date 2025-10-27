import { createClient } from '@supabase/supabase-js'

/**
 * Cliente de Supabase para AUTH (momentum-auth)
 * Gestiona la autenticación unificada de Momentum Brain
 */
export const supabaseAuth = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

/**
 * Cliente de Supabase para APPS (momentum-apps)
 * Gestiona los datos de la aplicación (proyectos de renders)
 */
export const supabaseApps = createClient(
  import.meta.env.VITE_APPS_SUPABASE_URL,
  import.meta.env.VITE_APPS_SUPABASE_ANON_KEY
)

// Types
export interface User {
  id: string
  email: string
  name?: string
  role?: 'admin' | 'manager' | 'employee'
  department?: string
  avatar_url?: string
  created_at?: string
}
