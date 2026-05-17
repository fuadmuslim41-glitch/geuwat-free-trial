/**
 * ConfigService Unit Tests
 * 
 * Tests for guide flow configuration loading and validation
 */

import { ConfigService } from './ConfigService';
import { GuideStep } from '@/types/guide';

// Mock the GUIDE_FLOW import
jest.mock('@/config/guideFlowConfig', () => ({
  GUIDE_FLOW: [
    {
      id: 'test-step-1',
      route: '/test',
      targetSelector: '[data-tour="test-1"]',
      tooltipText: 'Test step 1',
      tooltipPosition: 'bottom',
      mode: 'auto',
      requiresNavigation: false,
      waitForElement: true,
      scrollBehavior: 'smooth',
    },
    {
      id: 'test-step-2',
      route: '/test',
      targetSelector: '[data-tour="test-2"]',
      tooltipText: 'Test step 2',
      tooltipPosition: 'top',
      mode: 'interactive',
      requiresNavigation: true,
      navigationTarget: '/next-page',
      waitForElement: true,
      scrollBehavior: 'instant',
    },
    {
      id: 'test-step-3',
      route: '/next-page',
      targetSelector: '[data-tour="test-3"]',
      tooltipText: 'Test step 3',
      tooltipPosition: 'left',
      mode: 'auto',
      requiresNavigation: false,
      waitForElement: false,
      scrollBehavior: 'none',
      highlightStyle: {
        borderRadius: '8px',
        padding: 10,
        glowColor: '#ff0000',
        glowIntensity: 0.5,
      },
    },
  ],
}));

