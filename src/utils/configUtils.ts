/**
 * Centralized Config Access - Single Source of Truth
 *
 * Purpose: Provide safe, centralized access to all game configuration
 * Supports fallback values, type validation, and caching
 */

import type {
  GameConfig
} from '../types';
import { GAME_CONFIG, PHYSICS, BALL_PHYSICS, GAME_LOOP } from '../config';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Cache for frequently accessed config values */
const configCache = new Map<string, unknown>();

// ============================================================================
// GLOBAL DECLARATIONS
// ============================================================================

declare global {
  interface Window {
    CFG: typeof CFG;
    CFG_BATCH: typeof CFG_BATCH;
    CFG_TYPED: typeof CFG_TYPED;
    CFG_NUMBER: typeof CFG_NUMBER;
    CFG_PATH: typeof CFG_PATH;
    CFG_CACHED: typeof CFG_CACHED;
    VALIDATE_CONFIG: typeof VALIDATE_CONFIG;
    CLEAR_CFG_CACHE: typeof CLEAR_CFG_CACHE;
  }
}

// ============================================================================
// PRIMARY CONFIG ACCESSOR
// ============================================================================

/**
 * Centralized config accessor with fallback support
 * @param key - Config key to retrieve (e.g., 'PITCH_WIDTH', 'MAX_SPEED')
 * @param defaultValue - Fallback value if key not found
 * @returns Config value or default
 */
export function CFG(): GameConfig | Record<string, never>;
export function CFG<T>(key: string, defaultValue?: T): T;
export function CFG<T>(key?: string, defaultValue?: T): T | GameConfig | Record<string, never> {
  // If no key provided, return entire GAME_CONFIG
  if (!key) {
    if (typeof window !== 'undefined' && typeof GAME_CONFIG !== 'undefined') {
      return GAME_CONFIG;
    }
    console.warn('GAME_CONFIG not loaded yet');
    return {};
  }

  // Search order: GAME_CONFIG → PHYSICS → BALL_PHYSICS → GAME_LOOP
  const configSources: (Record<string, unknown> | undefined)[] = [
    typeof window !== 'undefined' && GAME_CONFIG ? (GAME_CONFIG as unknown as Record<string, unknown>) : undefined,
    typeof window !== 'undefined' && PHYSICS ? (PHYSICS as unknown as Record<string, unknown>) : undefined,
    typeof window !== 'undefined' && BALL_PHYSICS ? (BALL_PHYSICS as unknown as Record<string, unknown>) : undefined,
    typeof window !== 'undefined' && GAME_LOOP ? (GAME_LOOP as unknown as Record<string, unknown>) : undefined
  ];

  for (const source of configSources) {
    if (source && key in source && source[key] !== undefined) {
      return source[key] as T;
    }
  }

  // Not found in any source
  if (defaultValue === undefined) {
    console.warn(`Config key "${key}" not found and no default provided`);
  }

  return defaultValue as T;
}

// ============================================================================
// BATCH CONFIG ACCESSOR
// ============================================================================

/**
 * Get multiple config values at once
 * @param keys - Array of config keys
 * @returns Object with requested key-value pairs
 */
export function CFG_BATCH(keys: readonly string[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  keys.forEach(key => {
    result[key] = CFG(key);
  });
  return result;
}

// ============================================================================
// TYPED CONFIG ACCESSORS
// ============================================================================

/**
 * Get config with type validation
 * @param key - Config key
 * @param expectedType - Expected JavaScript type
 * @param defaultValue - Fallback value
 * @returns Config value or default
 */
export function CFG_TYPED<T>(
  key: string,
  expectedType: 'number' | 'string' | 'object' | 'boolean' | 'function',
  defaultValue: T
): T {
  const value = CFG(key, defaultValue);

  if (typeof value !== expectedType) {
    console.warn(`Config key "${key}" expected type ${expectedType}, got ${typeof value}`);
    return defaultValue;
  }

  return value;
}

/**
 * Safe config getter for numeric values with bounds checking
 * @param key - Config key
 * @param defaultValue - Default numeric value
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Bounded config value
 */
export function CFG_NUMBER(
  key: string,
  defaultValue: number,
  min: number = -Infinity,
  max: number = Infinity
): number {
  const value = CFG(key, defaultValue);

  if (typeof value !== 'number' || !isFinite(value)) {
    console.warn(`Config key "${key}" is not a valid number, using default ${defaultValue}`);
    return defaultValue;
  }

  if (value < min || value > max) {
    console.warn(`Config key "${key}" value ${value} out of bounds [${min}, ${max}], clamping`);
    return Math.max(min, Math.min(max, value));
  }

  return value;
}

// ============================================================================
// PATH-BASED CONFIG ACCESSOR
// ============================================================================

/**
 * Get nested config value using dot notation
 * @param path - Dot-separated path (e.g., 'TACTICS.balanced.pressIntensity')
 * @param defaultValue - Fallback value
 * @returns Nested config value or default
 */
export function CFG_PATH<T>(path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.');
  let current: unknown;

  // Try GAME_CONFIG first
  if (typeof window !== 'undefined' && typeof GAME_CONFIG !== 'undefined') {
    current = GAME_CONFIG;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        current = undefined;
        break;
      }
    }
    if (current !== undefined) return current as T;
  }

  // Try window object
  if (typeof window !== 'undefined') {
    current = window;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        current = undefined;
        break;
      }
    }
    if (current !== undefined) return current as T;
  }

  return defaultValue;
}

// ============================================================================
// CACHED CONFIG ACCESSOR
// ============================================================================

/**
 * Get config with caching for performance
 * @param key - Config key
 * @param defaultValue - Fallback value
 * @returns Cached config value
 */
export function CFG_CACHED<T>(key: string, defaultValue?: T): T {
  if (configCache.has(key)) {
    return configCache.get(key) as T;
  }

  const value = CFG(key, defaultValue);
  configCache.set(key, value);
  return value;
}

/**
 * Clear config cache (use when configs change dynamically)
 */
export function CLEAR_CFG_CACHE(): void {
  configCache.clear();
  console.log('✅ Config cache cleared');
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate that required configs exist
 * @param requiredKeys - Array of required config keys
 * @throws Error if any required key is missing
 */
export function VALIDATE_CONFIG(requiredKeys: readonly string[]): void {
  const missing: string[] = [];

  requiredKeys.forEach(key => {
    if (CFG(key) === undefined) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(`❌ Missing required config keys: ${missing.join(', ')}`);
  }

  console.log(`✅ Config validation passed (${requiredKeys.length} keys)`);
}

// ============================================================================
// GLOBAL EXPORT FOR BROWSER COMPATIBILITY
// ============================================================================

// Export to window for backward compatibility
if (typeof window !== 'undefined') {
  window.CFG = CFG;
  window.CFG_BATCH = CFG_BATCH;
  window.CFG_TYPED = CFG_TYPED;
  window.CFG_NUMBER = CFG_NUMBER;
  window.CFG_PATH = CFG_PATH;
  window.CFG_CACHED = CFG_CACHED;
  window.VALIDATE_CONFIG = VALIDATE_CONFIG;
  window.CLEAR_CFG_CACHE = CLEAR_CFG_CACHE;

  console.log('✅ Centralized Config Utilities loaded (TypeScript)');
}
