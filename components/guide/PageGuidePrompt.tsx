'use client';

import React, { useEffect, useState } from 'react';
import { useGuide } from '@/contexts/GuideContext';
import { usePathname } from 'next/navigation';
import { hasGuideForPage, getPageGuideStartIndex, GUIDE_FLOW } from '@/config/guideFlowConfig';
import Image from 'next/image';

/**
 * PageGuidePrompt Component
 * 
 * Displays a prompt when user loads a page that has a guide available.
 * Offers the user the option to start/resume the guide or dismiss it.
 * 
 * This prompt appears on every page load if:
 * - The page has a guide configured
 * - The guide is not currently active
 * - The user hasn't dismissed it for this session
 */
export const PageGuidePrompt: React.FC = () => {
  const pathname = usePathname();
  const { isActive, isPaused, currentStepIndex, goToStep, closeGuide } = useGuide();
  const [shouldShow, setShouldShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check if current page has a guide and show prompt
  useEffect(() => {
    // Don't show if guide is already active
    if (isActive) {
      setShouldShow(false);
      return;
    }

    // Don't show if user dismissed it
    if (dismissed) {
      setShouldShow(false);
      return;
    }

    // Check if current page has a guide
    const hasGuide = hasGuideForPage(pathname);
    
    if (hasGuide) {
      // Wait 500ms before showing the prompt to ensure page is fully loaded
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setShouldShow(false);
    }
  }, [pathname, isActive, dismissed]);

  // Reset dismissed state when pathname changes
  useEffect(() => {
    setDismissed(false);
  }, [pathname]);

  // Don't show if conditions not met
  if (!shouldShow || isActive) {
    return null;
  }

  // Check if we should resume or start new
  const currentStep = GUIDE_FLOW[currentStepIndex];
  const isResuming = isPaused && currentStep && currentStep.route === pathname;

  const handleStart = () => {
    console.log('[PageGuidePrompt] Start/Resume button clicked for page:', pathname);
    
    if (isResuming) {
      // Resume from saved position
      console.log('[PageGuidePrompt] Resuming from step:', currentStepIndex);
      goToStep(currentStepIndex);
    } else {
      // Start from first step of this page
      const firstStepIndex = getPageGuideStartIndex(pathname);
      
      if (firstStepIndex !== -1) {
        console.log('[PageGuidePrompt] Starting from step:', firstStepIndex);
        goToStep(firstStepIndex);
      }
    }
    
    setShouldShow(false);
  };

  const handleDismiss = () => {
    console.log('[PageGuidePrompt] Dismiss button clicked');
    setDismissed(true);
    setShouldShow(false);
    closeGuide();
  };

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="page-guide-prompt-title"
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
          id="page-guide-prompt-title"
          className="text-xl font-bold text-center text-gray-900"
        >
          {isResuming ? 'Lanjutkan Panduan?' : 'Mulai Panduan?'}
        </h2>

        {/* Message */}
        <p className="text-center text-gray-700">
          {isResuming 
            ? 'Anda memiliki panduan yang belum selesai. Apakah Anda ingin melanjutkan dari tempat terakhir?'
            : 'Halaman ini memiliki panduan interaktif. Apakah Anda ingin memulai panduan untuk mempelajari fitur-fitur yang tersedia?'
          }
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
            onClick={handleStart}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            aria-label={isResuming ? 'Lanjutkan panduan' : 'Mulai panduan'}
          >
            {isResuming ? 'Ya, Lanjutkan' : 'Ya, Mulai Panduan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageGuidePrompt;
