'use client'

import React, { useState, lazy, Suspense, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Menu, Play } from 'lucide-react'
import { useAuth } from '@/contexts/MemberAuthContext'
import DashboardSidebar from './components/DashboardSidebar'
import './dashboard.css'

import { useGuide } from '@/contexts/GuideContext'
import { PersistenceService } from '@/services/PersistenceService'


// Lazy load semua page components
const StartJourney = lazy(() => import('./components/StartJourney'))
const LockedFeatureTeaser = lazy(() => import('./components/LockedFeatureTeaser'))
const TourGuideTeaser = lazy(() => import('./components/TourGuideTeaser'))
const VIEW_IDS = ['dashboard', 'progress', 'achievements', 'notifications', 'tutorial', 'settings', 'device-approve', 'help-support'] as const
type ViewId = (typeof VIEW_IDS)[number]
const VALID_VIEWS = new Set<ViewId>(VIEW_IDS)
const LOCKED_VIEWS = new Set<ViewId>(['achievements', 'progress', 'notifications', 'tutorial', 'settings', 'device-approve', 'help-support'])
const DASHBOARD_VIEW_EVENT = 'geuwat:dashboard-view'

const resolveSavedDashboardView = (): ViewId | null => {
  if (typeof window === 'undefined') return null
  const savedView = window.localStorage.getItem('dashboardCurrentView')
  if (!savedView || !VALID_VIEWS.has(savedView as ViewId)) return null
  const resolvedView = savedView as ViewId
  if (LOCKED_VIEWS.has(resolvedView)) return null
  return resolvedView
}

