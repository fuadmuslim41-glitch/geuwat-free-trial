/**
 * Type definitions for the Interactive Guide System
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the guide system for type safety and documentation.
 */

/**
 * Position of the tooltip relative to the target element
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';

/**
 * Mode of interaction for a guide step
 * - 'interactive': User must click the target element to proceed
 * - 'auto': User clicks Next button to proceed
 */
export type StepMode = 'interactive' | 'auto';

/**
 * Scrolling behavior when navigating to a step
 * - 'smooth': Smooth animated scroll
 * - 'instant': Immediate scroll without animation
 * - 'none': No scrolling
 */
export type ScrollBehavior = 'smooth' | 'instant' | 'none';

/**
 * Custom styling options for element highlighting
 */
export interface HighlightStyle {
  /** Border radius for the highlight box */
  borderRadius?: string;
  /** Padding around the target element */
  padding?: number;
  /** Color of the glow effect */
  glowColor?: string;
  /** Intensity of the glow effect (0-1) */
  glowIntensity?: number;
}

/**
 * Represents a single step in the guide flow
 */
export interface GuideStep {
  /** Unique identifier for this step */
  id: string;
  
  /** Next.js route path where this step occurs */
  route: string;
  
  /** CSS selector for the target element to highlight */
  targetSelector: string;
  
  /** Instructional text to display in the tooltip (Indonesian) */
  tooltipText: string;
  
  /** Position of the tooltip relative to the target element */
  tooltipPosition: TooltipPosition;
  
  /** Interaction mode for this step */
  mode: StepMode;
  
  /** Whether this step requires navigation to another page */
  requiresNavigation: boolean;
  
  /** Target route if requiresNavigation is true */
  navigationTarget?: string;
  
  /** Wait for target element to appear in DOM before proceeding */
  waitForElement: boolean;
  
  /** Scrolling behavior for this step */
  scrollBehavior: ScrollBehavior;
  
  /** Custom highlight styling (optional) */
  highlightStyle?: HighlightStyle;
  
  /** Callback executed when step becomes active */
  onStepEnter?: () => void;
  
  /** Callback executed when leaving this step */
  onStepExit?: () => void;
  
  /** Callback executed when user interacts with target element */
  onInteraction?: () => void;
}

/**
 * Persisted state of the guide system
 * Stored in localStorage to track user progress
 */
export interface GuideState {
  /** Current step index in the guide flow */
  currentStepIndex: number;
  
  /** Whether the guide has been completed */
  isCompleted: boolean;
  
  /** Whether the guide is paused */
  isPaused: boolean;
  
  /** Timestamp of last guide activity */
  lastActiveTimestamp: number;
  
  /** Array of completed step IDs */
  completedSteps: string[];
  
  /** Whether bonus offer has been shown */
  bonusOffered: boolean;
  
  /** Whether bonus guide has been completed */
  bonusCompleted: boolean;
}

/**
 * Context value provided by GuideProvider
 * Available to all components consuming the guide context
 */
export interface GuideContextValue {
  // State
  /** Whether the guide is currently active */
  isActive: boolean;
  
  /** Current step index (0-based) */
  currentStepIndex: number;
  
  /** Total number of steps in the guide */
  totalSteps: number;
  
  /** ID of the current step, or null if guide is not active */
  currentStepId: string | null;
  
  /** Whether the guide has been completed */
  isCompleted: boolean;
  
  /** Whether the guide is paused */
  isPaused: boolean;
  
  /** Whether bonus offer has been shown */
  bonusOffered: boolean;
  
  /** Whether bonus guide has been completed */
  bonusCompleted: boolean;
  
  // Navigation
  /** Advance to the next step */
  nextStep: () => void;
  
  /** Go back to the previous step */
  prevStep: () => void;
  
  /** Jump to a specific step by index */
  goToStep: (stepIndex: number) => void;
  
  // Control
  /** Start the guide from the beginning */
  startGuide: () => void;
  
  /** Pause the guide and save progress */
  pauseGuide: () => void;
  
  /** Resume a paused guide */
  resumeGuide: () => void;
  
  /** Close the guide and save progress */
  closeGuide: () => void;
  
  /** Reset the guide to initial state */
  resetGuide: () => void;
  
  /** Mark the guide as completed */
  completeGuide: () => void;
  
  /** Mark bonus as offered */
  offerBonus: () => void;
  
  /** Mark bonus as completed */
  completeBonus: () => void;
  
  // Query
  /** Get the current step object, or null if guide is not active */
  getCurrentStep: () => GuideStep | null;
  
  /** Check if navigation to next step is possible */
  canGoNext: () => boolean;
  
  /** Check if navigation to previous step is possible */
  canGoPrev: () => boolean;
}
