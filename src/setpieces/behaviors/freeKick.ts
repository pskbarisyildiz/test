/**
 * Free Kick Behaviors - TypeScript Migration
 *
 * Professional free kick positioning system with:
 * - Attacking free kick formations (direct shots and crossing routines)
 * - Defensive free kick positioning (wall formation and zonal marking)
 * - Man-marking dangerous opponents
 * - Offside-aware positioning
 * - Context-aware tactical decisions
 *
 * This is the largest behavior file with complex wall calculations,
 * marking systems, and multiple attacking routines.
 *
 * @module setpieces/behaviors/freeKick
 * @migrated-from js/setpieces/behaviors/freeKick.js
 */

import type { Player, GameState, Vector2D } from '../../types';
import {
  sanitizePosition,
  TacticalContext,
  PositionManager,
  getValidPlayers,
  getSortedLists,
  checkAndAdjustOffsidePosition
} from '../utils';
import { GAME_CONFIG } from '../../config';
import { getAttackingGoalX } from '../../utils/ui';
import { getPlayerActivePosition } from '../../ai/movement';
import { distance as getDistance } from '../../utils/math';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface FreeKickZones {
  kicker: Vector2D;
  dummyRunner: Vector2D;
  secondKicker: Vector2D;
  standingAttacker: Vector2D;
  nearPostStart: Vector2D;
  nearPostTarget: Vector2D;
  farPostStart: Vector2D;
  farPostTarget: Vector2D;
  strikerPosition: Vector2D;
  penaltySpotStart: Vector2D;
  penaltySpotTarget: Vector2D;
  edgeBox: Vector2D;
  edgeBoxLeft: Vector2D;
  edgeBoxRight: Vector2D;
  wideRunnerStart: Vector2D;
  wideRunnerTarget: Vector2D;
  defensiveMidfield: Vector2D[];
}

interface DefensiveFreeKickZones {
  wallBase: Vector2D;
  nearPostZone: Vector2D;
  farPostZone: Vector2D;
  centralZone: Vector2D;
  edgeBoxZone: Vector2D;
  pressKicker: Vector2D;
  counterOutlet: Vector2D[];
}

export interface PlayerJobAssignment extends Vector2D {
  movement: string;
  role: string;
  priority: number;
  targetX?: number;
  targetY?: number;
  runTiming?: string;
  wallIndex?: number;
  targetId?: string;
}

export interface SortedLists {
  teammates: {
    bestKickers: Player[];
    bestHeaders: Player[];
    fastest: Player[];
    bestDefenders: Player[];
  };
  opponents: {
    mostDangerous: Player[];
  };
}

// ============================================================================
// HELPER FUNCTIONS (Internal - Not Exported from utils.ts)
// ============================================================================

function getSafeStat(stats: Record<string, unknown>, key: string, defaultValue: number = 0): number {
  if (!stats || typeof stats !== 'object') return defaultValue;
  const val = stats[key];
  return typeof val === 'number' && isFinite(val) ? val : defaultValue;
}

function getRoleBasedFallbackPosition(role: string | undefined, context: { player?: Player; gameState?: GameState } = {}): { x: number; y: number; movement: string; role: string } {
  const PITCH_WIDTH = GAME_CONFIG.PITCH_WIDTH;
  const PITCH_HEIGHT = GAME_CONFIG.PITCH_HEIGHT;

  let fallbackX = PITCH_WIDTH / 2;
  let fallbackY = PITCH_HEIGHT / 2;

  // Simple role-based positioning
  if (role?.includes('ST') || role?.includes('CF')) {
    fallbackX = context.player?.isHome ? PITCH_WIDTH - 150 : 150;
  }

  fallbackX = Math.max(10, Math.min(PITCH_WIDTH - 10, fallbackX));
  fallbackY = Math.max(10, Math.min(PITCH_HEIGHT - 10, fallbackY));

  return sanitizePosition({ x: fallbackX, y: fallbackY, movement: 'fallback_position' }, context);
}

// ============================================================================
// PROFESSIONAL FREE KICK BEHAVIORS
// ============================================================================

