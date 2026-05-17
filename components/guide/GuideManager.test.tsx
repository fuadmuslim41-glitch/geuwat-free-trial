import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GuideManager } from './GuideManager';
import { GuideContext } from '@/contexts/GuideContext';
import { GuideStep } from '@/types/guide';

// Mock the services
jest.mock('@/services/ScrollService', () => ({
  ScrollService: {
    scrollToElement: jest.fn().mockResolvedValue(undefined),
    waitForElement: jest.fn().mockResolvedValue(null),
  },
}));

jest.mock('@/services/NavigationService', () => ({
  NavigationService: {
    navigateToRoute: jest.fn().mockResolvedValue(undefined),
    waitForRouteChange: jest.fn().mockResolvedValue(true),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/test',
  }),
}));

describe('GuideManager - ARIA Live Region and Focus (Task 13)', () => {
  const mockStep: GuideStep = {
    id: 'test-step',
    route: '/test',
    targetSelector: '[data-tour="test"]',
    tooltipText: 'This is a test tooltip',
    tooltipPosition: 'bottom',
    mode: 'auto',
    requiresNavigation: false,
    waitForElement: false,
    scrollBehavior: 'smooth',
  };

  const mockContextValue = {
    isActive: true,
    currentStepIndex: 2,
    totalSteps: 5,
    currentStepId: 'test-step',
    isCompleted: false,
    isPaused: false,
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    goToStep: jest.fn(),
    startGuide: jest.fn(),
    pauseGuide: jest.fn(),
    resumeGuide: jest.fn(),
    closeGuide: jest.fn(),
    resetGuide: jest.fn(),
    completeGuide: jest.fn(),
    getCurrentStep: jest.fn(() => mockStep),
    canGoNext: jest.fn(() => true),
    canGoPrev: jest.fn(() => true),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Create a mock target element
    const targetElement = document.createElement('button');
    targetElement.setAttribute('data-tour', 'test');
    targetElement.textContent = 'Test Button';
    document.body.appendChild(targetElement);
  });

  afterEach(() => {
    // Clean up
    const targetElement = document.querySelector('[data-tour="test"]');
    if (targetElement) {
      document.body.removeChild(targetElement);
    }
  });

  describe('ARIA live region (Requirement 16.5)', () => {
    it('should render ARIA live region with polite announcement', async () => {
      render(
        <GuideContext.Provider value={mockContextValue}>
          <GuideManager />
        </GuideContext.Provider>
      );

      await waitFor(() => {
        const liveRegion = screen.getByText(/panduan langkah 3 dari 5/i);
        expect(liveRegion).toBeInTheDocument();
      });
    });

    it('should have aria-live="polite" on live region', async () => {
      render(
        <GuideContext.Provider value={mockContextValue}>
          <GuideManager />
        </GuideContext.Provider>
      );

      await waitFor(() => {
        const liveRegion = screen.getByText(/panduan langkah 3 dari 5/i);
        expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      });
    });

    it('should have aria-atomic="true" on live region', async () => {
      render(
        <GuideContext.Provider value={mockContextValue}>
          <GuideManager />
        </GuideContext.Provider>
      );

      await waitFor(() => {
        const liveRegion = screen.getByText(/panduan langkah 3 dari 5/i);
        expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
      });
    });

    it('should have sr-only class to hide visually but keep for screen readers', async () => {
      render(
        <GuideContext.Provider value={mockContextValue}>
          <GuideManager />
        </GuideContext.Provider>
      );

      await waitFor(() => {
        const liveRegion = screen.getByText(/panduan langkah 3 dari 5/i);
        expect(liveRegion).toHaveClass('sr-only');
      });
    });

    it('should announce step number, total steps, and tooltip text', async () => {
      render(
        <GuideContext.Provider value={mockContextValue}>
          <GuideManager />
        </GuideContext.Provider>
      );

      await waitFor(() => {
        const liveRegion = screen.getByText(
          'Panduan langkah 3 dari 5: This is a test tooltip'
        );
        expect(liveRegion).toBeInTheDocument();
      });
    });

    it('should update announcement when step changes', async () => {
      const { rerender } = render(
        <GuideContext.Provider value={mockContextValue}>
          <GuideManager />
        </GuideContext.Provider>
      );

      await waitFor(() => {
        expect(screen.getByText(/panduan langkah 3 dari 5/i)).toBeInTheDocument();
      });

      // Update to next step
      const updatedContextValue = {
        ...mockContextValue,
        currentStepIndex: 3,
        getCurrentStep: jest.fn(() => ({
          ...mockStep,
          tooltipText: 'Next step tooltip',
        })),
      };

      rerender(
        <GuideContext.Provider value={updatedContextValue}>
          <GuideManager />
        </GuideContext.Provider>
      );

      await waitFor(() => {
        // Check the ARIA live region specifically
        const liveRegion = screen.getAllByText(/next step tooltip/i).find(
          el => el.getAttribute('aria-live') === 'polite'
        );
        expect(liveRegion).toBeInTheDocument();
        expect(screen.getByText(/panduan langkah 4 dari 5/i)).toBeInTheDocument();
      });
    });
  });

  describe('Target element focus (Requirement 16.6)', () => {
    it('should focus target element when it is naturally focusable (button)', async () => {
      render(
        <GuideContext.Provider value={mockContextValue}>
          <GuideManager />
        </GuideContext.Provider>
      );

      await waitFor(() => {
        const targetElement = document.querySelector('[data-tour="test"]') as HTMLElement;
        expect(targetElement).toHaveFocus();
      });
    });

    it('should make non-focusable element temporarily focusable and focus it', async () => {
      // Replace button with a div (non-focusable)
      const button = document.querySelector('[data-tour="test"]');
      if (button) {
        document.body.removeChild(button);
      }

      const div = document.createElement('div');
      div.setAttribute('data-tour', 'test');
      div.textContent = 'Test Div';
      document.body.appendChild(div);

      render(
        <GuideContext.Provider value={mockContextValue}>
          <GuideManager />
        </GuideContext.Provider>
      );

      await waitFor(() => {
        const targetElement = document.querySelector('[data-tour="test"]') as HTMLElement;
        expect(targetElement).toHaveFocus();
      });

      // Clean up
      document.body.removeChild(div);
    });

    it('should restore original tabindex after focusing non-focusable element', async () => {
      // Replace button with a div with tabindex="0"
      const button = document.querySelector('[data-tour="test"]');
      if (button) {
        document.body.removeChild(button);
      }

      const div = document.createElement('div');
      div.setAttribute('data-tour', 'test');
      div.setAttribute('tabindex', '0');
      div.textContent = 'Test Div';
      document.body.appendChild(div);

      render(
        <GuideContext.Provider value={mockContextValue}>
          <GuideManager />
        </GuideContext.Provider>
      );

      await waitFor(() => {
        const targetElement = document.querySelector('[data-tour="test"]') as HTMLElement;
        expect(targetElement).toHaveFocus();
        // Should restore original tabindex
        expect(targetElement).toHaveAttribute('tabindex', '0');
      });

      // Clean up
      document.body.removeChild(div);
    });
  });

  describe('Guide inactive state', () => {
    it('should not render when guide is not active', () => {
      const inactiveContextValue = {
        ...mockContextValue,
        isActive: false,
      };

      const { container } = render(
        <GuideContext.Provider value={inactiveContextValue}>
          <GuideManager />
        </GuideContext.Provider>
      );

      expect(container).toBeEmptyDOMElement();
    });

    it('should not render when step is null', () => {
      const noStepContextValue = {
        ...mockContextValue,
        getCurrentStep: jest.fn(() => null),
      };

      const { container } = render(
        <GuideContext.Provider value={noStepContextValue}>
          <GuideManager />
        </GuideContext.Provider>
      );

      expect(container).toBeEmptyDOMElement();
    });
  });
});
