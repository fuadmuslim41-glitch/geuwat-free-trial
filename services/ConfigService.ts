/**
 * ConfigService
 * 
 * Service for loading and validating guide flow configuration.
 * Provides methods to access guide steps and validate their structure.
 * 
 * Requirements: 20.3, 20.4, 20.5
 */

import { GuideStep } from '@/types/guide';
import { GUIDE_FLOW } from '@/config/guideFlowConfig';

/**
 * Service for managing guide flow configuration
 */
export class ConfigService {
  /**
   * Load the complete guide flow configuration
   * @returns Array of all guide steps
   */
  static loadGuideFlow(): GuideStep[] {
    return GUIDE_FLOW;
  }

  /**
   * Validate that all steps in the guide flow have required fields
   * and correct value types
   * 
   * @param flow - The guide flow to validate
   * @returns true if all steps are valid, false otherwise
   */
  static validateGuideFlow(flow: GuideStep[]): boolean {
    if (!Array.isArray(flow)) {
      console.error('ConfigService: Guide flow must be an array');
      return false;
    }

    if (flow.length === 0) {
      console.error('ConfigService: Guide flow cannot be empty');
      return false;
    }

    return flow.every((step, index) => {
      // Validate id
      if (typeof step.id !== 'string' || step.id.length === 0) {
        console.error(`ConfigService: Step at index ${index} has invalid id`);
        return false;
      }

      // Validate route
      if (typeof step.route !== 'string' || step.route.length === 0) {
        console.error(`ConfigService: Step "${step.id}" has invalid route`);
        return false;
      }

      // Validate targetSelector
      if (typeof step.targetSelector !== 'string' || step.targetSelector.length === 0) {
        console.error(`ConfigService: Step "${step.id}" has invalid targetSelector`);
        return false;
      }

      // Validate tooltipText
      if (typeof step.tooltipText !== 'string' || step.tooltipText.length === 0) {
        console.error(`ConfigService: Step "${step.id}" has invalid tooltipText`);
        return false;
      }

      // Validate tooltipPosition
      const validPositions = ['top', 'bottom', 'left', 'right', 'auto'];
      if (!validPositions.includes(step.tooltipPosition)) {
        console.error(`ConfigService: Step "${step.id}" has invalid tooltipPosition: ${step.tooltipPosition}`);
        return false;
      }

      // Validate mode
      const validModes = ['interactive', 'auto'];
      if (!validModes.includes(step.mode)) {
        console.error(`ConfigService: Step "${step.id}" has invalid mode: ${step.mode}`);
        return false;
      }

      // Validate requiresNavigation
      if (typeof step.requiresNavigation !== 'boolean') {
        console.error(`ConfigService: Step "${step.id}" has invalid requiresNavigation`);
        return false;
      }

      // Validate navigationTarget if requiresNavigation is true
      if (step.requiresNavigation) {
        if (typeof step.navigationTarget !== 'string' || step.navigationTarget.length === 0) {
          console.error(`ConfigService: Step "${step.id}" requires navigation but has invalid navigationTarget`);
          return false;
        }
      }

      // Validate waitForElement
      if (typeof step.waitForElement !== 'boolean') {
        console.error(`ConfigService: Step "${step.id}" has invalid waitForElement`);
        return false;
      }

      // Validate scrollBehavior
      const validScrollBehaviors = ['smooth', 'instant', 'none'];
      if (!validScrollBehaviors.includes(step.scrollBehavior)) {
        console.error(`ConfigService: Step "${step.id}" has invalid scrollBehavior: ${step.scrollBehavior}`);
        return false;
      }

      // Validate optional highlightStyle if present
      if (step.highlightStyle !== undefined) {
        if (typeof step.highlightStyle !== 'object' || step.highlightStyle === null) {
          console.error(`ConfigService: Step "${step.id}" has invalid highlightStyle`);
          return false;
        }

        const { borderRadius, padding, glowColor, glowIntensity } = step.highlightStyle;

        if (borderRadius !== undefined && typeof borderRadius !== 'string') {
          console.error(`ConfigService: Step "${step.id}" has invalid highlightStyle.borderRadius`);
          return false;
        }

        if (padding !== undefined && typeof padding !== 'number') {
          console.error(`ConfigService: Step "${step.id}" has invalid highlightStyle.padding`);
          return false;
        }

        if (glowColor !== undefined && typeof glowColor !== 'string') {
          console.error(`ConfigService: Step "${step.id}" has invalid highlightStyle.glowColor`);
          return false;
        }

        if (glowIntensity !== undefined) {
          if (typeof glowIntensity !== 'number' || glowIntensity < 0 || glowIntensity > 1) {
            console.error(`ConfigService: Step "${step.id}" has invalid highlightStyle.glowIntensity (must be 0-1)`);
            return false;
          }
        }
      }

      // Validate optional callbacks if present
      if (step.onStepEnter !== undefined && typeof step.onStepEnter !== 'function') {
        console.error(`ConfigService: Step "${step.id}" has invalid onStepEnter callback`);
        return false;
      }

      if (step.onStepExit !== undefined && typeof step.onStepExit !== 'function') {
        console.error(`ConfigService: Step "${step.id}" has invalid onStepExit callback`);
        return false;
      }

      if (step.onInteraction !== undefined && typeof step.onInteraction !== 'function') {
        console.error(`ConfigService: Step "${step.id}" has invalid onInteraction callback`);
        return false;
      }

      return true;
    });
  }

  /**
   * Get a specific guide step by its ID
   * 
   * @param stepId - The unique identifier of the step
   * @returns The guide step object, or null if not found
   */
  static getStepById(stepId: string): GuideStep | null {
    const step = GUIDE_FLOW.find(s => s.id === stepId);
    return step || null;
  }

  /**
   * Get the index of a guide step by its ID
   * 
   * @param stepId - The unique identifier of the step
   * @returns The index of the step, or -1 if not found
   */
  static getStepIndexById(stepId: string): number {
    return GUIDE_FLOW.findIndex(s => s.id === stepId);
  }

  /**
   * Get all steps for a specific route
   * 
   * @param route - The Next.js route path
   * @returns Array of guide steps for that route
   */
  static getStepsByRoute(route: string): GuideStep[] {
    return GUIDE_FLOW.filter(step => step.route === route);
  }

  /**
   * Get the total number of steps in the guide flow
   * 
   * @returns Total number of steps
   */
  static getTotalSteps(): number {
    return GUIDE_FLOW.length;
  }

  /**
   * Check if a step ID exists in the guide flow
   * 
   * @param stepId - The unique identifier of the step
   * @returns true if the step exists, false otherwise
   */
  static hasStep(stepId: string): boolean {
    return GUIDE_FLOW.some(s => s.id === stepId);
  }

  /**
   * Validate the guide flow on initialization
   * Logs errors to console if validation fails
   * 
   * @returns true if validation passes, false otherwise
   */
  static validateOnInit(): boolean {
    const flow = this.loadGuideFlow();
    const isValid = this.validateGuideFlow(flow);

    if (!isValid) {
      console.error('ConfigService: Guide flow validation failed');
    } else {
      console.log(`ConfigService: Guide flow validated successfully (${flow.length} steps)`);
    }

    return isValid;
  }
}
