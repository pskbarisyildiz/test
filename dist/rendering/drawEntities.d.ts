/**
 * Entity Drawing System
 * Handles rendering of players, ball, and related visual effects
 *
 * @migrated-from js/rendering/drawEntities.js
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 */
import type { GameState, Player } from '../types';
declare global {
    interface Window {
        gameState: GameState;
        lightenColor?: typeof lightenColor;
        darkenColor?: typeof darkenColor;
        drawPlayer?: typeof drawPlayer;
        drawPlayerShadow?: typeof drawPlayerShadow;
        drawPlayerBody?: typeof drawPlayerBody;
        drawPlayerHighlight?: typeof drawPlayerHighlight;
        drawPlayerLabel?: typeof drawPlayerLabel;
        drawBall?: typeof drawBall;
        drawShotEffect?: typeof drawShotEffect;
        drawBallBody?: typeof drawBallBody;
        drawBallPattern?: typeof drawBallPattern;
    }
}
/**
 * Lighten a hex color by a percentage
 */
export declare function lightenColor(color: string, percent: number): string;
/**
 * Darken a hex color by a percentage
 */
export declare function darkenColor(color: string, percent: number): string;
/**
 * Draw a player on the canvas
 */
export declare function drawPlayer(ctx: CanvasRenderingContext2D, player: Player, hasBall: boolean): void;
/**
 * Draw player shadow (unused but kept for compatibility)
 */
export declare function drawPlayerShadow(_ctx: CanvasRenderingContext2D, _player: Player, _size: number): void;
/**
 * Draw player body (unused but kept for compatibility)
 */
export declare function drawPlayerBody(ctx: CanvasRenderingContext2D, player: Player, size: number): void;
/**
 * Draw player highlight (unused but kept for compatibility)
 */
export declare function drawPlayerHighlight(ctx: CanvasRenderingContext2D, player: Player, size: number, hasBall: boolean): void;
/**
 * Draw player name label
 */
export declare function drawPlayerLabel(ctx: CanvasRenderingContext2D, player: Player): void;
/**
 * Draw ground shadow for the ball
 * @migrated-from js/config.js (drawGroundShadow function)
 */
export declare function drawGroundShadow(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, ballHeight: number): void;
/**
 * Draw the ball
 */
export declare function drawBall(ctx: CanvasRenderingContext2D, x: number, y: number): void;
/**
 * Draw shot effect around the ball
 */
export declare function drawShotEffect(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void;
/**
 * Draw ball body with 3D shading
 */
export declare function drawBallBody(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void;
/**
 * Draw ball pattern (pentagon)
 */
export declare function drawBallPattern(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void;
//# sourceMappingURL=drawEntities.d.ts.map