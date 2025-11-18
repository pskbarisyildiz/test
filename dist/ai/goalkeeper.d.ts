/**
 * Goalkeeper AI System - TypeScript Migration
 *
 * Handles all goalkeeper-specific behavior:
 * - Positioning and stance management
 * - Threat assessment and reaction
 * - Sweeping and crossing
 * - Save mechanics and animations
 * - Advanced save probability calculation
 *
 * @module ai/goalkeeper
 * @migrated-from js/ai/aigoalkeeper.js
 */
import type { Player, Vector2D } from '../types';
interface GoalkeeperConfig {
    BASE_POSITION_RATIO: number;
    THREAT_ADVANCE_MAX: number;
    ANGLE_CUT_RATIO: number;
    STANCES: {
        [key: string]: GoalkeeperStance;
    };
    DANGER_ZONE_DISTANCE: number;
    IMMEDIATE_THREAT_DISTANCE: number;
    ONE_ON_ONE_DISTANCE: number;
    SWEEPER_DISTANCE: number;
    THROUGH_BALL_INTERCEPT_RANGE: number;
    GOAL_CENTER_Y: number;
    GOAL_WIDTH: number;
    REACTION_TIME: number;
    CROSS_CLAIM_RANGE: number;
    CROSS_PUNCH_RANGE: number;
}
interface GoalkeeperStance {
    name: string;
    saveBonus: number;
    mobilityPenalty: number;
    description: string;
}
interface ThreatInfo {
    player: Player;
    score: number;
    distToGoal: number;
    distToGK: number;
    hasBall: boolean;
    angleToGoal: number;
}
interface CrossAction {
    action: 'claim' | 'punch';
    targetX: number;
    targetY: number;
    successChance: number;
}
interface ShotResolution {
    holder: Player;
    xG: number;
    goalkeeper: Player;
    goalX: number;
    shotTargetY: number;
}
export declare const GOALKEEPER_CONFIG: GoalkeeperConfig;
/**
 * Assess threats to goalkeeper
 *
 * Evaluates opponents based on:
 * - Distance to goal
 * - Angle quality
 * - Ball possession
 * - Player role (attackers prioritized)
 */
export declare function assessGoalkeeperThreats(goalkeeper: Player, _ball: Vector2D, opponents: Player[]): ThreatInfo[];
/**
 * Determine goalkeeper's stance based on threat level
 */
export declare function determineGoalkeeperStance(_goalkeeper: Player, mainThreat: ThreatInfo | null, threats: ThreatInfo[], _ball: Vector2D): GoalkeeperStance;
/**
 * Calculate optimal goalkeeper position
 */
export declare function calculateOptimalGoalkeeperPosition(goalkeeper: Player, mainThreat: ThreatInfo | null, stance: GoalkeeperStance, ball: Vector2D): Vector2D;
/**
 * Determine if goalkeeper should sweep (come out for through ball)
 */
export declare function shouldGoalkeeperSweep(goalkeeper: Player, _ball: Vector2D, opponents: Player[]): boolean;
/**
 * Handle cross situations
 */
export declare function handleCrossSituation(goalkeeper: Player, _ball: Vector2D, _opponents: Player[]): CrossAction | null;
/**
 * Update goalkeeper AI (advanced system)
 *
 * Main entry point for goalkeeper behavior
 */
export declare function updateGoalkeeperAI_Advanced(goalkeeper: Player, ball: Vector2D, opponents: Player[]): void;
/**
 * Calculate advanced save probability
 *
 * Factors in:
 * - Goalkeeper ability (skill, rating, real stats)
 * - Shooter quality
 * - Positioning and stance
 * - Shot difficulty (placement)
 * - xG value
 */
export declare function calculateSaveProbability_Advanced(xG: number, goalkeeper: Player | null, shotTargetY: number, shooter?: Player): number;
/**
 * Trigger goalkeeper save animation
 */
export declare function triggerGoalkeeperSave(goalkeeper: Player, shotX: number, shotY: number, saveProbability?: number): void;
/**
 * Draw goalkeeper stance indicator (debug)
 */
export declare function drawGoalkeeperStanceIndicator(ctx: CanvasRenderingContext2D, goalkeeper: Player): void;
/**
 * Resolve shot with advanced goalkeeper system
 */
export declare function resolveShot_WithAdvancedGK(params: ShotResolution): void;
export {};
//# sourceMappingURL=goalkeeper.d.ts.map