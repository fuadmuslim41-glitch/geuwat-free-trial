'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@/types/database'

type SessionHealth = 'healthy' | 'degraded'
type DegradedReason = 'network' | 'auth' | 'data'

interface AuthContextType {
  user: User | null
  hasSession: boolean
  loading: boolean
  authIssue: string | null
  sessionHealth: SessionHealth
  degradedReason: DegradedReason | null
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo account credentials
const DEMO_EMAIL = 'geuwat@gmail.com'
const DEMO_PASSWORD = 'geuwat12'

// Demo user data
const DEMO_USER: User = {
  id: 'demo-user-id',
  email: DEMO_EMAIL,
  fullname: 'GEUWAT Demo User',
  whatsapp: '085846003119',
  tier: 'Pro',
  tier_period: null,
  balance: '0',
  referral_code: 'GEUWAT2024',
  referred_by: null,
  role: 'member',
  status: 'active',
  created_at: new Date().toISOString(),
  updated_at: null,
  membership_start: new Date().toISOString(),
  subscription_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  referral_period: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
  monthly_referral_count: 0,
}

const SESSION_KEY = 'auth_session'
const CACHED_USER_KEY = 'auth_cached_user'

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [hasSession, setHasSession] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState<string | null>(null)
  const [authIssue, setAuthIssue] = useState<string | null>(null)
  const [sessionHealth, setSessionHealth] = useState<SessionHealth>('healthy')
  const [degradedReason, setDegradedReason] = useState<DegradedReason | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const sessionData = localStorage.getItem(SESSION_KEY)
        if (sessionData) {
          const session = JSON.parse(sessionData)
          setUser(session.user)
          setHasSession(true)
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Network status monitoring
    const handleOnline = () => {
      setSessionHealth('healthy')
      setDegradedReason(null)
      setNotice(null)
    }

    const handleOffline = () => {
      setSessionHealth('degraded')
      setDegradedReason('network')
      setNotice('Koneksi tidak stabil. Mode belajar tetap berjalan.')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    return { 
      success: false, 
      error: 'Sign up tidak tersedia di versi free trial. Gunakan akun demo: geuwat@gmail.com / geuwat12' 
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Validate demo credentials
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        const sessionData = {
          user: DEMO_USER,
          timestamp: Date.now()
        }
        
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
        localStorage.setItem(CACHED_USER_KEY, JSON.stringify(DEMO_USER))
        
        setUser(DEMO_USER)
        setHasSession(true)
        setAuthIssue(null)
        
        return { success: true }
      }

      return { 
        success: false, 
        error: 'Email atau password salah. Gunakan: geuwat@gmail.com / geuwat12' 
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: 'Terjadi kesalahan saat login' }
    }
  }

  const signOut = async () => {
    try {
      localStorage.removeItem(SESSION_KEY)
      localStorage.removeItem(CACHED_USER_KEY)
      setUser(null)
      setHasSession(false)
      setAuthIssue(null)
      setNotice(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const value = {
    user,
    hasSession,
    loading,
    authIssue,
    sessionHealth,
    degradedReason,
    signUp,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {notice && (
        <div className="fixed top-0 left-0 right-0 z-[999] bg-amber-500/90 text-black text-sm px-4 py-2 text-center">
          {notice}
        </div>
      )}
      {children}
    </AuthContext.Provider>
  )
}
