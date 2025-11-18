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
import {
  sanitizePosition,
  getValidPlayers,
  getSortedLists,
  isPlayerAttacking,
  determineSetPieceTeam,
  getFormationAwarePosition,
  checkAndAdjustOffsidePosition,
  checkAndAdjustOffsidePositionWithAudit,
  PenaltyKickBehaviors,
  KickoffBehaviors,
  ThrowInBehaviors,
  ProfessionalCornerBehaviors,
  ProfessionalGoalKickBehaviors,
  ProfessionalFreeKickBehaviors
} from '../setpieces';
import type { PositionWithMovement } from '../setpieces/utils';

// ============================================================================
// CONFIGURATION
// ============================================================================

const GAME_CONFIG_SPB_DEFAULT = {
  PITCH_WIDTH: 800,
  PITCH_HEIGHT: 600,
  MIN_PLAYER_SPACING: 30,
  GOAL_Y_TOP: 240,
  GOAL_Y_BOTTOM: 360
};

const activeConfig = (typeof (window as any).GAME_CONFIG !== 'undefined')
  ? (window as any).GAME_CONFIG
  : GAME_CONFIG_SPB_DEFAULT;

const SET_PIECE_TYPES = {
  CORNER_KICK: 'CORNER_KICK',
  FREE_KICK: 'FREE_KICK',
  THROW_IN: 'THROW_IN',
  GOAL_KICK: 'GOAL_KICK',
  PENALTY: 'PENALTY',
  KICK_OFF: 'KICK_OFF'
} as const;

const PITCH_WIDTH = activeConfig.PITCH_WIDTH;
const PITCH_HEIGHT = activeConfig.PITCH_HEIGHT;

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

function handleGoalkeeperSetPiecePosition(
  player: Player,
  gameState: GameState,
  setPieceType: string,
  isAttacking: boolean,
  ownGoalX: number,
  setPiecePos: Vector2D
): PositionWithMovement {
  try {
    const opponentGoalX = (window as any).getAttackingGoalX(player.isHome, gameState.currentHalf);

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
        return PenaltyKickBehaviors.getPenaltyArcPosition(player, setPiecePos, isAttacking, gameState);

      case SET_PIECE_TYPES.GOAL_KICK:
        const teammates = getValidPlayers(player.isHome ? gameState.homePlayers : gameState.awayPlayers);
        const opponents = getValidPlayers(player.isHome ? gameState.awayPlayers : gameState.homePlayers);
        const teamTactic = player.isHome ? gameState.homeTactic : gameState.awayTactic;

        return isAttacking ?
          ProfessionalGoalKickBehaviors.getGoalKickPosition(player, ownGoalX, teamTactic, true, gameState, teammates) :
          ProfessionalGoalKickBehaviors.getDefendingGoalKickPosition(player, opponentGoalX, ownGoalX, gameState, opponents, teammates);
    }

    return sanitizePosition({ x: ownGoalX, y: 300, movement: 'gk_default' }, { player });
  } catch (error) {
    console.error(`GK positioning error:`, error);
    const fallbackGoalX = (window as any).getAttackingGoalX(!player.isHome, gameState?.currentHalf ?? 1);
    return sanitizePosition({ x: fallbackGoalX, y: 300, movement: 'gk_error' }, { player });
  }
}

function getSafeFallbackPosition(player: Player, reason: string, gameState: GameState | null | undefined): PositionWithMovement {
  const activePos = (window as any).getPlayerActivePosition(player, gameState?.currentHalf ?? 1);
  return sanitizePosition(
    { x: activePos?.x ?? PITCH_WIDTH / 2, y: activePos?.y ?? PITCH_HEIGHT / 2, movement: `fallback_${reason}` },
    { player, behavior: 'Fallback' }
  );
}

