/**
 * PersistenceService
 * 
 * Manages guide state persistence to localStorage with in-memory fallback.
 * Handles serialization, deserialization, and validation of guide state.
 * 
 * Requirements: 1.3, 7.3, 18.3, 18.4
 */

import { GuideState } from '@/types/guide';

/**
 * Storage key for guide state in localStorage
 */
const STORAGE_KEY = 'geuwat_guide_state';

/**
 * In-memory fallback storage when localStorage is unavailable
 */
let memoryStorage: GuideState | null = null;

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Validate that a loaded state object has the correct structure
 */
function isValidGuideState(state: any): state is GuideState {
  if (!state || typeof state !== 'object') {
    return false;
  }

  // Check required fields and their types
  if (typeof state.currentStepIndex !== 'number') return false;
  if (typeof state.isCompleted !== 'boolean') return false;
  if (typeof state.isPaused !== 'boolean') return false;
  if (typeof state.lastActiveTimestamp !== 'number') return false;
  if (typeof state.bonusOffered !== 'boolean') return false;
  if (typeof state.bonusCompleted !== 'boolean') return false;
  
  // Check completedSteps is an array of strings
  if (!Array.isArray(state.completedSteps)) return false;
  if (!state.completedSteps.every((item: any) => typeof item === 'string')) {
    return false;
  }

  // Validate value ranges
  if (state.currentStepIndex < 0) return false;
  if (state.lastActiveTimestamp < 0) return false;

  return true;
}

/**
 * PersistenceService class
 * Provides methods for saving, loading, and clearing guide state
 */
export class PersistenceService {
  /**
   * Save guide state to localStorage (or in-memory fallback)
   * 
   * @param state - The guide state to save
   * @throws Error if serialization fails
   */
  static saveState(state: GuideState): void {
    try {
      const serialized = JSON.stringify(state);
      
      if (isLocalStorageAvailable()) {
        localStorage.setItem(STORAGE_KEY, serialized);
      } else {
        // Fallback to in-memory storage
        memoryStorage = state;
      }
    } catch (error) {
      console.error('Failed to save guide state:', error);
      // Fallback to in-memory storage on serialization error
      memoryStorage = state;
    }
  }

  /**
   * Load guide state from localStorage (or in-memory fallback)
   * 
   * @returns The loaded guide state, or null if no valid state exists
   */
  static loadState(): GuideState | null {
    try {
      let serialized: string | null = null;

      if (isLocalStorageAvailable()) {
        serialized = localStorage.getItem(STORAGE_KEY);
      }

      // If localStorage is unavailable or empty, check memory storage
      if (serialized === null) {
        return memoryStorage;
      }

      // Deserialize and validate
      const parsed = JSON.parse(serialized);
      
      if (isValidGuideState(parsed)) {
        return parsed;
      } else {
        console.warn('Invalid guide state structure, clearing corrupted data');
        this.clearState();
        return null;
      }
    } catch (error) {
      console.error('Failed to load guide state:', error);
      // Clear corrupted data
      this.clearState();
      return null;
    }
  }

  /**
   * Clear guide state from localStorage and memory
   */
  static clearState(): void {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.removeItem(STORAGE_KEY);
      }
      memoryStorage = null;
    } catch (error) {
      console.error('Failed to clear guide state:', error);
      // Still clear memory storage even if localStorage fails
      memoryStorage = null;
    }
  }

  /**
   * Check if the user is a first-time user (no saved guide state exists)
   * 
   * @returns true if no guide state exists, false otherwise
   */
  static isFirstTimeUser(): boolean {
    const state = this.loadState();
    return state === null;
  }
}
