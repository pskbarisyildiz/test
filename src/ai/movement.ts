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

import type { Player, Vector2D, PlayerRole } from '../types';
import { distance, pointToLineDistance } from '../utils/math';
import { getAttackingGoalX } from '../utils/ui';
import { shouldAvoidOffside } from '../rules/offside';
import { updateGoalkeeperAI_Advanced } from '../ai/goalkeeper';
import { BehaviorSystem } from '../behavior/BehaviorSystem';
import { gameState } from '../globalExports';
import { GAME_CONFIG, TACTICS, POSITION_CONFIGS } from '../config';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Safe distance calculation wrapper
 */
function getDistance(p1: Vector2D | Player, p2: Vector2D | Player): number {
  return distance(p1, p2);
}

// Wrapper functions removed - now using direct ES6 imports

// ============================================================================
// POSITION CONFIGURATION
// ============================================================================

/**
 * Get position configuration for a role
 */
export function getPositionConfig(role: string): PositionConfig {
  // Using imported POSITION_CONFIGS from config
  const normalizedRole = role.toUpperCase() as PlayerRole;
  return POSITION_CONFIGS[normalizedRole] || {
    defensiveness: 0.5,
    attackRange: 0.5,
    ballChasePriority: 0.5,
    idealWidth: 0.2,
    pushUpOnAttack: 60
  };
}

// ============================================================================
// POSITIONAL CALCULATION
// ============================================================================

/**
 * Get player's active position based on half, ball position, and team state
 *
 * Accounts for:
 * - Half-time orientation flip
 * - Ball influence on positioning
 * - Tactical shifts based on team state
 */
export function getPlayerActivePosition(player: Player, currentHalf: number): Vector2D {
  // Using imported gameState from globalExports
  // Using imported GAME_CONFIG from config

  // 1. STEP: Get base "home" position
  let homeX = player.homeX ?? 400;
  let homeY = player.homeY ?? 300;
  const pitchWidth = GAME_CONFIG.PITCH_WIDTH;
  const pitchHeight = GAME_CONFIG.PITCH_HEIGHT;

  // 2. STEP: APPLY HALF-TIME FLIP IMMEDIATELY
  // 'activeX' and 'activeY' are now the player's base position in this half
  let activeX = (currentHalf === 2) ? (pitchWidth - homeX) : homeX;
  let activeY = homeY;

  // 3. STEP: Calculate ball influence and tactical shifts FROM THIS NEW 'activeX' AND 'activeY'
  const ballShiftFactor = 0.15;
  const shiftX = (gameState.ballPosition.x - (pitchWidth / 2)) * ballShiftFactor;
  const shiftY = (gameState.ballPosition.y - (pitchHeight / 2)) * ballShiftFactor;

  // Apply ball shift to 'activeX' and 'activeY' (not erroneous 'homeX')
  if (!['GK', 'CB', 'LB', 'RB'].includes(player.role)) {
    activeX += shiftX * Math.min(1, Math.abs(activeX - (pitchWidth / 2)) / (pitchWidth / 4));
    activeY += shiftY;
  }

  // Calculate tactical shifts from 'activeX'
  const isMidfielder = ['CDM', 'CM', 'CAM', 'RM', 'LM'].includes(player.role);
  if (isMidfielder) {
    const teamState = player.isHome ? gameState.homeTeamState : gameState.awayTeamState;
    const opponentGoalX = getAttackingGoalX(player.isHome, currentHalf);
    const ownGoalX = getAttackingGoalX(!player.isHome, currentHalf);

    if (teamState === 'ATTACKING' || teamState === 'COUNTER_ATTACK') {
      const pushFactor = (teamState === 'ATTACKING') ? 80 : 100;
      const direction = Math.sign(opponentGoalX - activeX) || 1;
      activeX += direction * pushFactor;
    }
    else if (teamState === 'DEFENDING' || teamState === 'HIGH_PRESS') {
      const pullFactor = (teamState === 'DEFENDING') ? 70 : 50;
      const direction = Math.sign(ownGoalX - activeX) || 1;
      activeX += direction * pullFactor;
    }
  }

  // 4. STEP: Constrain and return results
  activeX = Math.max(10, Math.min(pitchWidth - 10, activeX));
  activeY = Math.max(10, Math.min(pitchHeight - 10, activeY));

  return { x: activeX, y: activeY };
}

