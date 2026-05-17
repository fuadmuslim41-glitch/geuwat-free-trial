'use client'

type SpeakOptions = {
  rate?: number
  pitch?: number
  volume?: number
  lang?: string
}

let cachedBestVoice: SpeechSynthesisVoice | null = null

function pickBestEnglishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null

  const candidates = voices.filter((voice) => {
    const lang = (voice.lang || '').toLowerCase()
    return lang.startsWith('en-us') || lang.startsWith('en_us') || lang === 'en-us'
  })

  const pool = candidates.length ? candidates : voices.filter((voice) => (voice.lang || '').toLowerCase().startsWith('en'))
  if (!pool.length) return null

  const preferredNameHints = [
    'google us english',
    'microsoft david',
    'microsoft zira',
    'samantha',
    'alex',
  ]

  const ranked = [...pool].sort((a, b) => {
    const aName = (a.name || '').toLowerCase()
    const bName = (b.name || '').toLowerCase()
    const aScore = preferredNameHints.findIndex((hint) => aName.includes(hint))
    const bScore = preferredNameHints.findIndex((hint) => bName.includes(hint))
    const norm = (score: number) => (score === -1 ? 999 : score)
    return norm(aScore) - norm(bScore)
  })

  return ranked[0] ?? null
}

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
    cachedBestVoice = pickBestEnglishVoice(existing)
    return
  }

  await new Promise<void>((resolve) => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      synthesis.removeEventListener('voiceschanged', onVoicesChanged as EventListener)
      const voices = synthesis.getVoices()
      cachedBestVoice = pickBestEnglishVoice(voices)
      resolve()
    }

    const onVoicesChanged = () => finish()
    synthesis.addEventListener('voiceschanged', onVoicesChanged as EventListener)

    window.setTimeout(() => finish(), 900)
  })
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

