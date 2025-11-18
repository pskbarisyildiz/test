/**
 * Safe Math Utilities - Prevents NaN Propagation
 *
 * Purpose: Provide NaN-safe mathematical operations for physics calculations
 * All functions handle edge cases and prevent NaN/Infinity propagation
 */
import type { Vector2D, MutableVector2D } from '../types';
/**
 * Safe division that returns fallback value instead of NaN/Infinity
 */
export declare function safeDiv(numerator: number, denominator: number, fallback?: number): number;
/**
 * Safe square root that returns fallback for negative or invalid values
 */
export declare function safeSqrt(value: number, fallback?: number): number;
/**
 * Clamp value between min and max
 */
export declare function clamp(value: number, min: number, max: number): number;
/**
 * Calculate distance between two points safely
 */
export declare function distance(p1: Vector2D | null | undefined, p2: Vector2D | null | undefined): number;
/**
 * Normalize a 2D vector safely
 */
export declare function normalize(x: number, y: number): MutableVector2D;
/**
 * Linear interpolation between two values
 */
export declare function lerp(start: number, end: number, t: number): number;
/**
 * Calculate angle between two points in radians
 */
export declare function angleTo(from: Vector2D | null | undefined, to: Vector2D | null | undefined): number;
/**
 * Point-to-line distance calculation
 */
export declare function pointToLineDistance(point: Vector2D | null | undefined, lineStart: Vector2D | null | undefined, lineEnd: Vector2D | null | undefined): number;
/**
 * Check if value is safe for calculations
 */
export declare function isSafeNumber(value: unknown): value is number;
/**
 * Safe vector addition
 */
export declare function addVectors(v1: Vector2D, v2: Vector2D): MutableVector2D;
/**
 * Safe vector subtraction
 */
export declare function subtractVectors(v1: Vector2D, v2: Vector2D): MutableVector2D;
/**
 * Safe vector scaling
 */
export declare function scaleVector(v: Vector2D, scalar: number): MutableVector2D;
/**
 * Get vector magnitude (length)
 */
export declare function magnitude(v: Vector2D): number;
declare global {
    interface Window {
        MathUtils: {
            safeDiv: typeof safeDiv;
            safeSqrt: typeof safeSqrt;
            clamp: typeof clamp;
            distance: typeof distance;
            normalize: typeof normalize;
            lerp: typeof lerp;
            angleTo: typeof angleTo;
            pointToLineDistance: typeof pointToLineDistance;
            isSafeNumber: typeof isSafeNumber;
            addVectors: typeof addVectors;
            subtractVectors: typeof subtractVectors;
            scaleVector: typeof scaleVector;
            magnitude: typeof magnitude;
        };
    }
}
//# sourceMappingURL=math.d.ts.map