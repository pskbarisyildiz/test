/**
 * Configuration Type Definitions
 * Type-safe configuration objects for game constants
 */
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/** Get safe config value with fallback */
export function getConfigValue(obj, key, defaultValue) {
    if (!obj || !(key in obj)) {
        return defaultValue;
    }
    const value = obj[key];
    return value !== undefined ? value : defaultValue;
}
//# sourceMappingURL=config.js.map