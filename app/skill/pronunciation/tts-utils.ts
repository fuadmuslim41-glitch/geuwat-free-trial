'use client'

import { pickPreferredEnglishVoice, waitForVoices } from '@/lib/tts/speech'

type SpeakOptions = {
  rate?: number
  pitch?: number
  volume?: number
  lang?: string
}

let cachedBestVoice: SpeechSynthesisVoice | null = null

function ensureSpeechSynthesis(): SpeechSynthesis | null {
  if (typeof window === 'undefined') return null
  if (!('speechSynthesis' in window)) return null
  return window.speechSynthesis
}

export async function primeBestEnglishVoice(): Promise<void> {
  const synthesis = ensureSpeechSynthesis()
  if (!synthesis) return

  const existing = synthesis.getVoices()
  if (existing.length) {
    cachedBestVoice = pickPreferredEnglishVoice(existing, 'en-US')
    return
  }

  await waitForVoices()
  cachedBestVoice = pickPreferredEnglishVoice(synthesis.getVoices(), 'en-US')
}

export async function speakWithBestEnglishVoice(text: string, options: SpeakOptions = {}): Promise<void> {
  const synthesis = ensureSpeechSynthesis()
  if (!synthesis) return

  const trimmed = text?.trim?.() ?? ''
  if (!trimmed) return

  if (!cachedBestVoice) {
    await primeBestEnglishVoice()
  }

  await new Promise<void>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(trimmed)
    utterance.lang = options.lang ?? cachedBestVoice?.lang ?? 'en-US'
    utterance.rate = options.rate ?? 0.95
    utterance.pitch = options.pitch ?? 1
    utterance.volume = options.volume ?? 1
    if (cachedBestVoice) utterance.voice = cachedBestVoice

    utterance.onend = () => resolve()
    utterance.onerror = () => resolve()

    synthesis.speak(utterance)
  })
}

