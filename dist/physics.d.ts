/**
 * Physics System
 * Handles ball physics, player movement, and collision detection
 *
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 * ✅ NaN-safe calculations throughout
 */
import type { Player, GameState } from './types';
declare global {
    interface Window {
        DEBUG_PHYSICS?: boolean;
        gameState: GameState;
        updatePhysics: typeof updatePhysics;
        updatePlayerPhysics: typeof updatePlayerPhysics;
        updateBallWithHolder: typeof updateBallWithHolder;
        updateBallTrajectory: typeof updateBallTrajectory;
        validateBallState: typeof validateBallState;
        updateParticles?: (dt: number) => void;
        handleBallInterception?: (progress: number) => void;
        handleBallOutOfBounds: () => void;
        handleThrowIn: () => void;
        resolveBallControl?: (allPlayers: Player[]) => void;
        getPlayerFacingDirection?: (player: Player) => number;
        passBall?: (passingPlayer: Player, fromX: number, fromY: number, toX: number, toY: number, passQuality: number, speed: number, isShot: boolean) => void;
    }
}
/**
 * Update ball trajectory during passes and shots
 */
export declare function updateBallTrajectory(_dt: number): void;
/**
 * Validate and sanitize ball state to prevent NaN propagation
 */
export declare function validateBallState(): void;
/**
 * Validate ball holder player object
 */
export declare function validateBallHolder(player: Player | null): Player | null;
/**
 * Main physics update function called every frame
 */
export declare function updatePhysics(dt: number): void;
/**
 * Update ball position when held by a player
 */
export declare function updateBallWithHolder(allPlayers: Player[], dt: number): void;
/**
 * Update all player physics (movement, stamina, etc.)
 */
export declare function updatePlayerPhysics(allPlayers: Player[], dt: number): void;
/**
 * Assign which players should chase the loose ball
 */
export declare function assignBallChasers(allPlayers: Player[], priorityChaser?: Player | null): void;
//# sourceMappingURL=physics.d.ts.map