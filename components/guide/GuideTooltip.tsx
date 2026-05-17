'use client';

import React, { useMemo, useEffect, useCallback } from 'react';
import { GuideStep } from '@/types/guide';

export interface GuideTooltipProps {
  step: GuideStep;
  currentStepIndex: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onRequestPause?: () => void;
  isPaused?: boolean;
}

export const GuideTooltip: React.FC<GuideTooltipProps> = ({
  step,
  currentStepIndex,
  totalSteps,
  onPrev,
  onNext,
  onClose,
}) => {
  const isFirstStep = currentStepIndex <= 0;
  const isLastStep = currentStepIndex >= totalSteps - 1;

  const nextLabel = isLastStep ? 'Selesai' : 'Next';

  // Keyboard event handler for global keyboard shortcuts
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Escape key to close guide
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    // Arrow keys for navigation
    if (event.key === 'ArrowLeft' && !isFirstStep) {
      event.preventDefault();
      onPrev();
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onNext();
      return;
    }
  }, [isFirstStep, onPrev, onNext, onClose]);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const tooltipWidthClass = useMemo(() => {
    // Keep it aligned with requirements: desktop max-width 400px, mobile 90vw
    return 'max-w-[400px] w-full sm:w-auto sm:mx-0';
  }, []);

  return (
    <div
      className="fixed z-[10001] left-1/2 -translate-x-1/2 bottom-4 sm:bottom-8 w-[90vw] sm:w-auto"
      style={{
        maxWidth: 400,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Panduan interaktif"
      aria-describedby="guide-tooltip-content"
    >
      <div
        className={
          'bg-white text-slate-900 rounded-t-2xl sm:rounded-2xl shadow-xl p-4 sm:p-5 '
        }
      >
        <div className="flex items-start gap-3">
          <img
            src="/Kepala1.png"
            alt="Avatar panduan"
            className="w-12 h-12 sm:w-14 sm:h-14 shrink-0"
            aria-hidden="true"
          />
          <div className="flex-1">
            <p 
              id="guide-tooltip-content"
              className="text-sm sm:text-base leading-relaxed"
              aria-current="step"
            >
              {step.tooltipText}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={isFirstStep}
            tabIndex={isFirstStep ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!isFirstStep) {
                  onPrev();
                }
              }
            }}
            className={
              'h-11 min-w-[44px] px-3 rounded-xl border text-sm sm:text-base '
              + (isFirstStep
                ? 'opacity-50 cursor-not-allowed bg-slate-50'
                : 'hover:bg-slate-50')
            }
            aria-label="Kembali ke langkah sebelumnya"
            aria-disabled={isFirstStep}
          >
            Prev
          </button>

          <div className="flex-1" />

          <button
            type="button"
            onClick={onClose}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClose();
              }
            }}
            className="h-11 min-w-[44px] px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm sm:text-base"
            aria-label="Tutup panduan"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onNext}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNext();
              }
            }}
            className="h-11 min-w-[44px] px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm sm:text-base"
            aria-label={isLastStep ? 'Selesai panduan' : 'Lanjut ke langkah berikutnya'}
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders (Requirement 17.5, 20.2)
export default React.memo(GuideTooltip);