/**
 * Get zone boundaries for a player based on role and team state
 */
export function getZoneForPlayer(
  player: Player,
  _activePosition: Vector2D,
  teamState: TeamState
): Zone {
  const { role, isHome } = player;

  // Field dimensions and key points
  const FIELD_WIDTH = 800;
  const FIELD_HEIGHT = 600;
  const HALF_WAY_LINE = FIELD_WIDTH / 2;

  // Team-oriented coordinates
  const ownGoalLine = isHome ? 0 : FIELD_WIDTH;
  const opponentGoalLine = isHome ? FIELD_WIDTH : 0;

  // Penalty area boundaries (approximate values)
  const ownPenaltyAreaX = isHome ? 130 : FIELD_WIDTH - 130;
  const oppPenaltyAreaX = isHome ? FIELD_WIDTH - 130 : 130;

  let zone: Zone = { x1: 0, y1: 0, x2: FIELD_WIDTH, y2: FIELD_HEIGHT }; // Default

  // Vertical corridors (Wings and Center)
  const leftWingY = { y1: 0, y2: 180 };
  const leftCenterY = { y1: 180, y2: 300 };
  const rightCenterY = { y1: 300, y2: 420 };
  const rightWingY = { y1: 420, y2: 600 };
  const centralCorridorY = { y1: 180, y2: 420 };

  // Zone assignment by position
  switch (role) {
    // --- DEFENSE ---
    case 'LB':
    case 'RB':
      const wingY = role === 'LB' ? leftWingY : rightWingY;
      if (teamState === 'ATTACKING') {
        zone = { x1: HALF_WAY_LINE - 100, x2: oppPenaltyAreaX, ...wingY };
      } else {
        zone = { x1: ownGoalLine, x2: HALF_WAY_LINE, ...wingY };
      }
      break;

    case 'LCB':
    case 'RCB':
    case 'CB':
      const centerBackY = role === 'LCB' ? leftCenterY : role === 'RCB' ? rightCenterY : centralCorridorY;
      if (teamState === 'ATTACKING') {
        const forwardLimit = isHome ? HALF_WAY_LINE + 100 : HALF_WAY_LINE - 100;
        zone = { x1: ownPenaltyAreaX, x2: forwardLimit, ...centerBackY };
      } else {
        zone = { x1: ownGoalLine, x2: HALF_WAY_LINE, ...centerBackY };
      }
      break;

    // --- MIDFIELD ---
    case 'CDM':
    case 'CM':
    case 'LCM':
    case 'RCM':
      const midY = role.includes('L') ? leftCenterY : role.includes('R') ? rightCenterY : centralCorridorY;
      zone = { x1: ownPenaltyAreaX, x2: oppPenaltyAreaX, ...midY };
      break;

    case 'CAM':
      zone = { x1: HALF_WAY_LINE - 150, x2: oppPenaltyAreaX + 20, ...centralCorridorY };
      break;

    // --- WINGS ---
    case 'LM':
    case 'RM':
      const wideMidY = role === 'LM' ? leftWingY : rightWingY;
      if (teamState === 'ATTACKING') {
        zone = { x1: ownPenaltyAreaX, x2: oppPenaltyAreaX, ...wideMidY };
      } else {
        zone = { x1: ownGoalLine + 100, x2: HALF_WAY_LINE + 150, ...wideMidY };
      }
      break;

    case 'LW':
    case 'RW':
      const wingerY = role === 'LW' ? leftWingY : rightWingY;
      zone = { x1: HALF_WAY_LINE - 100, x2: opponentGoalLine, ...wingerY };
      if (teamState === 'DEFENDING') {
        zone.x1 = isHome ? zone.x1 - 150 : zone.x1 + 150;
      }
      break;

    // --- FORWARDS ---
    case 'ST':
    case 'CF':
      zone = { x1: HALF_WAY_LINE, x2: opponentGoalLine, ...centralCorridorY };
      if (teamState === 'DEFENDING') {
        const retreatX = isHome ? HALF_WAY_LINE - 150 : HALF_WAY_LINE + 150;
        zone = { x1: retreatX, x2: opponentGoalLine, ...centralCorridorY };
      }
      break;

    // --- GOALKEEPER ---
    case 'GK':
      const gkWidth = 160;
      const gkHeight = 400;
      zone = {
        x1: isHome ? ownGoalLine : ownGoalLine - gkWidth,
        x2: isHome ? ownGoalLine + gkWidth : ownGoalLine,
        y1: (FIELD_HEIGHT - gkHeight) / 2,
        y2: (FIELD_HEIGHT + gkHeight) / 2
      };
      break;
  }

  return zone;
}