export const ProfessionalFreeKickBehaviors = {
  getAttackingFreeKickPosition(
    player: Player,
    fkPos: Vector2D,
    opponentGoalX: number,
    distToGoal: number,
    sortedLists: SortedLists | null,
    gameState: GameState,
    teammates: Player[]
  ) {
    if (!gameState || !player || !fkPos) {
      return sanitizePosition({ x: player?.x ?? 400, y: player?.y ?? 300, movement: 'error_fk_att' }, { player });
    }

    if (player.role === 'GK') {
      const gkX = getAttackingGoalX(!player.isHome, gameState.currentHalf);
      return sanitizePosition({ x: gkX, y: 300, movement: 'gk_stay_goal' }, { player });
    }

    const direction = Math.sign(opponentGoalX - 400);
    if (!isFinite(direction) || direction === 0) {
      return getRoleBasedFallbackPosition(player.role, { player, gameState });
    }

    const PITCH_WIDTH = GAME_CONFIG.PITCH_WIDTH;
    const PITCH_HEIGHT = GAME_CONFIG.PITCH_HEIGHT;
    const activeConfig = { GOAL_Y_TOP: 225, GOAL_Y_BOTTOM: 375 };

    const isDangerous = distToGoal < 280;
    const isCentral = Math.abs(fkPos.y - 300) < 100;
    const isShootingPosition = isDangerous && isCentral;

    if (!sortedLists) sortedLists = getSortedLists(teammates, getValidPlayers(gameState ? (player.isHome ? gameState.awayPlayers : gameState.homePlayers) : []));

    // Professional free kick zones with realistic spacing
    const ZONES: FreeKickZones = {
      // Direct shot setup (kicker and options)
      kicker: { x: fkPos.x - direction * 8, y: fkPos.y },
      dummyRunner: { x: fkPos.x - direction * 22, y: fkPos.y + 18 },
      secondKicker: { x: fkPos.x - direction * 22, y: fkPos.y - 18 },
      standingAttacker: { x: fkPos.x - direction * 35, y: fkPos.y },

      // Near post runner (timing run for flick-ons) - PROFESSIONAL: Deep starting position for momentum
      // Players attack from penalty area with proper run-up space
      nearPostStart: { x: fkPos.x + direction * 50, y: fkPos.y - 75 },
      nearPostTarget: { x: opponentGoalX - direction * 100, y: activeConfig.GOAL_Y_TOP + 50 },

      // Far post target (power header) - PROFESSIONAL: Deep starting position for powerful run
      // Players attack from penalty area with maximum momentum
      farPostStart: { x: fkPos.x + direction * 60, y: fkPos.y + 85 },
      farPostTarget: { x: opponentGoalX - direction * 110, y: activeConfig.GOAL_Y_BOTTOM - 50 },

      // Central striker (flick-on/lay-off or shot) - PROFESSIONAL: Penalty spot area
      strikerPosition: { x: opponentGoalX - direction * 105, y: PITCH_HEIGHT / 2 },

      // Penalty spot threat (if ball is crossed)
      penaltySpotStart: { x: fkPos.x + direction * 60, y: PITCH_HEIGHT / 2 + (fkPos.y < 300 ? 30 : -30) },
      penaltySpotTarget: { x: opponentGoalX - direction * 108, y: PITCH_HEIGHT / 2 },

      // Edge of box positions (rebounds/cutbacks/long shots)
      edgeBox: { x: opponentGoalX - direction * 188, y: PITCH_HEIGHT / 2 },
      edgeBoxLeft: { x: opponentGoalX - direction * 185, y: PITCH_HEIGHT / 2 - 55 },
      edgeBoxRight: { x: opponentGoalX - direction * 185, y: PITCH_HEIGHT / 2 + 55 },

      // Wide runner (creates space, exploits gaps)
      wideRunnerStart: { x: fkPos.x + direction * 50, y: fkPos.y < 300 ? 520 : 80 },
      wideRunnerTarget: { x: opponentGoalX - direction * 95, y: fkPos.y < 300 ? activeConfig.GOAL_Y_BOTTOM - 20 : activeConfig.GOAL_Y_TOP + 20 },

      // Defensive cover (counter-attack prevention)
      defensiveMidfield: [
        { x: PITCH_WIDTH / 2 - direction * 55, y: 215 },
        { x: PITCH_WIDTH / 2 - direction * 55, y: 385 },
        { x: PITCH_WIDTH / 2 - direction * 85, y: PITCH_HEIGHT / 2 }
      ]
    };

    if (!(gameState as any)._fkAttPosManager) (gameState as any)._fkAttPosManager = new PositionManager();
    const posManager = (gameState as any)._fkAttPosManager;

    const setupKey = `_lastFkAttSetup_H${gameState.currentHalf}`;
    if (!(gameState as any)[setupKey] || (gameState as any)[setupKey] !== gameState.setPiece) {
      (gameState as any)[setupKey] = gameState.setPiece;
      posManager.reset();

      const playerJobs = new Map<string, PlayerJobAssignment>();
      const validTeammates = getValidPlayers(teammates).filter(p => p.role !== 'GK');

      const kickers = sortedLists.teammates.bestKickers;
      const headers = sortedLists.teammates.bestHeaders;
      const runners = sortedLists.teammates.fastest;
      const defenders = sortedLists.teammates.bestDefenders;

      const assigned = new Set<string>();

      if (isShootingPosition) {
        // Shooting free kick routine - Direct attempt on goal
        if (kickers[0]) {
          playerJobs.set(String(kickers[0].id), {
            ...ZONES.kicker,
            movement: 'primary_kicker_shoot',
            role: 'PRIMARY_KICKER',
            priority: 10
          });
          assigned.add(String(kickers[0].id));
        }

        // Dummy runner - creates confusion for goalkeeper
        if (runners[0] && !assigned.has(String(runners[0].id))) {
          playerJobs.set(String(runners[0].id), {
            ...ZONES.dummyRunner,
            movement: 'dummy_run',
            role: 'DUMMY_RUNNER',
            runTiming: 'ON_WHISTLE',
            priority: 9
          });
          assigned.add(String(runners[0].id));
        }

        // Second kicker option - variation
        if (kickers[1] && !assigned.has(String(kickers[1].id))) {
          playerJobs.set(String(kickers[1].id), {
            ...ZONES.secondKicker,
            movement: 'second_kicker_option',
            role: 'SECOND_KICKER',
            priority: 9
          });
          assigned.add(String(kickers[1].id));
        }

        // Standing attacker - blocks keeper's view
        const standingPlayer = headers.find(p => !assigned.has(String(p.id)));
        if (standingPlayer) {
          playerJobs.set(String(standingPlayer.id), {
            ...ZONES.standingAttacker,
            movement: 'standing_attacker',
            role: 'STANDING_ATTACKER',
            priority: 8
          });
          assigned.add(String(standingPlayer.id));
        }

        // Near post crasher - rebound opportunity
        if (headers[0] && !assigned.has(String(headers[0].id))) {
          playerJobs.set(String(headers[0].id), {
            ...ZONES.nearPostStart,
            targetX: ZONES.nearPostTarget.x,
            targetY: ZONES.nearPostTarget.y,
            movement: 'near_post_crash',
            role: 'NEAR_POST_RUNNER',
            runTiming: 'ON_KICK',
            priority: 8
          });
          assigned.add(String(headers[0].id));
        }

        // Far post crasher - follow-up
        if (headers[1] && !assigned.has(String(headers[1].id))) {
          playerJobs.set(String(headers[1].id), {
            ...ZONES.farPostStart,
            targetX: ZONES.farPostTarget.x,
            targetY: ZONES.farPostTarget.y,
            movement: 'far_post_crash',
            role: 'FAR_POST_RUNNER',
            runTiming: 'ON_KICK',
            priority: 8
          });
          assigned.add(String(headers[1].id));
        }
      } else {
        // Crossing/playmaking free kick - Deliver into the box
        if (kickers[0]) {
          playerJobs.set(String(kickers[0].id), {
            ...ZONES.kicker,
            movement: 'primary_kicker_cross',
            role: 'PRIMARY_KICKER',
            priority: 10
          });
          assigned.add(String(kickers[0].id));
        }

        // Target striker - central presence
        if (headers[0] && !assigned.has(String(headers[0].id))) {
          const finalPos = posManager.findValidPosition(ZONES.strikerPosition);
          playerJobs.set(String(headers[0].id), {
            ...finalPos,
            movement: 'target_man_fk',
            role: 'TARGET_STRIKER',
            priority: 9
          });
          assigned.add(String(headers[0].id));
        }

        // Near post runner - timing run
        if (runners[0] && !assigned.has(String(runners[0].id))) {
          playerJobs.set(String(runners[0].id), {
            ...ZONES.nearPostStart,
            targetX: ZONES.nearPostTarget.x,
            targetY: ZONES.nearPostTarget.y,
            movement: 'near_post_run_cross',
            role: 'NEAR_POST_RUNNER',
            runTiming: 'ON_KICK',
            priority: 9
          });
          assigned.add(String(runners[0].id));
        }

        // Far post header
        if (headers[1] && !assigned.has(String(headers[1].id))) {
          playerJobs.set(String(headers[1].id), {
            ...ZONES.farPostStart,
            targetX: ZONES.farPostTarget.x,
            targetY: ZONES.farPostTarget.y,
            movement: 'far_post_header',
            role: 'FAR_POST_HEADER',
            runTiming: 'DELAYED',
            priority: 9
          });
          assigned.add(String(headers[1].id));
        }

        // Penalty spot runner
        if (headers[2] && !assigned.has(String(headers[2].id))) {
          playerJobs.set(String(headers[2].id), {
            ...ZONES.penaltySpotStart,
            targetX: ZONES.penaltySpotTarget.x,
            targetY: ZONES.penaltySpotTarget.y,
            movement: 'penalty_spot_run',
            role: 'PENALTY_SPOT',
            runTiming: 'IMMEDIATE',
            priority: 8
          });
          assigned.add(String(headers[2].id));
        }

        // Wide runner - exploit space
        const wideRunner = runners.find(p => !assigned.has(String(p.id)));
        if (wideRunner) {
          playerJobs.set(String(wideRunner.id), {
            ...ZONES.wideRunnerStart,
            targetX: ZONES.wideRunnerTarget.x,
            targetY: ZONES.wideRunnerTarget.y,
            movement: 'wide_runner',
            role: 'WIDE_RUNNER',
            runTiming: 'ON_KICK',
            priority: 7
          });
          assigned.add(String(wideRunner.id));
        }
      }

      // Edge of box positions - three players for rebounds/cutbacks/long shots
      const edgePositions = [ZONES.edgeBox, ZONES.edgeBoxLeft, ZONES.edgeBoxRight];
      const edgePlayers = validTeammates
        .filter(p => !assigned.has(String(p.id)) && (p.role.includes('CM') || p.role.includes('CDM') || p.role.includes('CAM')))
        .slice(0, 3);

      edgePlayers.forEach((edgePlayer, idx) => {
        if (edgePositions[idx]) {
          const finalPos = posManager.findValidPosition(edgePositions[idx]);
          playerJobs.set(String(edgePlayer.id), {
            ...finalPos,
            movement: `edge_box_fk_${idx}`,
            role: `EDGE_BOX_${idx}`,
            priority: 7
          });
          assigned.add(String(edgePlayer.id));
        }
      });

      // Defensive cover - three players for counter-attack prevention
      let defIdx = 0;
      defenders.forEach(def => {
        if (!assigned.has(String(def.id)) && defIdx < ZONES.defensiveMidfield.length) {
          const finalPos = posManager.findValidPosition(ZONES.defensiveMidfield[defIdx]);
          playerJobs.set(String(def.id), {
            ...finalPos,
            movement: 'defensive_cover_fk',
            role: `DEFENSIVE_COVER_${defIdx}`,
            priority: 6
          });
          assigned.add(String(def.id));
          defIdx++;
        }
      });

      // Support players
      let supportIdx = 0;
      validTeammates.forEach(p => {
        if (!assigned.has(String(p.id))) {
          const activePos = getPlayerActivePosition(p, gameState.currentHalf);
          const finalPos = posManager.findValidPosition(activePos);
          playerJobs.set(String(p.id), {
            ...finalPos,
            movement: 'support_fk',
            role: `SUPPORT_${supportIdx}`,
            priority: 5
          });
          supportIdx++;
        }
      });

      (gameState as any)._fkJobAssignments = playerJobs;
    }

    const playerIdStr = String(player.id);
    const myPositionData = (gameState as any)._fkJobAssignments?.get(playerIdStr);

    if (myPositionData) {
      // OFSAYT KONTROLÜ: Free kick hücum pozisyonlarında ofsayt kontrolü yap
      const opponents = getValidPlayers(player.isHome ? gameState.awayPlayers : gameState.homePlayers);
      const adjustedPosition = checkAndAdjustOffsidePosition(
        myPositionData,
        player,
        opponentGoalX,
        opponents,
        gameState
      );
      return sanitizePosition(adjustedPosition, { player, gameState, behavior: 'ProfessionalFreeKickAttacking' });
    }

    const activePos = getPlayerActivePosition(player, gameState.currentHalf);
    return sanitizePosition({ x: activePos.x, y: activePos.y, movement: 'fallback_fk_att' }, { player });
  },

  getDefendingFreeKickPosition(
    player: Player,
    fkPos: Vector2D,
    ownGoalX: number,
    distToGoal: number,
    sortedLists: SortedLists | null,
    opponents: Player[],
    gameState: GameState,
    teammates: Player[]
  ) {
    if (!gameState || !player || !fkPos) {
      return sanitizePosition({ x: player?.x ?? 400, y: player?.y ?? 300, movement: 'error_fk_def' }, { player });
    }

    if (player.role === 'GK') {
      // GK positioning - off-center for visibility
      const offsetY = fkPos.y > 300 ? -20 : 20;
      return sanitizePosition({ x: ownGoalX, y: 300 + offsetY, movement: 'gk_fk_positioning' }, { player });
    }

    const direction = Math.sign(ownGoalX - 400);
    if (!isFinite(direction) || direction === 0) {
      return getRoleBasedFallbackPosition(player.role, { player, gameState });
    }

    const PITCH_WIDTH = GAME_CONFIG.PITCH_WIDTH;
    const PITCH_HEIGHT = GAME_CONFIG.PITCH_HEIGHT;
    const SET_PIECE_TYPES = { FREE_KICK: 'FREE_KICK' };
    const activeConfig = { GOAL_Y_TOP: 225, GOAL_Y_BOTTOM: 375 };

    const isCentral = Math.abs(fkPos.y - 300) < 130;
    const isDangerous = distToGoal < 280;
    const needsWall = isDangerous && isCentral;

    // Calculate professional wall size
    let wallSize = 0;
    if (needsWall) {
      if (distToGoal < 140) wallSize = 6;
      else if (distToGoal < 160) wallSize = 5;
      else if (distToGoal < 180) wallSize = 4;
      else if (distToGoal < 220) wallSize = 3;
      else wallSize = 2;
    }

    if (!sortedLists) sortedLists = getSortedLists(teammates, opponents);

    const ZONES: DefensiveFreeKickZones = {
      // Wall setup zone
      wallBase: { x: fkPos.x, y: fkPos.y },

      // FIXED: Zonal defenders OUTSIDE 6-yard box (professional positioning)
      // 6-yard box is ~55px, so defenders should be 100-110px from goal minimum
      nearPostZone: { x: ownGoalX - direction * 100, y: activeConfig.GOAL_Y_TOP + 45 },
      farPostZone: { x: ownGoalX - direction * 100, y: activeConfig.GOAL_Y_BOTTOM - 45 },
      centralZone: { x: ownGoalX - direction * 110, y: PITCH_HEIGHT / 2 },
      edgeBoxZone: { x: ownGoalX - direction * 180, y: PITCH_HEIGHT / 2 },

      // Press/counter outlets
      pressKicker: { x: fkPos.x + direction * 20, y: fkPos.y },
      counterOutlet: [
        { x: PITCH_WIDTH / 2 - direction * 120, y: 180 },
        { x: PITCH_WIDTH / 2 - direction * 120, y: 420 }
      ]
    };

    if (!(gameState as any)._fkDefPosManager) (gameState as any)._fkDefPosManager = new PositionManager();
    const posManager = (gameState as any)._fkDefPosManager;

    const setupKey = `_lastFkDefSetup_H${gameState.currentHalf}`;
    if (!(gameState as any)[setupKey] || (gameState as any)[setupKey] !== gameState.setPiece) {
      (gameState as any)[setupKey] = gameState.setPiece;
      posManager.reset();

      const playerJobs = new Map<string, PlayerJobAssignment>();
      const validTeammates = getValidPlayers(teammates).filter(p => p.role !== 'GK');
      const validOpponents = getValidPlayers(opponents).filter(p => p.role !== 'GK');

      (gameState as any)._fkOpponentMap = new Map(validOpponents.map(p => [String(p.id), p]));
      (gameState as any)._currentWallSize = wallSize;

      const assigned = new Set<string>();

      // Assign wall players (tallest/strongest)
      if (needsWall) {
        const wallPlayers = [...sortedLists.teammates.bestDefenders]
          .slice(0, wallSize)
          .sort((a, b) => getSafeStat((b as any).stats, 'heading', 70) - getSafeStat((a as any).stats, 'heading', 70));

        wallPlayers.forEach((p, idx) => {
          playerJobs.set(String(p.id), {
            x: 0, // Will be calculated dynamically
            y: 0, // Will be calculated dynamically
            role: `JOB_WALL_${idx}`,
            movement: 'wall_formation',
            wallIndex: idx,
            priority: 10
          });
          assigned.add(String(p.id));
        });
      }

      // Press the kicker if appropriate
      const context = new TacticalContext(gameState, SET_PIECE_TYPES.FREE_KICK);
      const shouldPress = !isDangerous || context.shouldCommitForward(player.isHome);

      if (shouldPress) {
        const presser = sortedLists.teammates.fastest.find(p => !assigned.has(String(p.id)));
        if (presser) {
          const finalPos = posManager.findValidPosition(ZONES.pressKicker);
          playerJobs.set(String(presser.id), {
            ...finalPos,
            movement: 'press_kicker',
            role: 'PRESS_KICKER',
            priority: 9
          });
          assigned.add(String(presser.id));
        }
      }

      // Man-mark dangerous opponents
      const dangerousOpponents = sortedLists.opponents.mostDangerous.slice(0, 3);
      const availableMarkers = validTeammates.filter(p => !assigned.has(String(p.id))).slice(0, 3);

      dangerousOpponents.forEach((opp, idx) => {
        if (availableMarkers[idx]) {
          playerJobs.set(String(availableMarkers[idx].id), {
            x: 0, // Will be calculated dynamically
            y: 0, // Will be calculated dynamically
            role: `JOB_MARK_${opp.id}`,
            movement: 'man_mark_fk',
            targetId: String(opp.id),
            priority: 8
          });
          assigned.add(String(availableMarkers[idx].id));
        }
      });

      // Zonal coverage - REDUCED for dangerous free kicks to avoid crowding
      // For dangerous FKs: Only 1 central zone (wall already covers posts)
      // For non-dangerous: 3 zones for better coverage
      const zonalAssignments = isDangerous
        ? [{ zone: 'centralZone' as const, role: 'CENTRAL_ZONE', priority: 7 }] // Only 1 for dangerous
        : [
            { zone: 'centralZone' as const, role: 'CENTRAL_ZONE', priority: 7 },
            { zone: 'nearPostZone' as const, role: 'NEAR_POST_ZONE', priority: 7 },
            { zone: 'farPostZone' as const, role: 'FAR_POST_ZONE', priority: 7 }
          ];

      zonalAssignments.forEach(assignment => {
        const zonePlayer = validTeammates.find(p => !assigned.has(String(p.id)));
        if (zonePlayer) {
          const finalPos = posManager.findValidPosition(ZONES[assignment.zone]);
          playerJobs.set(String(zonePlayer.id), {
            ...finalPos,
            movement: assignment.zone,
            role: assignment.role,
            priority: assignment.priority
          });
          assigned.add(String(zonePlayer.id));
        }
      });

      // Counter-attack outlets
      let outletIdx = 0;
      sortedLists.teammates.fastest.forEach(fast => {
        if (!assigned.has(String(fast.id)) && outletIdx < 2) {
          const finalPos = posManager.findValidPosition(ZONES.counterOutlet[outletIdx]);
          playerJobs.set(String(fast.id), {
            ...finalPos,
            movement: 'counter_outlet',
            role: `COUNTER_OUTLET_${outletIdx}`,
            priority: 6
          });
          assigned.add(String(fast.id));
          outletIdx++;
        }
      });

      // Remaining players - compact shape
      validTeammates.forEach(p => {
        if (!assigned.has(String(p.id))) {
          // ✅ FIX: Clamp compact position to stay within bounds [10-790]
          const rawX = ownGoalX + direction * 120;
          const clampedX = Math.max(10, Math.min(790, rawX));
          const compactPos = { x: clampedX, y: 300 };
          const finalPos = posManager.findValidPosition(compactPos);
          playerJobs.set(String(p.id), {
            ...finalPos,
            movement: 'compact_shape',
            role: 'COMPACT',
            priority: 5
          });
        }
      });

      (gameState as any)._fkDefJobAssignments = playerJobs;
    }

    const playerIdStr = String(player.id);
    const myPositionData = (gameState as any)._fkDefJobAssignments?.get(playerIdStr);

    if (myPositionData) {
      let finalPos = { ...myPositionData };

      // Dynamic updates
      if (finalPos.role?.startsWith('JOB_WALL_')) {
        finalPos = this.calculateWallPosition(finalPos, wallSize, fkPos, ownGoalX, direction, player, gameState);
      } else if (finalPos.role?.startsWith('JOB_MARK_')) {
        finalPos = this.calculateMarkingPosition(finalPos, direction, (gameState as any)._fkOpponentMap, player, gameState, ownGoalX);
      }

      // Encroachment rule
      const dist = getDistance({ x: finalPos.x, y: finalPos.y }, fkPos);
      if (dist < 92 && !finalPos.role?.startsWith('JOB_WALL_')) {
        const angle = Math.atan2(finalPos.y - fkPos.y, finalPos.x - fkPos.x);
        finalPos.x = fkPos.x + Math.cos(angle) * 92;
        finalPos.y = fkPos.y + Math.sin(angle) * 92;
      }

      return sanitizePosition(finalPos, { player, gameState, behavior: 'ProfessionalFreeKickDefending' });
    }

    const activePos = getPlayerActivePosition(player, gameState.currentHalf);
    return sanitizePosition({ x: activePos.x, y: activePos.y, movement: 'fallback_fk_def' }, { player });
  },

  calculateWallPosition(
    positionData: PlayerJobAssignment,
    wallSize: number,
    fkPos: Vector2D,
    ownGoalX: number,
    direction: number,
    player: Player,
    gameState: GameState
  ) {
    try {
      const roleParts = positionData.role.split('_');
      const wallIndex = positionData.wallIndex ?? (roleParts[2] ? parseInt(roleParts[2]) : 0);
      if (isNaN(wallIndex) || wallSize <= 0) {
        return getRoleBasedFallbackPosition(positionData.role, { player, gameState });
      }

      const PITCH_WIDTH = GAME_CONFIG.PITCH_WIDTH;
      const PITCH_HEIGHT = GAME_CONFIG.PITCH_HEIGHT;
      const activeConfig = { GOAL_Y_TOP: 225, GOAL_Y_BOTTOM: 375 };

      // Calculate wall base position to cover near post
      const wallDistance = 92; // 10 yards
      const angleToNearPost = Math.atan2(activeConfig.GOAL_Y_TOP - fkPos.y, ownGoalX - fkPos.x);
      const angleToFarPost = Math.atan2(activeConfig.GOAL_Y_BOTTOM - fkPos.y, ownGoalX - fkPos.x);

      // Wall covers near post side
      const coverageAngle = angleToNearPost + (angleToFarPost - angleToNearPost) * 0.3;

      let wallBaseX = fkPos.x + Math.cos(coverageAngle) * wallDistance;
      let wallBaseY = fkPos.y + Math.sin(coverageAngle) * wallDistance;

      // CRITICAL FIX: Ensure wall base is between free kick and own goal (not behind goal)
      // Wall should always be positioned BETWEEN the ball and the goal
      if (direction > 0) {
        // Own goal is on right, wall should be left of goal
        wallBaseX = Math.min(wallBaseX, ownGoalX - 20);
      } else {
        // Own goal is on left, wall should be right of goal
        wallBaseX = Math.max(wallBaseX, ownGoalX + 20);
      }

      // Perpendicular spacing
      const wallPerpendicularAngle = coverageAngle + Math.PI / 2;
      const spacing = 18; // Shoulder to shoulder
      const offset = (wallIndex - (wallSize - 1) / 2) * spacing;

      let wallX = wallBaseX + Math.cos(wallPerpendicularAngle) * offset;
      let wallY = wallBaseY + Math.sin(wallPerpendicularAngle) * offset;

      // CRITICAL FIX: Clamp wall positions to pitch bounds BEFORE sanitizePosition
      // This prevents sanitizePosition from clamping and triggering warnings
      wallX = Math.max(10, Math.min(PITCH_WIDTH - 10, wallX));
      wallY = Math.max(10, Math.min(PITCH_HEIGHT - 10, wallY));

      return sanitizePosition({
        x: wallX,
        y: wallY,
        movement: 'wall_positioned',
        role: positionData.role
      }, { player, gameState });
    } catch (error) {
      console.error(`[FreeKick] Error calculating wall position for ${player.name} (${positionData.role}):`, error);
      return getRoleBasedFallbackPosition(positionData.role, { player, gameState });
    }
  },

  calculateMarkingPosition(
    positionData: PlayerJobAssignment,
    direction: number,
    opponentMap: Map<string, Player> | undefined,
    player: Player,
    gameState: GameState,
    ownGoalX: number
  ) {
    try {
      const targetIdStr = positionData.targetId || positionData.role.split('_').pop();
      const target = opponentMap?.get(targetIdStr || '');

      if (target) {
        // Goal-side marking with tight distance
        let markX = target.x - direction * 10;
        let markY = target.y + (Math.random() - 0.5) * 3;

        // CRITICAL FIX: Prevent markers from entering 6-yard box
        // 6-yard box is approximately 55px from goal line
        // Enforce minimum distance of 65px from goal to keep 0-2 players in box (only wall if needed)
        const SIX_YARD_BOX_DISTANCE = 65;
        if (direction < 0) { // Own goal on left, players must be to the right of the line
          const minAllowedX = ownGoalX + SIX_YARD_BOX_DISTANCE;
          markX = Math.max(markX, minAllowedX);
        } else { // Own goal on right, players must be to the left of the line
          const maxAllowedX = ownGoalX - SIX_YARD_BOX_DISTANCE;
          markX = Math.min(markX, maxAllowedX);
        }

        // Also don't get pulled too far forward
        const maxForwardXDistance = 150;
        if (direction < 0) { // Own goal on left
          const maxAllowedX = ownGoalX + maxForwardXDistance;
          markX = Math.min(markX, maxAllowedX);
        } else { // Own goal on right
          const minAllowedX = ownGoalX - maxForwardXDistance;
          markX = Math.max(markX, minAllowedX);
        }

        return sanitizePosition({
          ...positionData,
          x: markX,
          y: markY,
          movement: 'tight_marking'
        }, { player, gameState });
      } else {
        // Target lost - drop into central zone (also outside 6-yard box)
        return sanitizePosition({
          x: ownGoalX + direction * 100,
          y: 300,
          movement: 'zone_fallback',
          role: 'ZONE_FALLBACK'
        }, { player, gameState });
      }
    } catch (error) {
      console.error(`[FreeKick] Error calculating marking position for ${player.name} (${positionData.role}):`, error);
      return getRoleBasedFallbackPosition(positionData.role, { player, gameState });
    }
  }
};