function calculateSetPiecePositionWithSafety(
  player: Player,
  gameState: GameState,
  setPieceType: string,
  isAttacking: boolean,
  setPiecePos: Vector2D
): PositionWithMovement {
  const ownGoalX = (window as any).getAttackingGoalX(!player.isHome, gameState.currentHalf);
  const opponentGoalX = (window as any).getAttackingGoalX(player.isHome, gameState.currentHalf);
  const teammates = getValidPlayers(player.isHome ? gameState.homePlayers : gameState.awayPlayers);
  const opponents = getValidPlayers(player.isHome ? gameState.awayPlayers : gameState.homePlayers);

  try {
    switch (setPieceType) {
      case SET_PIECE_TYPES.FREE_KICK:
        const distToGoal = (window as any).getDistance(setPiecePos, { x: (isAttacking ? opponentGoalX : ownGoalX), y: 300 });
        return isAttacking ?
          ProfessionalFreeKickBehaviors.getAttackingFreeKickPosition(player, setPiecePos, opponentGoalX, distToGoal, null, gameState, teammates) :
          ProfessionalFreeKickBehaviors.getDefendingFreeKickPosition(player, setPiecePos, ownGoalX, distToGoal, null, opponents, gameState, teammates);

      case SET_PIECE_TYPES.CORNER_KICK:
        return isAttacking ?
          ProfessionalCornerBehaviors.getAttackingCornerPosition(player, setPiecePos, opponentGoalX, teammates, null, (gameState.setPiece as any)?.routine, gameState) :
          ProfessionalCornerBehaviors.getDefendingCornerPosition(player, setPiecePos, ownGoalX, opponents, null, (gameState.setPiece as any)?.defensiveSystem, gameState, teammates);

      case SET_PIECE_TYPES.THROW_IN:
        return ThrowInBehaviors.getThrowInPosition(player, setPiecePos, ownGoalX, opponentGoalX, gameState, teammates, opponents);

      case SET_PIECE_TYPES.GOAL_KICK:
        const teamTactic = player.isHome ? gameState.homeTactic : gameState.awayTactic;
        return isAttacking ?
          ProfessionalGoalKickBehaviors.getGoalKickPosition(player, ownGoalX, teamTactic, true, gameState, teammates) :
          ProfessionalGoalKickBehaviors.getDefendingGoalKickPosition(player, opponentGoalX, ownGoalX, gameState, opponents, teammates);

      case SET_PIECE_TYPES.PENALTY:
        if (isAttacking && gameState.setPiece) {
          const isKicker = gameState.setPiece.kicker && String(gameState.setPiece.kicker.id) === String(player.id);
          if (isKicker) {
            return PenaltyKickBehaviors.getKickerPosition(setPiecePos);
          }
        }
        return PenaltyKickBehaviors.getPenaltyArcPosition(player, setPiecePos, isAttacking, gameState);

      case SET_PIECE_TYPES.KICK_OFF:
        if (typeof KickoffBehaviors !== 'undefined' && gameState.setPiece) {
          const kickingTeamIsHome = typeof gameState.setPiece.team === 'boolean'
            ? gameState.setPiece.team
            : gameState.setPiece.team === 'home';
          const isKickingTeam = player.isHome === kickingTeamIsHome;
          return KickoffBehaviors.getKickoffPosition(player, setPiecePos, isKickingTeam, gameState);
        }
        // Fallback if KickoffBehaviors not loaded
        return sanitizePosition({ x: player.x, y: player.y, movement: 'kickoff_fallback', role: player.role }, { player, gameState });

      default:
        return getSafeFallbackPosition(player, `unknown_type_${setPieceType}`, gameState);
    }
  } catch (error) {
    console.error(`Set piece calculation error:`, error);
    return getSafeFallbackPosition(player, `calculation_error`, gameState);
  }
}

function getSetPiecePosition(player: Player, gameState: GameState): PositionWithMovement {
  try {
    if (!gameState || !player || !gameState.setPiece || !gameState.setPiece.position) {
      return getSafeFallbackPosition(player, 'invalid_state', gameState);
    }

    const setPieceType = gameState.status;
    const isAttacking = isPlayerAttacking(player, gameState);
    const setPiecePos = gameState.setPiece.position;

    if (player.role === 'GK' || (player.role as string) === 'goalkeeper') {
      const ownGoalX = (window as any).getAttackingGoalX(!player.isHome, gameState.currentHalf);
      return handleGoalkeeperSetPiecePosition(player, gameState, setPieceType, isAttacking, ownGoalX, setPiecePos);
    }

    let position = calculateSetPiecePositionWithSafety(player, gameState, setPieceType, isAttacking, setPiecePos);

    // Apply formation-aware positioning discipline
    position = getFormationAwarePosition(player, position, gameState, isAttacking);

    return sanitizePosition(position, {
      player,
      setPieceType,
      behavior: 'MainSetPieceDispatch',
      role: position?.role || player?.role || 'UNKNOWN',
      gameState
    });

  } catch (error) {
    console.error('Critical error in getSetPiecePosition:', error);
    return getSafeFallbackPosition(player, 'critical_error', gameState);
  }
}