// ============================================================================
// DEFENSIVE THREAT ASSESSMENT
// ============================================================================

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
export function assessDefensiveThreats(
  defendingPlayer: Player,
  opponents: Player[],
  ownGoalX: number
): ThreatAssessment[] {
  // Using imported gameState from globalExports
  const ballCarrier = gameState.ballHolder;

  return opponents.map(opponent => {
    if (opponent.role === 'GK') return { player: opponent, score: 0 };

    const distToGoal = Math.abs(opponent.x - ownGoalX);
    const distToDefender = getDistance(defendingPlayer, opponent);
    const role = opponent.role;
    let score = 0;

    // Role-based threat bonus
    if (role === 'ST' || role === 'CF') {
      score += 80; // Highest priority
    } else if (role === 'LW' || role === 'RW') {
      score += 70; // High priority wing threats
    } else if (role === 'CAM') {
      score += 50; // Offensive midfielder
    }

    // 1. Proximity to goal is biggest factor
    if (distToGoal < 400) {
      score += (400 - distToGoal) * 0.6;
    }

    // 2. Ball possession makes them primary threat
    if (ballCarrier && ballCarrier.id === opponent.id) {
      score += 200;
    }

    // 3. Central, dangerous position
    const angleToGoal = Math.abs(opponent.y - 300);
    if (angleToGoal < 150) {
      score += (150 - angleToGoal) * 0.3;
    }

    // 4. Pass reception potential (open space)
    const teammates = defendingPlayer.isHome ? gameState.homePlayers : gameState.awayPlayers;
    const nearbyDefenders = teammates.filter(d => getDistance(d, opponent) < 60);
    if (nearbyDefenders.length <= 1) {
      score += 50; // Unmarked bonus
    }

    // 5. Closer to defender makes them more urgent responsibility
    score -= distToDefender * 0.15;

    return { player: opponent, score: Math.max(0, score) };
  }).sort((a, b) => b.score - a.score);
}

/**
 * Find most dangerous attacker to mark
 *
 * Prioritizes based on marker's role and threat zones
 */
