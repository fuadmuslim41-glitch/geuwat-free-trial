/**
 * Unit and Property-Based Tests for PersistenceService
 * 
 * Tests cover:
 * - State persistence round-trip
 * - localStorage unavailability fallback
 * - State validation
 * - First-time user detection
 * - Error handling for corrupted data
 */

import { PersistenceService } from './PersistenceService';
import { GuideState } from '@/types/guide';
import * as fc from 'fast-check';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  let isAvailable = true;

  return {
    getItem: jest.fn((key: string) => {
      if (!isAvailable) throw new Error('localStorage not available');
      return store[key] || null;
    }),
    setItem: jest.fn((key: string, value: string) => {
      if (!isAvailable) throw new Error('localStorage not available');
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      if (!isAvailable) throw new Error('localStorage not available');
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    setAvailable: (available: boolean) => {
      isAvailable = available;
    },
    getStore: () => store,
  };
})();

// Replace global localStorage
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('PersistenceService', () => {
  beforeEach(() => {
    // Clear localStorage and reset mocks before each test
    localStorageMock.clear();
    localStorageMock.setAvailable(true);
    jest.clearAllMocks();
    // Clear in-memory storage by calling clearState
    PersistenceService.clearState();
  });

  describe('saveState', () => {
    it('should save valid guide state to localStorage', () => {
      const state: GuideState = {
        currentStepIndex: 5,
        isCompleted: false,
        isPaused: false,
        lastActiveTimestamp: Date.now(),
        completedSteps: ['step1', 'step2', 'step3'],
        bonusOffered: false,
        bonusCompleted: false,
      };

      PersistenceService.saveState(state);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'geuwat_guide_state',
        JSON.stringify(state)
      );
    });

    it('should use in-memory fallback when localStorage is unavailable', () => {
      localStorageMock.setAvailable(false);

      const state: GuideState = {
        currentStepIndex: 3,
        isCompleted: false,
        isPaused: true,
        lastActiveTimestamp: Date.now(),
        completedSteps: ['step1'],
        bonusOffered: false,
        bonusCompleted: false,
      };

      PersistenceService.saveState(state);

      // Should not throw error
      expect(() => PersistenceService.saveState(state)).not.toThrow();

      // Should be able to load from memory
      const loaded = PersistenceService.loadState();
      expect(loaded).toEqual(state);
    });

    it('should handle serialization errors gracefully', () => {
      const circularState: any = {
        currentStepIndex: 0,
        isCompleted: false,
        isPaused: false,
        lastActiveTimestamp: Date.now(),
        completedSteps: [],
        bonusOffered: false,
        bonusCompleted: false,
      };
      // Create circular reference
      circularState.self = circularState;

      // Should not throw
      expect(() => PersistenceService.saveState(circularState)).not.toThrow();
    });
  });

  describe('loadState', () => {
    it('should load valid guide state from localStorage', () => {
      const state: GuideState = {
        currentStepIndex: 10,
        isCompleted: true,
        isPaused: false,
        lastActiveTimestamp: 1704067200000,
        completedSteps: ['step1', 'step2', 'step3', 'step4'],
        bonusOffered: true,
        bonusCompleted: false,
      };

      PersistenceService.saveState(state);
      const loaded = PersistenceService.loadState();

      expect(loaded).toEqual(state);
    });

    it('should return null when no state exists', () => {
      const loaded = PersistenceService.loadState();
      expect(loaded).toBeNull();
    });

    it('should return null and clear corrupted data', () => {
      // Manually set corrupted data
      localStorageMock.setItem('geuwat_guide_state', 'invalid json{');

      const loaded = PersistenceService.loadState();

      expect(loaded).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('geuwat_guide_state');
    });

    it('should validate state structure and reject invalid data', () => {
      const invalidStates = [
        // Missing required field
        {
          currentStepIndex: 0,
          isCompleted: false,
          isPaused: false,
          lastActiveTimestamp: Date.now(),
          completedSteps: [],
          bonusOffered: false,
          // missing bonusCompleted
        },
        // Wrong type for field
        {
          currentStepIndex: '5', // should be number
          isCompleted: false,
          isPaused: false,
          lastActiveTimestamp: Date.now(),
          completedSteps: [],
          bonusOffered: false,
          bonusCompleted: false,
        },
        // Invalid completedSteps (not array of strings)
        {
          currentStepIndex: 0,
          isCompleted: false,
          isPaused: false,
          lastActiveTimestamp: Date.now(),
          completedSteps: [1, 2, 3], // should be strings
          bonusOffered: false,
          bonusCompleted: false,
        },
        // Negative currentStepIndex
        {
          currentStepIndex: -1,
          isCompleted: false,
          isPaused: false,
          lastActiveTimestamp: Date.now(),
          completedSteps: [],
          bonusOffered: false,
          bonusCompleted: false,
        },
      ];

      invalidStates.forEach((invalidState) => {
        localStorageMock.clear();
        localStorageMock.setItem('geuwat_guide_state', JSON.stringify(invalidState));

        const loaded = PersistenceService.loadState();
        expect(loaded).toBeNull();
      });
    });

    it('should load from memory when localStorage is unavailable', () => {
      const state: GuideState = {
        currentStepIndex: 2,
        isCompleted: false,
        isPaused: false,
        lastActiveTimestamp: Date.now(),
        completedSteps: ['step1', 'step2'],
        bonusOffered: false,
        bonusCompleted: false,
      };

      // Make localStorage unavailable before saving
      localStorageMock.setAvailable(false);

      // Save with localStorage unavailable (should use memory)
      PersistenceService.saveState(state);

      // Should load from memory
      const loaded = PersistenceService.loadState();
      expect(loaded).toEqual(state);
    });
  });

  describe('clearState', () => {
    it('should clear guide state from localStorage', () => {
      const state: GuideState = {
        currentStepIndex: 5,
        isCompleted: false,
        isPaused: false,
        lastActiveTimestamp: Date.now(),
        completedSteps: ['step1'],
        bonusOffered: false,
        bonusCompleted: false,
      };

      PersistenceService.saveState(state);
      PersistenceService.clearState();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('geuwat_guide_state');

      const loaded = PersistenceService.loadState();
      expect(loaded).toBeNull();
    });

    it('should clear in-memory state', () => {
      localStorageMock.setAvailable(false);

      const state: GuideState = {
        currentStepIndex: 3,
        isCompleted: false,
        isPaused: false,
        lastActiveTimestamp: Date.now(),
        completedSteps: [],
        bonusOffered: false,
        bonusCompleted: false,
      };

      PersistenceService.saveState(state);
      PersistenceService.clearState();

      const loaded = PersistenceService.loadState();
      expect(loaded).toBeNull();
    });

    it('should not throw when localStorage is unavailable', () => {
      localStorageMock.setAvailable(false);
      expect(() => PersistenceService.clearState()).not.toThrow();
    });
  });

  describe('isFirstTimeUser', () => {
    it('should return true when no state exists', () => {
      expect(PersistenceService.isFirstTimeUser()).toBe(true);
    });

    it('should return false when state exists', () => {
      const state: GuideState = {
        currentStepIndex: 0,
        isCompleted: false,
        isPaused: false,
        lastActiveTimestamp: Date.now(),
        completedSteps: [],
        bonusOffered: false,
        bonusCompleted: false,
      };

      PersistenceService.saveState(state);
      expect(PersistenceService.isFirstTimeUser()).toBe(false);
    });

    it('should return true after clearing state', () => {
      const state: GuideState = {
        currentStepIndex: 5,
        isCompleted: false,
        isPaused: false,
        lastActiveTimestamp: Date.now(),
        completedSteps: ['step1'],
        bonusOffered: false,
        bonusCompleted: false,
      };

      PersistenceService.saveState(state);
      expect(PersistenceService.isFirstTimeUser()).toBe(false);

      PersistenceService.clearState();
      expect(PersistenceService.isFirstTimeUser()).toBe(true);
    });
  });

  describe('Property-Based Tests', () => {
    /**
     * Property: State Persistence Round-Trip
     * For any valid guide state, saving and then loading should produce equivalent state
     * Validates: Requirements 1.3, 7.3
     */
    it('property: state persistence round-trip preserves all fields', () => {
      // Arbitrary for GuideState
      const guideStateArbitrary = fc.record({
        currentStepIndex: fc.nat(100),
        isCompleted: fc.boolean(),
        isPaused: fc.boolean(),
        lastActiveTimestamp: fc.nat(),
        completedSteps: fc.array(fc.string(), { maxLength: 50 }),
        bonusOffered: fc.boolean(),
        bonusCompleted: fc.boolean(),
      });

      fc.assert(
        fc.property(guideStateArbitrary, (state) => {
          // Clear before each property test iteration
          PersistenceService.clearState();
          localStorageMock.setAvailable(true);

          // Save and load
          PersistenceService.saveState(state);
          const loaded = PersistenceService.loadState();

          // Should be equivalent
          expect(loaded).toEqual(state);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: In-Memory Fallback Consistency
     * For any valid guide state, when localStorage is unavailable,
     * in-memory storage should work identically
     * Validates: Requirements 18.3
     */
    it('property: in-memory fallback preserves state when localStorage unavailable', () => {
      const guideStateArbitrary = fc.record({
        currentStepIndex: fc.nat(100),
        isCompleted: fc.boolean(),
        isPaused: fc.boolean(),
        lastActiveTimestamp: fc.nat(),
        completedSteps: fc.array(fc.string(), { maxLength: 50 }),
        bonusOffered: fc.boolean(),
        bonusCompleted: fc.boolean(),
      });

      fc.assert(
        fc.property(guideStateArbitrary, (state) => {
          // Clear and disable localStorage
          PersistenceService.clearState();
          localStorageMock.setAvailable(false);

          // Save and load with in-memory fallback
          PersistenceService.saveState(state);
          const loaded = PersistenceService.loadState();

          // Should be equivalent
          expect(loaded).toEqual(state);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Clear State Idempotence
     * Clearing state multiple times should have the same effect as clearing once
     * Validates: Requirements 1.4
     */
    it('property: clearing state is idempotent', () => {
      const guideStateArbitrary = fc.record({
        currentStepIndex: fc.nat(100),
        isCompleted: fc.boolean(),
        isPaused: fc.boolean(),
        lastActiveTimestamp: fc.nat(),
        completedSteps: fc.array(fc.string(), { maxLength: 50 }),
        bonusOffered: fc.boolean(),
        bonusCompleted: fc.boolean(),
      });

      fc.assert(
        fc.property(guideStateArbitrary, fc.integer({ min: 1, max: 10 }), (state, clearCount) => {
          localStorageMock.setAvailable(true);
          PersistenceService.saveState(state);

          // Clear multiple times (at least once)
          for (let i = 0; i < clearCount; i++) {
            PersistenceService.clearState();
          }

          // Should be null regardless of how many times we cleared (as long as we cleared at least once)
          expect(PersistenceService.loadState()).toBeNull();
          expect(PersistenceService.isFirstTimeUser()).toBe(true);
        }),
        { numRuns: 50 }
      );
    });

    /**
     * Property: First-Time User Detection
     * isFirstTimeUser should return true if and only if no valid state exists
     * Validates: Requirements 1.1, 1.2
     */
    it('property: isFirstTimeUser is true iff no state exists', () => {
      const guideStateArbitrary = fc.record({
        currentStepIndex: fc.nat(100),
        isCompleted: fc.boolean(),
        isPaused: fc.boolean(),
        lastActiveTimestamp: fc.nat(),
        completedSteps: fc.array(fc.string(), { maxLength: 50 }),
        bonusOffered: fc.boolean(),
        bonusCompleted: fc.boolean(),
      });

      fc.assert(
        fc.property(fc.option(guideStateArbitrary, { nil: null }), (maybeState) => {
          PersistenceService.clearState();
          localStorageMock.setAvailable(true);

          if (maybeState !== null) {
            PersistenceService.saveState(maybeState);
            expect(PersistenceService.isFirstTimeUser()).toBe(false);
          } else {
            expect(PersistenceService.isFirstTimeUser()).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });
  });
});
