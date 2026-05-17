'use client'

import React from 'react'
import { X, Sparkles, BookOpen, Target, Trophy, Zap } from 'lucide-react'

interface TourGuideTeaserProps {
  isOpen: boolean
  onClose: () => void
}

export default function TourGuideTeaser({ isOpen, onClose }: TourGuideTeaserProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
        onClick={onClose}
      />

      {/* Popup Modal */}
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 overflow-y-auto">
        <div className="relative max-w-2xl w-full my-8">
          {/* Main Card */}
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-purple-500/30 backdrop-blur-xl overflow-visible">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-3xl" />
            
            <div className="relative p-8 md:p-12">
              {/* Hero Image */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 p-4 rounded-full border border-purple-500/30">
                    <img 
                      src="/Kepala1.png" 
                      alt="Tour Guide" 
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-3">
                <h2 className="text-lg md:text-xl font-bold text-white mb-2">
                  Robot Premium
                </h2>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Belajar lebih cepat dengan panduan Robot personal yang memahami gaya belajar Anda. 
                  Dapatkan tips, trik, dan shortcut eksklusif untuk menguasai bahasa Inggris!
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-900/50 rounded-xl p-3 border border-purple-500/20">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/20">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-0.5">Panduan Interaktif</h3>
                      <p className="text-xs text-slate-400">Step-by-step guidance untuk setiap fitur</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-3 border border-purple-500/20">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 rounded-lg bg-fuchsia-500/20">
                      <Target className="w-4 h-4 text-fuchsia-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-0.5">Personalized Tips</h3>
                      <p className="text-xs text-slate-400">Saran belajar sesuai level Anda</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-3 border border-purple-500/20">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 rounded-lg bg-violet-500/20">
                      <Trophy className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-0.5">Progress Tracking</h3>
                      <p className="text-xs text-slate-400">Monitor kemajuan dengan Robot insights</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-3 border border-purple-500/20">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 rounded-lg bg-pink-500/20">
                      <Zap className="w-4 h-4 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-0.5">Quick Shortcuts</h3>
                      <p className="text-xs text-slate-400">Akses cepat ke fitur favorit</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits List */}
              <div className="mb-4 bg-slate-900/50 rounded-xl p-3 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <h3 className="text-sm font-semibold text-purple-300">Yang Anda Dapatkan:</h3>
                </div>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2 text-slate-300 text-xs">
                    <span className="text-purple-400 mt-0.5">✓</span>
                    <span>Robot Assistant 24/7 yang siap membantu kapan saja</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-300 text-xs">
                    <span className="text-purple-400 mt-0.5">✓</span>
                    <span>Rekomendasi materi belajar yang dipersonalisasi</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-300 text-xs">
                    <span className="text-purple-400 mt-0.5">✓</span>
                    <span>Tips & trik eksklusif dari expert</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-300 text-xs">
                    <span className="text-purple-400 mt-0.5">✓</span>
                    <span>Analisis progress dengan Robot insights</span>
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <a
                  href="https://learningenglishgeuwat-ten.vercel.app/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Daftar Sekarang & Aktifkan Robot Guide</span>
                </a>
                
                <p className="mt-2 text-xs text-slate-400">
                  Dapatkan akses penuh ke semua fitur premium
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              🎁 <span className="text-purple-300 font-semibold">Bonus Special</span> untuk pendaftar baru!
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
