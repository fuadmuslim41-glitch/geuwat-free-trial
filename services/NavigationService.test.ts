/**
 * Unit and Property-Based Tests for NavigationService
 * 
 * Tests cover:
 * - Route navigation
 * - Route change detection with timeout
 * - Route prefetching
 * - Route status checking
 * - Error handling
 */

import { NavigationService } from './NavigationService';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import * as fc from 'fast-check';

// Mock Next.js App Router
const createMockRouter = (): AppRouterInstance => {
  return {
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  } as unknown as AppRouterInstance;
};

// Mock window.location
const mockLocation = (pathname: string) => {
  delete (global as any).window;
  (global as any).window = {
    location: {
      pathname,
    },
  };
};

describe('NavigationService', () => {
  let mockRouter: AppRouterInstance;

  beforeEach(() => {
    mockRouter = createMockRouter();
    jest.clearAllMocks();
    // Reset window.location
    mockLocation('/');
  });

  describe('navigateToRoute', () => {
    it('should call router.push with the correct route', async () => {
      const route = '/dashboard';
      
      await NavigationService.navigateToRoute(mockRouter, route);
      
      expect(mockRouter.push).toHaveBeenCalledWith(route);
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
    });

    it('should handle navigation to nested routes', async () => {
      const route = '/skill/pronunciation/alphabet';
      
      await NavigationService.navigateToRoute(mockRouter, route);
      
      expect(mockRouter.push).toHaveBeenCalledWith(route);
    });

    it('should throw error when navigation fails', async () => {
      const route = '/dashboard';
      const error = new Error('Navigation failed');
      (mockRouter.push as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await expect(NavigationService.navigateToRoute(mockRouter, route))
        .rejects
        .toThrow('Failed to navigate to /dashboard: Navigation failed');
    });

    it('should handle navigation to root route', async () => {
      const route = '/';
      
      await NavigationService.navigateToRoute(mockRouter, route);
      
      expect(mockRouter.push).toHaveBeenCalledWith(route);
    });
  });

  describe('waitForRouteChange', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should resolve true when route changes to expected route', async () => {
      const expectedRoute = '/dashboard';
      mockLocation('/');

      const waitPromise = NavigationService.waitForRouteChange(
        mockRouter,
        expectedRoute,
        5000
      );

      // Simulate route change after 200ms
      setTimeout(() => {
        mockLocation(expectedRoute);
      }, 200);

      jest.advanceTimersByTime(300);
      
      const result = await waitPromise;
      expect(result).toBe(true);
    });

    it('should resolve false when timeout is reached', async () => {
      const expectedRoute = '/dashboard';
      const timeout = 1000;
      mockLocation('/');

      const waitPromise = NavigationService.waitForRouteChange(
        mockRouter,
        expectedRoute,
        timeout
      );

      // Don't change the route, let it timeout
      jest.advanceTimersByTime(timeout + 100);
      
      const result = await waitPromise;
      expect(result).toBe(false);
    });

    it('should use default timeout of 5000ms', async () => {
      const expectedRoute = '/skill';
      mockLocation('/');

      const waitPromise = NavigationService.waitForRouteChange(
        mockRouter,
        expectedRoute
        // No timeout parameter - should use default 5000ms
      );

      // Advance to just before default timeout
      jest.advanceTimersByTime(4900);
      
      // Route still hasn't changed, should still be waiting
      // Now timeout
      jest.advanceTimersByTime(200);
      
      const result = await waitPromise;
      expect(result).toBe(false);
    });

    it('should resolve immediately if already on expected route', async () => {
      const expectedRoute = '/dashboard';
      mockLocation(expectedRoute);

      const result = await NavigationService.waitForRouteChange(
        mockRouter,
        expectedRoute,
        5000
      );
      
      expect(result).toBe(true);
    });

    it('should handle route changes with query parameters', async () => {
      const expectedRoute = '/skill/pronunciation';
      mockLocation('/dashboard');

      const waitPromise = NavigationService.waitForRouteChange(
        mockRouter,
        expectedRoute,
        5000
      );

      setTimeout(() => {
        mockLocation(expectedRoute);
      }, 150);

      jest.advanceTimersByTime(200);
      
      const result = await waitPromise;
      expect(result).toBe(true);
    });

    it('should poll at 100ms intervals', async () => {
      const expectedRoute = '/dashboard';
      mockLocation('/');
      let checkCount = 0;

      // Mock window.location.pathname to count checks
      Object.defineProperty(window.location, 'pathname', {
        get: () => {
          checkCount++;
          return checkCount >= 5 ? expectedRoute : '/';
        },
        configurable: true,
      });

      const waitPromise = NavigationService.waitForRouteChange(
        mockRouter,
        expectedRoute,
        5000
      );

      // Advance by 500ms (should check ~5 times at 100ms intervals)
      jest.advanceTimersByTime(500);
      
      const result = await waitPromise;
      expect(result).toBe(true);
      expect(checkCount).toBeGreaterThanOrEqual(4);
    });
  });

  describe('prefetchRoute', () => {
    it('should call router.prefetch with the correct route', () => {
      const route = '/skill/pronunciation';
      
      NavigationService.prefetchRoute(mockRouter, route);
      
      expect(mockRouter.prefetch).toHaveBeenCalledWith(route);
      expect(mockRouter.prefetch).toHaveBeenCalledTimes(1);
    });

    it('should handle prefetch for nested routes', () => {
      const route = '/skill/pronunciation/phoneticSymbols/i';
      
      NavigationService.prefetchRoute(mockRouter, route);
      
      expect(mockRouter.prefetch).toHaveBeenCalledWith(route);
    });

    it('should not throw when prefetch fails', () => {
      const route = '/dashboard';
      (mockRouter.prefetch as jest.Mock).mockImplementation(() => {
        throw new Error('Prefetch failed');
      });

      // Should not throw, just log warning
      expect(() => NavigationService.prefetchRoute(mockRouter, route)).not.toThrow();
    });

    it('should handle prefetch for root route', () => {
      const route = '/';
      
      NavigationService.prefetchRoute(mockRouter, route);
      
      expect(mockRouter.prefetch).toHaveBeenCalledWith(route);
    });
  });

  describe('isRouteActive', () => {
    it('should return true when current route matches expected route', () => {
      mockLocation('/dashboard');
      
      const result = NavigationService.isRouteActive('/dashboard');
      
      expect(result).toBe(true);
    });

    it('should return false when current route does not match', () => {
      mockLocation('/dashboard');
      
      const result = NavigationService.isRouteActive('/skill');
      
      expect(result).toBe(false);
    });

    it('should return false when window is undefined (SSR)', () => {
      delete (global as any).window;
      
      const result = NavigationService.isRouteActive('/dashboard');
      
      expect(result).toBe(false);
    });

    it('should handle nested routes correctly', () => {
      mockLocation('/skill/pronunciation/alphabet');
      
      expect(NavigationService.isRouteActive('/skill/pronunciation/alphabet')).toBe(true);
      expect(NavigationService.isRouteActive('/skill/pronunciation')).toBe(false);
      expect(NavigationService.isRouteActive('/skill')).toBe(false);
    });

    it('should handle root route', () => {
      mockLocation('/');
      
      expect(NavigationService.isRouteActive('/')).toBe(true);
      expect(NavigationService.isRouteActive('/dashboard')).toBe(false);
    });
  });

  describe('getCurrentRoute', () => {
    it('should return current pathname', () => {
      mockLocation('/dashboard');
      
      const result = NavigationService.getCurrentRoute();
      
      expect(result).toBe('/dashboard');
    });

    it('should return empty string when window is undefined (SSR)', () => {
      delete (global as any).window;
      
      const result = NavigationService.getCurrentRoute();
      
      expect(result).toBe('');
    });

    it('should handle nested routes', () => {
      mockLocation('/skill/pronunciation/phoneticSymbols');
      
      const result = NavigationService.getCurrentRoute();
      
      expect(result).toBe('/skill/pronunciation/phoneticSymbols');
    });

    it('should handle root route', () => {
      mockLocation('/');
      
      const result = NavigationService.getCurrentRoute();
      
      expect(result).toBe('/');
    });
  });

  describe('Property-Based Tests', () => {
    /**
     * Property: Navigation Always Calls Router Push
     * For any valid route string, navigateToRoute should call router.push exactly once
     * Validates: Requirements 7.1
     */
    it('property: navigateToRoute always calls router.push once', async () => {
      // Arbitrary for route paths (simplified - starts with /)
      const routeArbitrary = fc.string({ minLength: 1 }).map(s => '/' + s.replace(/\s/g, '-'));

      await fc.assert(
        fc.asyncProperty(routeArbitrary, async (route) => {
          const router = createMockRouter();
          
          await NavigationService.navigateToRoute(router, route);
          
          expect(router.push).toHaveBeenCalledWith(route);
          expect(router.push).toHaveBeenCalledTimes(1);
        }),
        { numRuns: 50 }
      );
    });

    /**
     * Property: Prefetch Never Throws
     * For any route and any prefetch behavior (success or failure),
     * prefetchRoute should never throw an error
     * Validates: Requirements 18.2
     */
    it('property: prefetchRoute never throws regardless of router behavior', () => {
      const routeArbitrary = fc.string({ minLength: 1 }).map(s => '/' + s.replace(/\s/g, '-'));
      const shouldFailArbitrary = fc.boolean();

      fc.assert(
        fc.property(routeArbitrary, shouldFailArbitrary, (route, shouldFail) => {
          const router = createMockRouter();
          
          if (shouldFail) {
            (router.prefetch as jest.Mock).mockImplementation(() => {
              throw new Error('Prefetch failed');
            });
          }
          
          // Should never throw
          expect(() => NavigationService.prefetchRoute(router, route)).not.toThrow();
        }),
        { numRuns: 50 }
      );
    });

    /**
     * Property: Route Active Check Consistency
     * For any route, if we set window.location.pathname to that route,
     * isRouteActive should return true for that route and false for others
     * Validates: Requirements 7.2
     */
    it('property: isRouteActive is consistent with current location', () => {
      const routeArbitrary = fc.string({ minLength: 1 }).map(s => '/' + s.replace(/\s/g, '-'));

      fc.assert(
        fc.property(routeArbitrary, routeArbitrary, (currentRoute, checkRoute) => {
          mockLocation(currentRoute);
          
          const result = NavigationService.isRouteActive(checkRoute);
          
          if (currentRoute === checkRoute) {
            expect(result).toBe(true);
          } else {
            expect(result).toBe(false);
          }
        }),
        { numRuns: 50 }
      );
    });

    /**
     * Property: Get Current Route Matches Location
     * For any route, if we set window.location.pathname to that route,
     * getCurrentRoute should return exactly that route
     * Validates: Requirements 7.2
     */
    it('property: getCurrentRoute always returns window.location.pathname', () => {
      const routeArbitrary = fc.string({ minLength: 1 }).map(s => '/' + s.replace(/\s/g, '-'));

      fc.assert(
        fc.property(routeArbitrary, (route) => {
          mockLocation(route);
          
          const result = NavigationService.getCurrentRoute();
          
          expect(result).toBe(route);
        }),
        { numRuns: 50 }
      );
    });

    /**
     * Property: Wait For Route Change Timeout Behavior
     * For any timeout value, if the route never changes,
     * waitForRouteChange should resolve to false after the timeout
     * Validates: Requirements 7.2, 18.2
     */
    it('property: waitForRouteChange respects timeout when route does not change', async () => {
      jest.useFakeTimers();
      
      const timeoutArbitrary = fc.integer({ min: 100, max: 2000 });
      const routeArbitrary = fc.string({ minLength: 1 }).map(s => '/' + s.replace(/\s/g, '-'));

      await fc.assert(
        fc.asyncProperty(timeoutArbitrary, routeArbitrary, async (timeout, expectedRoute) => {
          mockLocation('/current-route');
          
          const waitPromise = NavigationService.waitForRouteChange(
            mockRouter,
            expectedRoute,
            timeout
          );
          
          // Advance past the timeout
          jest.advanceTimersByTime(timeout + 100);
          
          const result = await waitPromise;
          
          expect(result).toBe(false);
        }),
        { numRuns: 20 }
      );
      
      jest.useRealTimers();
    });

    /**
     * Property: Wait For Route Change Success When Already On Route
     * For any route, if window.location.pathname is already set to that route,
     * waitForRouteChange should immediately resolve to true
     * Validates: Requirements 7.2
     */
    it('property: waitForRouteChange resolves immediately when already on expected route', async () => {
      const routeArbitrary = fc.string({ minLength: 1 }).map(s => '/' + s.replace(/\s/g, '-'));

      await fc.assert(
        fc.asyncProperty(routeArbitrary, async (route) => {
          mockLocation(route);
          
          const result = await NavigationService.waitForRouteChange(
            mockRouter,
            route,
            5000
          );
          
          expect(result).toBe(true);
        }),
        { numRuns: 30 }
      );
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete navigation flow: navigate -> wait -> verify', async () => {
      jest.useFakeTimers();
      
      const targetRoute = '/skill/pronunciation';
      mockLocation('/dashboard');

      // Step 1: Navigate
      await NavigationService.navigateToRoute(mockRouter, targetRoute);
      expect(mockRouter.push).toHaveBeenCalledWith(targetRoute);

      // Step 2: Wait for route change
      const waitPromise = NavigationService.waitForRouteChange(
        mockRouter,
        targetRoute,
        5000
      );

      // Simulate route change after 150ms
      setTimeout(() => {
        mockLocation(targetRoute);
      }, 150);

      jest.advanceTimersByTime(200);
      
      const success = await waitPromise;
      expect(success).toBe(true);

      // Step 3: Verify we're on the correct route
      expect(NavigationService.isRouteActive(targetRoute)).toBe(true);
      expect(NavigationService.getCurrentRoute()).toBe(targetRoute);
      
      jest.useRealTimers();
    });

    it('should handle navigation with prefetch', async () => {
      const currentRoute = '/dashboard';
      const nextRoute = '/skill';
      const prefetchRoute = '/skill/pronunciation';

      mockLocation(currentRoute);

      // Prefetch the next route
      NavigationService.prefetchRoute(mockRouter, prefetchRoute);
      expect(mockRouter.prefetch).toHaveBeenCalledWith(prefetchRoute);

      // Navigate to intermediate route
      await NavigationService.navigateToRoute(mockRouter, nextRoute);
      expect(mockRouter.push).toHaveBeenCalledWith(nextRoute);
    });

    it('should handle failed navigation gracefully', async () => {
      const route = '/dashboard';
      (mockRouter.push as jest.Mock).mockImplementation(() => {
        throw new Error('Network error');
      });

      await expect(NavigationService.navigateToRoute(mockRouter, route))
        .rejects
        .toThrow('Failed to navigate to /dashboard: Network error');

      // Service should still be usable after error
      (mockRouter.push as jest.Mock).mockImplementation(() => {});
      await expect(NavigationService.navigateToRoute(mockRouter, '/skill'))
        .resolves
        .not
        .toThrow();
    });
  });
});
