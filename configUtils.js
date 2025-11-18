// ============================================================================
// CENTRALIZED CONFIG ACCESS - Single Source of Truth
// ============================================================================
// Created: 2025-11-12
// Purpose: Provide safe, centralized access to all game configuration
// ============================================================================

/**
 * Centralized config accessor with fallback support
 * @param {string} key - Config key to retrieve (e.g., 'PITCH_WIDTH', 'MAX_SPEED')
 * @param {*} defaultValue - Fallback value if key not found
 * @returns {*} Config value or default
 */
function CFG(key, defaultValue) {
    // If no key provided, return entire GAME_CONFIG
    if (!key) {
        if (typeof GAME_CONFIG !== 'undefined') return GAME_CONFIG;
        console.warn('GAME_CONFIG not loaded yet');
        return {};
    }

    // Search order: GAME_CONFIG → PHYSICS → BALL_PHYSICS → GAME_LOOP
    const configSources = [
        typeof GAME_CONFIG !== 'undefined' ? GAME_CONFIG : null,
        typeof PHYSICS !== 'undefined' ? PHYSICS : null,
        typeof BALL_PHYSICS !== 'undefined' ? BALL_PHYSICS : null,
        typeof GAME_LOOP !== 'undefined' ? GAME_LOOP : null,
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

/**
 * Get multiple config values at once
 * @param {string[]} keys - Array of config keys
 * @returns {Object} Object with requested key-value pairs
 */
function CFG_BATCH(keys) {
    const result = {};
    keys.forEach(key => {
        result[key] = CFG(key);
    });
    return result;
}

/**
 * Validate that required configs exist
 * @param {string[]} requiredKeys - Array of required config keys
 * @throws {Error} If any required key is missing
 */
function VALIDATE_CONFIG(requiredKeys) {
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

/**
 * Get config with type validation
 * @param {string} key - Config key
 * @param {string} expectedType - Expected type ('number', 'string', 'object', etc.)
 * @param {*} defaultValue - Fallback value
 * @returns {*} Config value or default
 */
function CFG_TYPED(key, expectedType, defaultValue) {
    const value = CFG(key, defaultValue);

    if (typeof value !== expectedType) {
        console.warn(`Config key "${key}" expected type ${expectedType}, got ${typeof value}`);
        return defaultValue;
    }

    return value;
}

/**
 * Safe config getter for numeric values with bounds checking
 * @param {string} key - Config key
 * @param {number} defaultValue - Default numeric value
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} Bounded config value
 */
function CFG_NUMBER(key, defaultValue, min = -Infinity, max = Infinity) {
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

/**
 * Get nested config value using dot notation
 * @param {string} path - Dot-separated path (e.g., 'TACTICS.balanced.pressIntensity')
 * @param {*} defaultValue - Fallback value
 * @returns {*} Nested config value or default
 */
function CFG_PATH(path, defaultValue) {
    const keys = path.split('.');
    let current;

    // Try GAME_CONFIG first
    if (typeof GAME_CONFIG !== 'undefined') {
        current = GAME_CONFIG;
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                current = undefined;
                break;
            }
        }
        if (current !== undefined) return current;
    }

    // Try window object
    if (typeof window !== 'undefined') {
        current = window;
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                current = undefined;
                break;
            }
        }
        if (current !== undefined) return current;
    }

    return defaultValue;
}

/**
 * Cache frequently accessed config values
 */
const configCache = {};

/**
 * Get config with caching for performance
 * @param {string} key - Config key
 * @param {*} defaultValue - Fallback value
 * @returns {*} Cached config value
 */
function CFG_CACHED(key, defaultValue) {
    if (key in configCache) {
        return configCache[key];
    }

    const value = CFG(key, defaultValue);
    configCache[key] = value;
    return value;
}

/**
 * Clear config cache (use when configs change dynamically)
 */
function CLEAR_CFG_CACHE() {
    Object.keys(configCache).forEach(key => delete configCache[key]);
    console.log('✅ Config cache cleared');
}

// Export to window for non-module usage
if (typeof window !== 'undefined') {
    window.CFG = CFG;
    window.CFG_BATCH = CFG_BATCH;
    window.CFG_TYPED = CFG_TYPED;
    window.CFG_NUMBER = CFG_NUMBER;
    window.CFG_PATH = CFG_PATH;
    window.CFG_CACHED = CFG_CACHED;
    window.VALIDATE_CONFIG = VALIDATE_CONFIG;
    window.CLEAR_CFG_CACHE = CLEAR_CFG_CACHE;

    console.log('✅ Centralized Config Utilities loaded');
}