export function findMostDangerousAttacker(
  player: Player,
  threats: ThreatAssessment[],
  playerZone: Zone
): Player | null {
  const markerRole = player.role;
  let primaryTargetRoles: string[] = [];
  let secondaryTargetRoles: string[] = [];
  let bestThreat: ThreatAssessment | null = null;

  // 1. Determine priority targets based on defender's role
  switch (markerRole) {
    // --- DEFENSE LINE ---
    case 'LB':
      primaryTargetRoles = ['RW', 'RM', 'RWB'];
      secondaryTargetRoles = ['ST', 'CF', 'CAM'];
      break;
    case 'RB':
      primaryTargetRoles = ['LW', 'LM', 'LWB'];
      secondaryTargetRoles = ['ST', 'CF', 'CAM'];
      break;
    case 'CB':
    case 'LCB':
    case 'RCB':
      primaryTargetRoles = ['ST', 'CF'];
      secondaryTargetRoles = ['CAM', 'CM'];
      break;

    // --- MIDFIELD AND WING FORWARD LINE ---
    case 'CDM':
      primaryTargetRoles = ['CAM', 'CF'];
      secondaryTargetRoles = ['CM'];
      break;
    case 'LM':
    case 'LW':
      primaryTargetRoles = ['RB', 'RWB', 'RM'];
      secondaryTargetRoles = ['CM'];
      break;
    case 'RM':
    case 'RW':
      primaryTargetRoles = ['LB', 'LWB', 'LM'];
      secondaryTargetRoles = ['CM'];
      break;
    case 'CM':
      primaryTargetRoles = ['CM', 'CAM'];
      secondaryTargetRoles = ['CDM'];
      break;
    case 'CAM':
      primaryTargetRoles = ['CDM'];
      secondaryTargetRoles = ['CB'];
      break;

    // --- FRONT PRESS ---
    case 'ST':
    case 'CF':
      primaryTargetRoles = ['CB', 'LCB', 'RCB'];
      secondaryTargetRoles = ['GK', 'CDM'];
      break;
    default:
      primaryTargetRoles = [];
      secondaryTargetRoles = [];
      break;
  }

  // 2. Search primary targets
  if (primaryTargetRoles.length > 0) {
    const primaryThreats = threats.filter(t => primaryTargetRoles.includes(t.player.role));
    if (primaryThreats.length > 0) {
      bestThreat = primaryThreats.sort((a, b) => b.score - a.score)[0] || null;
      if (bestThreat && bestThreat.score > 30) {
        return bestThreat.player;
      }
    }
  }

  // 3. Search secondary targets
  if (secondaryTargetRoles.length > 0) {
    const secondaryThreats = threats.filter(t => secondaryTargetRoles.includes(t.player.role));
    if (secondaryThreats.length > 0) {
      bestThreat = secondaryThreats.sort((a, b) => b.score - a.score)[0] || null;
      if (bestThreat && bestThreat.score > 50) {
        return bestThreat.player;
      }
    }
  }

  // 4. Zonal emergency
  const threatsInZone = threats.filter(t =>
    t.player.x > playerZone.x1 && t.player.x < playerZone.x2 &&
    t.player.y > playerZone.y1 && t.player.y < playerZone.y2
  );
  if (threatsInZone.length > 0 && threatsInZone[0]!.score > 100) {
    return threatsInZone[0]!.player;
  }

  // 5. No target found
  return null;
}

/**
 * Calculate optimal marking position
 *
 * @param marker - Marking player
 * @param target - Player being marked
 * @param ownGoalX - Own goal X coordinate
 * @param tightness - Marking tightness ('goal_side' or 'tight')
 */
export function calculateOptimalMarkingPosition(
  marker: Player,
  target: Player,
  ownGoalX: number,
  tightness: MarkingTightness = 'goal_side'
): Vector2D {
  const goalCenterY = 300;

  // TIGHT MARKING LOGIC
  if (tightness === 'tight') {
    // Stand fixed distance (25 units) close to target (goal side)
    const fixedDistance = 25;

    // Find angle between target and goal center
    const angleToGoal = Math.atan2(goalCenterY - target.y, ownGoalX - target.x);

    const markingPointX = target.x + Math.cos(angleToGoal) * fixedDistance;
    const markingPointY = target.y + Math.sin(angleToGoal) * fixedDistance;

    return { x: markingPointX, y: markingPointY };
  }

  // OLD LOGIC ('goal_side' or default):
  // Stand on line between target and goal (proportional distance)
  const vectorX = ownGoalX - target.x;
  const vectorY = goalCenterY - target.y;

  // Make CB ratio tighter
  const distanceRatio = (marker.role === 'CB') ? 0.08 : 0.12; // Was 0.10 / 0.15

  const markingPointX = target.x + vectorX * distanceRatio;
  const markingPointY = target.y + vectorY * distanceRatio;

  return { x: markingPointX, y: markingPointY };
}

// ============================================================================
// MAIN TACTICAL POSITIONING
// ============================================================================

/**
 * Update player's tactical position
 *
 * Main entry point for AI movement system
 */
