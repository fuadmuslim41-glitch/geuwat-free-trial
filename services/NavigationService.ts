/**
 * NavigationService
 * 
 * Manages route transitions during guide flow using Next.js App Router.
 * Provides methods for navigation, route change detection, and prefetching.
 * 
 * Requirements: 7.1, 7.2, 18.2
 */

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export class NavigationService {
  /**
   * Navigate to a specific route using Next.js router
   * 
   * @param router - Next.js App Router instance from useRouter hook
   * @param route - Target route path (e.g., '/dashboard', '/skill/pronunciation')
   * @returns Promise that resolves when navigation is initiated
   * 
   * @example
   * const router = useRouter();
   * await NavigationService.navigateToRoute(router, '/dashboard');
   */
  static async navigateToRoute(
    router: AppRouterInstance,
    route: string
  ): Promise<void> {
    try {
      router.push(route);
    } catch (error) {
      console.error('[NavigationService] Navigation failed:', error);
      throw new Error(`Failed to navigate to ${route}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Wait for route change to complete with timeout mechanism
   * 
   * Monitors the current pathname to detect when navigation completes.
   * Uses polling mechanism since App Router doesn't expose route change events.
   * 
   * @param router - Next.js App Router instance from useRouter hook
   * @param expectedRoute - The route we expect to navigate to
   * @param timeout - Maximum wait time in milliseconds (default: 5000ms)
   * @returns Promise<boolean> - true if route change completed, false if timeout
   * 
   * @example
   * const router = useRouter();
   * await NavigationService.navigateToRoute(router, '/skill');
   * const success = await NavigationService.waitForRouteChange(router, '/skill', 5000);
   * if (!success) {
   *   console.error('Navigation timeout');
   * }
   */
  static async waitForRouteChange(
    router: AppRouterInstance,
    expectedRoute: string,
    timeout: number = 5000
  ): Promise<boolean> {
    const startTime = Date.now();
    const pollInterval = 100; // Check every 100ms

    return new Promise((resolve) => {
      const checkRoute = () => {
        // Get current pathname from window.location since App Router doesn't expose it directly
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
        
        // Check if we've reached the expected route
        if (currentPath === expectedRoute) {
          resolve(true);
          return;
        }

        // Check if timeout exceeded
        const elapsed = Date.now() - startTime;
        if (elapsed >= timeout) {
          console.warn(
            `[NavigationService] Route change timeout after ${timeout}ms. Expected: ${expectedRoute}, Current: ${currentPath}`
          );
          resolve(false);
          return;
        }

        // Continue polling
        setTimeout(checkRoute, pollInterval);
      };

      // Start checking
      checkRoute();
    });
  }

  /**
   * Prefetch a route for faster transitions
   * 
   * Uses Next.js router prefetch to load the next step's route in the background.
   * This improves perceived performance when navigating through guide steps.
   * 
   * @param router - Next.js App Router instance from useRouter hook
   * @param route - Route to prefetch (e.g., '/skill/pronunciation')
   * 
   * @example
   * const router = useRouter();
   * // Prefetch the next step's route
   * NavigationService.prefetchRoute(router, '/skill/pronunciation/alphabet');
   */
  static prefetchRoute(
    router: AppRouterInstance,
    route: string
  ): void {
    try {
      router.prefetch(route);
    } catch (error) {
      // Prefetch failures are non-critical, just log them
      console.warn('[NavigationService] Prefetch failed for route:', route, error);
    }
  }

  /**
   * Check if a route is currently active
   * 
   * @param expectedRoute - Route to check against current location
   * @returns boolean - true if current route matches expected route
   * 
   * @example
   * if (NavigationService.isRouteActive('/dashboard')) {
   *   console.log('Currently on dashboard');
   * }
   */
  static isRouteActive(expectedRoute: string): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.location.pathname === expectedRoute;
  }

  /**
   * Get the current route pathname
   * 
   * @returns string - Current pathname or empty string if not in browser
   * 
   * @example
   * const currentRoute = NavigationService.getCurrentRoute();
   * console.log('Current route:', currentRoute);
   */
  static getCurrentRoute(): string {
    if (typeof window === 'undefined') {
      return '';
    }
    return window.location.pathname;
  }
}
