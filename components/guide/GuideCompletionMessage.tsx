'use client';

import React, { useState } from 'react';
import { useGuide } from '@/contexts/GuideContext';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

/**
 * GuideCompletionMessage Component
 * 
 * Displays a congratulations message when the guide is completed,
 * and offers a bonus guide based on the current page.
 * 
 * Bonus offers:
 * - Alphabet page → Phonetic Portal
 * - Phonetic Detail page → Vocabulary
 * 
 * Requirements:
 * - 14.1: Display completion message when isCompleted: true
 * - 14.2: Offer to continue to next feature as bonus
 * - 14.3: Navigate to bonus feature when user accepts
 * - 14.4: Close and mark as fully completed when user declines bonus
 * - 14.5: Store bonus completion status separately from main guide
 */
export const GuideCompletionMessage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isCompleted, isActive, bonusOffered, closeGuide, resetGuide } = useGuide();
  const [showBonusOffer, setShowBonusOffer] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Only show if guide is completed and not active
  if (!isCompleted || isActive || !isVisible) return null;

  // If bonus already offered, don't show anything
  if (bonusOffered) return null;

  // Determine bonus content based on current page
  const getBonusContent = () => {
    if (pathname === '/dashboard') {
      return {
        title: 'Bonus: Jelajahi Skill Selection! 🎁',
        message: 'Apakah Anda ingin melanjutkan panduan untuk menjelajahi halaman Skill Selection? Ini akan membantu Anda memilih skill yang ingin dipelajari.',
        route: '/skill',
      };
    } else if (pathname === '/skill') {
      return {
        title: 'Bonus: Jelajahi Pronunciation Menu! 🎁',
        message: 'Apakah Anda ingin melanjutkan panduan untuk menjelajahi menu Pronunciation? Ini akan membantu Anda meningkatkan kemampuan pronunciation bahasa Inggris.',
        route: '/skill/pronunciation',
      };
    } else if (pathname === '/skill/pronunciation') {
      return {
        title: 'Bonus: Fitur Alphabet! 🎁',
        message: 'Apakah Anda ingin melanjutkan panduan untuk menjelajahi fitur Alphabet? Ini akan membantu Anda belajar pengucapan huruf-huruf bahasa Inggris.',
        route: '/skill/pronunciation/alphabet',
      };
    } else if (pathname === '/skill/pronunciation/alphabet') {
      return {
        title: 'Bonus: Fitur Phonetic Portal! 🎁',
        message: 'Apakah Anda ingin melanjutkan panduan untuk menjelajahi fitur Phonetic Portal? Ini akan membantu Anda mempelajari simbol-simbol fonetik dan meningkatkan pronunciation Anda.',
        route: '/skill/pronunciation/phoneticSymbols',
      };
    } else if (pathname === '/skill/pronunciation/phoneticSymbols') {
      return {
        title: 'Bonus: Detail Simbol Fonetik! 🎁',
        message: 'Apakah Anda ingin melanjutkan panduan untuk melihat detail simbol fonetik /i/? Ini akan membantu Anda memahami cara pengucapan simbol fonetik secara mendalam.',
        route: '/skill/pronunciation/phoneticSymbols/i',
      };
    } else if (pathname === '/skill/pronunciation/phoneticSymbols/i') {
      return {
        title: 'Bonus: Fitur Vocabulary! 🎁',
        message: 'Apakah Anda ingin melanjutkan panduan untuk menjelajahi fitur vocabulary? Ini akan membantu Anda memperluas kosakata bahasa Inggris Anda.',
        route: '/skill/vocabulary',
      };
    } else if (pathname === '/skill/vocabulary') {
      return {
        title: 'Bonus: Vocabulary Detail! 🎁',
        message: 'Apakah Anda ingin melanjutkan panduan untuk melihat detail topik vocabulary? Ini akan membantu Anda belajar kata-kata dalam topik Personal Information.',
        route: '/skill/vocabulary/topic/pages/personal-information',
      };
    } else if (pathname === '/skill/vocabulary/topic/pages/personal-information') {
      return {
        title: 'Selamat! 🎉',
        message: 'Anda telah menyelesaikan semua panduan GEUWAT! Sekarang Anda siap untuk belajar bahasa Inggris dengan mandiri.',
        route: '/dashboard',
      };
    }
    
    // Default bonus (for other pages)
    return {
      title: 'Bonus: Jelajahi Fitur Lainnya! 🎁',
      message: 'Apakah Anda ingin melanjutkan menjelajahi fitur-fitur lainnya di GEUWAT?',
      route: '/dashboard',
    };
  };

  const bonusContent = getBonusContent();

  const handleContinue = () => {
    // Show bonus offer
    setShowBonusOffer(true);
  };

  const handleAcceptBonus = () => {
    // Navigate to bonus feature
    console.log('[GuideCompletionMessage] Bonus accepted - navigating to:', bonusContent.route);
    setIsVisible(false);
    resetGuide(); // Reset guide before navigating
    router.push(bonusContent.route);
  };

  const handleDeclineBonus = () => {
    // Close and mark as fully completed
    console.log('[GuideCompletionMessage] Bonus declined');
    setIsVisible(false);
    resetGuide(); // Reset guide completely instead of just closing
  };

  const handleClose = () => {
    console.log('[GuideCompletionMessage] Close button clicked');
    setIsVisible(false);
    resetGuide(); // Reset guide completely instead of just closing
  };

  if (showBonusOffer) {
    return (
      <div 
        className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bonus-offer-title"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-[90%] p-6 space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="w-20 h-20 relative">
              <Image
                src="/Kepala1.png"
                alt="Guide Avatar"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <h2 
            id="bonus-offer-title"
            className="text-xl font-bold text-center text-gray-900"
          >
            {bonusContent.title}
          </h2>

          {/* Message */}
          <p className="text-center text-gray-700">
            {bonusContent.message}
          </p>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleDeclineBonus}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
              aria-label="Tolak bonus"
            >
              Tidak, Terima Kasih
            </button>
            <button
              onClick={handleAcceptBonus}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              aria-label="Terima bonus"
            >
              Ya, Lanjutkan!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-[90%] p-6 space-y-4">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="w-20 h-20 relative">
            <Image
              src="/Kepala1.png"
              alt="Guide Avatar"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h2 
          id="completion-title"
          className="text-2xl font-bold text-center text-gray-900"
        >
          🎉 Selamat!
        </h2>

        {/* Message */}
        <p className="text-center text-gray-700">
          Anda telah menyelesaikan panduan GEUWAT! Sekarang Anda siap untuk memulai 
          perjalanan pembelajaran bahasa Inggris Anda.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={handleContinue}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            aria-label="Lanjutkan"
          >
            Lanjutkan
          </button>
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
            aria-label="Tutup"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideCompletionMessage;
