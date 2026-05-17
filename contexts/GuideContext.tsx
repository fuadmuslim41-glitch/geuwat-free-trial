/**
 * GuideContext
 * 
 * Centralized state management for the Interactive Guide System.
 * Provides guide state and control methods to all components via React Context.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 19.1, 19.2, 19.3, 19.4, 19.5
 */

'use client';

import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react';
import { GuideContextValue, GuideStep } from '@/types/guide';
import { PersistenceService } from '@/services/PersistenceService';
import { GUIDE_FLOW, TOTAL_GUIDE_STEPS } from '@/config/guideFlowConfig';
import dynamic from 'next/dynamic';

// Lazy load guide UI components for performance (Requirement 17.1, 20.1)
const GuideManager = dynamic(() => import('@/components/guide/GuideManager'), { ssr: false });
const GuideCompletionMessage = dynamic(() => import('@/components/guide/GuideCompletionMessage'), { ssr: false });
const PageGuidePrompt = dynamic(() => import('@/components/guide/PageGuidePrompt'), { ssr: false });

/**
 * Internal state managed by the reducer
 */
interface GuideState {
  isActive: boolean;
  currentStepIndex: number;
  totalSteps: number;
  currentStepId: string | null;
  isCompleted: boolean;
  isPaused: boolean;
  bonusOffered: boolean;
  bonusCompleted: boolean;
}

/**
 * Action types for the reducer
 */
type GuideAction =
  | { type: 'START_GUIDE' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'PAUSE_GUIDE' }
  | { type: 'RESUME_GUIDE' }
  | { type: 'CLOSE_GUIDE' }
  | { type: 'RESET_GUIDE' }
  | { type: 'COMPLETE_GUIDE' }
  | { type: 'OFFER_BONUS' }
  | { type: 'COMPLETE_BONUS' }
  | { type: 'LOAD_STATE'; payload: { currentStepIndex: number; isCompleted: boolean; isPaused: boolean; bonusOffered: boolean; bonusCompleted: boolean } };

/**
 * Initial state for the guide
 */
const initialState: GuideState = {
  isActive: false,
  currentStepIndex: 0,
  totalSteps: TOTAL_GUIDE_STEPS,
  currentStepId: null,
  isCompleted: false,
  isPaused: false,
  bonusOffered: false,
  bonusCompleted: false,
};

/**
 * Reducer function for guide state management
 */
function guideReducer(state: GuideState, action: GuideAction): GuideState {
  switch (action.type) {
    case 'START_GUIDE':
      return {
        ...state,
        isActive: true,
        currentStepIndex: 0,
        currentStepId: GUIDE_FLOW[0]?.id || null,
        isCompleted: false,
        isPaused: false,
      };

    case 'NEXT_STEP': {
      const nextIndex = state.currentStepIndex + 1;
      
      // Check if we've reached the end of the entire guide
      if (nextIndex >= state.totalSteps) {
        return {
          ...state,
          isActive: false,
          isCompleted: true,
          currentStepId: null,
        };
      }
      
      // Check if we've reached the end of the current page's guide
      const currentStep = GUIDE_FLOW[state.currentStepIndex];
      const nextStep = GUIDE_FLOW[nextIndex];
      
      if (currentStep && nextStep && currentStep.route !== nextStep.route) {
        // Next step is on a different page, so current page guide is complete
        console.log('[GuideContext] Completed guide for page:', currentStep.route);
        return {
          ...state,
          isActive: false,
          isCompleted: true,
          currentStepId: null,
        };
      }
      
      // Continue to next step on same page
      return {
        ...state,
        currentStepIndex: nextIndex,
        currentStepId: GUIDE_FLOW[nextIndex]?.id || null,
      };
    }

    case 'PREV_STEP': {
      const prevIndex = state.currentStepIndex - 1;
      if (prevIndex < 0) {
        return state; // Can't go before first step
      }
      return {
        ...state,
        currentStepIndex: prevIndex,
        currentStepId: GUIDE_FLOW[prevIndex]?.id || null,
      };
    }

    case 'GO_TO_STEP': {
      const targetIndex = action.payload;
      if (targetIndex < 0 || targetIndex >= state.totalSteps) {
        return state; // Invalid index
      }
      return {
        ...state,
        currentStepIndex: targetIndex,
        currentStepId: GUIDE_FLOW[targetIndex]?.id || null,
        isActive: true,
      };
    }

    case 'PAUSE_GUIDE':
      return {
        ...state,
        isActive: false,
        isPaused: true,
      };

    case 'RESUME_GUIDE':
      return {
        ...state,
        isActive: true,
        isPaused: false,
      };

    case 'CLOSE_GUIDE':
      return {
        ...state,
        isActive: false,
        isPaused: false,
      };

    case 'RESET_GUIDE':
      return {
        ...initialState,
        totalSteps: state.totalSteps,
      };

    case 'COMPLETE_GUIDE':
      return {
        ...state,
        isActive: false,
        isCompleted: true,
        isPaused: false,
        currentStepId: null,
      };

    case 'OFFER_BONUS':
      return {
        ...state,
        bonusOffered: true,
      };

    case 'COMPLETE_BONUS':
      return {
        ...state,
        bonusCompleted: true,
      };

    case 'LOAD_STATE':
      return {
        ...state,
        currentStepIndex: action.payload.currentStepIndex,
        isCompleted: action.payload.isCompleted,
        isPaused: action.payload.isPaused,
        bonusOffered: action.payload.bonusOffered,
        bonusCompleted: action.payload.bonusCompleted,
        currentStepId: GUIDE_FLOW[action.payload.currentStepIndex]?.id || null,
      };

    default:
      return state;
  }
}

