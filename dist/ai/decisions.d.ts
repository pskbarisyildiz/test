/**
 * AI Decision System - TypeScript Migration
 *
 * Handles all player decision-making:
 * - Pass/shoot/dribble decisions
 * - Pass quality and success calculation
 * - Through ball detection
 * - Vision-based decision making
 * - First-touch decision system
 *
 * @module ai/decisions
 * @migrated-from js/ai/aidecisions.js
 */
import type { Player, Vector2D } from '../types';
interface ThroughBallOpportunity {
    target: Player;
    targetPos: Vector2D;
    isThroughBall: true;
}
/**
 * Calculate average dribbling skill for a team
 */
export declare function calculateAvgDribbling(teamPlayers: Player[]): number;
/**
 * Execute a pass or shot
 *
 * @param passingPlayer - Player making the pass
 * @param fromX - Start X coordinate
 * @param fromY - Start Y coordinate
 * @param toX - Target X coordinate
 * @param toY - Target Y coordinate
 * @param passQuality - Quality of pass (0-1)
 * @param speed - Pass speed
 * @param isShot - Whether this is a shot
 */
export declare function passBall(passingPlayer: Player | null, fromX: number, fromY: number, toX: number, toY: number, passQuality?: number, speed?: number, isShot?: boolean): void;
/**
 * Calculate dribble success probability
 *
 * Factors:
 * - Base dribbling skill (exponential)
 * - Physical attributes (pace, physicality)
 * - Composure under pressure
 * - Real stats (dribbles succeeded, dispossessed, duels won)
 * - Pressure penalty (mitigated by composure)
 *
 * @param player - Dribbling player
 * @param opponents - Nearby opponents
 * @returns Success probability (0-1)
 */
export declare function calculateDribbleSuccess(player: Player, opponents: Player[]): number;
/**
 * Calculate pass success probability
 *
 * Blends player abilities (passing, vision, composure) with real statistics
 * (pass accuracy, long ball accuracy) for more accurate pass success prediction.
 *
 * @param passer - Passing player
 * @param receiver - Receiving player
 * @param distance - Pass distance
 * @param isUnderPressure - Whether passer is under pressure
 * @returns Success probability (0-1)
 */
export declare function calculatePassSuccess(passer: Player, _receiver: Player, distance: number, isUnderPressure: boolean): number;
/**
 * Check for through ball opportunities
 *
 * Looks for teammates ahead with space behind defense
 *
 * @param passer - Player with ball
 * @param teammates - Teammate players
 * @param opponents - Opponent players
 * @param opponentGoalX - Opponent goal X coordinate
 * @returns Through ball opportunity or null
 */
export declare function checkForThroughBall(passer: Player, teammates: Player[], opponents: Player[], opponentGoalX: number): ThroughBallOpportunity | null;
/**
 * Initiate a pass to a target player
 */
export declare function initiatePass(player: Player, target: Player | null): void;
/**
 * Initiate a through ball
 */
export declare function initiateThroughBall(player: Player, throughBall: ThroughBallOpportunity): void;
/**
 * Initiate a dribble move
 */
export declare function initiateDribble(player: Player, goalX: number): void;
/**
 * Handle player with ball using first touch decision system
 *
 * Simpler decision tree focused on quick reactions
 */
export declare function handlePlayerWithBall_WithFirstTouch(player: Player, opponents: Player[], teammates: Player[]): void;
/**
 * Handle player with ball using vision-based decision system
 *
 * More sophisticated system that evaluates action values
 */
export declare function handlePlayerWithBall_WithVision(player: Player, opponents: Player[], teammates: Player[]): void;
export {};
//# sourceMappingURL=decisions.d.ts.map