describe('ConfigService', () => {
  describe('loadGuideFlow', () => {
    it('should load the guide flow configuration', () => {
      const flow = ConfigService.loadGuideFlow();
      expect(flow).toBeDefined();
      expect(Array.isArray(flow)).toBe(true);
      expect(flow.length).toBe(3);
    });

    it('should return steps with all required fields', () => {
      const flow = ConfigService.loadGuideFlow();
      const step = flow[0];
      
      expect(step.id).toBe('test-step-1');
      expect(step.route).toBe('/test');
      expect(step.targetSelector).toBe('[data-tour="test-1"]');
      expect(step.tooltipText).toBe('Test step 1');
      expect(step.tooltipPosition).toBe('bottom');
      expect(step.mode).toBe('auto');
      expect(step.requiresNavigation).toBe(false);
      expect(step.waitForElement).toBe(true);
      expect(step.scrollBehavior).toBe('smooth');
    });
  });

  describe('validateGuideFlow', () => {
    it('should validate a correct guide flow', () => {
      const flow = ConfigService.loadGuideFlow();
      const isValid = ConfigService.validateGuideFlow(flow);
      expect(isValid).toBe(true);
    });

    it('should reject non-array input', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const isValid = ConfigService.validateGuideFlow({} as any);
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('ConfigService: Guide flow must be an array');
      consoleSpy.mockRestore();
    });

    it('should reject empty array', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const isValid = ConfigService.validateGuideFlow([]);
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('ConfigService: Guide flow cannot be empty');
      consoleSpy.mockRestore();
    });

    it('should reject step with missing id', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidFlow = [
        {
          route: '/test',
          targetSelector: '[data-tour="test"]',
          tooltipText: 'Test',
          tooltipPosition: 'bottom',
          mode: 'auto',
          requiresNavigation: false,
          waitForElement: true,
          scrollBehavior: 'smooth',
        } as any,
      ];
      const isValid = ConfigService.validateGuideFlow(invalidFlow);
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('ConfigService: Step at index 0 has invalid id');
      consoleSpy.mockRestore();
    });

    it('should reject step with empty id', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidFlow = [
        {
          id: '',
          route: '/test',
          targetSelector: '[data-tour="test"]',
          tooltipText: 'Test',
          tooltipPosition: 'bottom',
          mode: 'auto',
          requiresNavigation: false,
          waitForElement: true,
          scrollBehavior: 'smooth',
        } as GuideStep,
      ];
      const isValid = ConfigService.validateGuideFlow(invalidFlow);
      expect(isValid).toBe(false);
      consoleSpy.mockRestore();
    });

    it('should reject step with invalid route', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidFlow = [
        {
          id: 'test',
          route: '',
          targetSelector: '[data-tour="test"]',
          tooltipText: 'Test',
          tooltipPosition: 'bottom',
          mode: 'auto',
          requiresNavigation: false,
          waitForElement: true,
          scrollBehavior: 'smooth',
        } as GuideStep,
      ];
      const isValid = ConfigService.validateGuideFlow(invalidFlow);
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('ConfigService: Step "test" has invalid route');
      consoleSpy.mockRestore();
    });

    it('should reject step with invalid targetSelector', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidFlow = [
        {
          id: 'test',
          route: '/test',
          targetSelector: '',
          tooltipText: 'Test',
          tooltipPosition: 'bottom',
          mode: 'auto',
          requiresNavigation: false,
          waitForElement: true,
          scrollBehavior: 'smooth',
        } as GuideStep,
      ];
      const isValid = ConfigService.validateGuideFlow(invalidFlow);
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('ConfigService: Step "test" has invalid targetSelector');
      consoleSpy.mockRestore();
    });

    it('should reject step with invalid tooltipText', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidFlow = [
        {
          id: 'test',
          route: '/test',
          targetSelector: '[data-tour="test"]',
          tooltipText: '',
          tooltipPosition: 'bottom',
          mode: 'auto',
          requiresNavigation: false,
          waitForElement: true,
          scrollBehavior: 'smooth',
        } as GuideStep,
      ];
      const isValid = ConfigService.validateGuideFlow(invalidFlow);
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('ConfigService: Step "test" has invalid tooltipText');
      consoleSpy.mockRestore();
    });

    it('should reject step with invalid tooltipPosition', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidFlow = [
        {
          id: 'test',
          route: '/test',
          targetSelector: '[data-tour="test"]',
          tooltipText: 'Test',
          tooltipPosition: 'invalid' as any,
          mode: 'auto',
          requiresNavigation: false,
          waitForElement: true,
          scrollBehavior: 'smooth',
        },
      ];
      const isValid = ConfigService.validateGuideFlow(invalidFlow);
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('ConfigService: Step "test" has invalid tooltipPosition: invalid');
      consoleSpy.mockRestore();
    });

    it('should reject step with invalid mode', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidFlow = [
        {
          id: 'test',
          route: '/test',
          targetSelector: '[data-tour="test"]',
          tooltipText: 'Test',
          tooltipPosition: 'bottom',
          mode: 'invalid' as any,
          requiresNavigation: false,
          waitForElement: true,
          scrollBehavior: 'smooth',
        },
      ];
      const isValid = ConfigService.validateGuideFlow(invalidFlow);
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('ConfigService: Step "test" has invalid mode: invalid');
      consoleSpy.mockRestore();
    });

    it('should reject step with invalid requiresNavigation', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidFlow = [
        {
          id: 'test',
          route: '/test',
          targetSelector: '[data-tour="test"]',
          tooltipText: 'Test',
          tooltipPosition: 'bottom',
          mode: 'auto',
          requiresNavigation: 'yes' as any,
          waitForElement: true,
          scrollBehavior: 'smooth',
        },
      ];
      const isValid = ConfigService.validateGuideFlow(invalidFlow);
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('ConfigService: Step "test" has invalid requiresNavigation');
      consoleSpy.mockRestore();
    });

    it('should reject step with requiresNavigation true but missing navigationTarget', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidFlow = [
        {
          id: 'test',
          route: '/test',
          targetSelector: '[data-tour="test"]',
          tooltipText: 'Test',
          tooltipPosition: 'bottom',
          mode: 'interactive',
          requiresNavigation: true,
          waitForElement: true,
          scrollBehavior: 'smooth',
        } as GuideStep,
      ];
      const isValid = ConfigService.validateGuideFlow(invalidFlow);
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('ConfigService: Step "test" requires navigation but has invalid navigationTarget');
      consoleSpy.mockRestore();
    });

    it('should reject step with invalid waitForElement', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidFlow = [
        {
          id: 'test',
          route: '/test',
          targetSelector: '[data-tour="test"]',
          tooltipText: 'Test',
          tooltipPosition: 'bottom',
          mode: 'auto',
          requiresNavigation: false,
          waitForElement: 'yes' as any,
          scrollBehavior: 'smooth',
        },
      ];
      const isValid = ConfigService.validateGuideFlow(invalidFlow);
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('ConfigService: Step "test" has invalid waitForElement');
      consoleSpy.mockRestore();
    });

    it('should reject step with invalid scrollBehavior', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidFlow = [
        {
          id: 'test',
          route: '/test',
          targetSelector: '[data-tour="test"]',
          tooltipText: 'Test',
          tooltipPosition: 'bottom',
          mode: 'auto',
          requiresNavigation: false,
          waitForElement: true,
          scrollBehavior: 'invalid' as any,
        },
      ];
      const isValid = ConfigService.validateGuideFlow(invalidFlow);
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('ConfigService: Step "test" has invalid scrollBehavior: invalid');
      consoleSpy.mockRestore();
    });

    it('should accept step with valid highlightStyle', () => {
      const validFlow = [
        {
          id: 'test',
          route: '/test',
          targetSelector: '[data-tour="test"]',
          tooltipText: 'Test',
          tooltipPosition: 'bottom',
          mode: 'auto',
          requiresNavigation: false,
          waitForElement: true,
          scrollBehavior: 'smooth',
          highlightStyle: {
            borderRadius: '8px',
            padding: 10,
            glowColor: '#ff0000',
            glowIntensity: 0.5,
          },
        } as GuideStep,
      ];
      const isValid = ConfigService.validateGuideFlow(validFlow);
      expect(isValid).toBe(true);
    });

    it('should reject step with invalid highlightStyle.borderRadius', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidFlow = [
        {
          id: 'test',
          route: '/test',
          targetSelector: '[data-tour="test"]',
          tooltipText: 'Test',
          tooltipPosition: 'bottom',
          mode: 'auto',
          requiresNavigation: false,
          waitForElement: true,
          scrollBehavior: 'smooth',
          highlightStyle: {
            borderRadius: 123 as any,
          },
        },
      ];
      const isValid = ConfigService.validateGuideFlow(invalidFlow);
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('ConfigService: Step "test" has invalid highlightStyle.borderRadius');
      consoleSpy.mockRestore();
    });

    it('should reject step with invalid highlightStyle.padding', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidFlow = [
        {
          id: 'test',
          route: '/test',
          targetSelector: '[data-tour="test"]',
          tooltipText: 'Test',
          tooltipPosition: 'bottom',
          mode: 'auto',
          requiresNavigation: false,
          waitForElement: true,
          scrollBehavior: 'smooth',
          highlightStyle: {
            padding: '10px' as any,
          },
        },
      ];
      const isValid = ConfigService.validateGuideFlow(invalidFlow);
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('ConfigService: Step "test" has invalid highlightStyle.padding');
      consoleSpy.mockRestore();
    });

    it('should reject step with invalid highlightStyle.glowIntensity (out of range)', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidFlow = [
        {
          id: 'test',
          route: '/test',
          targetSelector: '[data-tour="test"]',
          tooltipText: 'Test',
          tooltipPosition: 'bottom',
          mode: 'auto',
          requiresNavigation: false,
          waitForElement: true,
          scrollBehavior: 'smooth',
          highlightStyle: {
            glowIntensity: 1.5,
          },
        },
      ];
      const isValid = ConfigService.validateGuideFlow(invalidFlow);
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('ConfigService: Step "test" has invalid highlightStyle.glowIntensity (must be 0-1)');
      consoleSpy.mockRestore();
    });

    it('should accept step with valid callbacks', () => {
      const validFlow = [
        {
          id: 'test',
          route: '/test',
          targetSelector: '[data-tour="test"]',
          tooltipText: 'Test',
          tooltipPosition: 'bottom',
          mode: 'auto',
          requiresNavigation: false,
          waitForElement: true,
          scrollBehavior: 'smooth',
          onStepEnter: () => {},
          onStepExit: () => {},
          onInteraction: () => {},
        } as GuideStep,
      ];
      const isValid = ConfigService.validateGuideFlow(validFlow);
      expect(isValid).toBe(true);
    });

    it('should reject step with invalid onStepEnter callback', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidFlow = [
        {
          id: 'test',
          route: '/test',
          targetSelector: '[data-tour="test"]',
          tooltipText: 'Test',
          tooltipPosition: 'bottom',
          mode: 'auto',
          requiresNavigation: false,
          waitForElement: true,
          scrollBehavior: 'smooth',
          onStepEnter: 'not a function' as any,
        },
      ];
      const isValid = ConfigService.validateGuideFlow(invalidFlow);
      expect(isValid).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('ConfigService: Step "test" has invalid onStepEnter callback');
      consoleSpy.mockRestore();
    });
  });

  describe('getStepById', () => {
    it('should return the correct step by id', () => {
      const step = ConfigService.getStepById('test-step-2');
      expect(step).toBeDefined();
      expect(step?.id).toBe('test-step-2');
      expect(step?.route).toBe('/test');
      expect(step?.mode).toBe('interactive');
    });

    it('should return null for non-existent step id', () => {
      const step = ConfigService.getStepById('non-existent');
      expect(step).toBeNull();
    });
  });

  describe('getStepIndexById', () => {
    it('should return the correct index for a step id', () => {
      const index = ConfigService.getStepIndexById('test-step-2');
      expect(index).toBe(1);
    });

    it('should return -1 for non-existent step id', () => {
      const index = ConfigService.getStepIndexById('non-existent');
      expect(index).toBe(-1);
    });
  });

  describe('getStepsByRoute', () => {
    it('should return all steps for a given route', () => {
      const steps = ConfigService.getStepsByRoute('/test');
      expect(steps).toHaveLength(2);
      expect(steps[0].id).toBe('test-step-1');
      expect(steps[1].id).toBe('test-step-2');
    });

    it('should return empty array for route with no steps', () => {
      const steps = ConfigService.getStepsByRoute('/non-existent');
      expect(steps).toHaveLength(0);
    });

    it('should return single step for route with one step', () => {
      const steps = ConfigService.getStepsByRoute('/next-page');
      expect(steps).toHaveLength(1);
      expect(steps[0].id).toBe('test-step-3');
    });
  });

  describe('getTotalSteps', () => {
    it('should return the total number of steps', () => {
      const total = ConfigService.getTotalSteps();
      expect(total).toBe(3);
    });
  });

  describe('hasStep', () => {
    it('should return true for existing step id', () => {
      const exists = ConfigService.hasStep('test-step-1');
      expect(exists).toBe(true);
    });

    it('should return false for non-existent step id', () => {
      const exists = ConfigService.hasStep('non-existent');
      expect(exists).toBe(false);
    });
  });

  describe('validateOnInit', () => {
    it('should validate and log success for valid guide flow', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const isValid = ConfigService.validateOnInit();
      expect(isValid).toBe(true);
      expect(consoleLogSpy).toHaveBeenCalledWith('ConfigService: Guide flow validated successfully (3 steps)');
      consoleLogSpy.mockRestore();
    });
  });
});