/**
 * Create the context with undefined default value
 * Exported for testing purposes
 */
export const GuideContext = createContext<GuideContextValue | undefined>(undefined);

/**
 * GuideProvider Props
 */
interface GuideProviderProps {
  children: React.ReactNode;
}

/**
 * GuideProvider Component
 * 
 * Wraps the application and provides guide state and methods to all children.
 * Integrates with PersistenceService to save/load guide progress.
 */
export function GuideProvider({ children }: GuideProviderProps) {
  const [state, dispatch] = useReducer(guideReducer, initialState);

  // Load saved state on mount
  useEffect(() => {
    const savedState = PersistenceService.loadState();
    if (savedState) {
      dispatch({
        type: 'LOAD_STATE',
        payload: {
          currentStepIndex: savedState.currentStepIndex,
          isCompleted: savedState.isCompleted,
          isPaused: savedState.isPaused,
          bonusOffered: savedState.bonusOffered,
          bonusCompleted: savedState.bonusCompleted,
        },
      });
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (state.isActive || state.isPaused || state.isCompleted) {
      PersistenceService.saveState({
        currentStepIndex: state.currentStepIndex,
        isCompleted: state.isCompleted,
        isPaused: state.isPaused,
        lastActiveTimestamp: Date.now(),
        completedSteps: GUIDE_FLOW.slice(0, state.currentStepIndex).map(step => step.id),
        bonusOffered: state.bonusOffered,
        bonusCompleted: state.bonusCompleted,
      });
    }
  }, [state.currentStepIndex, state.isCompleted, state.isPaused, state.isActive, state.bonusOffered, state.bonusCompleted]);

  // Navigation methods
  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
  }, []);

  const goToStep = useCallback((stepIndex: number) => {
    dispatch({ type: 'GO_TO_STEP', payload: stepIndex });
  }, []);

  // Control methods
  const startGuide = useCallback(() => {
    dispatch({ type: 'START_GUIDE' });
  }, []);

  const pauseGuide = useCallback(() => {
    dispatch({ type: 'PAUSE_GUIDE' });
  }, []);

  const resumeGuide = useCallback(() => {
    // Check if current step's route matches current pathname
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const currentStep = GUIDE_FLOW[state.currentStepIndex];
      
      // If current step is on this page, resume from saved position
      if (currentStep && currentStep.route === currentPath) {
        console.log('[GuideContext] Resuming from saved step:', state.currentStepIndex);
        dispatch({ type: 'RESUME_GUIDE' });
      } else {
        // If current step is NOT on this page, find first step for current page
        const firstStepIndex = GUIDE_FLOW.findIndex(step => step.route === currentPath);
        
        if (firstStepIndex !== -1) {
          console.log('[GuideContext] Starting guide for this page from step:', firstStepIndex);
          dispatch({ type: 'GO_TO_STEP', payload: firstStepIndex });
        } else {
          // No guide for this page, just resume (will be paused by GuideManager)
          console.log('[GuideContext] No guide for this page, resuming anyway');
          dispatch({ type: 'RESUME_GUIDE' });
        }
      }
    } else {
      dispatch({ type: 'RESUME_GUIDE' });
    }
  }, [state.currentStepIndex]);

  const closeGuide = useCallback(() => {
    dispatch({ type: 'CLOSE_GUIDE' });
  }, []);

  const resetGuide = useCallback(() => {
    dispatch({ type: 'RESET_GUIDE' });
    PersistenceService.clearState();
  }, []);

  const completeGuide = useCallback(() => {
    dispatch({ type: 'COMPLETE_GUIDE' });
  }, []);

  const offerBonus = useCallback(() => {
    dispatch({ type: 'OFFER_BONUS' });
  }, []);

  const completeBonus = useCallback(() => {
    dispatch({ type: 'COMPLETE_BONUS' });
  }, []);

  // Query methods
  const getCurrentStep = useCallback((): GuideStep | null => {
    if (!state.isActive || state.currentStepIndex >= GUIDE_FLOW.length) {
      return null;
    }
    return GUIDE_FLOW[state.currentStepIndex] || null;
  }, [state.isActive, state.currentStepIndex]);

  const canGoNext = useCallback((): boolean => {
    return state.currentStepIndex < state.totalSteps - 1;
  }, [state.currentStepIndex, state.totalSteps]);

  const canGoPrev = useCallback((): boolean => {
    return state.currentStepIndex > 0;
  }, [state.currentStepIndex]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<GuideContextValue>(
    () => ({
      // State
      isActive: state.isActive,
      currentStepIndex: state.currentStepIndex,
      totalSteps: state.totalSteps,
      currentStepId: state.currentStepId,
      isCompleted: state.isCompleted,
      isPaused: state.isPaused,
      bonusOffered: state.bonusOffered,
      bonusCompleted: state.bonusCompleted,

      // Navigation
      nextStep,
      prevStep,
      goToStep,

      // Control
      startGuide,
      pauseGuide,
      resumeGuide,
      closeGuide,
      resetGuide,
      completeGuide,
      offerBonus,
      completeBonus,

      // Query
      getCurrentStep,
      canGoNext,
      canGoPrev,
    }),
    [
      state.isActive,
      state.currentStepIndex,
      state.totalSteps,
      state.currentStepId,
      state.isCompleted,
      state.isPaused,
      state.bonusOffered,
      state.bonusCompleted,
      nextStep,
      prevStep,
      goToStep,
      startGuide,
      pauseGuide,
      resumeGuide,
      closeGuide,
      resetGuide,
      completeGuide,
      offerBonus,
      completeBonus,
      getCurrentStep,
      canGoNext,
      canGoPrev,
    ]
  );

  return (
    <GuideContext.Provider value={contextValue}>
      {children}
      {/* Render guide components based on specific conditions (Requirement 17.1, 20.1) */}
      {state.isActive && <GuideManager />}
      {/* Show completion message when guide is completed */}
      {state.isCompleted && !state.isActive && <GuideCompletionMessage />}
      {/* Show page guide prompt when page loads - handles both start and resume */}
      {!state.isActive && !state.isCompleted && <PageGuidePrompt />}
    </GuideContext.Provider>
  );
}

/**
 * Custom hook to use the GuideContext
 * 
 * @throws Error if used outside of GuideProvider
 * @returns GuideContextValue
 */
export function useGuide(): GuideContextValue {
  const context = useContext(GuideContext);
  if (context === undefined) {
    throw new Error('useGuide must be used within a GuideProvider');
  }
  return context;
}
