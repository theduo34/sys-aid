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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Cookies from another tab carry a valid session here, but this tab hasn't
      // gone through login — redirect without signing out so the other tab is unaffected.
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

      setUser(session.user)
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setProfile(data)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
