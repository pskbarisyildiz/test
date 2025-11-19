import type { Player, GameState } from '../types';
import { getDistance, getAttackingGoalX } from '../utils/ui';
import { sanitizePosition, getValidPlayers, isPlayerAttacking, getFormationAwarePosition } from './utils';
import { getPlayerActivePosition } from '../ai/movement';
import { KickoffBehaviors } from './behaviors/kickoff';
import { PenaltyKickBehaviors as PenaltyBehaviors } from './behaviors/penalty';
import { ThrowInBehaviors } from './behaviors/throwIn';
import { ProfessionalCornerBehaviors as CornerKickBehaviors } from './behaviors/cornerKick';
import { ProfessionalFreeKickBehaviors as FreeKickBehaviors } from './behaviors/freeKick';
import { ProfessionalGoalKickBehaviors as GoalKickBehaviors } from './behaviors/goalKick';
import { GAME_CONFIG } from '../config';
import { isSetPieceStatus } from '../utils/ui';

const GAME_CONFIG_SPB_DEFAULT = {
    PITCH_WIDTH: 800,
    PITCH_HEIGHT: 600,
    MIN_PLAYER_SPACING: 30,
    GOAL_Y_TOP: 240,
    GOAL_Y_BOTTOM: 360
};

const activeConfig = (typeof GAME_CONFIG !== 'undefined') ? GAME_CONFIG : GAME_CONFIG_SPB_DEFAULT;
const PITCH_WIDTH = activeConfig.PITCH_WIDTH;
const PITCH_HEIGHT = activeConfig.PITCH_HEIGHT;

const SET_PIECE_TYPES = {
    CORNER_KICK: 'CORNER_KICK',
    FREE_KICK: 'FREE_KICK',
    THROW_IN: 'THROW_IN',
    GOAL_KICK: 'GOAL_KICK',
    PENALTY: 'PENALTY',
    KICK_OFF: 'KICK_OFF'
};

function handleGoalkeeperSetPiecePosition(player: Player, gameState: GameState, setPieceType: string, isAttacking: boolean, ownGoalX: number, setPiecePos: { x: number; y: number }) {
    try {
        const opponentGoalX = getAttackingGoalX(player.isHome, gameState.currentHalf);

        switch (setPieceType) {
            case SET_PIECE_TYPES.CORNER_KICK:
                if (!isAttacking) {
                    const isRightCorner = setPiecePos.y < (PITCH_HEIGHT / 2);
                    const gkY = isRightCorner ? activeConfig.GOAL_Y_TOP + 50 : activeConfig.GOAL_Y_BOTTOM - 50;
                    return sanitizePosition({ x: ownGoalX, y: gkY, movement: 'gk_corner_positioning', role: 'GK' }, { player });
                }
                break;

            case SET_PIECE_TYPES.FREE_KICK:
                if (!isAttacking) {
                    const offsetY = setPiecePos.y > 300 ? -20 : 20;
                    return sanitizePosition({ x: ownGoalX, y: 300 + offsetY, movement: 'gk_fk_positioning', role: 'GK' }, { player });
                }
                break;

            case SET_PIECE_TYPES.PENALTY:
                return PenaltyBehaviors.getPenaltyArcPosition(player, setPiecePos, isAttacking, gameState);

            case SET_PIECE_TYPES.GOAL_KICK:
                const teammates = getValidPlayers(player.isHome ? gameState.homePlayers : gameState.awayPlayers);
                const opponents = getValidPlayers(player.isHome ? gameState.awayPlayers : gameState.homePlayers);
                const teamTactic = player.isHome ? gameState.homeTactic : gameState.awayTactic;

                return isAttacking ?
                    GoalKickBehaviors.getGoalKickPosition(player, ownGoalX, teamTactic, true, gameState, teammates) :
                    GoalKickBehaviors.getDefendingGoalKickPosition(player, opponentGoalX, ownGoalX, gameState, opponents, teammates);
        }

        return sanitizePosition({ x: ownGoalX, y: 300, movement: 'gk_default' }, { player });
    } catch (error) {
        console.error(`GK positioning error:`, error);
        const fallbackGoalX = getAttackingGoalX(!player.isHome, gameState?.currentHalf ?? 1);
        return sanitizePosition({ x: fallbackGoalX, y: 300, movement: 'gk_error' }, { player });
    }
}

function getSafeFallbackPosition(player: Player, reason: string, gameState: GameState) {
    const activePos = getPlayerActivePosition(player, gameState?.currentHalf ?? 1);
    return sanitizePosition(
        { x: activePos?.x ?? PITCH_WIDTH / 2, y: activePos?.y ?? PITCH_HEIGHT / 2, movement: `fallback_${reason}` },
        { player, behavior: 'Fallback' }
    );
}

