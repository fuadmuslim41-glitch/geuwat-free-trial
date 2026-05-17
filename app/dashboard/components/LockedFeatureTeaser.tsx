'use client'

import React from 'react'
import { Lock, Sparkles } from 'lucide-react'

interface LockedFeatureTeaserProps {
  feature: 'notifications' | 'progress' | 'achievements' | 'tutorial' | 'settings' | 'device-approve' | 'help-support'
}

const featureContent = {
  notifications: {
    icon: '🔔',
    title: 'Notifikasi Real-Time',
    description: 'Dapatkan update terbaru tentang progress belajar Anda, achievement baru, dan pengumuman penting langsung ke dashboard Anda.',
    benefits: [
      'Update fitur terbaru',
      'Notifikasi achievement unlock',
      'Pengumuman event & promo'
    ]
  },
  progress: {
    icon: '📊',
    title: 'Tracking Progress Lengkap',
    description: 'Pantau perkembangan belajar Anda dengan detail. Lihat statistik, grafik kemajuan, dan analisis mendalam tentang skill yang sudah dikuasai.',
    benefits: [
      'Grafik progress visual',
      'Statistik pembelajaran detail',
      'Analisis kekuatan & kelemahan'
    ]
  },
  achievements: {
    icon: '🏆',
    title: 'Sistem Achievement & Rewards',
    description: 'Raih berbagai achievement menarik dan dapatkan reward eksklusif. Buktikan kemampuan Anda dan bersaing dengan member lain!',
    benefits: [
      'Achievement menarik',
      'Leaderboard kompetitif',
      'Reward & bonus special'
    ]
  },
  tutorial: {
    icon: '🎓',
    title: 'Tutorial & Roadmap Lengkap',
    description: 'Akses panduan belajar terstruktur dengan roadmap yang jelas. Dari pemula hingga mahir, semua ada panduannya!',
    benefits: [
      'Roadmap belajar terstruktur',
      'Step-by-step guidance',
      'Tips & tricks dari expert'
    ]
  },
  settings: {
    icon: '⚙️',
    title: 'Pengaturan Personal',
    description: 'Sesuaikan pengalaman belajar Anda. Atur preferensi, notifikasi, tema, dan berbagai fitur personalisasi lainnya.',
    benefits: [
      'Personalisasi tampilan',
      'Atur jadwal belajar',
      'Kelola notifikasi'
    ]
  },
  'device-approve': {
    icon: '🔐',
    title: 'Keamanan Akun',
    description: 'Akses akun Anda dari berbagai device dengan aman. Kelola perangkat yang terhubung dan approve device baru dengan mudah.',
    benefits: [
      'Keamanan berlapis',
      'Device management'
    ]
  },
  'help-support': {
    icon: '💬',
    title: 'Support 24/7',
    description: 'Dapatkan bantuan kapan saja Anda butuhkan. Tim support kami siap membantu Anda dengan respon cepat dan solusi efektif.',
    benefits: [
      'Laporkan kendala',
      'FAQ lengkap',
      'Priority response'
    ]
  }
}

export default function LockedFeatureTeaser({ feature }: LockedFeatureTeaserProps) {
  const content = featureContent[feature]

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-purple-500/30 backdrop-blur-sm">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-3xl" />
          
          <div className="relative p-8 md:p-12">
            {/* Lock Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 p-4 rounded-full border border-purple-500/30">
                  <Lock className="w-8 h-8 text-purple-300" />
                </div>
              </div>
            </div>

            {/* Feature Icon & Title */}
            <div className="text-center mb-3">
              <h2 className="text-lg md:text-xl font-bold text-white mb-2">
                {content.title}
              </h2>
              <p className="text-slate-300 text-xs leading-relaxed">
                {content.description}
              </p>
            </div>

            {/* Benefits List */}
            <div className="mb-4 bg-slate-900/50 rounded-xl p-3 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <h3 className="text-sm font-semibold text-purple-300">Fitur yang Anda Dapatkan:</h3>
              </div>
              <ul className="space-y-1.5">
                {content.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-300 text-xs">
                    <span className="text-purple-400 mt-0.5">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
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
                <Lock className="w-3 h-3" />
                <span>Daftar Sekarang & Unlock Semua Fitur</span>
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
  )
}
