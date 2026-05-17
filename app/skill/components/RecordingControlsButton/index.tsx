'use client'

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Circle, Mic, Sparkles, CheckCircle2, Award } from 'lucide-react';

interface RecordingControlsButtonProps {
  downloadFileName?: string;
  className?: string;
  showHelp?: boolean;
}

const RecordingControlsButton: React.FC<RecordingControlsButtonProps> = ({
  className = '',
}) => {
  const [showTeaser, setShowTeaser] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ui = (
    <>
      {/* Floating Recording Button */}
      <button
        onClick={() => setShowTeaser(true)}
        data-tour="recording-open-teaser"
        className={`fixed bottom-[calc(env(safe-area-inset-bottom,0px)+104px)] md:bottom-6 right-6 z-[85] w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-cyber-cyan via-cyber-pink to-purple-600 backdrop-blur-sm border-2 border-cyber-cyan rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(190,41,236,0.5)] hover:shadow-[0_0_50px_rgba(190,41,236,0.8)] transition-all duration-300 group animate-pulse ${className}`}
        title="Lihat Fitur Recording"
      >
        <Mic className="text-white group-hover:scale-110 transition-transform" size={24} />
      </button>

      {/* Teaser Popup */}
      {showTeaser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setShowTeaser(false)}
          />
          
          <div className="relative bg-gradient-to-br from-[#0a0f1c] via-[#0d1420] to-[#050a10] border-2 border-cyber-cyan/50 rounded-3xl p-4 sm:p-6 max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto w-full shadow-[0_0_80px_rgba(190,41,236,0.4)] mx-4 sm:mx-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowTeaser(false)}
              data-tour="alphabet-close-recording"
              className="absolute top-2 right-2 text-gray-400 hover:text-white hover:bg-red-500/20 p-1.5 rounded-lg transition-all duration-200 z-10"
              title="Tutup"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header with Icon */}
            <div className="text-center mb-3">
              <h2 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-pink to-purple-400 mb-2">
                Fitur Recording Premium
              </h2>
              <p className="text-gray-300 text-xs">
                Rekam, Analisis & Tingkatkan Pronunciation Anda dengan AI
              </p>
            </div>

            {/* Description */}
            <div className="mb-6 p-4 bg-cyber-cyan/5 border border-cyber-cyan/20 rounded-xl">
              <p className="text-gray-200 text-center leading-relaxed">
                Bayangkan bisa <span className="text-cyber-cyan font-semibold">merekam suara Anda</span>, mendengarkan kembali setiap detail pronunciation, 
                dan mendapatkan <span className="text-cyber-pink font-semibold">feedback langsung dari AI</span> tentang akurasi pengucapan Anda. 
                Fitur ini membantu Anda <span className="text-purple-400 font-semibold">berbicara bahasa Inggris dengan percaya diri</span>!
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-cyber-cyan/10 to-transparent border border-cyber-cyan/30 rounded-xl p-4 hover:border-cyber-cyan/50 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-cyber-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mic className="text-cyber-cyan" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Rekam Suara Anda</h3>
                    <p className="text-gray-400 text-sm">Rekam pronunciation dengan kualitas tinggi, dengarkan ulang kapan saja</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyber-pink/10 to-transparent border border-cyber-pink/30 rounded-xl p-4 hover:border-cyber-pink/50 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-cyber-pink/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="text-cyber-pink" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Analisis AI</h3>
                    <p className="text-gray-400 text-sm">Upload ke AI untuk mendapat feedback pronunciation yang akurat</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-xl p-4 hover:border-purple-500/50 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Track Progress</h3>
                    <p className="text-gray-400 text-sm">Simpan hasil dan pantau perkembangan pronunciation Anda dari waktu ke waktu</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/30 rounded-xl p-4 hover:border-teal-500/50 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="text-teal-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Latihan Unlimited</h3>
                    <p className="text-gray-400 text-sm">Rekam sebanyak yang Anda mau, tanpa batasan waktu atau jumlah</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="mb-6 p-5 bg-gradient-to-r from-cyber-cyan/5 via-cyber-pink/5 to-purple-500/5 border border-cyber-cyan/20 rounded-xl">
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <Sparkles className="text-cyber-pink" size={20} />
                Apa yang Anda Dapatkan:
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-cyber-cyan flex-shrink-0 mt-0.5" size={18} />
                  <span>Kontrol perekaman lengkap: Record, Stop, Play, Download</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-cyber-cyan flex-shrink-0 mt-0.5" size={18} />
                  <span>Panduan step-by-step untuk menggunakan AI assistant</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-cyber-cyan flex-shrink-0 mt-0.5" size={18} />
                  <span>Feedback pronunciation yang detail dan actionable</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-cyber-cyan flex-shrink-0 mt-0.5" size={18} />
                  <span>Sistem progress tracking untuk monitor perkembangan</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-cyber-cyan flex-shrink-0 mt-0.5" size={18} />
                  <span>Akses ke semua materi Vocabulary & Pronunciation</span>
                </li>
              </ul>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <div className="mb-2 p-2 bg-gradient-to-r from-cyber-pink/10 to-purple-500/10 border border-cyber-pink/30 rounded-xl">
                <p className="text-cyber-pink font-semibold text-xs mb-1">
                  🎁 Bonus Eksklusif untuk Member Baru!
                </p>
                <p className="text-gray-300 text-xs">
                  Dapatkan akses ke 100+ pronunciation exercises + AI feedback unlimited
                </p>
              </div>
              
              <a
                href="https://learningenglishgeuwat-ten.vercel.app/register"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_50px_rgba(16,185,129,0.8)] hover:scale-105 transition-all duration-300"
              >
                🚀 Daftar Sekarang & Mulai Recording
              </a>
              
              <p className="text-gray-400 text-xs mt-2">
                Bergabunglah dengan learners yang sudah meningkatkan pronunciation mereka
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (!mounted) return null;
  return createPortal(ui, document.body);
};

export default RecordingControlsButton;
