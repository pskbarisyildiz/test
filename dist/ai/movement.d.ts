/**
 * AI Movement System - TypeScript Migration
 *
 * Handles all player tactical positioning and movement:
 * - Positional play based on formations
 * - Defensive marking and pressing
 * - Attacking runs and support play
 * - Zone-based positioning
 * - Anti-clustering logic
 *
 * @module ai/movement
 * @migrated-from js/ai/aimovement.js
 */
import type { Player, Vector2D } from '../types';
interface PositionConfig {
    defensiveness: number;
    attackRange: number;
    ballChasePriority: number;
    idealWidth: number;
    pushUpOnAttack: number;
}
interface Zone {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
interface ThreatAssessment {
    player: Player;
    score: number;
}
interface MarkingResult {
    shouldMark: boolean;
    shouldPress: boolean;
    x: number;
    y: number;
}
interface MovementResult {
    x: number;
    y: number;
    speedBoost?: number;
    shouldLock?: boolean;
}
type TeamState = 'BALANCED' | 'ATTACKING' | 'DEFENDING' | 'COUNTER_ATTACK' | 'HIGH_PRESS';
type MarkingTightness = 'goal_side' | 'tight';
/**
 * Get position configuration for a role
 */
export declare function getPositionConfig(role: string): PositionConfig;
/**
 * Get player's active position based on half, ball position, and team state
 *
 * Accounts for:
 * - Half-time orientation flip
 * - Ball influence on positioning
 * - Tactical shifts based on team state
 */
export declare function getPlayerActivePosition(player: Player, currentHalf: number): Vector2D;
/**
 * Get zone boundaries for a player based on role and team state
 */
export declare function getZoneForPlayer(player: Player, _activePosition: Vector2D, teamState: TeamState): Zone;
/**
 * Assess defensive threats from opponents
 *
 * Scores opponents based on:
 * - Role (ST/CF/W high priority)
 * - Proximity to goal
 * - Ball possession
 * - Central position
 * - Marking coverage
 */
export declare function assessDefensiveThreats(defendingPlayer: Player, opponents: Player[], ownGoalX: number): ThreatAssessment[];
/**
 * Find most dangerous attacker to mark
 *
 * Prioritizes based on marker's role and threat zones
 */
export declare function findMostDangerousAttacker(player: Player, threats: ThreatAssessment[], playerZone: Zone): Player | null;
/**
 * Calculate optimal marking position
 *
 * @param marker - Marking player
 * @param target - Player being marked
 * @param ownGoalX - Own goal X coordinate
 * @param tightness - Marking tightness ('goal_side' or 'tight')
 */
export declare function calculateOptimalMarkingPosition(marker: Player, target: Player, ownGoalX: number, tightness?: MarkingTightness): Vector2D;
/**
 * Update player's tactical position
 *
 * Main entry point for AI movement system
 */
export declare function updateTacticalPosition(player: Player, ball: Vector2D, _teammates: Player[], opponents: Player[]): void;
/**
 * Apply marking and pressing logic
 */
export declare function applyMarkingAndPressing(player: Player, _ball: Vector2D, opponents: Player[], activePosition: Vector2D, ownGoalX: number, tactic: any, teamState: TeamState): MarkingResult;
/**
 * Apply defensive positioning logic
 */
export declare function applyDefensivePositioning(player: Player, ball: Vector2D, _tactic: any, activePosition: Vector2D, ownGoalX: number, teamState: TeamState): MovementResult;
/**
 * Apply attacking movement patterns
 */
export declare function applyAttackingMovement(player: Player, holder: Player, teammates: Player[], activePosition: Vector2D, opponentGoalX: number, _teamState: TeamState): MovementResult;
export {};
//# sourceMappingURL=movement.d.ts.map