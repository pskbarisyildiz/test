/**
 * Goal Kick Behaviors - TypeScript Migration
 *
 * Professional goal kick positioning system with:
 * - Attacking goal kick formations (short build-up and long direct play)
 * - Defensive goal kick positioning (high press and mid-block)
 * - Formation-aware positioning for remaining players
 * - Penalty area rule compliance for defending team
 * - Role-based player assignments with tactical variations
 *
 * @module setpieces/behaviors/goalKick
 * @migrated-from js/setpieces/behaviors/goalKick.js
 */
import type { Player, GameState } from '../../types';
export declare const ProfessionalGoalKickBehaviors: {
    getGoalKickPosition(player: Player, ownGoalX: number, tactic: string, playShort: boolean, gameState: GameState, teammates: Player[]): import("../utils").PositionWithMovement;
    getDefendingGoalKickPosition(player: Player, opponentGoalX: number, ownGoalX: number, gameState: GameState, _opponents: Player[], teammates: Player[]): import("../utils").PositionWithMovement;
};
//# sourceMappingURL=goalKick.d.ts.map