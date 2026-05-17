/**
 * Unit tests for GuideContext
 * 
 * Tests the GuideProvider component and useGuide hook functionality.
 * Validates state management, navigation, control methods, and persistence integration.
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { GuideProvider, useGuide } from '../GuideContext';
import { PersistenceService } from '@/services/PersistenceService';
import { GUIDE_FLOW, TOTAL_GUIDE_STEPS } from '@/config/guideFlowConfig';

// Mock PersistenceService
jest.mock('@/services/PersistenceService', () => ({
  PersistenceService: {
    saveState: jest.fn(),
    loadState: jest.fn(),
    clearState: jest.fn(),
    isFirstTimeUser: jest.fn(),
  },
}));

describe('GuideContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (PersistenceService.loadState as jest.Mock).mockReturnValue(null);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GuideProvider>{children}</GuideProvider>
  );

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      expect(result.current.isActive).toBe(false);
      expect(result.current.currentStepIndex).toBe(0);
      expect(result.current.totalSteps).toBe(TOTAL_GUIDE_STEPS);
      expect(result.current.currentStepId).toBe(null);
      expect(result.current.isCompleted).toBe(false);
      expect(result.current.isPaused).toBe(false);
    });

    it('should load saved state on mount', () => {
      const savedState = {
        currentStepIndex: 5,
        isCompleted: false,
        isPaused: true,
        lastActiveTimestamp: Date.now(),
        completedSteps: ['dashboard-title', 'dashboard-guide-text'],
        bonusOffered: false,
        bonusCompleted: false,
      };
      (PersistenceService.loadState as jest.Mock).mockReturnValue(savedState);

      const { result } = renderHook(() => useGuide(), { wrapper });

      expect(result.current.currentStepIndex).toBe(5);
      expect(result.current.isPaused).toBe(true);
      expect(result.current.currentStepId).toBe(GUIDE_FLOW[5].id);
    });

    it('should throw error when used outside GuideProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useGuide());
      }).toThrow('useGuide must be used within a GuideProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Control Methods', () => {
    it('should start guide from beginning', () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
      });

      expect(result.current.isActive).toBe(true);
      expect(result.current.currentStepIndex).toBe(0);
      expect(result.current.currentStepId).toBe(GUIDE_FLOW[0].id);
      expect(result.current.isCompleted).toBe(false);
      expect(result.current.isPaused).toBe(false);
    });

    it('should pause guide and save state', async () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
      });

      act(() => {
        result.current.pauseGuide();
      });

      expect(result.current.isActive).toBe(false);
      expect(result.current.isPaused).toBe(true);

      await waitFor(() => {
        expect(PersistenceService.saveState).toHaveBeenCalled();
      });
    });

    it('should resume paused guide', () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
        result.current.pauseGuide();
      });

      act(() => {
        result.current.resumeGuide();
      });

      expect(result.current.isActive).toBe(true);
      expect(result.current.isPaused).toBe(false);
    });

    it('should close guide and save progress', async () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
      });

      act(() => {
        result.current.closeGuide();
      });

      expect(result.current.isActive).toBe(false);
      expect(result.current.isPaused).toBe(true);

      await waitFor(() => {
        expect(PersistenceService.saveState).toHaveBeenCalled();
      });
    });

    it('should reset guide to initial state', () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
        result.current.nextStep();
        result.current.nextStep();
      });

      act(() => {
        result.current.resetGuide();
      });

      expect(result.current.isActive).toBe(false);
      expect(result.current.currentStepIndex).toBe(0);
      expect(result.current.isCompleted).toBe(false);
      expect(result.current.isPaused).toBe(false);
      expect(PersistenceService.clearState).toHaveBeenCalled();
    });

    it('should complete guide', async () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
      });

      act(() => {
        result.current.completeGuide();
      });

      expect(result.current.isActive).toBe(false);
      expect(result.current.isCompleted).toBe(true);
      expect(result.current.isPaused).toBe(false);
      expect(result.current.currentStepId).toBe(null);

      await waitFor(() => {
        expect(PersistenceService.saveState).toHaveBeenCalled();
      });
    });
  });

  describe('Navigation Methods', () => {
    it('should advance to next step', () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
      });

      const initialStepId = result.current.currentStepId;

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStepIndex).toBe(1);
      expect(result.current.currentStepId).toBe(GUIDE_FLOW[1].id);
      expect(result.current.currentStepId).not.toBe(initialStepId);
    });

    it('should go back to previous step', () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
        result.current.nextStep();
        result.current.nextStep();
      });

      expect(result.current.currentStepIndex).toBe(2);

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStepIndex).toBe(1);
      expect(result.current.currentStepId).toBe(GUIDE_FLOW[1].id);
    });

    it('should not go before first step', () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
      });

      expect(result.current.currentStepIndex).toBe(0);

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStepIndex).toBe(0);
    });

    it('should complete guide when advancing past last step', () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
        result.current.goToStep(TOTAL_GUIDE_STEPS - 1);
      });

      expect(result.current.currentStepIndex).toBe(TOTAL_GUIDE_STEPS - 1);

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.isActive).toBe(false);
      expect(result.current.isCompleted).toBe(true);
      expect(result.current.currentStepId).toBe(null);
    });

    it('should jump to specific step', () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
      });

      const targetIndex = 10;

      act(() => {
        result.current.goToStep(targetIndex);
      });

      expect(result.current.currentStepIndex).toBe(targetIndex);
      expect(result.current.currentStepId).toBe(GUIDE_FLOW[targetIndex].id);
      expect(result.current.isActive).toBe(true);
    });

    it('should not jump to invalid step index', () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
      });

      const initialIndex = result.current.currentStepIndex;

      act(() => {
        result.current.goToStep(-1);
      });

      expect(result.current.currentStepIndex).toBe(initialIndex);

      act(() => {
        result.current.goToStep(TOTAL_GUIDE_STEPS + 10);
      });

      expect(result.current.currentStepIndex).toBe(initialIndex);
    });
  });

  describe('Query Methods', () => {
    it('should return current step when guide is active', () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
      });

      const currentStep = result.current.getCurrentStep();

      expect(currentStep).not.toBe(null);
      expect(currentStep?.id).toBe(GUIDE_FLOW[0].id);
    });

    it('should return null when guide is not active', () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      const currentStep = result.current.getCurrentStep();

      expect(currentStep).toBe(null);
    });

    it('should correctly report canGoNext', () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
      });

      expect(result.current.canGoNext()).toBe(true);

      act(() => {
        result.current.goToStep(TOTAL_GUIDE_STEPS - 1);
      });

      expect(result.current.canGoNext()).toBe(false);
    });

    it('should correctly report canGoPrev', () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
      });

      expect(result.current.canGoPrev()).toBe(false);

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.canGoPrev()).toBe(true);
    });
  });

  describe('State Persistence', () => {
    it('should save state when step changes', async () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
      });

      await waitFor(() => {
        expect(PersistenceService.saveState).toHaveBeenCalled();
      });

      const saveCallCount = (PersistenceService.saveState as jest.Mock).mock.calls.length;

      act(() => {
        result.current.nextStep();
      });

      await waitFor(() => {
        expect((PersistenceService.saveState as jest.Mock).mock.calls.length).toBeGreaterThan(saveCallCount);
      });
    });

    it('should save correct state structure', async () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
        result.current.nextStep();
      });

      await waitFor(() => {
        expect(PersistenceService.saveState).toHaveBeenCalled();
      });

      const lastCall = (PersistenceService.saveState as jest.Mock).mock.calls.slice(-1)[0][0];

      expect(lastCall).toHaveProperty('currentStepIndex');
      expect(lastCall).toHaveProperty('isCompleted');
      expect(lastCall).toHaveProperty('isPaused');
      expect(lastCall).toHaveProperty('lastActiveTimestamp');
      expect(lastCall).toHaveProperty('completedSteps');
      expect(lastCall).toHaveProperty('bonusOffered');
      expect(lastCall).toHaveProperty('bonusCompleted');
    });

    it('should include completed steps in saved state', async () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      act(() => {
        result.current.startGuide();
        result.current.nextStep();
        result.current.nextStep();
      });

      await waitFor(() => {
        expect(PersistenceService.saveState).toHaveBeenCalled();
      });

      const lastCall = (PersistenceService.saveState as jest.Mock).mock.calls.slice(-1)[0][0];

      expect(lastCall.completedSteps).toHaveLength(2);
      expect(lastCall.completedSteps).toContain(GUIDE_FLOW[0].id);
      expect(lastCall.completedSteps).toContain(GUIDE_FLOW[1].id);
    });
  });

  describe('Memoization', () => {
    it('should not recreate context value when state does not change', () => {
      const { result, rerender } = renderHook(() => useGuide(), { wrapper });

      const firstValue = result.current;

      rerender();

      const secondValue = result.current;

      // Context value should be the same object reference
      expect(firstValue).toBe(secondValue);
    });

    it('should recreate context value when state changes', () => {
      const { result } = renderHook(() => useGuide(), { wrapper });

      const initialValue = result.current;

      act(() => {
        result.current.startGuide();
      });

      const updatedValue = result.current;

      // Context value should be a different object reference
      expect(initialValue).not.toBe(updatedValue);
    });
  });
});
