/**
 * Integration tests for GuideManager manual navigation detection
 * 
 * Tests the manual navigation detection functionality (Task 14.1).
 * Validates Requirement 7.4: Pause and save on manual navigation
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { GuideManager } from './GuideManager';
import { useGuide } from '@/contexts/GuideContext';
import { useRouter, usePathname } from 'next/navigation';

// Mock the hooks
jest.mock('@/contexts/GuideContext', () => ({
  useGuide: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock the services
jest.mock('@/services/ScrollService', () => ({
  ScrollService: {
    waitForElement: jest.fn().mockResolvedValue(null),
    scrollToElement: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@/services/NavigationService', () => ({
  NavigationService: {
    navigateToRoute: jest.fn().mockResolvedValue(undefined),
    waitForRouteChange: jest.fn().mockResolvedValue(true),
  },
}));

// Mock the components
jest.mock('./GuideOverlay', () => ({
  GuideOverlay: () => <div data-testid="guide-overlay" />,
}));

jest.mock('./GuideTooltip', () => ({
  GuideTooltip: () => <div data-testid="guide-tooltip" />,
}));

describe('GuideManager - Manual Navigation Detection', () => {
  const mockPauseGuide = jest.fn();
  const mockGetCurrentStep = jest.fn();
  const mockRouter = {
    push: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should pause guide when user manually navigates away from expected route', async () => {
    // Setup: Guide is active on /dashboard
    const mockStep = {
      id: 'dashboard-title',
      route: '/dashboard',
      targetSelector: '[data-tour="dashboard-title"]',
      tooltipText: 'Test step',
      tooltipPosition: 'bottom' as const,
      mode: 'auto' as const,
      requiresNavigation: false,
      waitForElement: false,
      scrollBehavior: 'smooth' as const,
    };

    mockGetCurrentStep.mockReturnValue(mockStep);
    (useGuide as jest.Mock).mockReturnValue({
      isActive: true,
      getCurrentStep: mockGetCurrentStep,
      currentStepIndex: 0,
      totalSteps: 10,
      nextStep: jest.fn(),
      prevStep: jest.fn(),
      closeGuide: jest.fn(),
      pauseGuide: mockPauseGuide,
    });

    // Initial render on /dashboard
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    
    const { rerender } = render(<GuideManager />);

    // Wait for initial render
    await waitFor(() => {
      expect(mockGetCurrentStep).toHaveBeenCalled();
    });

    // User manually navigates to /skill
    (usePathname as jest.Mock).mockReturnValue('/skill');
    
    // Trigger re-render with new pathname
    rerender(<GuideManager />);

    // Verify pauseGuide was called
    await waitFor(() => {
      expect(mockPauseGuide).toHaveBeenCalledTimes(1);
    });
  });

  it('should NOT pause guide when route matches expected route', async () => {
    const mockStep = {
      id: 'dashboard-title',
      route: '/dashboard',
      targetSelector: '[data-tour="dashboard-title"]',
      tooltipText: 'Test step',
      tooltipPosition: 'bottom' as const,
      mode: 'auto' as const,
      requiresNavigation: false,
      waitForElement: false,
      scrollBehavior: 'smooth' as const,
    };

    mockGetCurrentStep.mockReturnValue(mockStep);
    (useGuide as jest.Mock).mockReturnValue({
      isActive: true,
      getCurrentStep: mockGetCurrentStep,
      currentStepIndex: 0,
      totalSteps: 10,
      nextStep: jest.fn(),
      prevStep: jest.fn(),
      closeGuide: jest.fn(),
      pauseGuide: mockPauseGuide,
    });

    // Stay on /dashboard
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    
    render(<GuideManager />);

    await waitFor(() => {
      expect(mockGetCurrentStep).toHaveBeenCalled();
    });

    // Verify pauseGuide was NOT called
    expect(mockPauseGuide).not.toHaveBeenCalled();
  });

  it('should NOT pause guide when guide is not active', async () => {
    mockGetCurrentStep.mockReturnValue(null);
    (useGuide as jest.Mock).mockReturnValue({
      isActive: false,
      getCurrentStep: mockGetCurrentStep,
      currentStepIndex: 0,
      totalSteps: 10,
      nextStep: jest.fn(),
      prevStep: jest.fn(),
      closeGuide: jest.fn(),
      pauseGuide: mockPauseGuide,
    });

    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    
    const { rerender } = render(<GuideManager />);

    // Change pathname
    (usePathname as jest.Mock).mockReturnValue('/skill');
    rerender(<GuideManager />);

    // Verify pauseGuide was NOT called
    expect(mockPauseGuide).not.toHaveBeenCalled();
  });
});
