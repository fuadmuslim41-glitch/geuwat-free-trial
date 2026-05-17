'use client';

import React, { useEffect } from 'react';
import { useGuide } from '@/contexts/GuideContext';
import Image from 'next/image';

/**
 * GuideResumePrompt Component
 * 
 * Displays a prompt when the guide is paused, offering the user
 * the option to resume or dismiss the guide.
 * 
 * Requirements:
 * - 7.5: When user returns to a page where guide was paused, offer to resume
 * - 14.2: Display prompt when guide state has isPaused: true
 */
export const GuideResumePrompt: React.FC = () => {
  const { isPaused, isActive, resumeGuide, closeGuide } = useGuide();
  const [shouldShow, setShouldShow] = React.useState(false);

  // Add delay before showing prompt to ensure page is loaded
  useEffect(() => {
    if (isPaused && !isActive) {
      // Wait 500ms before showing the prompt to ensure page is fully loaded
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setShouldShow(false);
    }
  }, [isPaused, isActive]);

  // Log state changes for debugging
  useEffect(() => {
    console.log('[GuideResumePrompt] State changed - isPaused:', isPaused, 'isActive:', isActive, 'shouldShow:', shouldShow);
  }, [isPaused, isActive, shouldShow]);

  // Don't show if guide is active or not paused or delay not elapsed
  if (!isPaused || isActive || !shouldShow) {
    console.log('[GuideResumePrompt] Not rendering - isPaused:', isPaused, 'isActive:', isActive, 'shouldShow:', shouldShow);
    return null;
  }

  const handleResume = () => {
    console.log('[GuideResumePrompt] Resume button clicked');
    resumeGuide();
  };

  const handleDismiss = () => {
    console.log('[GuideResumePrompt] Dismiss button clicked');
    closeGuide();
  };

  console.log('[GuideResumePrompt] Rendering - isPaused:', isPaused, 'isActive:', isActive, 'shouldShow:', shouldShow);

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-prompt-title"
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
          id="resume-prompt-title"
          className="text-xl font-bold text-center text-gray-900"
        >
          Lanjutkan Panduan?
        </h2>

        {/* Message */}
        <p className="text-center text-gray-700">
          Anda memiliki panduan yang belum selesai. Apakah Anda ingin melanjutkan dari tempat terakhir?
        </p>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleDismiss}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
            aria-label="Tutup panduan"
          >
            Tidak, Terima Kasih
          </button>
          <button
            onClick={handleResume}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            aria-label="Lanjutkan panduan"
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideResumePrompt;