export function updateTacticalPosition(
  player: Player,
  ball: Vector2D,
  _teammates: Player[],
  opponents: Player[]
): void {
  // Using imported gameState from globalExports

  // Fix: AI Conflict Prevention
  // If status is not 'playing' (e.g. 'FREE_KICK', 'CORNER_KICK' etc.)
  // and player is not locked by 'SetPieceIntegration',
  // prevent this function (tactical positioning) from running
  if (gameState.status !== 'playing') {
    player.targetX = player.x;
    player.targetY = player.y;
    player.speedBoost = 1.0;
    return; // Don't run tactical AI
  }

  // Using imported TACTICS from config
  const tactic = TACTICS[player.isHome ? gameState.homeTactic : gameState.awayTactic] || {};
  const teamState = player.isHome ? gameState.homeTeamState : gameState.awayTeamState;
  const activePosition = getPlayerActivePosition(player, gameState.currentHalf);
  const teamHasBall = gameState.ballHolder && gameState.ballHolder.isHome === player.isHome;
  const opponentHasBall = gameState.ballHolder && gameState.ballHolder.isHome !== player.isHome;

  const ownGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);

  // Goalkeeper uses advanced AI
  if (player.role === 'GK') {
    updateGoalkeeperAI_Advanced(player, ball, opponents);
    return;
  }

  // Ball chasers go straight to ball
  if (gameState.ballChasers.has(player)) {
    player.targetX = ball.x;
    player.targetY = ball.y;
    player.targetLocked = true;
    player.targetLockTime = Date.now();
    return;
  }

  // Check if target should be maintained
  const now = Date.now();
  const distToTarget = Math.sqrt(
    Math.pow(player.targetX - player.x, 2) +
    Math.pow(player.targetY - player.y, 2)
  );

  if (player.targetLocked && now - (player.targetLockTime || 0) < 1500) {
    if (distToTarget > 20) {
      return;
    }
  }

  // Default values
  let targetX = activePosition.x;
  let targetY = activePosition.y;
  let shouldLockTarget = false;

  // DEFENSIVE LOGIC
  if (opponentHasBall) {
    const markingResult = applyMarkingAndPressing(player, ball, opponents, activePosition, ownGoalX, tactic, teamState);
    if (markingResult.shouldMark) {
      targetX = markingResult.x;
      targetY = markingResult.y;
      player.speedBoost = 1.2;
      shouldLockTarget = true;
    } else if (markingResult.shouldPress) {
      targetX = markingResult.x;
      targetY = markingResult.y;
      player.speedBoost = teamState === 'HIGH_PRESS' ? 1.4 : 1.3;
      shouldLockTarget = true;
    } else {
      ({ x: targetX, y: targetY } = applyDefensivePositioning(player, ball, tactic, activePosition, ownGoalX, teamState));
    }

    // ATTACKING LOGIC - NEW INTEGRATION
  } else if (teamHasBall && gameState.ballHolder) {
    // Use BehaviorSystem for advanced attacking behaviors
    if (BehaviorSystem) {
      const phase = BehaviorSystem.detectGamePhase?.(gameState) || 'attacking';
      const tacticName = player.isHome ? gameState.homeTactic : gameState.awayTactic;
      const tacticalSystem = BehaviorSystem.getTacticalSystemType?.(tacticName) || 'balanced';

      const advancedBehavior = BehaviorSystem.selectPlayerBehavior?.(
        player,
        gameState,
        phase,
        tacticalSystem
      );

      if (advancedBehavior) {
        targetX = advancedBehavior.target.x;
        targetY = advancedBehavior.target.y;
        player.speedBoost = advancedBehavior.speedMultiplier;
        shouldLockTarget = advancedBehavior.shouldLock;
        player.currentBehavior = advancedBehavior.description;
      } else {
        // No behavior from system, return to formation
        targetX = activePosition.x;
        targetY = activePosition.y;
        player.speedBoost = 1.0;
        player.currentBehavior = 'holding_shape';
      }
    } else {
      // Fallback if BehaviorSystem not available
      targetX = activePosition.x;
      targetY = activePosition.y;
      player.speedBoost = 1.0;
    }

  } else {
    // Ball is loose
    const verticalInfluence = (ball.y - 300) * 0.15;
    targetX = activePosition.x;
    targetY = activePosition.y + verticalInfluence;
    player.speedBoost = 1.0;
  }

  // Apply soft anti-clustering if not locked
  // Note: applySoftAntiClustering is not implemented - removed dead code

  // CB OVERFLOW LOGIC (preserve formation discipline)
  if (player.role === 'CB' || player.role === 'LCB' || player.role === 'RCB') {
    const MAX_CB_ADVANCE_DISTANCE = 470;
    const halfwayLine = 400;

    if (ownGoalX < halfwayLine) {
      const redLine = ownGoalX + MAX_CB_ADVANCE_DISTANCE;
      if (targetX > redLine) {
        targetX = redLine;
      }
    } else {
      const redLine = ownGoalX - MAX_CB_ADVANCE_DISTANCE;
      if (targetX < redLine) {
        targetX = redLine;
      }
    }
  }

  // Constrain to field bounds
  targetX = Math.max(50, Math.min(750, targetX));
  targetY = Math.max(50, Math.min(550, targetY));

  player.targetX = targetX;
  player.targetY = targetY;

  if (shouldLockTarget) {
    player.targetLocked = true;
    player.targetLockTime = now;
  } else {
    if (distToTarget < 15) {
      player.targetLocked = false;
    }
  }
}

