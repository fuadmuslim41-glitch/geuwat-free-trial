/**
 * ConfigService Integration Tests
 * 
 * Tests ConfigService with the actual GUIDE_FLOW configuration
 */

import { ConfigService } from './ConfigService';

describe('ConfigService Integration Tests', () => {
  describe('with actual GUIDE_FLOW', () => {
    it('should load the actual guide flow', () => {
      const flow = ConfigService.loadGuideFlow();
      expect(flow).toBeDefined();
      expect(Array.isArray(flow)).toBe(true);
      expect(flow.length).toBeGreaterThan(0);
    });

    it('should validate the actual guide flow successfully', () => {
      const flow = ConfigService.loadGuideFlow();
      const isValid = ConfigService.validateGuideFlow(flow);
      expect(isValid).toBe(true);
    });

    it('should have all required dashboard steps', () => {
      const dashboardSteps = ConfigService.getStepsByRoute('/dashboard');
      expect(dashboardSteps.length).toBeGreaterThan(0);
      
      const stepIds = dashboardSteps.map(s => s.id);
      expect(stepIds).toContain('dashboard-title');
      expect(stepIds).toContain('dashboard-guide-text');
      expect(stepIds).toContain('dashboard-phase-indicator');
      expect(stepIds).toContain('dashboard-initiate-button');
    });

    it('should have all required skill selection steps', () => {
      const skillSteps = ConfigService.getStepsByRoute('/skill');
      expect(skillSteps.length).toBeGreaterThan(0);
      
      const stepIds = skillSteps.map(s => s.id);
      expect(stepIds).toContain('skill-status');
      expect(stepIds).toContain('skill-execute');
    });

    it('should have all required pronunciation menu steps', () => {
      const pronunciationSteps = ConfigService.getStepsByRoute('/skill/pronunciation');
      expect(pronunciationSteps.length).toBeGreaterThan(0);
      
      const stepIds = pronunciationSteps.map(s => s.id);
      expect(stepIds).toContain('pronunciation-menu-icon');
      expect(stepIds).toContain('pronunciation-alphabet');
    });

    it('should have all required alphabet page steps', () => {
      const alphabetSteps = ConfigService.getStepsByRoute('/skill/pronunciation/alphabet');
      expect(alphabetSteps.length).toBeGreaterThan(0);
      
      const stepIds = alphabetSteps.map(s => s.id);
      expect(stepIds).toContain('alphabet-play-all');
      expect(stepIds).toContain('alphabet-cards');
      expect(stepIds).toContain('alphabet-quick-spelling');
      expect(stepIds).toContain('alphabet-notes');
      expect(stepIds).toContain('alphabet-practice-button');
      expect(stepIds).toContain('alphabet-prompt-input');
      expect(stepIds).toContain('alphabet-recording-panel');
      expect(stepIds).toContain('alphabet-close-recording');
      expect(stepIds).toContain('alphabet-back-button');
    });

    it('should have all required phonetic portal steps', () => {
      const phoneticPortalSteps = ConfigService.getStepsByRoute('/skill/pronunciation/phoneticSymbols');
      expect(phoneticPortalSteps.length).toBeGreaterThan(0);
      
      const stepIds = phoneticPortalSteps.map(s => s.id);
      expect(stepIds).toContain('phonetic-cpu-icon');
      expect(stepIds).toContain('phonetic-vowel-portal');
      expect(stepIds).toContain('phonetic-symbol-i');
    });

    it('should have all required phonetic detail steps', () => {
      const phoneticDetailSteps = ConfigService.getStepsByRoute('/skill/pronunciation/phoneticSymbols/i');
      expect(phoneticDetailSteps.length).toBeGreaterThan(0);
      
      const stepIds = phoneticDetailSteps.map(s => s.id);
      expect(stepIds).toContain('phonetic-detail-play');
      expect(stepIds).toContain('phonetic-detail-examples');
      expect(stepIds).toContain('phonetic-detail-tips');
      expect(stepIds).toContain('phonetic-detail-common-letters');
      expect(stepIds).toContain('phonetic-detail-close-popup');
      expect(stepIds).toContain('phonetic-detail-alternative-audio');
      expect(stepIds).toContain('phonetic-detail-practice');
    });

    it('should find steps by id', () => {
      const step = ConfigService.getStepById('dashboard-title');
      expect(step).toBeDefined();
      expect(step?.id).toBe('dashboard-title');
      expect(step?.route).toBe('/dashboard');
    });

    it('should return correct step index', () => {
      const index = ConfigService.getStepIndexById('dashboard-title');
      expect(index).toBe(0);
    });

    it('should return total steps count', () => {
      const total = ConfigService.getTotalSteps();
      expect(total).toBeGreaterThan(0);
    });

    it('should check if step exists', () => {
      expect(ConfigService.hasStep('dashboard-title')).toBe(true);
      expect(ConfigService.hasStep('non-existent-step')).toBe(false);
    });

    it('should validate all steps have required navigation targets', () => {
      const flow = ConfigService.loadGuideFlow();
      const stepsRequiringNav = flow.filter(s => s.requiresNavigation);
      
      stepsRequiringNav.forEach(step => {
        expect(step.navigationTarget).toBeDefined();
        expect(step.navigationTarget).not.toBe('');
      });
    });

    it('should validate all interactive mode steps', () => {
      const flow = ConfigService.loadGuideFlow();
      const interactiveSteps = flow.filter(s => s.mode === 'interactive');
      
      expect(interactiveSteps.length).toBeGreaterThan(0);
      interactiveSteps.forEach(step => {
        expect(step.targetSelector).toBeDefined();
        expect(step.targetSelector).not.toBe('');
      });
    });

    it('should validate all steps have valid tooltip positions', () => {
      const flow = ConfigService.loadGuideFlow();
      const validPositions = ['top', 'bottom', 'left', 'right', 'auto'];
      
      flow.forEach(step => {
        expect(validPositions).toContain(step.tooltipPosition);
      });
    });

    it('should validate all steps have valid scroll behaviors', () => {
      const flow = ConfigService.loadGuideFlow();
      const validBehaviors = ['smooth', 'instant', 'none'];
      
      flow.forEach(step => {
        expect(validBehaviors).toContain(step.scrollBehavior);
      });
    });

    it('should validate all steps have Indonesian tooltip text', () => {
      const flow = ConfigService.loadGuideFlow();
      
      flow.forEach(step => {
        expect(step.tooltipText).toBeDefined();
        expect(step.tooltipText.length).toBeGreaterThan(0);
        // Check for common Indonesian words to verify language
        const hasIndonesianWords = /untuk|dan|ini|yang|dengan|klik|tombol|menu/i.test(step.tooltipText);
        expect(hasIndonesianWords).toBe(true);
      });
    });
  });
});