function shouldLockSetPiecePosition(player: Player, gameState: GameState | null | undefined): boolean {
  if (!gameState || !player || !gameState.setPiece) return false;

  // SPECIAL CASE: KICKOFF - ALL players must be locked in position
  // until execution to enforce the "players in own half" rule
  if (gameState.status === 'KICK_OFF') {
    return true; // Lock everyone during kickoff setup
  }

  const movement = (player as any).setPieceMovement || getSetPieceMovementType(player, gameState);
  const movementLower = typeof movement === 'string' ? movement.toLowerCase() : '';

  const lockKeywords = ['kicker', 'thrower', 'wall'];
  if (lockKeywords.some(keyword => movementLower.includes(keyword))) {
    return (window as any).getDistance(player, gameState.setPiece.position) < 15;
  }

  if (!gameState.setPiece.executionTime) return false;
  const timeUntilExecution = gameState.setPiece.executionTime - Date.now();
  return timeUntilExecution < 1500 && timeUntilExecution > -500;
}

function getSetPieceMovementType(player: Player, gameState: GameState | null | undefined): string {
  if (!gameState || !player) return 'standard_position';
  if ((player as any).setPieceMovement) return (player as any).setPieceMovement;

  const position = getSetPiecePosition(player, gameState);
  const movement = (position as any)?.movement || 'standard_position';
  (player as any).setPieceMovement = movement;
  return movement;
}

function isSetPieceActive(gameState: GameState | null | undefined): boolean {
  if (!gameState || !gameState.status) return false;

  if (typeof (window as any).isSetPieceStatus === 'function') {
    return (window as any).isSetPieceStatus(gameState.status);
  }

  return [
    SET_PIECE_TYPES.CORNER_KICK,
    SET_PIECE_TYPES.FREE_KICK,
    SET_PIECE_TYPES.THROW_IN,
    SET_PIECE_TYPES.GOAL_KICK,
    SET_PIECE_TYPES.PENALTY,
    SET_PIECE_TYPES.KICK_OFF
  ].includes(gameState.status as any);
}

// ============================================================================
// EXPORTS
// ============================================================================

export const SetPieceBehaviorSystem = {
  getSetPiecePosition,
  shouldLockSetPiecePosition,
  getSetPieceMovementType,
  isSetPieceActive,
  checkAndAdjustOffsidePosition,
  checkAndAdjustOffsidePositionWithAudit,
  ProfessionalCornerBehaviors,
  ProfessionalFreeKickBehaviors,
  ThrowInBehaviors,
  ProfessionalGoalKickBehaviors,
  PenaltyKickBehaviors,
  KickoffBehaviors: typeof KickoffBehaviors !== 'undefined' ? KickoffBehaviors : null,
  SET_PIECE_TYPES,
  determineSetPieceTeam,
  isPlayerAttacking,
  getFormationAwarePosition,
  sanitizePosition,
  getSafeFallbackPosition,
  handleGoalkeeperSetPiecePosition,
  calculateSetPiecePositionWithSafety,
  getValidPlayers,
  getSortedLists
};

// ============================================================================
// BROWSER EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
  (window as any).SetPieceBehaviorSystem = SetPieceBehaviorSystem;

  // Register with DependencyRegistry
  if (typeof (window as any).DependencyRegistry !== 'undefined') {
    (window as any).DependencyRegistry.register('SetPieceBehaviorSystem', SetPieceBehaviorSystem);
  }

  console.log('✅ PROFESSIONAL SET PIECE BEHAVIOR SYSTEM v6.0 (World Class) LOADED');
  console.log('   ✓ Formation-aware positioning');
  console.log('   ✓ Professional throw-in system');
  console.log('   ✓ Enhanced corner & free kick patterns');
  console.log('   ✓ FIX #8: Registered with DependencyRegistry');
  console.log('   ✓ FIX #12: Offside audit trail enabled');
  console.log('   ✓ Modern goal kick build-up play');
}