/**
 * Apply marking and pressing logic
 */
export function applyMarkingAndPressing(
  player: Player,
  _ball: Vector2D,
  opponents: Player[],
  activePosition: Vector2D,
  ownGoalX: number,
  tactic: any,
  teamState: TeamState
): MarkingResult {
  // Using imported gameState from globalExports
  const ballCarrier = gameState.ballHolder;
  if (!ballCarrier) return { shouldMark: false, shouldPress: false, x: activePosition.x, y: activePosition.y };

  // 1. THREAT ANALYSIS
  const playerZone = getZoneForPlayer(player, activePosition, teamState);
  const allThreats = assessDefensiveThreats(player, opponents, ownGoalX);
  const primaryThreat = findMostDangerousAttacker(player, allThreats, playerZone);

  const distToBallCarrier = getDistance(player, ballCarrier);

  // 2. PRESS DECISION
  const pressDistance = (teamState === 'HIGH_PRESS') ? 120 : ((tactic.pressIntensity || 0) > 0.7 ? 100 : 80);
  const teammates = player.isHome ? gameState.homePlayers : gameState.awayPlayers;
  const allDefenders = teammates.filter(p => p.id !== player.id && p.role !== 'GK');
  const isClosestDefender = !allDefenders.some(p => getDistance(p, ballCarrier) < distToBallCarrier);

  if (distToBallCarrier < pressDistance && isClosestDefender) {
    const targetX = ballCarrier.x + (ballCarrier.vx || 0) * 0.2;
    const targetY = ballCarrier.y + (ballCarrier.vy || 0) * 0.2;
    return { shouldMark: false, shouldPress: true, x: targetX, y: targetY };
  }

  // 3. MARKING DECISION (IMPROVED)
  if (primaryThreat) {
    const distToGoal = Math.abs(primaryThreat.x - ownGoalX);

    // Danger zone = closer than 180 pixels (~16 meters) to goal
    const inDangerZone = distToGoal < 180;

    // If threat in danger zone AND player is a defender, use 'tight' marking
    const tightness: MarkingTightness = (inDangerZone && ['CB', 'RB', 'LB'].includes(player.role))
      ? 'tight'
      : 'goal_side';

    const { x, y } = calculateOptimalMarkingPosition(player, primaryThreat, ownGoalX, tightness);

    return { shouldMark: true, shouldPress: false, x, y };
  }

  // 5. ZONAL DEFENSE (Default):
  const { x, y } = applyDefensivePositioning(player, gameState.ballPosition, tactic, activePosition, ownGoalX, teamState);
  return { shouldMark: false, shouldPress: false, x, y };
}

/**
 * Apply defensive positioning logic
 */
