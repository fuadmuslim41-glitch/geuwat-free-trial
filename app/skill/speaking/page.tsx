'use client'

import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SpeakingSkillTeaser() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Speaking Practice Premium
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl mx-auto mb-12">
              Tingkatkan kemampuan berbicara bahasa Inggris Anda dengan latihan interaktif dan robot conversation partner!
            </p>

            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-400">100+</div>
                <div className="text-sm text-slate-400 mt-1">Topik Percakapan</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-fuchsia-400">24/7</div>
                <div className="text-sm text-slate-400 mt-1">Robot Practice</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-2">Robot Conversation Partner</h3>
              <p className="text-slate-400 text-sm">Latihan percakapan dengan robot yang natural dan responsif, tersedia 24/7</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-2">Pronunciation Analysis</h3>
              <p className="text-slate-400 text-sm">Analisis pelafalan dengan teknologi untuk koreksi akurat</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-2">Instant Feedback</h3>
              <p className="text-slate-400 text-sm">Koreksi dan saran langsung saat latihan untuk improvement cepat</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 mb-12">
            <h2 className="text-xl font-bold text-white mb-6">Fitur Eksklusif Speaking Practice</h2>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-pink-400 text-lg">✓</span>
                <span className="text-slate-300 text-sm">100+ topik percakapan dari daily conversation hingga business English</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-pink-400 text-lg">✓</span>
                <span className="text-slate-300 text-sm">Role-play scenarios untuk berbagai situasi real-life</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-pink-400 text-lg">✓</span>
                <span className="text-slate-300 text-sm">Recording & playback untuk review progress Anda</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-pink-400 text-lg">✓</span>
                <span className="text-slate-300 text-sm">Personalized learning path berdasarkan level Anda</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://learningenglishgeuwat-ten.vercel.app/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-emerald-500/50 hover:shadow-emerald-400/60 hover:scale-105"
            >
              Daftar Sekarang & Mulai Speaking Practice
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
