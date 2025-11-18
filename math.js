// ============================================================================
// SAFE MATH UTILITIES - Prevents NaN Propagation
// ============================================================================
// Created: 2025-11-12
// Purpose: Provide NaN-safe mathematical operations for physics calculations
// ============================================================================

/**
 * Safe division that returns fallback value instead of NaN/Infinity
 * @param {number} numerator - The dividend
 * @param {number} denominator - The divisor
 * @param {number} fallback - Value to return if division is unsafe (default: 0)
 * @returns {number} Safe division result or fallback
 */
function safeDiv(numerator, denominator, fallback = 0) {
    if (!isFinite(numerator) || !isFinite(denominator)) return fallback;
    if (denominator === 0) return fallback;
    const result = numerator / denominator;
    return isFinite(result) ? result : fallback;
}

/**
 * Safe square root that returns fallback for negative or invalid values
 * @param {number} value - The value to get square root of
 * @param {number} fallback - Value to return if sqrt is unsafe (default: 0)
 * @returns {number} Safe sqrt result or fallback
 */
function safeSqrt(value, fallback = 0) {
    if (!isFinite(value) || value < 0) return fallback;
    return Math.sqrt(value);
}

/**
 * Clamp value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
    if (!isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
}

/**
 * Calculate distance between two points safely
 * @param {Object} p1 - First point {x, y}
 * @param {Object} p2 - Second point {x, y}
 * @returns {number} Distance or 0 if invalid
 */
function distance(p1, p2) {
    if (!p1 || !p2) return 0;
    const dx = (p2.x || 0) - (p1.x || 0);
    const dy = (p2.y || 0) - (p1.y || 0);
    return safeSqrt(dx * dx + dy * dy, 0);
}

/**
 * Normalize a 2D vector safely
 * @param {number} x - X component
 * @param {number} y - Y component
 * @returns {Object} Normalized vector {x, y} or {x:0, y:0} if zero-length
 */
function normalize(x, y) {
    const len = safeSqrt(x * x + y * y, 1); // Fallback to 1 to avoid div by 0
    return {
        x: safeDiv(x, len, 0),
        y: safeDiv(y, len, 0)
    };
}

/**
 * Linear interpolation between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
function lerp(start, end, t) {
    t = clamp(t, 0, 1);
    return start + (end - start) * t;
}

/**
 * Calculate angle between two points
 * @param {Object} from - Starting point {x, y}
 * @param {Object} to - Target point {x, y}
 * @returns {number} Angle in radians or 0 if invalid
 */
function angleTo(from, to) {
    if (!from || !to) return 0;
    const dx = (to.x || 0) - (from.x || 0);
    const dy = (to.y || 0) - (from.y || 0);
    return Math.atan2(dy, dx);
}

/**
 * Point-to-line distance calculation
 * @param {Object} point - Point {x, y}
 * @param {Object} lineStart - Line start {x, y}
 * @param {Object} lineEnd - Line end {x, y}
 * @returns {number} Distance from point to line
 */
function pointToLineDistance(point, lineStart, lineEnd) {
    if (!point || !lineStart || !lineEnd) return Infinity;

    const dx = (lineEnd.x || 0) - (lineStart.x || 0);
    const dy = (lineEnd.y || 0) - (lineStart.y || 0);
    const lenSq = dx * dx + dy * dy;

    if (lenSq === 0) return distance(point, lineStart);

    const t = clamp(
        ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lenSq,
        0,
        1
    );

    const closestPoint = {
        x: lineStart.x + t * dx,
        y: lineStart.y + t * dy
    };

    return distance(point, closestPoint);
}

/**
 * Check if value is safe for calculations
 * @param {*} value - Value to check
 * @returns {boolean} True if value is a finite number
 */
function isSafeNumber(value) {
    return typeof value === 'number' && isFinite(value);
}

/**
 * Safe vector addition
 * @param {Object} v1 - First vector {x, y}
 * @param {Object} v2 - Second vector {x, y}
 * @returns {Object} Sum vector {x, y}
 */
function addVectors(v1, v2) {
    return {
        x: (v1.x || 0) + (v2.x || 0),
        y: (v1.y || 0) + (v2.y || 0)
    };
}

/**
 * Safe vector subtraction
 * @param {Object} v1 - First vector {x, y}
 * @param {Object} v2 - Second vector {x, y}
 * @returns {Object} Difference vector {x, y}
 */
function subtractVectors(v1, v2) {
    return {
        x: (v1.x || 0) - (v2.x || 0),
        y: (v1.y || 0) - (v2.y || 0)
    };
}

/**
 * Safe vector scaling
 * @param {Object} v - Vector {x, y}
 * @param {number} scalar - Scaling factor
 * @returns {Object} Scaled vector {x, y}
 */
function scaleVector(v, scalar) {
    if (!isSafeNumber(scalar)) scalar = 1;
    return {
        x: (v.x || 0) * scalar,
        y: (v.y || 0) * scalar
    };
}

/**
 * Get vector magnitude
 * @param {Object} v - Vector {x, y}
 * @returns {number} Vector length
 */
function magnitude(v) {
    return safeSqrt((v.x || 0) * (v.x || 0) + (v.y || 0) * (v.y || 0), 0);
}

// Export all functions to window for non-module usage
if (typeof window !== 'undefined') {
    window.MathUtils = {
        safeDiv,
        safeSqrt,
        clamp,
        distance,
        normalize,
        lerp,
        angleTo,
        pointToLineDistance,
        isSafeNumber,
        addVectors,
        subtractVectors,
        scaleVector,
        magnitude
    };
    console.log('✅ Safe Math Utilities loaded');
}