export function applyDefensivePositioning(
  player: Player,
  ball: Vector2D,
  _tactic: any,
  activePosition: Vector2D,
  ownGoalX: number,
  teamState: TeamState
): MovementResult {
  // Using imported gameState from globalExports
  const ballDistToOwnGoal = Math.abs(ball.x - ownGoalX);
  const ballSideY = ball.y;
  const playerSideY = player.y;
  const isBallOnFarSide = Math.abs(ballSideY - playerSideY) > 300;
  const horizontalShift = (ball.y - 300) * 0.25;
  const compression = teamState === 'DEFENDING' ? 0.6 : 0.7;

  let targetX = activePosition.x;
  let targetY = activePosition.y;

  // --- 1. Depth Adjustment (All roles) ---
  const retreatModifier = teamState === 'DEFENDING' ? 1.3 : 1.0;
  if (ballDistToOwnGoal < 300) {
    const retreatAmount = ((300 - ballDistToOwnGoal) / 3) * retreatModifier;
    const direction = ownGoalX < 400 ? -1 : 1;
    targetX = activePosition.x + direction * retreatAmount;
  }

  // --- 2. Horizontal Shift and Compactness (Role-based) ---
  const playerRole = player.role;

  // NEW: CB GAP DYNAMIC FILLING
  // This block runs BEFORE "Weak Side" logic
  if (['RB', 'LB'].includes(playerRole)) {
    const teammates = player.isHome ? gameState.homePlayers : gameState.awayPlayers;
    const centralDefenders = teammates.filter(p => p.role === 'CB' || p.role === 'LCB' || p.role === 'RCB');

    const myNearestCB = centralDefenders.sort((a, b) => getDistance(a, player) - getDistance(b, player))[0];

    if (myNearestCB) {
      const cbHomeX = getPlayerActivePosition(myNearestCB, gameState.currentHalf).x;
      const cbCurrentX = myNearestCB.x;

      const cbDisplacement = Math.abs(cbCurrentX - cbHomeX);

      if (cbDisplacement > 100) {
        const isRB = playerRole === 'RB';
        targetX = cbHomeX + (isRB ? -30 : 30);
        targetY = 300 + (isRB ? -60 : 60);

        player.speedBoost = 1.3;
        return { x: targetX, y: targetY };
      }
    }
  }

  // Weak side fullback logic
  if (['RB', 'LB'].includes(playerRole) && isBallOnFarSide) {
    const teammates = player.isHome ? gameState.homePlayers : gameState.awayPlayers;
    const centerBacks = teammates.filter(p => p.role === 'CB');
    if (centerBacks.length > 0) {
      const nearestCB = centerBacks.sort((a, b) => getDistance(a, player) - getDistance(b, player))[0];
      if (nearestCB) {
        targetX = nearestCB.x + (playerRole === 'RB' ? -30 : 30);
      }
    }
    targetY = 300 + (playerRole === 'RB' ? -50 : 50);

  } else if (['RM', 'LM', 'RW', 'LW'].includes(playerRole)) {
    const isRightSided = playerRole === 'RM' || playerRole === 'RW';

    if (isBallOnFarSide) {
      targetX = activePosition.x + (ownGoalX > 400 ? -30 : 30);
      targetY = 300 + (isRightSided ? -80 : 80);
    } else {
      targetY = activePosition.y + horizontalShift * 1.5;
      const direction = ownGoalX < 400 ? 1 : -1;
      targetX = activePosition.x + (direction * 50);
    }

  } else if (['CB', 'CDM', 'CM'].includes(playerRole)) {
    targetY = activePosition.y + horizontalShift;
    targetY = 300 + (targetY - 300) * compression;

  } else if (playerRole === 'CAM') {
    const direction = ownGoalX < 400 ? 1 : -1;
    targetX = (activePosition.x + (direction * 100));
    targetY = 300 + (ball.y - 300) * 0.3;

  } else {
    targetY = activePosition.y + horizontalShift;
  }

  return { x: targetX, y: targetY };
}

/**
 * Apply attacking movement patterns
 */
