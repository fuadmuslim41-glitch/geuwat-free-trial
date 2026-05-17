'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowRight, Lock } from 'lucide-react'
import Background from '../../components/Background'
import BackButton from '../../../components/BackButton'
import { TOPICS } from '../../constants'

const REGISTER_URL = 'https://learningenglishgeuwat-ten.vercel.app/register'

type PreviewCopy = {
  headline: string
  subheadline: string
  bullets: string[]
}

function copyForTopic(topicId: string, topicTitle: string): PreviewCopy {
  switch (topicId) {
    case 'stressing':
      return {
        headline: 'Biar terdengar natural, bukan “dibaca per kata”.',
        subheadline: `Di ${topicTitle}, kamu belajar ritme English (stress-timed) supaya ucapan lebih jelas dan enak didengar.`,
        bullets: [
          'Latihan Word Stress biar kata terdengar “benar”.',
          'Latihan Sentence Stress biar kalimat punya ritme.',
          'Drill cepat untuk bikin accent kamu naik level.',
        ],
      }
    case 'intonation':
      return {
        headline: 'Satu kalimat, bisa beda makna kalau intonasinya beda.',
        subheadline: `Di ${topicTitle}, kamu latihan rising/falling/fall-rise untuk nunjukin intent dan emosi dengan tepat.`,
        bullets: [
          'Pola dasar intonation untuk pertanyaan & statement.',
          'Latihan emphasis biar terdengar yakin, bukan ragu.',
          'Dialog drill untuk speaking yang lebih “hidup”.',
        ],
      }
    case 'final-sound':
      return {
        headline: 'Akhiran bunyi kecil, efeknya besar.',
        subheadline:
          'Final Sound bikin grammar kamu “kedengeran”: -s/-es dan -ed jadi jelas, tidak ketelen saat ngomong cepat.',
        bullets: [
          'Aturan bunyi untuk -s/-es dan -ed (praktis, bukan teori doang).',
          'Simulasi listening–speaking biar otomatis kebawa.',
          'Common mistakes yang bikin native sulit paham.',
        ],
      }
    case 'american-t':
      return {
        headline: 'Mau kedengeran lebih American? Mulai dari /t/.',
        subheadline:
          'Kamu belajar Flap T dan Glottal Stop (butter, water, button) biar flow-nya lebih native-like.',
        bullets: [
          'Kapan /t/ jadi flap (ɾ) dan kapan jadi glottal stop (ʔ).',
          'Latihan minimal pairs biar telinga makin peka.',
          'Drill kalimat untuk speech casual sehari-hari.',
        ],
      }
    case 'text':
      return {
        headline: 'Latihan paling efektif itu: praktik dalam konteks.',
        subheadline:
          'TEXT membantu kamu melatih clarity, stress, dan rhythm lewat bacaan pendek yang terarah.',
        bullets: [
          'Latihan pelafalan di kalimat asli, bukan kata terpisah.',
          'Checklist fokus biar latihan gak “asal baca”.',
          'Progress terasa karena ada target yang jelas.',
        ],
      }
    case 'reading-text':
      return {
        headline: 'Baca lancar itu skill — bisa dilatih.',
        subheadline:
          'Reading Text berisi bacaan pendek untuk melatih flow, clarity, dan konsistensi bunyi saat membaca paragraf utuh.',
        bullets: [
          'Pilihan teks cepat untuk latihan harian.',
          'Fokus pacing & articulation biar terdengar clean.',
          'Bikin kamu lebih pede saat reading/speaking.',
        ],
      }
    default:
      return {
        headline: 'Fitur ini tersedia di versi lengkap.',
        subheadline: `Lihat preview singkat untuk ${topicTitle}, lalu daftar untuk unlock semua modul.`,
        bullets: ['Materi terstruktur', 'Latihan bertahap', 'Progress tracking'],
      }
  }
}

export default function LockedTopicPage() {
  const params = useParams<{ topicId: string }>()
  const topicId = params?.topicId ?? ''
  const topic = useMemo(() => TOPICS.find((t) => t.id === topicId) ?? TOPICS[0], [topicId])
  const copy = useMemo(() => copyForTopic(topicId, topic.title), [topicId, topic.title])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background topic={topic} />

      <header className="relative z-10 w-full p-4 md:p-6 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <BackButton to="/skill/pronunciation" />
        <div className="text-right">
          <div className="text-[10px] md:text-xs font-mono tracking-[0.25em] text-white/60 uppercase">Preview Mode</div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-10 md:py-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-300/30 bg-yellow-300/10 text-yellow-200 text-xs font-mono tracking-widest uppercase">
          <Lock size={14} />
          Locked Module
        </div>

        <h1 className="mt-5 text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
          {topic.title}
        </h1>
        <p className="mt-3 text-base md:text-lg text-white/85 max-w-3xl">{copy.headline}</p>
        <p className="mt-2 text-sm md:text-base text-white/70 max-w-3xl">{copy.subheadline}</p>

        <div className="mt-8 grid gap-3 max-w-3xl">
          {copy.bullets.map((item) => (
            <div
              key={item}
              className="px-4 py-3 rounded-xl border border-white/10 bg-black/35 backdrop-blur-sm text-white/85 text-sm md:text-base"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href={REGISTER_URL}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold shadow-[0_0_40px_rgba(16,185,129,0.25)] hover:scale-[1.02] transition-all duration-300"
          >
            Daftar sekarang
            <ArrowRight size={18} />
          </Link>
          <div className="mt-3 text-xs text-white/55 font-mono">Unlock semua modul + latihan lengkap.</div>
        </div>
      </main>
    </div>
  )
}

