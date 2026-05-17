/**
 * ScrollService
 * 
 * Handles automatic scrolling to target elements during guide flow.
 * Provides methods to scroll elements into view, check viewport visibility,
 * and calculate optimal scroll positions with configurable offsets.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */

import { ScrollBehavior } from '@/types/guide';

/**
 * Configuration options for scrolling operations
 */
interface ScrollOptions {
  /** Scroll behavior: 'smooth' or 'instant' */
  behavior: ScrollBehavior;
  /** Vertical offset in pixels for tooltip clearance (default: 100) */
  offset?: number;
  /** Block alignment for scrollIntoView (default: 'center') */
  block?: ScrollLogicalPosition;
}

/**
 * ScrollService class provides methods for managing scroll operations
 * during the interactive guide flow.
 */
export class ScrollService {
  /**
   * Default offset for tooltip clearance (in pixels)
   */
  private static readonly DEFAULT_OFFSET = 100;

  /**
   * Default timeout for scroll completion detection (in milliseconds)
   */
  private static readonly SCROLL_TIMEOUT = 1000;

  /**
   * Scrolls the viewport to bring the target element into view.
   * 
   * This method uses the native scrollIntoView API with configurable behavior
   * and returns a Promise that resolves when the scroll operation completes.
   * 
   * Requirements: 4.1, 4.2, 4.3
   * 
   * @param element - The target HTML element to scroll to
   * @param behavior - Scroll behavior ('smooth', 'instant', or 'none')
   * @param offset - Optional vertical offset in pixels for tooltip clearance
   * @returns Promise that resolves when scroll completes
   * 
   * @example
   * ```typescript
   * const element = document.querySelector('[data-tour="dashboard-title"]');
   * await ScrollService.scrollToElement(element, 'smooth', 120);
   * ```
   */
  static async scrollToElement(
    element: HTMLElement,
    behavior: ScrollBehavior = 'smooth',
    offset: number = ScrollService.DEFAULT_OFFSET
  ): Promise<void> {
    // If behavior is 'none', skip scrolling
    if (behavior === 'none') {
      return Promise.resolve();
    }

    // Always scroll to ensure element is properly centered, even if partially visible
    // This ensures consistent guide experience
    return new Promise<void>((resolve) => {
      // Determine scroll behavior for scrollIntoView
      const scrollBehaviorValue: 'auto' | 'smooth' = behavior === 'instant' ? 'auto' : 'smooth';

      // Scroll element into view with center alignment
      element.scrollIntoView({
        behavior: scrollBehaviorValue,
        block: 'center',
        inline: 'nearest',
      });

      // If instant scroll, resolve immediately
      if (behavior === 'instant') {
        resolve();
        return;
      }

      // For smooth scroll, wait for scroll to complete
      let scrollTimeout: NodeJS.Timeout;
      let lastScrollY = window.scrollY;
      let scrollCheckCount = 0;
      const maxScrollChecks = 50; // Maximum checks to prevent infinite loop

      const checkScrollComplete = () => {
        const currentScrollY = window.scrollY;
        
        // Check if scroll has stopped (position hasn't changed)
        if (currentScrollY === lastScrollY) {
          scrollCheckCount++;
          
          // If position stable for 2 checks or max checks reached, consider complete
          if (scrollCheckCount >= 2 || scrollCheckCount >= maxScrollChecks) {
            clearTimeout(scrollTimeout);
            
            // Apply offset adjustment if needed
            if (offset !== 0) {
              const optimalPosition = ScrollService.getOptimalScrollPosition(
                element,
                window.innerHeight,
                offset
              );
              
              window.scrollTo({
                top: optimalPosition,
                behavior: 'smooth',
              });
              
              // Wait a bit for offset adjustment to complete
              setTimeout(() => resolve(), 200);
            } else {
              resolve();
            }
            return;
          }
        } else {
          // Reset counter if still scrolling
          scrollCheckCount = 0;
          lastScrollY = currentScrollY;
        }

        // Continue checking
        scrollTimeout = setTimeout(checkScrollComplete, 50);
      };

      // Start checking for scroll completion
      scrollTimeout = setTimeout(checkScrollComplete, 50);

      // Fallback timeout to prevent hanging
      setTimeout(() => {
        clearTimeout(scrollTimeout);
        resolve();
      }, ScrollService.SCROLL_TIMEOUT);
    });
  }

