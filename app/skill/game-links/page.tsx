'use client'

import Link from '../../components/HoverPrefetchLink'
import { ArrowUpRight } from 'lucide-react'
import BackButton from '../components/BackButton'

export default function SkillGameLinksPage() {
  return (
    <div className="min-h-screen bg-[#020916] px-4 py-6 text-cyan-100">
      <div className="mx-auto flex max-w-5xl items-center justify-start">
        <BackButton to="/skill" />
      </div>

      <main className="mx-auto mt-8 max-w-5xl flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-2xl px-6 py-8 bg-gradient-to-br from-[#0a1628]/90 to-[#020916]/90 backdrop-blur-sm rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-100 mb-4">
            Fitur Premium
          </h2>

          <p className="text-base text-cyan-100/90 mb-6 leading-relaxed">
            Akses koleksi lengkap game pembelajaran bahasa Inggris yang dirancang untuk meningkatkan spelling, vocabulary, pronunciation, dan grammar Anda dengan cara yang menyenangkan.
          </p>

          <Link 
            href="https://learningenglishgeuwat-ten.vercel.app/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm rounded-lg transition-all duration-300 shadow-lg shadow-emerald-500/50 hover:shadow-emerald-400/60 hover:scale-105"
          >
            Daftar Sekarang
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <p className="mt-4 text-sm text-cyan-100/60">
            Mulai perjalanan belajar bahasa Inggris Anda hari ini
          </p>
        </div>
      </main>
    </div>
  )
}
