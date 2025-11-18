/**
 * Kickoff Behaviors - TypeScript Migration
 *
 * Professional kickoff positioning system
 * This function's ONLY job is to tell players to HOLD the position
 * that `setupKickOff` (in main.js) already put them in to prevent stuttering.
 *
 * @module setpieces/behaviors/kickoff
 * @migrated-from js/setpieces/behaviors/kickoff.js
 */
import type { Player, GameState, Vector2D } from '../../types';
export interface DesignatedKickers {
    primary: Player | null;
    secondary: Player | null;
}
export declare const KickoffBehaviors: {
    /**
     * Get position for kickoff based on player role and team
     */
    getKickoffPosition(player: Player, _kickoffPos: Vector2D, isKickingTeam: boolean, gameState: GameState): import("../utils").PositionWithMovement;
    /**
     * Check if a player's position is valid for kickoff
     * (This function is still useful for validation by other systems)
     */
    isValidKickoffPosition(player: Player, position: Vector2D, isKickingTeam: boolean, gameState: GameState): boolean;
    /**
     * Get the two designated kickers for kickoff
     * (This function is still useful for validation by other systems)
     */
    getDesignatedKickers(gameState: GameState): DesignatedKickers;
};
//# sourceMappingURL=kickoff.d.ts.map