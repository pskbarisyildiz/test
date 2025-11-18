/**
 * Safe Math Utilities - Prevents NaN Propagation
 *
 * Purpose: Provide NaN-safe mathematical operations for physics calculations
 * All functions handle edge cases and prevent NaN/Infinity propagation
 */
// ============================================================================
// BASIC MATH OPERATIONS
// ============================================================================
/**
 * Safe division that returns fallback value instead of NaN/Infinity
 */
export function safeDiv(numerator, denominator, fallback = 0) {
    if (!isFinite(numerator) || !isFinite(denominator))
        return fallback;
    if (denominator === 0)
        return fallback;
    const result = numerator / denominator;
    return isFinite(result) ? result : fallback;
}
/**
 * Safe square root that returns fallback for negative or invalid values
 */
export function safeSqrt(value, fallback = 0) {
    if (!isFinite(value) || value < 0)
        return fallback;
    return Math.sqrt(value);
}
/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
    if (!isFinite(value))
        return min;
    return Math.max(min, Math.min(max, value));
}
// ============================================================================
// GEOMETRY OPERATIONS
// ============================================================================
/**
 * Calculate distance between two points safely
 */
export function distance(p1, p2) {
    if (!p1 || !p2)
        return 0;
    const dx = (p2.x ?? 0) - (p1.x ?? 0);
    const dy = (p2.y ?? 0) - (p1.y ?? 0);
    return safeSqrt(dx * dx + dy * dy, 0);
}
/**
 * Normalize a 2D vector safely
 */
export function normalize(x, y) {
    const len = safeSqrt(x * x + y * y, 1); // Fallback to 1 to avoid div by 0
    return {
        x: safeDiv(x, len, 0),
        y: safeDiv(y, len, 0)
    };
}
/**
 * Linear interpolation between two values
 */
export function lerp(start, end, t) {
    const clampedT = clamp(t, 0, 1);
    return start + (end - start) * clampedT;
}
/**
 * Calculate angle between two points in radians
 */
export function angleTo(from, to) {
    if (!from || !to)
        return 0;
    const dx = (to.x ?? 0) - (from.x ?? 0);
    const dy = (to.y ?? 0) - (from.y ?? 0);
    return Math.atan2(dy, dx);
}
/**
 * Point-to-line distance calculation
 */
export function pointToLineDistance(point, lineStart, lineEnd) {
    if (!point || !lineStart || !lineEnd)
        return Infinity;
    const dx = (lineEnd.x ?? 0) - (lineStart.x ?? 0);
    const dy = (lineEnd.y ?? 0) - (lineStart.y ?? 0);
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0)
        return distance(point, lineStart);
    const t = clamp(((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lenSq, 0, 1);
    const closestPoint = {
        x: lineStart.x + t * dx,
        y: lineStart.y + t * dy
    };
    return distance(point, closestPoint);
}
// ============================================================================
// VALIDATION
// ============================================================================
/**
 * Check if value is safe for calculations
 */
export function isSafeNumber(value) {
    return typeof value === 'number' && isFinite(value);
}
// ============================================================================
// VECTOR OPERATIONS
// ============================================================================
/**
 * Safe vector addition
 */
export function addVectors(v1, v2) {
    return {
        x: (v1.x ?? 0) + (v2.x ?? 0),
        y: (v1.y ?? 0) + (v2.y ?? 0)
    };
}
/**
 * Safe vector subtraction
 */
export function subtractVectors(v1, v2) {
    return {
        x: (v1.x ?? 0) - (v2.x ?? 0),
        y: (v1.y ?? 0) - (v2.y ?? 0)
    };
}
/**
 * Safe vector scaling
 */
export function scaleVector(v, scalar) {
    const safeScalar = isSafeNumber(scalar) ? scalar : 1;
    return {
        x: (v.x ?? 0) * safeScalar,
        y: (v.y ?? 0) * safeScalar
    };
}
/**
 * Get vector magnitude (length)
 */
export function magnitude(v) {
    return safeSqrt((v.x ?? 0) * (v.x ?? 0) + (v.y ?? 0) * (v.y ?? 0), 0);
}
// Export to window for backward compatibility
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
    console.log('✅ Safe Math Utilities loaded (TypeScript)');
}
//# sourceMappingURL=math.js.map