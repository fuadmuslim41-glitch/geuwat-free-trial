'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGuide } from '@/contexts/GuideContext';
import { GuideOverlay } from '@/components/guide/GuideOverlay';
import { ScrollService } from '@/services/ScrollService';
import { NavigationService } from '@/services/NavigationService';
import { GuideTooltip } from '@/components/guide/GuideTooltip';
import { useRouter, usePathname } from 'next/navigation';

export const GuideManager: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isActive, getCurrentStep, currentStepIndex, totalSteps, nextStep, prevStep, closeGuide, pauseGuide } =
    useGuide();

  const step = getCurrentStep();

  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);
  const [isLoadingTarget, setIsLoadingTarget] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const stepNumber = useMemo(() => currentStepIndex + 1, [currentStepIndex]);

  // Keep reference to listener for interactive mode
  const interactionHandlerRef = useRef<(() => void) | null>(null);

  // Track the expected route for manual navigation detection (Requirement 7.4)
  const expectedRouteRef = useRef<string | null>(null);
  const isNavigatingRef = useRef<boolean>(false);

  // Update expected route when step changes
  useEffect(() => {
    if (step) {
      expectedRouteRef.current = step.route;
      console.log('[GuideManager] Expected route updated to:', step.route);
    }
  }, [step?.id]);

  // Detect manual navigation (user navigating away from guide flow)
  // Requirement 7.4: When user manually navigates away during guide, pause and save progress
  // Requirement 7.2: When route transition completes, resume guide on the new page
  useEffect(() => {
    if (!isActive || !step) return;

    const currentRoute = pathname;
    const expectedRoute = step.route; // Use step.route directly instead of expectedRouteRef

    // If we're navigating as part of the guide flow, don't pause
    if (isNavigatingRef.current) {
      return;
    }

    // If current route doesn't match step's route, user navigated manually
    if (currentRoute !== expectedRoute) {
      console.log('[GuideManager] Manual navigation detected. Current:', currentRoute, 'Expected:', expectedRoute);
      pauseGuide();
    }
  }, [pathname, isActive, step, pauseGuide]);

  useEffect(() => {
    if (!isActive || !step) {
      setTargetEl(null);
      setIsLoadingTarget(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setIsLoadingTarget(true);
      setError(null);

      try {
        const resolved = step.waitForElement ? await ScrollService.waitForElement(step.targetSelector) : null;
        const found = (resolved ?? (document.querySelector(step.targetSelector) as HTMLElement | null)) || null;

        if (cancelled) return;

        // Requirement 18.1: When target element is not found, skip to next available step
        if (!found) {
          console.warn(`[GuideManager] Target element not found: ${step.targetSelector}. Skipping to next step.`);
          setError(`Element tidak ditemukan. Melanjutkan ke langkah berikutnya...`);
          
          // Wait a bit before skipping to show the error message
          setTimeout(() => {
            if (!cancelled) {
              nextStep();
            }
          }, 2000);
          
          setIsLoadingTarget(false);
          return;
        }

        setTargetEl(found);
        setIsLoadingTarget(false);

        if (found && step.mode === 'interactive') {
          // In interactive mode we wait for a click on the element to advance.
          // We also allow the element's own click to happen naturally.
          // Only one interactive handler per step in this MVP
          const handler = () => {
            nextStep();
          };

          // Best effort cleanup from previous handler
          if (interactionHandlerRef.current) {
            found.removeEventListener('click', interactionHandlerRef.current);
          }

          interactionHandlerRef.current = handler;
          found.addEventListener('click', handler);
        }
      } catch (err) {
        // Requirement 18.5: Log errors to console without breaking user experience
        console.error('[GuideManager] Error finding target element:', err);
        
        if (!cancelled) {
          setError('Terjadi kesalahan. Mencoba lagi...');
          setIsLoadingTarget(false);
          
          // Retry logic with exponential backoff
          if (retryCount < 3) {
            setTimeout(() => {
              if (!cancelled) {
                setRetryCount(prev => prev + 1);
              }
            }, 1000 * Math.pow(2, retryCount));
          } else {
            // After 3 retries, skip to next step
            setTimeout(() => {
              if (!cancelled) {
                nextStep();
                setRetryCount(0);
              }
            }, 2000);
          }
        }
      }
    };

    run();

    return () => {
      cancelled = true;
      setIsLoadingTarget(false);
      // best effort cleanup: remove listener from last found element
      if (targetEl && interactionHandlerRef.current) {
        targetEl.removeEventListener('click', interactionHandlerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, step?.id, retryCount]);

  useEffect(() => {
    if (!isActive || !step || !targetEl) return;

    // Route transitions
    const maybeNavigate = async () => {
      // For interactive mode steps, navigation happens when user clicks Next (which triggers button click)
      // Don't auto-navigate immediately when the step loads
      if (step.mode === 'interactive') {
        console.log('[GuideManager] Interactive mode - skipping auto-navigation');
        return;
      }
      
      if (step.requiresNavigation && step.navigationTarget) {
        try {
          // Set flag to indicate guide-initiated navigation
          isNavigatingRef.current = true;
          
          // Prefetch next route handled inside NavigationService caller if desired.
          await NavigationService.navigateToRoute(router as any, step.navigationTarget);
          const ok = await NavigationService.waitForRouteChange(router as any, step.navigationTarget, 5000);
          
          // Reset flag after navigation completes
          isNavigatingRef.current = false;
          
          // Requirement 18.2: When route transition fails, display error message and offer to retry
          if (!ok) {
            console.error('[GuideManager] Route transition timeout');
            setError('Navigasi gagal. Mencoba lagi...');
            
            // Retry navigation after a delay
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 2000);
            
            return;
          }
        } catch (err) {
          console.error('[GuideManager] Navigation error:', err);
          isNavigatingRef.current = false;
          setError('Terjadi kesalahan saat navigasi. Mencoba lagi...');
          
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        }
      }
    };

    // Auto-scroll (skip if behavior is none handled in ScrollService)
    const doScroll = async () => {
      if (step.scrollBehavior === 'none') {
        console.log('[GuideManager] Scroll behavior is none - skipping scroll');
        return;
      }
      
      try {
        console.log('[GuideManager] Scrolling to element:', step.targetSelector);
        await ScrollService.scrollToElement(targetEl, step.scrollBehavior, 100);
        console.log('[GuideManager] Scroll completed');
      } catch (err) {
        console.error('[GuideManager] Scroll error:', err);
        // Non-critical error, continue without scrolling
      }
    };

    // Focus target element for accessibility (Requirement 16.6)
    const focusTarget = () => {
      try {
        // Only focus if element is focusable or can be made focusable
        if (targetEl) {
          // Check if element is naturally focusable
          const isFocusable = targetEl.tabIndex >= 0 || 
            ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(targetEl.tagName);
          
          if (isFocusable) {
            targetEl.focus();
          } else {
            // Make element temporarily focusable for accessibility
            const originalTabIndex = targetEl.getAttribute('tabindex');
            targetEl.setAttribute('tabindex', '-1');
            targetEl.focus();
            
            // Restore original tabindex after focus
            if (originalTabIndex === null) {
              targetEl.removeAttribute('tabindex');
            } else {
              targetEl.setAttribute('tabindex', originalTabIndex);
            }
          }
        }
      } catch (err) {
        console.error('[GuideManager] Focus error:', err);
        // Non-critical error, continue without focusing
      }
    };

    const run = async () => {
      // First, handle navigation if needed
      await maybeNavigate();
      
      // Then scroll to element
      await doScroll();
      
      // Finally, focus for accessibility
      focusTarget();
    };

    run();
  }, [isActive, step?.id, targetEl, router, retryCount]);

  if (!isActive || !step) return null;

  const onPrev = () => {
    prevStep();
  };

  const onNext = () => {
    // If in interactive mode and target element exists, trigger click on it
    if (step.mode === 'interactive' && targetEl) {
      console.log('[GuideManager] Next clicked in interactive mode - triggering target click');
      targetEl.click();
      // Note: nextStep() will be called automatically by the click handler
      return;
    }
    
    // For auto mode, just advance normally
    nextStep();
  };

  const onClose = () => {
    closeGuide();
  };

  // Safety: if target not found, do nothing (guide remains active per tasks.md error-handling later)
  return (
    <>
      <GuideOverlay targetElement={targetEl} isActive={isActive} />

      {/* ARIA live region for step change announcements (Requirement 16.5) */}
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        Panduan langkah {stepNumber} dari {totalSteps}: {step.tooltipText}
      </div>

      {/* Error message display */}
      {error && (
        <div 
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[10003] bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* GuideTooltip: positioned by fixed layout (mobile bottom sheet / desktop normal flow) */}
      <GuideTooltip
        step={step}
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        onPrev={onPrev}
        onNext={onNext}
        onClose={onClose}
        onRequestPause={pauseGuide}
      />

      {/* Optional loading overlay state could be added here later */}
      {isLoadingTarget ? (
        <div aria-hidden="true" className="fixed inset-0 z-[10002] pointer-events-none" />
      ) : null}
    </>
  );
};

export default GuideManager;

