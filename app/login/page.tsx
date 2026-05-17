'use client'

import { LoginForm } from './components/login/LoginForm'
import { useAuth } from '@/contexts/MemberAuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import './styles/login/login.css'

export default function LoginPage() {
  const { hasSession } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (hasSession) {
      router.push('/dashboard')
    }
  }, [hasSession, router])

  return (
    <div className="auth-layout flex items-center justify-center relative overflow-hidden font-sans">
      <div className="login-background-layer" aria-hidden="true" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <LoginForm />
        
        <div className="mt-8 text-center text-sm text-slate-400">
          <p className="mt-2 text-xs">Click the gears to activate form fields!</p>
          
          {/* Demo Account Info */}
          <div className="mt-4 p-4 bg-gradient-to-br from-purple-900/30 to-fuchsia-900/30 border border-purple-500/30 rounded-lg backdrop-blur-sm">
            <p className="text-xs font-semibold text-purple-300 mb-2">🎯 Demo Account</p>
            <div className="space-y-1">
              <p className="text-xs text-slate-300">
                <span className="text-slate-400">Email:</span>{' '}
                <span className="font-mono text-purple-200">geuwat@gmail.com</span>
              </p>
              <p className="text-xs text-slate-300">
                <span className="text-slate-400">Password:</span>{' '}
                <span className="font-mono text-purple-200">geuwat12</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
