/**
 * Pitch Drawing System
 * Handles rendering of the football pitch background, lines, and markings
 *
 * @migrated-from js/rendering/drawPitch.js
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 */
import type { GameState } from '../types';
declare global {
    interface Window {
        gameState: GameState;
        drawPitchBackground?: typeof drawPitchBackground;
        drawGrass?: typeof drawGrass;
        drawStripes?: typeof drawStripes;
        drawLines?: typeof drawLines;
        drawCenterCircle?: typeof drawCenterCircle;
        drawGoals?: typeof drawGoals;
        drawPenaltyAreas?: typeof drawPenaltyAreas;
    }
}
/**
 * Draw the pitch background with caching
 */
export declare function drawPitchBackground(): void;
/**
 * Draw grass background
 */
export declare function drawGrass(ctx: CanvasRenderingContext2D, w: number, h: number): void;
/**
 * Draw grass stripes (mowing pattern)
 */
export declare function drawStripes(ctx: CanvasRenderingContext2D, w: number, h: number): void;
/**
 * Draw pitch lines
 */
export declare function drawLines(ctx: CanvasRenderingContext2D, w: number, h: number): void;
/**
 * Draw center circle
 */
export declare function drawCenterCircle(ctx: CanvasRenderingContext2D, w: number, h: number): void;
/**
 * Draw goals
 */
export declare function drawGoals(ctx: CanvasRenderingContext2D, w: number, h: number): void;
/**
 * Draw penalty areas and arcs
 */
export declare function drawPenaltyAreas(ctx: CanvasRenderingContext2D, w: number, h: number): void;
//# sourceMappingURL=drawPitch.d.ts.map