  /**
   * Checks if an element is currently visible within the viewport.
   * 
   * This method determines if the target element is already visible to the user,
   * which allows the guide system to skip unnecessary scroll operations.
   * 
   * Requirements: 4.4
   * 
   * @param element - The HTML element to check
   * @returns true if element is in viewport, false otherwise
   * 
   * @example
   * ```typescript
   * const element = document.querySelector('[data-tour="skill-status"]');
   * if (ScrollService.isElementInViewport(element)) {
   *   console.log('Element is already visible');
   * }
   * ```
   */
  static isElementInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    // Check if element is within viewport bounds
    const isVisible =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= windowHeight &&
      rect.right <= windowWidth;

    return isVisible;
  }

  /**
   * Calculates the optimal scroll position for an element with offset adjustment.
   * 
   * This method computes the ideal scroll position to center the element in the
   * viewport while accounting for tooltip clearance offset.
   * 
   * Requirements: 4.3
   * 
   * @param element - The target HTML element
   * @param viewportHeight - Height of the viewport in pixels
   * @param offset - Vertical offset for tooltip clearance (default: 100)
   * @returns Optimal scroll position in pixels from top of document
   * 
   * @example
   * ```typescript
   * const element = document.querySelector('[data-tour="alphabet-cards"]');
   * const position = ScrollService.getOptimalScrollPosition(
   *   element,
   *   window.innerHeight,
   *   120
   * );
   * window.scrollTo({ top: position, behavior: 'smooth' });
   * ```
   */
  static getOptimalScrollPosition(
    element: HTMLElement,
    viewportHeight: number,
    offset: number = ScrollService.DEFAULT_OFFSET
  ): number {
    const rect = element.getBoundingClientRect();
    const elementTop = rect.top + window.scrollY;
    const elementHeight = rect.height;

    // Calculate center position
    const centerPosition = elementTop - (viewportHeight / 2) + (elementHeight / 2);

    // Apply offset adjustment (move element down by offset amount)
    const adjustedPosition = centerPosition - offset;

    // Ensure we don't scroll above the document
    const finalPosition = Math.max(0, adjustedPosition);

    return finalPosition;
  }

  /**
   * Waits for an element to appear in the DOM.
   * 
   * This method is useful when navigating to a new page where the target
   * element may not be immediately available.
   * 
   * @param selector - CSS selector for the target element
   * @param timeout - Maximum time to wait in milliseconds (default: 5000)
   * @returns Promise that resolves with the element or null if timeout
   * 
   * @example
   * ```typescript
   * const element = await ScrollService.waitForElement('[data-tour="phonetic-cpu"]', 3000);
   * if (element) {
   *   await ScrollService.scrollToElement(element, 'smooth');
   * }
   * ```
   */
  static async waitForElement(
    selector: string,
    timeout: number = 5000
  ): Promise<HTMLElement | null> {
    return new Promise((resolve) => {
      // Check if element already exists
      const existingElement = document.querySelector(selector) as HTMLElement;
      if (existingElement) {
        resolve(existingElement);
        return;
      }

      // Set up MutationObserver to watch for element
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
          observer.disconnect();
          clearTimeout(timeoutId);
          resolve(element);
        }
      });

      // Start observing
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Set timeout
      const timeoutId = setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  }

  /**
   * Checks if smooth scrolling is supported by the browser.
   * 
   * @returns true if smooth scrolling is supported, false otherwise
   */
  static isSmoothScrollSupported(): boolean {
    return 'scrollBehavior' in document.documentElement.style;
  }
}
