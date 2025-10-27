import { supabaseAuth, supabaseApps, type User } from '../lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

// ======================
// AUTHENTICATION (momentum-auth)
// ======================

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

// ======================
// VIDEO PROJECTS (momentum-apps)
// ======================

export interface VideoProject {
  id?: string
  user_id: string
  user_email: string
  user_name?: string
  user_photo?: string
  image_url: string
  video_url: string
  prompt: string
  resolution: string
  music_track: string
  tags: string[]
  description?: string
  created_at?: string
  updated_at?: string
  thumbnail_url?: string
  // Camera configuration
  camera_movement?: string
  movement_speed?: string
  duration?: string
  intensity?: number
}

/**
 * Guarda un nuevo proyecto de video
 */
export const saveVideoProject = async (
  project: Omit<VideoProject, 'id' | 'created_at' | 'updated_at'>
): Promise<string> => {
  const { data, error } = await supabaseApps
    .from('video_projects')
    .insert([{
      ...project,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (error) {
    console.error('Error saving video project:', error)
    throw error
  }

  return data.id
}

/**
 * Actualiza un proyecto existente
 */
export const updateVideoProject = async (
  projectId: string,
  updates: Partial<VideoProject>
) => {
  const { error } = await supabaseApps
    .from('video_projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)

  if (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

/**
 * Obtiene todos los proyectos (ordenados por fecha)
 */
export const getAllProjects = async (): Promise<VideoProject[]> => {
  const { data, error } = await supabaseApps
    .from('video_projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error getting all projects:', error)
    throw error
  }

  return data || []
}

/**
 * Obtiene los proyectos de un usuario específico
 */
export const getUserProjects = async (userId: string): Promise<VideoProject[]> => {
  const { data, error } = await supabaseApps
    .from('video_projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error getting user projects:', error)
    throw error
  }

  return data || []
}

/**
 * Elimina un proyecto
 */
export const deleteVideoProject = async (projectId: string) => {
  const { error } = await supabaseApps
    .from('video_projects')
    .delete()
    .eq('id', projectId)

  if (error) {
    console.error('Error deleting project:', error)
    throw error
  }
}
