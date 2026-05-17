/**
 * GuideOverlay Component
 * 
 * Renders a semi-transparent overlay that dims non-target areas and creates
 * a cutout effect around the target element to highlight it during the guide.
 * 
 * Requirements: 1.5, 5.1, 5.2, 5.3, 5.4
 */

'use client';

import React, { useEffect, useState } from 'react';
import styles from './GuideOverlay.module.css';

export interface GuideOverlayProps {
  /** The target element to highlight (create cutout around) */
  targetElement: HTMLElement | null;
  
  /** Whether the overlay is active */
  isActive: boolean;
  
  /** Opacity of the overlay background (0-1), default: 0.6 */
  overlayOpacity?: number;
  
  /** Z-index of the overlay, default: 9998 */
  zIndex?: number;
}

export const GuideOverlay: React.FC<GuideOverlayProps> = ({
  targetElement,
  isActive,
  overlayOpacity = 0.6,
  zIndex = 9998,
}) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isActive || !targetElement) {
      setTargetRect(null);
      return;
    }

    const updateTargetRect = () => {
      setTargetRect(targetElement.getBoundingClientRect());
    };

    updateTargetRect();
    window.addEventListener('scroll', updateTargetRect, true);
    window.addEventListener('resize', updateTargetRect);

    return () => {
      window.removeEventListener('scroll', updateTargetRect, true);
      window.removeEventListener('resize', updateTargetRect);
    };
  }, [isActive, targetElement]);

  useEffect(() => {
    if (!isActive || !targetElement) {
      return;
    }

    // Apply pointer-events: auto to target element so it remains clickable.
    const originalPointerEvents = targetElement.style.pointerEvents;
    targetElement.style.pointerEvents = 'auto';

    return () => {
      targetElement.style.pointerEvents = originalPointerEvents;
    };
  }, [isActive, targetElement]);

  if (!isActive || !targetRect) {
    return null;
  }

  return (
    <div
      className={styles.targetHighlight}
      style={{
        top: Math.max(0, targetRect.top - 8),
        left: Math.max(0, targetRect.left - 8),
        width: targetRect.width + 16,
        height: targetRect.height + 16,
        zIndex,
        boxShadow: `0 0 0 9999px rgba(0, 0, 0, ${overlayOpacity})`,
      }}
      aria-hidden="true"
    />
  );
};

// Memoize component to prevent unnecessary re-renders (Requirement 17.5, 20.2)
export default React.memo(GuideOverlay);
