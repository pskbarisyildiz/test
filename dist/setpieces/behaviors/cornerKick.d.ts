/**
 * Corner Kick Behaviors - TypeScript Migration
 *
 * Professional corner kick positioning system with:
 * - Attacking corner formations with near/far post runs and set routines
 * - Defensive corner marking (man-to-man and zonal)
 * - Position-aware spacing and tactical assignments
 * - Role-based player assignments with run timing
 * - Offside-aware positioning
 *
 * @module setpieces/behaviors/cornerKick
 * @migrated-from js/setpieces/behaviors/cornerKick.js
 */
import type { Player, GameState, Vector2D } from '../../types';
export declare const ProfessionalCornerBehaviors: {
    getAttackingCornerPosition(player: Player, cornerPos: Vector2D, opponentGoalX: number, teammates: Player[], sortedLists: {
        teammates?: {
            bestHeaders?: Player[];
            fastest?: Player[];
            bestKickers?: Player[];
        };
        opponents?: {
            mostDangerous?: Player[];
            bestDefenders?: Player[];
        };
    } | null, _routine: unknown, gameState: GameState): import("../utils").PositionWithMovement;
    getDefendingCornerPosition(player: Player, cornerPos: Vector2D, ownGoalX: number, opponents: Player[], sortedLists: {
        teammates?: {
            bestHeaders?: Player[];
            fastest?: Player[];
            bestKickers?: Player[];
        };
        opponents?: {
            mostDangerous?: Player[];
            bestDefenders?: Player[];
        };
    } | null, system: string, gameState: GameState, teammates: Player[]): import("../utils").PositionWithMovement;
};
//# sourceMappingURL=cornerKick.d.ts.map