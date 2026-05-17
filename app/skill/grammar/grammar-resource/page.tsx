'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import BackButton from '../../components/BackButton'

export default function GrammarResourcePage() {
  return (
    <div className="min-h-screen bg-[#020916] px-4 py-6 text-cyan-100">
      <div className="mx-auto flex max-w-5xl items-center justify-start">
        <BackButton to="/skill/grammar" />
      </div>

      <main className="mx-auto mt-8 max-w-4xl flex items-center justify-center min-h-[70vh]">
        <div className="w-full px-6 py-10 bg-gradient-to-br from-[#0a1628]/90 to-[#020916]/90 backdrop-blur-sm rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-100 mb-3">
              Grammar Resource Premium
            </h1>
            <p className="text-base text-cyan-100/90 leading-relaxed max-w-2xl mx-auto">
              Kuasai grammar bahasa Inggris dari dasar hingga mahir dengan materi lengkap, terstruktur, dan mudah dipahami. Dilengkapi contoh real-life dan latihan interaktif!
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-10 pb-8 border-b border-cyan-500/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">50+</div>
              <div className="text-sm text-cyan-100/70">Topik Grammar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">500+</div>
              <div className="text-sm text-cyan-100/70">Contoh Kalimat</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">100%</div>
              <div className="text-sm text-cyan-100/70">Praktis & Aplikatif</div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-4 mb-10 pb-8 border-b border-cyan-500/20">
            {/* Features section removed */}
          </div>

          {/* Topics */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-cyan-100 mb-6 text-center">Topik Grammar yang Akan Anda Kuasai</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-cyan-300 mb-3">Foundation Grammar</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-cyan-100/90 text-sm">
                    <span className="text-cyan-400">✓</span>
                    <span>Parts of Speech</span>
                  </div>
                  <div className="flex items-start gap-2 text-cyan-100/90 text-sm">
                    <span className="text-cyan-400">✓</span>
                    <span>Sentence Structure</span>
                  </div>
                  <div className="flex items-start gap-2 text-cyan-100/90 text-sm">
                    <span className="text-cyan-400">✓</span>
                    <span>Subject-Verb Agreement</span>
                  </div>
                  <div className="flex items-start gap-2 text-cyan-100/90 text-sm">
                    <span className="text-cyan-400">✓</span>
                    <span>Pronouns & Determiners</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-cyan-300 mb-3">Tense System</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-cyan-100/90 text-sm">
                    <span className="text-cyan-400">✓</span>
                    <span>Present Tenses</span>
                  </div>
                  <div className="flex items-start gap-2 text-cyan-100/90 text-sm">
                    <span className="text-cyan-400">✓</span>
                    <span>Past Tenses</span>
                  </div>
                  <div className="flex items-start gap-2 text-cyan-100/90 text-sm">
                    <span className="text-cyan-400">✓</span>
                    <span>Future Forms</span>
                  </div>
                  <div className="flex items-start gap-2 text-cyan-100/90 text-sm">
                    <span className="text-cyan-400">✓</span>
                    <span>Perfect & Continuous</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-cyan-300 mb-3">Advanced Topics</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-cyan-100/90 text-sm">
                    <span className="text-cyan-400">✓</span>
                    <span>Conditionals</span>
                  </div>
                  <div className="flex items-start gap-2 text-cyan-100/90 text-sm">
                    <span className="text-cyan-400">✓</span>
                    <span>Passive Voice</span>
                  </div>
                  <div className="flex items-start gap-2 text-cyan-100/90 text-sm">
                    <span className="text-cyan-400">✓</span>
                    <span>Reported Speech</span>
                  </div>
                  <div className="flex items-start gap-2 text-cyan-100/90 text-sm">
                    <span className="text-cyan-400">✓</span>
                    <span>Modal Verbs</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-cyan-100/80">
              Dan masih banyak lagi topik grammar lainnya yang akan membantu Anda berbicara dan menulis bahasa Inggris dengan percaya diri!
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link 
              href="https://learningenglishgeuwat-ten.vercel.app/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm rounded-lg transition-all duration-300 shadow-lg shadow-emerald-500/50 hover:shadow-emerald-400/60 hover:scale-105"
            >
              Daftar Sekarang & Akses Grammar Resource
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <p className="mt-4 text-sm text-cyan-100/70">
              🎁 <span className="text-emerald-300 font-semibold">Free Grammar Cheat Sheet</span> untuk member baru!
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}
