/**
 * Particle System
 * Handles visual effects particles for goals, passes, saves, and ball trails
 *
 * @migrated-from js/rendering/particles.js
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 */
import type { GameState, Particle as ParticleInterface } from '../types';
declare global {
    interface Window {
        gameState: GameState;
        Particle?: typeof Particle;
        createGoalExplosion?: typeof createGoalExplosion;
        createBallTrail?: typeof createBallTrail;
        createPassEffect?: typeof createPassEffect;
        createSaveEffect?: typeof createSaveEffect;
    }
}
/**
 * Particle class for visual effects
 */
export declare class Particle implements ParticleInterface {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
    decay: number;
    size: number;
    radius: number;
    alpha: number;
    type: string;
    rotation: number;
    gravity: number;
    createdAt: number;
    constructor(x: number, y: number, color: string, velocityX?: number, velocityY?: number);
    update(dt: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
/**
 * Create goal explosion effect
 */
export declare function createGoalExplosion(x: number, y: number, color: string): void;
/**
 * Create ball trail effect
 */
export declare function createBallTrail(x: number, y: number): void;
/**
 * Create pass effect
 */
export declare function createPassEffect(x: number, y: number, color: string): void;
/**
 * Create save effect
 */
export declare function createSaveEffect(x: number, y: number): void;
//# sourceMappingURL=particles.d.ts.map