export function applyAttackingMovement(
  player: Player,
  holder: Player,
  teammates: Player[],
  activePosition: Vector2D,
  opponentGoalX: number,
  _teamState: TeamState
): MovementResult {
  // Using imported gameState from globalExports
  const opponents = player.isHome ? gameState.awayPlayers : gameState.homePlayers;
  const direction = Math.sign(opponentGoalX - player.x) || 1;
  const ballOnOtherSide = (holder.y > 300 && player.y < 300) || (holder.y < 300 && player.y > 300);

  // Avoid offside trap
  if (shouldAvoidOffside(player, gameState.ballPosition, opponents)) {
    return {
      x: player.x - direction * 20,
      y: player.y,
      speedBoost: 0.9,
      shouldLock: true
    };
  }

  // Far side wingers cut inside
  if (['LW', 'RW'].includes(player.role) && ballOnOtherSide && getDistance(holder, player) > 150) {
    return {
      x: opponentGoalX - direction * 60,
      y: 300 + (player.y < 300 ? 50 : -50),
      speedBoost: 1.3,
      shouldLock: true
    };
  }

  // Fullback overlap
  if (['RB', 'LB'].includes(player.role)) {
    const wingerOnMySide = teammates.find(t =>
      (player.role === 'RB' && t.role === 'RW') || (player.role === 'LB' && t.role === 'LW')
    );
    if (wingerOnMySide && Math.abs(wingerOnMySide.y - 300) < 100) {
      return {
        x: activePosition.x + direction * 100,
        y: activePosition.y,
        speedBoost: 1.25,
        shouldLock: true
      };
    }
  }

  // Winger cutting inside with ball
  if (holder.id === player.id && ['LW', 'RW', 'LM', 'RM'].includes(player.role)) {
    const goalCenterY = 300;
    const targetX = player.x + direction * 70;
    const targetY = player.y + Math.sign(goalCenterY - player.y) * 40;
    return { x: targetX, y: targetY, speedBoost: 1.1, shouldLock: false };
  }

  const runOptions: Array<{ type: string; target: Vector2D; score: number }> = [];
  const holderUnderPressure = opponents.some(o => getDistance(o, holder) < 70);

  // 1. SUPPORT RUN (priority when teammate under pressure)
  if (holderUnderPressure) {
    const supportTarget = {
      x: holder.x - direction * 60,
      y: holder.y + (player.y < 300 ? -70 : 70)
    };
    const supportSpace = Math.min(...opponents.map(o => getDistance(o, supportTarget)));
    runOptions.push({ type: 'SUPPORT', target: supportTarget, score: supportSpace + 40 });
  }

  // 2. THROUGH BALL RUN (forwards and wingers)
  if (['ST', 'RW', 'LW', 'CAM'].includes(player.role)) {
    const lastDefender = opponents
      .filter(o => o.role !== 'GK')
      .sort((a, b) => direction * (b.x - a.x))[0];

    if (lastDefender) {
      const runTargetX = lastDefender.x + direction * 25;
      const runTargetY = activePosition.y; // Use active position Y to prevent oscillation
      const runTarget = { x: runTargetX, y: runTargetY };

      const spaceRating = Math.min(...opponents.map(o => getDistance(o, runTarget)));
      const pathClear = !opponents.some(o => pointToLineDistance(o, holder, runTarget) < 25);

      if (pathClear) {
        runOptions.push({ type: 'THROUGH', target: runTarget, score: spaceRating * 1.2 + (player.passing / 100 * 20) });
      }
    }
  }

  // 3. SPACE RUN (default forward movement)
  const spaceRunTarget = { x: activePosition.x + direction * 70, y: activePosition.y };
  const spaceRating = Math.min(...opponents.map(o => getDistance(o, spaceRunTarget)));
  runOptions.push({ type: 'SPACE', target: spaceRunTarget, score: spaceRating });

  // Choose best run option
  const bestRun = runOptions.sort((a, b) => b.score - a.score)[0];

  let finalMove: MovementResult = { x: activePosition.x, y: activePosition.y, speedBoost: 1.0, shouldLock: false };

  if (bestRun && bestRun.score > 50) {
    finalMove = {
      x: bestRun.target.x,
      y: bestRun.target.y,
      speedBoost: (bestRun.type === 'THROUGH') ? 1.4 : 1.15,
      shouldLock: true
    };
  }

  // CM - ST distance control (prevent clustering)
  if (player.role === 'CM' || player.role === 'CAM') {
    const striker = teammates.find(t => t.role === 'ST');
    if (striker) {
      const distToStriker = getDistance({ x: finalMove.x, y: finalMove.y }, striker);
      if (distToStriker < 80) {
        const angleAwayFromStriker = Math.atan2(finalMove.y - striker.y, finalMove.x - striker.x);
        finalMove.x += Math.cos(angleAwayFromStriker) * 20;
        finalMove.y += Math.sin(angleAwayFromStriker) * 20;
      }
    }
  }

  return finalMove;
}

