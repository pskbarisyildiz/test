/**
 * Centralized Config Access - Single Source of Truth
 *
 * Purpose: Provide safe, centralized access to all game configuration
 * Supports fallback values, type validation, and caching
 */
import { GAME_CONFIG, PHYSICS, BALL_PHYSICS, GAME_LOOP } from '../config';
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/** Cache for frequently accessed config values */
const configCache = new Map();
export function CFG(key, defaultValue) {
    // If no key provided, return entire GAME_CONFIG
    if (!key) {
        if (typeof window !== 'undefined' && typeof GAME_CONFIG !== 'undefined') {
            return GAME_CONFIG;
        }
        console.warn('GAME_CONFIG not loaded yet');
        return {};
    }
    // Search order: GAME_CONFIG → PHYSICS → BALL_PHYSICS → GAME_LOOP
    const configSources = [
        typeof window !== 'undefined' && GAME_CONFIG ? GAME_CONFIG : undefined,
        typeof window !== 'undefined' && PHYSICS ? PHYSICS : undefined,
        typeof window !== 'undefined' && BALL_PHYSICS ? BALL_PHYSICS : undefined,
        typeof window !== 'undefined' && GAME_LOOP ? GAME_LOOP : undefined
    ];
    for (const source of configSources) {
        if (source && key in source && source[key] !== undefined) {
            return source[key];
        }
    }
    // Not found in any source
    if (defaultValue === undefined) {
        console.warn(`Config key "${key}" not found and no default provided`);
    }
    return defaultValue;
}
// ============================================================================
// BATCH CONFIG ACCESSOR
// ============================================================================
/**
 * Get multiple config values at once
 * @param keys - Array of config keys
 * @returns Object with requested key-value pairs
 */
export function CFG_BATCH(keys) {
    const result = {};
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
export function CFG_TYPED(key, expectedType, defaultValue) {
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
export function CFG_NUMBER(key, defaultValue, min = -Infinity, max = Infinity) {
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
export function CFG_PATH(path, defaultValue) {
    const keys = path.split('.');
    let current;
    // Try GAME_CONFIG first
    if (typeof window !== 'undefined' && typeof GAME_CONFIG !== 'undefined') {
        current = GAME_CONFIG;
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            }
            else {
                current = undefined;
                break;
            }
        }
        if (current !== undefined)
            return current;
    }
    // Try window object
    if (typeof window !== 'undefined') {
        current = window;
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            }
            else {
                current = undefined;
                break;
            }
        }
        if (current !== undefined)
            return current;
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
export function CFG_CACHED(key, defaultValue) {
    if (configCache.has(key)) {
        return configCache.get(key);
    }
    const value = CFG(key, defaultValue);
    configCache.set(key, value);
    return value;
}
/**
 * Clear config cache (use when configs change dynamically)
 */
export function CLEAR_CFG_CACHE() {
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
export function VALIDATE_CONFIG(requiredKeys) {
    const missing = [];
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
//# sourceMappingURL=configUtils.js.map