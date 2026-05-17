'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { LayoutGrid, BarChart2 } from 'lucide-react'
import { dispatchKepalaExpand } from './KepalaTeaserMount'

const DASHBOARD_VIEW_STORAGE_KEY = 'dashboardCurrentView'

function safeSetLocalStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

export default function DesktopBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [kepalaExpanded, setKepalaExpanded] = useState(false)
  const [showProgressPopup, setShowProgressPopup] = useState(false)

  const goDashboardView = (viewId: string) => {
    safeSetLocalStorage(DASHBOARD_VIEW_STORAGE_KEY, viewId)
    router.push('/dashboard')
  }

  useEffect(() => {
    const onState = (event: Event) => {
      const customEvent = event as CustomEvent<{ expanded?: boolean }>
      setKepalaExpanded(Boolean(customEvent.detail?.expanded))
    }
    window.addEventListener('geuwat:kepala-state', onState as EventListener)
    return () => window.removeEventListener('geuwat:kepala-state', onState as EventListener)
  }, [])

  // Don't show navbar on dashboard page (it has its own navbar) or auth pages
  const isDashboard = pathname === '/dashboard'
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/reset-password'
  
  if (isDashboard || isAuthPage) return null

  return (
    <>
      {/* Spacer to prevent content from being hidden behind navbar */}
      <div className="hidden md:block h-28" aria-hidden="true" />

      {/* Progress Popup */}
      {showProgressPopup && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            onClick={() => setShowProgressPopup(false)}
          />
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-2xl border border-[rgba(34,211,238,0.3)] bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-black/98 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(34,211,238,0.25)]">
              {/* Close button */}
              <button
                onClick={() => setShowProgressPopup(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 flex items-center justify-center">
                    <BarChart2 className="w-10 h-10 text-cyan-400" />
                  </div>
                </div>
              </div>

              {/* Persuasive Text */}
              <div className="text-center mb-8">
                <h3 className="text-h2 text-white mb-3">
                  Unlock Your Full Potential!
                </h3>
                <p className="text-body text-slate-300 leading-relaxed">
                  Lacak progres Anda, raih pencapaian, dan lihat seberapa jauh Anda telah berkembang! 
                  <span className="block mt-2 text-cyan-400 font-semibold">
                    Bergabunglah dengan ribuan pelajar yang meningkatkan bahasa Inggris mereka setiap hari.
                  </span>
                </p>
              </div>

              {/* CTA Button */}
              <a
                href="https://learningenglishgeuwat-ten.vercel.app/register"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-center transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:scale-[1.02]"
              >
                Daftar Sekarang
              </a>

              {/* Small text */}
              <p className="text-center text-xs-custom text-slate-500 mt-4">
                Dapatkan akses penuh ke semua fitur premium
              </p>
            </div>
          </div>
        </>
      )}
      
      <nav className="hidden md:block fixed inset-x-0 bottom-0 z-[80]" aria-label="Bottom navigation">
      <div className="relative mx-auto w-full max-w-2xl md:mb-4 rounded-t-2xl md:rounded-2xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-slate-900/25 via-slate-950/90 to-black/90 backdrop-blur-xl">
        <div
          className="pointer-events-none absolute inset-0 rounded-t-2xl md:rounded-2xl shadow-[0_0_36px_rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.14)]"
          aria-hidden="true"
        />

        <div className="flex items-end justify-between px-8 pt-5 pb-4">
          <button
            type="button"
            onClick={() => router.push('/skill')}
            className="group inline-flex w-24 flex-col items-center gap-2 text-slate-200 transition hover:text-white"
            aria-label="Open skill"
          >
            <LayoutGrid className="h-6 w-6 text-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.75)] transition group-hover:text-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.95)]" />
            <span className="text-[11px] font-semibold tracking-[0.24em] text-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.70)] group-hover:text-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.92)]">
              SKILL
            </span>
          </button>

          <button
            type="button"
            onClick={dispatchKepalaExpand}
            className="inline-flex -mt-10 h-[78px] w-[78px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.10)] bg-slate-950/70 shadow-[0_0_0_10px_rgba(255,255,255,0.05),0_0_40px_rgba(0,0,0,0.55)] backdrop-blur-md transition hover:shadow-[0_0_0_12px_rgba(255,255,255,0.06),0_0_46px_rgba(0,0,0,0.62)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,255,255,0.35)]"
            aria-label={kepalaExpanded ? 'AI Tour Guide active' : 'Open AI Tour Guide'}
          >
            {!kepalaExpanded ? (
              <Image
                src="/Kepala.png"
                alt="AI Tour Guide"
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover opacity-90 grayscale saturate-50 brightness-95 ring-2 ring-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.35)] shadow-[0_0_22px_rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.22)]"
                priority
              />
            ) : (
              <span className="h-3 w-3 rounded-full bg-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.85)] shadow-[0_0_18px_rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.55)]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowProgressPopup(true)}
            className="group inline-flex w-24 flex-col items-center gap-2 text-slate-200 transition hover:text-white"
            aria-label="View progress"
          >
            <BarChart2 className="h-6 w-6 text-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.75)] transition group-hover:text-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.95)]" />
            <span className="text-[11px] font-semibold tracking-[0.24em] text-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.70)] group-hover:text-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.92)]">
              PROGRESS
            </span>
          </button>
        </div>
      </div>
    </nav>
    </>
  )
}
