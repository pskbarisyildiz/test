/**
 * @migrated-from js/SetPieceBehaviorSystem.js
 *
 * Professional Set Piece Behavior System v6.0
 * Champions League Grade Tactical AI - ENHANCED EDITION
 *
 * Key Improvements v6.0:
 * 1. Position-specific tactical intelligence (defenders defend, attackers attack)
 * 2. Ball possession awareness - dynamic positioning based on team having ball
 * 3. Professional spacing and movement patterns matching real football
 * 4. Enhanced throw-in tactical system with position-based roles
 * 5. Improved corner and free kick variations with attacking mentality
 * 6. Formation-aware positioning - players maintain team shape
 * 7. Context-aware decision making based on game state and position
 *
 * @module behavior/setPieceBehavior
 */
import type { Player, GameState, Vector2D } from '../types';
import { sanitizePosition, getValidPlayers, getSortedLists, isPlayerAttacking, determineSetPieceTeam, getFormationAwarePosition, checkAndAdjustOffsidePosition } from '../setpieces';
import type { PositionWithMovement } from '../setpieces/utils';
declare function handleGoalkeeperSetPiecePosition(player: Player, gameState: GameState, setPieceType: string, isAttacking: boolean, ownGoalX: number, setPiecePos: Vector2D): PositionWithMovement;
declare function getSafeFallbackPosition(player: Player, reason: string, gameState: GameState | null | undefined): PositionWithMovement;
declare function calculateSetPiecePositionWithSafety(player: Player, gameState: GameState, setPieceType: string, isAttacking: boolean, setPiecePos: Vector2D): PositionWithMovement;
declare function getSetPiecePosition(player: Player, gameState: GameState): PositionWithMovement;
declare function shouldLockSetPiecePosition(player: Player, gameState: GameState | null | undefined): boolean;
declare function getSetPieceMovementType(player: Player, gameState: GameState | null | undefined): string;
declare function isSetPieceActive(gameState: GameState | null | undefined): boolean;
export declare const SetPieceBehaviorSystem: {
    getSetPiecePosition: typeof getSetPiecePosition;
    shouldLockSetPiecePosition: typeof shouldLockSetPiecePosition;
    getSetPieceMovementType: typeof getSetPieceMovementType;
    isSetPieceActive: typeof isSetPieceActive;
    checkAndAdjustOffsidePosition: typeof checkAndAdjustOffsidePosition;
    checkAndAdjustOffsidePositionWithAudit: (position: {
        x: number;
        y: number;
        [key: string]: unknown;
    }, isHome: boolean, gameState: GameState | null | undefined) => import("../setpieces/utils").OffsideAudit;
    ProfessionalCornerBehaviors: {
        getAttackingCornerPosition(player: Player, cornerPos: Vector2D, opponentGoalX: number, teammates: Player[], sortedLists: {
            teammates?: {
                bestHeaders?: Player[];
                fastest?: Player[];
            };
            opponents?: {
                mostDangerous?: Player[];
            };
        }, _routine: unknown, gameState: GameState): PositionWithMovement;
        getDefendingCornerPosition(player: Player, cornerPos: Vector2D, ownGoalX: number, opponents: Player[], sortedLists: {
            teammates?: {
                bestHeaders?: Player[];
                fastest?: Player[];
            };
            opponents?: {
                mostDangerous?: Player[];
            };
        }, system: string, gameState: GameState, teammates: Player[]): PositionWithMovement;
    };
    ProfessionalFreeKickBehaviors: {
        getAttackingFreeKickPosition(player: Player, fkPos: Vector2D, opponentGoalX: number, distToGoal: number, sortedLists: import("../setpieces/behaviors/freeKick").SortedLists | null, gameState: GameState, teammates: Player[]): PositionWithMovement | {
            x: number;
            y: number;
            movement: string;
            role: string;
        };
        getDefendingFreeKickPosition(player: Player, fkPos: Vector2D, ownGoalX: number, distToGoal: number, sortedLists: import("../setpieces/behaviors/freeKick").SortedLists | null, opponents: Player[], gameState: GameState, teammates: Player[]): PositionWithMovement | {
            x: number;
            y: number;
            movement: string;
            role: string;
        };
        calculateWallPosition(positionData: import("../setpieces/behaviors/freeKick").PlayerJobAssignment, wallSize: number, fkPos: Vector2D, ownGoalX: number, direction: number, player: Player, gameState: GameState): PositionWithMovement | {
            x: number;
            y: number;
            movement: string;
            role: string;
        };
        calculateMarkingPosition(positionData: import("../setpieces/behaviors/freeKick").PlayerJobAssignment, direction: number, opponentMap: Map<string, Player> | undefined, player: Player, gameState: GameState, ownGoalX: number): PositionWithMovement | {
            x: number;
            y: number;
            movement: string;
            role: string;
        };
    };
    ThrowInBehaviors: {
        getThrowInPosition(player: Player, throwPos: Vector2D, ownGoalX: number, opponentGoalX: number, gameState: GameState, teammates: Player[], opponents: Player[]): PositionWithMovement;
        getDefendingThrowInPosition(player: Player, throwPos: Vector2D, ownGoalX: number, gameState: GameState, teammates: Player[]): PositionWithMovement;
    };
    ProfessionalGoalKickBehaviors: {
        getGoalKickPosition(player: Player, ownGoalX: number, tactic: string, playShort: boolean, gameState: GameState, teammates: Player[]): PositionWithMovement;
        getDefendingGoalKickPosition(player: Player, opponentGoalX: number, ownGoalX: number, gameState: GameState, _opponents: Player[], teammates: Player[]): PositionWithMovement;
    };
    PenaltyKickBehaviors: {
        getKickerPosition(penaltyPos: Vector2D): PositionWithMovement;
        getPenaltyArcPosition(player: Player, penaltyPos: Vector2D, isAttacking: boolean, gameState: GameState): PositionWithMovement;
    };
    KickoffBehaviors: {
        getKickoffPosition(player: Player, _kickoffPos: Vector2D, isKickingTeam: boolean, gameState: GameState): PositionWithMovement;
        isValidKickoffPosition(player: Player, position: Vector2D, isKickingTeam: boolean, gameState: GameState): boolean;
        getDesignatedKickers(gameState: GameState): import("../setpieces/behaviors/kickoff").DesignatedKickers;
    } | null;
    SET_PIECE_TYPES: {
        readonly CORNER_KICK: "CORNER_KICK";
        readonly FREE_KICK: "FREE_KICK";
        readonly THROW_IN: "THROW_IN";
        readonly GOAL_KICK: "GOAL_KICK";
        readonly PENALTY: "PENALTY";
        readonly KICK_OFF: "KICK_OFF";
    };
    determineSetPieceTeam: typeof determineSetPieceTeam;
    isPlayerAttacking: typeof isPlayerAttacking;
    getFormationAwarePosition: typeof getFormationAwarePosition;
    sanitizePosition: typeof sanitizePosition;
    getSafeFallbackPosition: typeof getSafeFallbackPosition;
    handleGoalkeeperSetPiecePosition: typeof handleGoalkeeperSetPiecePosition;
    calculateSetPiecePositionWithSafety: typeof calculateSetPiecePositionWithSafety;
    getValidPlayers: typeof getValidPlayers;
    getSortedLists: typeof getSortedLists;
};
export {};
//# sourceMappingURL=setPieceBehavior.d.ts.map