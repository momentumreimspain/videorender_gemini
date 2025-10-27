import { supabaseAuth } from '../lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

// ======================
// AUTHENTICATION ONLY (momentum-auth)
// ======================
// Este servicio SOLO maneja autenticación con Supabase
// Storage y Database siguen usando Firebase

/**
 * Inicia sesión con email y contraseña (Momentum Brain credentials)
 */
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Error signing in:', error)
    throw error
  }

  return data.user
}

/**
 * Cierra sesión
 */
export const logOut = async () => {
  const { error } = await supabaseAuth.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

/**
 * Obtiene el usuario actual
 */
export const getCurrentUser = async (): Promise<SupabaseUser | null> => {
  const { data: { user } } = await supabaseAuth.auth.getUser()
  return user
}

/**
 * Escucha cambios en la autenticación
 */
export const onAuthChange = (callback: (user: SupabaseUser | null) => void) => {
  const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange(
    (_event, session) => {
      callback(session?.user ?? null)
    }
  )

  return () => subscription.unsubscribe()
}
