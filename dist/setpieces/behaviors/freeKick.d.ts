/**
 * Free Kick Behaviors - TypeScript Migration
 *
 * Professional free kick positioning system with:
 * - Attacking free kick formations (direct shots and crossing routines)
 * - Defensive free kick positioning (wall formation and zonal marking)
 * - Man-marking dangerous opponents
 * - Offside-aware positioning
 * - Context-aware tactical decisions
 *
 * This is the largest behavior file with complex wall calculations,
 * marking systems, and multiple attacking routines.
 *
 * @module setpieces/behaviors/freeKick
 * @migrated-from js/setpieces/behaviors/freeKick.js
 */
import type { Player, GameState, Vector2D } from '../../types';
import { type PositionWithMovement } from '../utils';
export interface PlayerJobAssignment extends Vector2D {
    movement: string;
    role: string;
    priority: number;
    targetX?: number;
    targetY?: number;
    runTiming?: string;
    wallIndex?: number;
    targetId?: string;
}
export interface SortedLists {
    teammates: {
        bestKickers: Player[];
        bestHeaders: Player[];
        fastest: Player[];
        bestDefenders: Player[];
    };
    opponents: {
        mostDangerous: Player[];
    };
}
export declare const ProfessionalFreeKickBehaviors: {
    getAttackingFreeKickPosition(player: Player, fkPos: Vector2D, opponentGoalX: number, distToGoal: number, sortedLists: SortedLists | null, gameState: GameState, teammates: Player[]): PositionWithMovement;
    getDefendingFreeKickPosition(player: Player, fkPos: Vector2D, ownGoalX: number, distToGoal: number, sortedLists: SortedLists | null, opponents: Player[], gameState: GameState, teammates: Player[]): PositionWithMovement;
    calculateWallPosition(positionData: PlayerJobAssignment, wallSize: number, fkPos: Vector2D, ownGoalX: number, direction: number, player: Player, gameState: GameState): PositionWithMovement;
    calculateMarkingPosition(positionData: PlayerJobAssignment, direction: number, opponentMap: Map<string, Player> | undefined, player: Player, gameState: GameState, ownGoalX: number): PositionWithMovement;
};
//# sourceMappingURL=freeKick.d.ts.map