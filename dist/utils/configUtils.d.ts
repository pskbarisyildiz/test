/**
 * Centralized Config Access - Single Source of Truth
 *
 * Purpose: Provide safe, centralized access to all game configuration
 * Supports fallback values, type validation, and caching
 */
import type { GameConfig } from '../types';
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
/**
 * Centralized config accessor with fallback support
 * @param key - Config key to retrieve (e.g., 'PITCH_WIDTH', 'MAX_SPEED')
 * @param defaultValue - Fallback value if key not found
 * @returns Config value or default
 */
export declare function CFG(): GameConfig | Record<string, never>;
export declare function CFG<T>(key: string, defaultValue?: T): T;
/**
 * Get multiple config values at once
 * @param keys - Array of config keys
 * @returns Object with requested key-value pairs
 */
export declare function CFG_BATCH(keys: readonly string[]): Record<string, unknown>;
/**
 * Get config with type validation
 * @param key - Config key
 * @param expectedType - Expected JavaScript type
 * @param defaultValue - Fallback value
 * @returns Config value or default
 */
export declare function CFG_TYPED<T>(key: string, expectedType: 'number' | 'string' | 'object' | 'boolean' | 'function', defaultValue: T): T;
/**
 * Safe config getter for numeric values with bounds checking
 * @param key - Config key
 * @param defaultValue - Default numeric value
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Bounded config value
 */
export declare function CFG_NUMBER(key: string, defaultValue: number, min?: number, max?: number): number;
/**
 * Get nested config value using dot notation
 * @param path - Dot-separated path (e.g., 'TACTICS.balanced.pressIntensity')
 * @param defaultValue - Fallback value
 * @returns Nested config value or default
 */
export declare function CFG_PATH<T>(path: string, defaultValue?: T): T | undefined;
/**
 * Get config with caching for performance
 * @param key - Config key
 * @param defaultValue - Fallback value
 * @returns Cached config value
 */
export declare function CFG_CACHED<T>(key: string, defaultValue?: T): T;
/**
 * Clear config cache (use when configs change dynamically)
 */
export declare function CLEAR_CFG_CACHE(): void;
/**
 * Validate that required configs exist
 * @param requiredKeys - Array of required config keys
 * @throws Error if any required key is missing
 */
export declare function VALIDATE_CONFIG(requiredKeys: readonly string[]): void;
//# sourceMappingURL=configUtils.d.ts.map