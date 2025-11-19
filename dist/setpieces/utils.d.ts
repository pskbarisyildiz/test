/**
 * Set Piece Utility Functions - TypeScript Migration
 *
 * Core utilities for set piece positioning and validation:
 * - TacticalContext: Game state analysis and urgency calculation
 * - PositionManager: Intelligent player spacing and collision avoidance
 * - Utility functions: Position sanitization, player validation, offside checks
 *
 * @module setpieces/utils
 * @migrated-from js/setpieces/setPieceUtils.js
 */
import type { Player, GameState, Vector2D } from '../types';
type Urgency = 'DESPERATE' | 'HIGH' | 'MODERATE' | 'BALANCED' | 'CONSERVATIVE';
export interface PositionWithMovement extends Vector2D {
    movement?: string;
    role?: string;
    targetX?: number;
    targetY?: number;
}
interface SortedPlayerLists {
    teammates: {
        bestKickers: Player[];
        bestHeaders: Player[];
        fastest: Player[];
        bestDefenders: Player[];
    };
    opponents: {
        tallest: Player[];
        mostDangerous: Player[];
    };
}
export interface OffsideAudit {
    position: Vector2D;
    wasOffside: boolean;
    wasAdjusted: boolean;
    originalX: number;
    defensiveLine: number;
    tolerance: number;
    error: string | null;
}
export declare class TacticalContext {
    gameState: GameState;
    setPieceType: string;
    scoreDifference: number;
    timeRemaining: number;
    isTrailing: boolean;
    isLeading: boolean;
    isDrawn: boolean;
    isLateGame: boolean;
    isVeryLateGame: boolean;
    urgency?: Urgency;
    constructor(gameState: GameState, setPieceType: string);
    getUrgency(isHome: boolean): Urgency;
    shouldCommitForward(isHome: boolean): boolean;
    shouldStayCompact(isHome: boolean): boolean;
}
export declare class PositionManager {
    occupiedPositions: Vector2D[];
    minDistance: number;
    priorityZones: Map<string, {
        x: number;
        y: number;
        radius: number;
    }>;
    constructor();
    reset(): void;
    markPriorityZone(x: number, y: number, radius?: number): void;
    isPositionOccupied(x: number, y: number, allowOverlap?: boolean): boolean;
    findValidPosition(idealPos: Vector2D, maxAttempts?: number, allowPriorityOverlap?: boolean): Vector2D;
}
export declare function getSafeStat(stats: Record<string, unknown>, key: string, defaultValue?: number): number;
export declare function sanitizePosition(pos: unknown, context?: {
    player?: Player;
    gameState?: GameState;
    role?: string;
    behavior?: string;
    movement?: string;
    [key: string]: unknown;
}): PositionWithMovement;
export declare function getValidPlayers(playersArray: Player[] | undefined | null): Player[];
export declare function getSortedLists(teammates: Player[], opponents: Player[]): SortedPlayerLists;
export declare function determineSetPieceTeam(gameState: GameState | null | undefined, player?: Player): 'home' | 'away';
export declare function isPlayerAttacking(player: Player, gameState: GameState): boolean;
/**
 * Formation-aware positioning helper
 * Ensures players maintain proper positional discipline based on their role
 */
export declare function getFormationAwarePosition(player: Player, basePosition: PositionWithMovement, gameState: GameState, isAttacking: boolean): PositionWithMovement;
/**
 * Check and adjust for offside position
 * Attacking player cannot be ahead of last defender (excluding goalkeeper)
 */
export declare function checkAndAdjustOffsidePosition(position: {
    x: number;
    y: number;
    [key: string]: unknown;
}, _player: Player, opponentGoalX: number, opponents: Player[], _gameState: GameState): {
    x: number;
    y: number;
    [key: string]: unknown;
};
/**
 * Check and adjust for offside with detailed audit trail for debugging
 */
export declare const checkAndAdjustOffsidePositionWithAudit: (position: {
    x: number;
    y: number;
    [key: string]: unknown;
}, isHome: boolean, gameState: GameState | null | undefined) => OffsideAudit;
export {};
//# sourceMappingURL=utils.d.ts.map