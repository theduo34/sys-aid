'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Profile } from '@/types/types_db'
import type { User } from '@supabase/supabase-js'

const TAB_KEY = 'sysaid_tab'

const AUTH_PATHS = ['/login', '/register', '/forgot-password']

interface AuthContext {
  user: User | null
  profile: Profile | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContext>({ user: null, profile: null, isLoading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // New tab without a login — redirect without signing out so other tabs stay active.
      if (event === 'INITIAL_SESSION' && session && !sessionStorage.getItem(TAB_KEY)) {
        setIsLoading(false)
        const onAuthPage = AUTH_PATHS.some((p) => window.location.pathname.startsWith(p))
        if (!onAuthPage) window.location.replace('/login')
        return
      }

      if (event === 'SIGNED_OUT' || !session) {
        sessionStorage.removeItem(TAB_KEY)
        setUser(null)
        setProfile(null)
        setIsLoading(false)
        if (!window.location.pathname.startsWith('/login')) {
          window.location.replace('/login')
        }
        return
      }

      if (event === 'SIGNED_IN') {
        sessionStorage.setItem(TAB_KEY, '1')
      }

      // Set user synchronously — profile is fetched in the separate effect below.
      // Never await inside onAuthStateChange; the auth lock is still held here and
      // React Strict Mode's unmount/remount cycle would orphan it.
      setUser(session.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch profile whenever the authenticated user ID changes
  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function fetchProfile() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()
      if (!cancelled) {
        setProfile(data)
        setIsLoading(false)
      }
    }

    fetchProfile()
    return () => { cancelled = true }
  }, [user?.id])

  return (
    <AuthContext.Provider value={{ user, profile, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
