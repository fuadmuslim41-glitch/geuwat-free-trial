'use client'

import React from 'react'

type CommonLettersModalProps = {
  isOpen: boolean
  onClose: () => void
  letters: any | null
  isLoading: boolean
  error: string | null
  onRetry: () => void
}

export default function CommonLettersModal({
  isOpen,
  onClose,
}: CommonLettersModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-black/98 border border-[rgba(168,85,247,0.4)] rounded-2xl p-8 md:p-12 max-w-2xl w-full shadow-[0_0_60px_rgba(168,85,247,0.3)] backdrop-blur-xl my-8 z-[10001]">
        {/* Close button */}
        <button
          onClick={onClose}
          data-tour="phonetic-close-popup"
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition z-[10002]"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-lg md:text-xl font-bold text-white mb-2">
            Common Letters
          </h3>
          <p className="text-xs text-slate-400">
            Huruf-huruf yang menghasilkan suara ini
          </p>
        </div>

        {/* Sound Example - Only /i/ */}
        <div className="mb-4 p-3 rounded-xl bg-purple-500/10 border border-purple-400/30">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-2xl font-bold text-purple-300">/i/</span>
            <span className="text-xl text-purple-200">→</span>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-lg font-mono text-purple-100 bg-purple-500/20 px-2 py-1 rounded">ee</span>
              <span className="text-lg font-mono text-purple-100 bg-purple-500/20 px-2 py-1 rounded">ea</span>
              <span className="text-lg font-mono text-purple-100 bg-purple-500/20 px-2 py-1 rounded">e</span>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="space-y-1">
              <p className="text-xs text-purple-100">
                <span className="font-semibold">ee</span> → <span className="font-mono">see, green, meet</span>
              </p>
              <p className="text-xs text-purple-100">
                <span className="font-semibold">ea</span> → <span className="font-mono">eat, teacher, clean</span>
              </p>
              <p className="text-xs text-purple-100">
                <span className="font-semibold">e</span> → <span className="font-mono">me, he, these</span>
              </p>
            </div>
            <div className="pt-2 border-t border-purple-400/20">
              <p className="text-xs text-purple-200/90 italic">
                💡 Lidah depan tinggi, bunyi tegang dan lebih panjang
              </p>
            </div>
          </div>
        </div>

        {/* Persuasive Text */}
        <div className="mb-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 border-2 border-purple-400/50 mb-3">
            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h4 className="text-base md:text-lg font-bold text-white mb-2">
            Unlock Full Common Letters Database! 🔓
          </h4>
          
          <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto mb-3">
            Dapatkan akses ke <span className="text-emerald-400 font-semibold">berbagai pola huruf</span> untuk semua simbol fonetik. 
            Pelajari bagaimana huruf-huruf membentuk suara yang berbeda dan tingkatkan pronunciation Anda secara drastis!
          </p>

          <div className="space-y-1.5 mb-4">
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Pola lengkap untuk 44 simbol fonetik</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-emerald-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Berbagai contoh kata dengan audio native speaker</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-emerald-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Tips pronunciation untuk setiap pola</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <a
          href="https://learningenglishgeuwat-ten.vercel.app/register"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs text-center transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:scale-[1.02]"
        >
          Daftar Sekarang - Gratis!
        </a>

        {/* Small text */}
        <p className="text-center text-xs text-slate-500 mt-2">
          Akses penuh • Tanpa biaya tersembunyi • Belajar kapan saja
        </p>
      </div>
    </div>
  )
}
