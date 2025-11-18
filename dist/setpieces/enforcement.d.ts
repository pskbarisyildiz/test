/**
 * ============================================================================
 * SET PIECE ENFORCEMENT SYSTEM v1.0
 * ============================================================================
 * [setpiece-fix] [defenders-fix] [gk-protection]
 *
 * Enforces professional set-piece rules:
 * 1. Taker-first action: Only taker can initiate play
 * 2. Opponent distance: Opponents must stay 100px away until first action
 * 3. Goalkeeper protection: GK cannot be tackled
 * 4. Set-piece state machine: Clear phases for execution
 * ============================================================================
 *
 * @module setpieces/enforcement
 * @migrated-from js/setpieces/setPieceEnforcement.js
 */
import type { GameState, Player } from '../types';
/**
 * Get current set-piece state
 */
declare function getSetPieceState(gameState: GameState): string | null;
/**
 * Check if player is the designated taker
 */
declare function isSetPieceTaker(player: Player, gameState: GameState): boolean;
/**
 * [setpiece-fix] Freeze opponents until taker acts
 * Enforces 100px minimum distance rule
 * [kick-off-fix] Also freezes non-taker teammates for kick-offs
 * [kick-off-half-fix] Enforces players stay in own half before kick-off
 */
declare function freezeOpponentsUntilKick(player: Player, gameState: GameState, _allPlayers: Player[]): boolean;
/**
 * [kick-off-half-fix] CRITICAL: Enforce players stay in own half before kick-off
 * This runs during POSITIONING and WAIT phases to prevent players crossing center line
 */
declare function enforceKickOffHalfRule(player: Player, gameState: GameState): boolean;
/**
 * [setpiece-fix] Resume play after taker action
 */
declare function resumeAfterTakerAction(gameState: GameState): void;
/**
 * [gk-protection] Check if player is a goalkeeper
 */
declare function isGoalkeeper(player: Player): boolean;
/**
 * [gk-protection] Prevent tackling the goalkeeper
 * Returns true if tackle should be blocked
 */
declare function protectGoalkeeper(tackler: Player, target: Player, gameState: GameState): boolean;
/**
 * [gk-protection] Assign defensive marking instead of tackling GK
 */
declare function assignDefensiveMarking(marker: Player, target: Player, gameState: GameState): void;
/**
 * Initialize set piece with proper state
 */
declare function initializeSetPieceState(gameState: GameState): void;
/**
 * Update set piece state machine
 */
declare function updateSetPieceState(gameState: GameState): void;
/**
 * Check if set piece action is allowed
 */
declare function canPlayerActOnSetPiece(player: Player, gameState: GameState): boolean;
/**
 * Main enforcement update - call this every frame
 */
declare function updateSetPieceEnforcement(gameState: GameState, allPlayers: Player[]): void;
export declare const SetPieceEnforcement: {
    SET_PIECE_ENFORCEMENT: {
        OPPONENT_MIN_DISTANCE: number;
        GK_PROTECTION_ENABLED: boolean;
        TAKER_PROTECTION_TIME: number;
        WALL_MIN_DISTANCE: number;
    };
    SET_PIECE_STATES: {
        POSITIONING: string;
        WAIT_FOR_TAKER_ACTION: string;
        EXECUTING: string;
        COMPLETED: string;
    };
    getSetPieceState: typeof getSetPieceState;
    initializeSetPieceState: typeof initializeSetPieceState;
    updateSetPieceState: typeof updateSetPieceState;
    canPlayerActOnSetPiece: typeof canPlayerActOnSetPiece;
    isSetPieceTaker: typeof isSetPieceTaker;
    freezeOpponentsUntilKick: typeof freezeOpponentsUntilKick;
    enforceKickOffHalfRule: typeof enforceKickOffHalfRule;
    resumeAfterTakerAction: typeof resumeAfterTakerAction;
    isGoalkeeper: typeof isGoalkeeper;
    protectGoalkeeper: typeof protectGoalkeeper;
    assignDefensiveMarking: typeof assignDefensiveMarking;
    updateSetPieceEnforcement: typeof updateSetPieceEnforcement;
};
export {};
//# sourceMappingURL=enforcement.d.ts.map