function DashboardContent() {
  const router = useRouter()
  const { hasSession, loading } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState<ViewId>('dashboard')
  const [mountedViews, setMountedViews] = useState<Set<string>>(() => new Set(['dashboard']))
  const [isTourGuideExpanded, setIsTourGuideExpanded] = useState(false)
  const [isTourGuideTeaserOpen, setIsTourGuideTeaserOpen] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 767px)').matches
  })
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const hasRestoredViewRef = useRef(false)

  useEffect(() => {
    if (loading) return
    if (hasSession) return
    router.replace('/login')
  }, [loading, hasSession, router])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQueryList = window.matchMedia('(max-width: 767px)')
    const onChange = (event: MediaQueryListEvent) => setIsMobileViewport(event.matches)

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', onChange)
      return () => mediaQueryList.removeEventListener('change', onChange)
    }

    // Safari fallback
    mediaQueryList.addListener(onChange)
    return () => mediaQueryList.removeListener(onChange)
  }, [])

  const toggleSidebar = () => {
    console.log('Toggle sidebar clicked, current state:', isSidebarOpen)
    setIsSidebarOpen(!isSidebarOpen)
  }

  const { startGuide, resumeGuide } = useGuide()

  const autoStartedRef = useRef(false)

  useEffect(() => {
    if (loading) return
    if (!hasSession) return
    if (autoStartedRef.current) return

    autoStartedRef.current = true

    try {
      const saved = PersistenceService.loadState()
      if (!saved) {
        startGuide()
        return
      }

      if (saved.isCompleted) return

      if (saved.isPaused) {
        resumeGuide()
        return
      }

      startGuide()
    } catch {
      startGuide()
    }
  }, [loading, hasSession, startGuide, resumeGuide])


  const handleKepalaPngClick = () => {
    setIsTourGuideExpanded(true)
  }

  const handleKepala1PngClick = async () => {
    // Start/resume interactive guide when user clicks Kepala1.png
    try {
      const { PersistenceService } = await import('@/services/PersistenceService')
      const saved = PersistenceService.loadState()

      if (!saved) {
        startGuide()
      } else if (saved.isCompleted) {
        // no-op
      } else if (saved.isPaused) {
        resumeGuide()
      } else {
        startGuide()
      }
    } catch {
      startGuide()
    }

    setIsTourGuideTeaserOpen(true)
  }


  const handleCloseTeaserPopup = () => {
    setIsTourGuideTeaserOpen(false)
    setIsTourGuideExpanded(false)
  }

  const handleViewChange = useCallback((nextView: string) => {
    if (!VALID_VIEWS.has(nextView as ViewId)) return
    const safeView = nextView as ViewId
    // Allow navigation to locked views to show teaser
    
    setMountedViews(prev => {
      if (prev.has(safeView)) return prev
      const next = new Set(prev)
      next.add(safeView)
      return next
    })

    setCurrentView(safeView)
  }, [])

  useEffect(() => {
    if (hasRestoredViewRef.current) return
    hasRestoredViewRef.current = true
    const savedView = resolveSavedDashboardView()
    if (!savedView) return
    const timerId = window.setTimeout(() => {
      handleViewChange(savedView)
    }, 0)
    return () => window.clearTimeout(timerId)
  }, [handleViewChange])

  useEffect(() => {
    if (VALID_VIEWS.has(currentView)) {
      localStorage.setItem('dashboardCurrentView', currentView)
    }
  }, [currentView])

  useEffect(() => {
    const onDashboardViewEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ viewId?: string }>
      const nextView = customEvent.detail?.viewId
      if (!nextView || !VALID_VIEWS.has(nextView as ViewId)) return
      handleViewChange(nextView)
    }

    window.addEventListener(DASHBOARD_VIEW_EVENT, onDashboardViewEvent as EventListener)
    return () => window.removeEventListener(DASHBOARD_VIEW_EVENT, onDashboardViewEvent as EventListener)
  }, [handleViewChange])

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentView])

  const renderViewPanel = (viewId: string, element: React.ReactNode, loadingLabel: string) => {
    if (!mountedViews.has(viewId)) return null
    const isActive = currentView === viewId

    return (
      <section
        key={viewId}
        className={`dashboard-view-panel ${isActive ? 'active' : 'inactive'}`}
        aria-hidden={!isActive}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-400">{loadingLabel}</div>
            </div>
          }
        >
          {element}
        </Suspense>
      </section>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center">
        <div className="text-sm">Memuat dashboard...</div>
      </div>
    )
  }

  if (!hasSession) {
    // Redirect is handled by the effect above.
    return null
  }

  return (
    <div className="dashboard-layout font-sans flex overflow-hidden" data-tour="dashboard-layout">
      {/* Sidebar */}
      <div data-tour="dashboard-sidebar">
        <DashboardSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          currentView={currentView}
          setCurrentView={handleViewChange}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen md:h-screen overflow-hidden relative">
        {/* Background Gradients/Effects - Nebula Style */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Content Scrollable Area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 pb-28 md:p-8 md:pb-32 lg:p-12 lg:pb-36 scroll-smooth"
        >
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="dashboard-view-stack" data-tour="dashboard-view-stack">
              {renderViewPanel('dashboard', <StartJourney />, 'Loading dashboard...')}
              {renderViewPanel('progress', <LockedFeatureTeaser feature="progress" />, 'Loading...')}
              {renderViewPanel('achievements', <LockedFeatureTeaser feature="achievements" />, 'Loading...')}
              {renderViewPanel('notifications', <LockedFeatureTeaser feature="notifications" />, 'Loading...')}
              {renderViewPanel('tutorial', <LockedFeatureTeaser feature="tutorial" />, 'Loading...')}
              {renderViewPanel('settings', <LockedFeatureTeaser feature="settings" />, 'Loading...')}
              {renderViewPanel('device-approve', <LockedFeatureTeaser feature="device-approve" />, 'Loading...')}
              {renderViewPanel('help-support', <LockedFeatureTeaser feature="help-support" />, 'Loading...')}
            </div>
          </div>
        </div>

        {/* Tour Guide Teaser Popup */}
        <Suspense fallback={null}>
          <TourGuideTeaser 
            isOpen={isTourGuideTeaserOpen} 
            onClose={handleCloseTeaserPopup} 
          />
        </Suspense>

        {/* Tour Guide Avatar Kepala1.png - Top Right (muncul setelah Kepala.png diklik) */}
        {isTourGuideExpanded && !isTourGuideTeaserOpen && (
          <button
            type="button"
            onClick={handleKepala1PngClick}
            className="fixed top-6 right-6 z-[140] inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(255,255,255,0.10)] bg-slate-950/70 shadow-[0_0_0_8px_rgba(255,255,255,0.04),0_0_34px_rgba(0,0,0,0.55)] backdrop-blur-md transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,255,255,0.35)]"
            aria-label="Open Tour Guide Info"
          >
            <Image
              src="/Kepala1.png"
              alt="Tour Guide"
              width={48}
              height={48}
              className="h-10 w-10 rounded-full object-contain"
              priority
            />
          </button>
        )}

        {/* Tour Guide Avatar Kepala.png - Bottom Center (hanya desktop, tidak muncul di mobile) */}
        {!isMobileViewport && !isTourGuideExpanded && (
          <button
            type="button"
            onClick={handleKepalaPngClick}
            className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+14px)] left-1/2 z-[55] inline-flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-purple-500/60 bg-slate-950/80 backdrop-blur-sm transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 shadow-lg shadow-purple-500/20"
            aria-label="Buka Tour Guide"
          >
            <Image
              src="/Kepala.png"
              alt="Tour Guide"
              width={48}
              height={48}
              className="h-11 w-11 rounded-full object-cover"
            />
          </button>
        )}

        {/* Dashboard Bottom Navbar */}
        <nav
          className="dashboard-tour-nav fixed inset-x-0 bottom-0 z-[95]"
          aria-label="Dashboard navigation"
        >
          <div className="dashboard-tour-nav-panel relative mx-auto w-full max-w-2xl rounded-t-2xl md:mb-4 md:rounded-2xl">
            <div
              className="dashboard-tour-nav-scan pointer-events-none absolute inset-0 rounded-t-2xl md:rounded-2xl"
              aria-hidden="true"
            />
            <div className="flex items-end justify-between px-6 pt-5 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] md:px-8 md:pb-4">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="dashboard-tour-nav-action group inline-flex w-24 flex-col items-center gap-2"
                  data-tour="dashboard-mobile-menu-toggle"
                  aria-label={isSidebarOpen ? 'Close dashboard menu' : 'Open dashboard menu'}
                >
                  <Menu className="h-6 w-6 transition" />
                  <span className="text-[11px] font-semibold tracking-[0.24em]">
                    MENU
                  </span>
                </button>

                {/* Avatar di tengah navbar - toggle collapsed/expanded */}
                <button
                  type="button"
                  onClick={handleKepalaPngClick}
                  className={`dashboard-tour-avatar ${isTourGuideExpanded ? 'is-active' : ''} -mt-10 inline-flex h-[78px] w-[78px] items-center justify-center rounded-full`}
                  aria-label={isTourGuideExpanded ? 'Tour Guide Active' : 'Buka Tour Guide'}
                >
                  {!isTourGuideExpanded ? (
                    <Image
                      src="/Kepala.png"
                      alt="Tour Guide"
                      width={56}
                      height={56}
                      className="dashboard-tour-avatar-image h-14 w-14 rounded-full object-cover"
                      priority
                    />
                  ) : (
                    <span className="dashboard-tour-active-dot h-3 w-3 rounded-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSidebarOpen(false)
                    handleViewChange('dashboard')
                  }}
                  className="dashboard-tour-nav-action group inline-flex w-24 flex-col items-center gap-2"
                  aria-label="Start Journey"
                >
                  <Play className="h-6 w-6 transition" />
                  <span className="text-[11px] font-semibold tracking-[0.24em]">
                    MULAI
                  </span>
                </button>
            </div>
          </div>
        </nav>
      </main>
    </div>
  )
}

export default function MemberDashboard() {
  return <DashboardContent />
}
