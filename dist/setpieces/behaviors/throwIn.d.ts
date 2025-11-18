/**
 * Throw-In Behaviors - TypeScript Migration
 *
 * Professional throw-in positioning system with:
 * - Attacking throw-in formations with short and long options
 * - Defensive throw-in marking and pressing
 * - Position-aware spacing based on field location
 * - Role-based player assignments
 *
 * @module setpieces/behaviors/throwIn
 * @migrated-from js/setpieces/behaviors/throwIn.js
 */
import type { Player, GameState, Vector2D } from '../../types';
export declare const ThrowInBehaviors: {
    getThrowInPosition(player: Player, throwPos: Vector2D, ownGoalX: number, opponentGoalX: number, gameState: GameState, teammates: Player[], opponents: Player[]): import("../utils").PositionWithMovement;
    /**
     * Defending throw-in positioning - opponents mark and cover space
     */
    getDefendingThrowInPosition(player: Player, throwPos: Vector2D, ownGoalX: number, gameState: GameState, teammates: Player[]): import("../utils").PositionWithMovement;
};
//# sourceMappingURL=throwIn.d.ts.map