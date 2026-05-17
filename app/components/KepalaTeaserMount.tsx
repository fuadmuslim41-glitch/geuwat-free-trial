'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import TourGuideTeaser from '@/app/dashboard/components/TourGuideTeaser'

import { useGuide } from '@/contexts/GuideContext'
import { PersistenceService } from '@/services/PersistenceService'


const KEPALA_TEASER_OPEN_EVENT = 'geuwat:kepala-teaser-open'
const KEPALA_EXPAND_EVENT = 'geuwat:kepala-expand'
const KEPALA_COLLAPSE_EVENT = 'geuwat:kepala-collapse'
const KEPALA_STATE_EVENT = 'geuwat:kepala-state'


export function dispatchKepalaTeaserOpen() {
  try {
    window.dispatchEvent(new Event(KEPALA_TEASER_OPEN_EVENT))
  } catch {
    // ignore
  }
}

export function dispatchKepalaExpand() {
  try {
    window.dispatchEvent(new Event(KEPALA_EXPAND_EVENT))
  } catch {
    // ignore
  }
}

export function dispatchKepalaCollapse() {
  try {
    window.dispatchEvent(new Event(KEPALA_COLLAPSE_EVENT))
  } catch {
    // ignore
  }
}

function broadcastKepalaState(expanded: boolean) {
  try {
    window.dispatchEvent(new CustomEvent(KEPALA_STATE_EVENT, { detail: { expanded } }))
  } catch {
    // ignore
  }
}

export default function KepalaTeaserMount() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const onOpen = () => setIsOpen(true)
    window.addEventListener(KEPALA_TEASER_OPEN_EVENT, onOpen as EventListener)
    return () => window.removeEventListener(KEPALA_TEASER_OPEN_EVENT, onOpen as EventListener)
  }, [])

  useEffect(() => {
    const onExpand = () => setIsExpanded(true)
    const onCollapse = () => setIsExpanded(false)
    window.addEventListener(KEPALA_EXPAND_EVENT, onExpand as EventListener)
    window.addEventListener(KEPALA_COLLAPSE_EVENT, onCollapse as EventListener)
    return () => {
      window.removeEventListener(KEPALA_EXPAND_EVENT, onExpand as EventListener)
      window.removeEventListener(KEPALA_COLLAPSE_EVENT, onCollapse as EventListener)
    }
  }, [])

  useEffect(() => {
    broadcastKepalaState(isExpanded)
  }, [isExpanded])

  const { startGuide, resumeGuide } = useGuide()

  const handleClosePopup = () => {
    setIsOpen(false)
    setIsExpanded(false)
  }

  return (

    <>
      <TourGuideTeaser isOpen={isOpen} onClose={handleClosePopup} />

      {isExpanded && !isOpen ? (
        <button
          type="button"
          onClick={() => {
            try {
              const saved = PersistenceService.loadState()

              if (!saved) {
                startGuide()
              } else if (!saved.isCompleted) {
                if (saved.isPaused) resumeGuide()
                else startGuide()
              }
            } catch {
              startGuide()
            }

            setIsOpen(true)
          }}


          className="fixed top-6 right-6 z-[140] inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(255,255,255,0.10)] bg-slate-950/70 shadow-[0_0_0_8px_rgba(255,255,255,0.04),0_0_34px_rgba(0,0,0,0.55)] backdrop-blur-md transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,255,255,0.35)]"
          aria-label="Open AI Tour Guide teaser"
        >
          <Image
            src="/Kepala1.png"
            alt="AI Tour Guide"
            width={48}
            height={48}
            className="h-10 w-10 rounded-full object-contain"
            priority
          />
        </button>
      ) : null}
    </>
  )
}