function calculateSetPiecePositionWithSafety(player: Player, gameState: GameState, setPieceType: string, isAttacking: boolean, setPiecePos: { x: number; y: number }) {
    const ownGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);
    const opponentGoalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
    const teammates = getValidPlayers(player.isHome ? gameState.homePlayers : gameState.awayPlayers);
    const opponents = getValidPlayers(player.isHome ? gameState.awayPlayers : gameState.homePlayers);

    try {
        switch (setPieceType) {
            case SET_PIECE_TYPES.FREE_KICK:
                const distToGoal = getDistance(setPiecePos, { x: (isAttacking ? opponentGoalX : ownGoalX), y: 300 });
                return isAttacking ?
                    FreeKickBehaviors.getAttackingFreeKickPosition(player, setPiecePos, opponentGoalX, distToGoal, null, gameState, teammates) :
                    FreeKickBehaviors.getDefendingFreeKickPosition(player, setPiecePos, ownGoalX, distToGoal, null, opponents, gameState, teammates);

            case SET_PIECE_TYPES.CORNER_KICK:
                return isAttacking ?
                    CornerKickBehaviors.getAttackingCornerPosition(player, setPiecePos, opponentGoalX, teammates, null, gameState.setPiece?.routine, gameState) :
                    CornerKickBehaviors.getDefendingCornerPosition(player, setPiecePos, ownGoalX, opponents, null, gameState.setPiece?.defensiveSystem, gameState, teammates);

            case SET_PIECE_TYPES.THROW_IN:
                return ThrowInBehaviors.getThrowInPosition(player, setPiecePos, ownGoalX, opponentGoalX, gameState, teammates, opponents);

            case SET_PIECE_TYPES.GOAL_KICK:
                const teamTactic = player.isHome ? gameState.homeTactic : gameState.awayTactic;
                return isAttacking ?
                    GoalKickBehaviors.getGoalKickPosition(player, ownGoalX, teamTactic, true, gameState, teammates) :
                    GoalKickBehaviors.getDefendingGoalKickPosition(player, opponentGoalX, ownGoalX, gameState, opponents, teammates);

            case SET_PIECE_TYPES.PENALTY:
                if (isAttacking) {
                    const isKicker = gameState.setPiece?.kicker && String(gameState.setPiece.kicker.id) === String(player.id);
                    if (isKicker) {
                        return PenaltyBehaviors.getKickerPosition(setPiecePos);
                    }
                }
                return PenaltyBehaviors.getPenaltyArcPosition(player, setPiecePos, isAttacking, gameState);

            case SET_PIECE_TYPES.KICK_OFF:
                if (typeof KickoffBehaviors.getKickoffPosition !== 'undefined') {
                    const kickingTeamIsHome = typeof gameState.setPiece?.team === 'boolean'
                        ? gameState.setPiece.team
                        : gameState.setPiece?.team === 'home';
                    const isKickingTeam = player.isHome === kickingTeamIsHome;
                    return KickoffBehaviors.getKickoffPosition(player, setPiecePos, isKickingTeam, gameState);
                }
                return sanitizePosition({ x: player.x, y: player.y, movement: 'kickoff_fallback', role: player.role }, { player, gameState });

            default:
                return getSafeFallbackPosition(player, `unknown_type_${setPieceType}`, gameState);
        }
    } catch (error) {
        console.error(`Set piece calculation error:`, error);
        return getSafeFallbackPosition(player, `calculation_error`, gameState);
    }
}

function getSetPiecePosition(player: Player, gameState: GameState) {
    try {
        if (!gameState || !player || !gameState.setPiece || !gameState.setPiece.position) {
            return getSafeFallbackPosition(player, 'invalid_state', gameState);
        }

        const setPieceType = gameState.status;
        const isAttacking = isPlayerAttacking(player, gameState);
        const setPiecePos = gameState.setPiece.position;

        if (player.role === 'GK' || (player as any).role === 'goalkeeper') {
            const ownGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);
            return handleGoalkeeperSetPiecePosition(player, gameState, setPieceType, isAttacking, ownGoalX, setPiecePos);
        }

        let position = calculateSetPiecePositionWithSafety(player, gameState, setPieceType, isAttacking, setPiecePos);

        position = getFormationAwarePosition(player, position, gameState, isAttacking);

        return sanitizePosition(position, {
            player,
            setPieceType,
            behavior: 'MainSetPieceDispatch',
            role: (position as any)?.role || player?.role || 'UNKNOWN',
            gameState
        });

    } catch (error) {
        console.error('Critical error in getSetPiecePosition:', error);
        return getSafeFallbackPosition(player, 'critical_error', gameState);
    }
}

function shouldLockSetPiecePosition(player: Player, gameState: GameState): boolean {
    if (!gameState || !player || !gameState.setPiece) return false;

    if (gameState.status === 'KICK_OFF') {
        return true;
    }

    const movement = (player as any).setPieceMovement || getSetPieceMovementType(player, gameState);
    const movementLower = typeof movement === 'string' ? movement.toLowerCase() : '';

    const lockKeywords = ['kicker', 'thrower', 'wall'];
    if (lockKeywords.some(keyword => movementLower.includes(keyword))) {
        return getDistance(player, gameState.setPiece?.position) < 15;
    }

    if (!gameState.setPiece?.executionTime) return false;
    const timeUntilExecution = gameState.setPiece.executionTime - Date.now();
    return timeUntilExecution < 1500 && timeUntilExecution > -500;
}

function getSetPieceMovementType(player: Player, gameState: GameState): string {
    if (!gameState || !player) return 'standard_position';
    if ((player as any).setPieceMovement) return (player as any).setPieceMovement;

    const position = getSetPiecePosition(player, gameState);
    const movement = (position as any)?.movement || 'standard_position';
    (player as any).setPieceMovement = movement;
    return movement;
}

function isSetPieceActive(gameState: GameState): boolean {
    if (!gameState || !gameState.status) return false;

    if (typeof isSetPieceStatus === 'function') {
        return isSetPieceStatus(gameState.status);
    }

    return [
        SET_PIECE_TYPES.CORNER_KICK,
        SET_PIECE_TYPES.FREE_KICK,
        SET_PIECE_TYPES.THROW_IN,
        SET_PIECE_TYPES.GOAL_KICK,
        SET_PIECE_TYPES.PENALTY,
        SET_PIECE_TYPES.KICK_OFF
    ].includes(gameState.status);
}

export const SetPieceBehaviorSystem = {
    getSetPiecePosition,
    shouldLockSetPiecePosition,
    getSetPieceMovementType,
    isSetPieceActive
};
