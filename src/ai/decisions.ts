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
import { distance } from '../utils/math';
import { canPlayerActOnBall } from './playerFirstTouch';
import { getAttackingGoalX, getValidStat, isSetPieceStatus, calculateXG } from '../utils/ui';
import { recordOffsidePositions } from '../rules/offside';
import { getPlayerFacingDirection, findBestPassOption_WithVision } from './playerVision';
import { handleShotAttempt } from '../main';
import { gameState } from '../globalExports';
import { GAME_CONFIG, PHYSICS } from '../config';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ThroughBallOpportunity {
  target: Player;
  targetPos: Vector2D;
  isThroughBall: true;
}

interface RealStats {
  dribblesSucceeded?: number;
  dispossessed?: number;
  duelWonPercent?: number;
  passAccuracy?: number;
  longBallAccuracy?: number;
  chancesCreated?: number;
  xA?: number;
  [key: string]: any;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Safe distance calculation wrapper
 */
function getDistance(p1: Vector2D | Player, p2: Vector2D | Player): number {
  return distance(p1, p2);
}

// getAttackingGoalX, getValidStat, isSetPieceStatus, recordOffsidePositions, and getPlayerFacingDirection
// are now imported from their respective modules

// ============================================================================
// TEAM STATISTICS
// ============================================================================

/**
 * Calculate average dribbling skill for a team
 */
export function calculateAvgDribbling(teamPlayers: Player[]): number {
  if (teamPlayers.length === 0) return 0;
  return teamPlayers.reduce((sum, p) => sum + p.dribbling, 0) / teamPlayers.length;
}

// ============================================================================
// BALL PASSING MECHANICS
// ============================================================================

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
export function passBall(
  passingPlayer: Player | null,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  passQuality: number = 0.7,
  speed: number = 400,
  isShot: boolean = false
): void {
  // Using imported gameState from globalExports

  if (passingPlayer && !isShot) {
    // --- 1. STATS: PASS ATTEMPTED ---
    const teamStats = passingPlayer.isHome ? gameState.stats.home : gameState.stats.away;
    teamStats.passesAttempted++;

    // --- 2. STATS: SET UP FOR PASS COMPLETION ---
    // We set this so we know who passed it when it's received
    gameState.lastTouchedBy = passingPlayer;

    // Offside logic
    const isSetPiece = isSetPieceStatus(gameState.status);

    if (!isShot && (gameState.status === 'playing' || isSetPiece)) {
      const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
      recordOffsidePositions(passingPlayer, allPlayers);
    }
  } else if (passingPlayer && isShot) {
    // Also track who shot the ball for rebounds/saves
    gameState.lastTouchedBy = passingPlayer;
  }

  const dist = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
  const duration = (dist / speed) * 1000;
  let maxHeight = 0;
  let passType: 'ground' | 'aerial' | 'shot' = 'ground';

  // Using imported PHYSICS from config
  const LONG_PASS_THRESHOLD = (PHYSICS as any).LONG_PASS_THRESHOLD ?? 150;

  if (isShot) {
    maxHeight = 0.6;
    passType = 'shot';
  } else if (dist > LONG_PASS_THRESHOLD) {
    maxHeight = 0.7 + (dist / 300) * 0.3;
    passType = 'aerial';
  }

  gameState.ballTrajectory = {
    startX: fromX,
    startY: fromY,
    endX: toX,
    endY: toY,
    startTime: Date.now(),
    duration: duration,
    maxHeight: maxHeight,
    isShot: isShot,
    passType: passType,
    passQuality: passQuality,
    dist: dist,
    speed: speed
  } as any;

  gameState.ballHolder = null;
  if (passingPlayer) {
    passingPlayer.hasBallControl = false;
  }
}

// ============================================================================
// SUCCESS PROBABILITY CALCULATIONS
// ============================================================================

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
export function calculateDribbleSuccess(player: Player, opponents: Player[]): number {
  const realStats: RealStats = (player as any).realStats || {};

  // 1. Base skill (exponential calculation amplifies skill differences)
  // E.g: (0.95^0.8) = 0.96 | (0.80^0.8) = 0.84 | (0.60^0.8) = 0.67
  const baseDribbling = Math.pow(player.dribbling / 100, 0.8);

  // 2. Physical attributes
  const paceBonus = (player.pace / 100) * 0.15; // Critical for acceleration
  const physicalityBonus = (player.physicality / 100) * 0.10; // Ball shielding and duels

  // 3. Mental attributes
  // Composure directly reduces pressure penalty
  const composure = ((player as any).composure || 60) / 100; // Default 60

  // 4. Real stat impact (1.5x effect)
  const dribbleModifier = realStats.dribblesSucceeded ? Math.min(realStats.dribblesSucceeded / 10, 0.25) : 0;
  const dispossessedPenalty = realStats.dispossessed ? Math.min(realStats.dispossessed / 20, 0.15) : 0;
  const duelBonus = realStats.duelWonPercent ? (realStats.duelWonPercent / 100) * 0.1 : 0;

  const realStatImpact = (dribbleModifier + duelBonus - dispossessedPenalty) * 1.5;

  // 5. Situational penalties (pressure penalty balanced by composure)
  const nearbyOpponents = opponents.filter(opp => getDistance(player, opp) < 40);
  const pressurePenalty = (nearbyOpponents.length * 0.20) * (1 - composure);

  // 6. Final calculation
  const successChance = baseDribbling +
    paceBonus +
    physicalityBonus +
    realStatImpact -
    pressurePenalty;

  // 7. Extended range (good players better, bad players worse)
  return Math.max(0.10, Math.min(0.95, successChance));
}

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
export function calculatePassSuccess(
  passer: Player,
  _receiver: Player,
  distance: number,
  isUnderPressure: boolean
): number {
  const realStats: RealStats = (passer as any).realStats || {};

  // 1. Base skill (exponential calculation amplifies skill differences)
  // E.g: (0.90^0.7) = 0.93 | (0.70^0.7) = 0.79
  const basePassing = Math.pow(passer.passing / 100, 0.7);

  // 2. Effective accuracy (blend base skill with real stats)
  const passAccuracyStat = getValidStat(realStats.passAccuracy, 0);
  let effectiveAccuracy: number;
  if (passAccuracyStat > 0) {
    // 50% base skill, 50% real world performance
    effectiveAccuracy = (basePassing * 0.5) + ((passAccuracyStat / 100) * 0.5);
  } else {
    // No realStats, 90% trust in base skill
    effectiveAccuracy = basePassing * 0.9;
  }

  // 3. Creativity and vision bonuses
  const visionBonus = (((passer as any).vision || 60) / 100) * 0.15; // Default 60
  const chancesCreated = getValidStat(realStats.chancesCreated, 0);
  const xA = getValidStat(realStats.xA, 0);

  const creativityBonus = chancesCreated > 0 ? Math.min(chancesCreated / 8, 0.15) : 0;
  const xABonus = xA > 0 ? Math.min(xA / 4, 0.10) : 0;

  // 4. Situational penalties

  // Pressure penalty (directly reduced by composure)
  const composure = ((passer as any).composure || 60) / 100; // Default 60
  const pressurePenalty = isUnderPressure ? (0.25 * (1 - composure)) : 0; // Max 0.25 penalty
  // E.g: 90 Composure -> 0.25 * (1 - 0.9) = 0.025 penalty
  // E.g: 50 Composure -> 0.25 * (1 - 0.5) = 0.125 penalty

  // Distance penalty (directly reduced by long ball skill)
  const longBallAccuracy = getValidStat(realStats.longBallAccuracy, 60); // Default 60
  const longBallSkill = longBallAccuracy / 100;

  let distancePenalty = 0;
  if (distance > 120) { // Only passes over 120px get penalty
    distancePenalty = Math.min((distance - 120) / 400, 0.30); // Max 0.30 penalty
    distancePenalty *= (1 - longBallSkill * 0.8); // 100 LBA removes 80% of penalty
  }

  // 5. Final calculation
  const successChance = effectiveAccuracy +
    visionBonus + creativityBonus + xABonus -
    pressurePenalty - distancePenalty;

  // 6. Extended range (minimum 20% instead of 40%)
  return Math.max(0.20, Math.min(0.98, successChance));
}

// ============================================================================
// TACTICAL OPPORTUNITIES
// ============================================================================

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
export function checkForThroughBall(
  passer: Player,
  teammates: Player[],
  opponents: Player[],
  opponentGoalX: number
): ThroughBallOpportunity | null {
  const direction = opponentGoalX > 400 ? 1 : -1;

  for (const teammate of teammates) {
    if (teammate.role === 'GK') continue;

    const isAhead = (direction > 0 && teammate.x > passer.x) ||
      (direction < 0 && teammate.x < passer.x);

    if (!isAhead) continue;

    const distToGoal = Math.abs(teammate.x - opponentGoalX);
    if (distToGoal > 250) continue;

    const targetX = teammate.x + direction * 60;
    const targetY = teammate.y;

    const defendersInPath = opponents.filter(opp => {
      const oppIsAhead = (direction > 0 && opp.x > passer.x && opp.x < targetX) ||
        (direction < 0 && opp.x < passer.x && opp.x > targetX);
      return oppIsAhead && Math.abs(opp.y - targetY) < 50;
    });

    if (defendersInPath.length === 0) {
      return {
        target: teammate,
        targetPos: { x: targetX, y: targetY },
        isThroughBall: true
      };
    }
  }

  return null;
}

// ============================================================================
// PASS EXECUTION
// ============================================================================

/**
 * Initiate a pass to a target player
 */
export function initiatePass(player: Player, target: Player | null): void {
  if (!target) {
    console.warn('⚠️ No pass target provided');
    return;
  }

  // Using imported gameState from globalExports
  const distance = getDistance(player, target);
  const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
  const nearbyOpponents = allPlayers
    .filter(p => p.isHome !== player.isHome && getDistance(player, p) < 50);

  const isUnderPressure = nearbyOpponents.length > 0;

  // Calculate pass quality
  const quality = calculatePassSuccess(player, target, distance, isUnderPressure);

  // Vary pass speed based on situation
  let passSpeed = 400;

  if (distance > 150) {
    // Long pass - faster
    passSpeed = 500 + player.passing * 3;
  } else if (isUnderPressure) {
    // Under pressure - quick pass
    passSpeed = 450 + player.passing * 2;
  } else {
    // Normal pass
    passSpeed = 400 + player.passing * 2.5;
  }

  // ✅ FIX: Reduce pass power immediately after kick-off to prevent wild passes
  if ((gameState as any).postKickOffCalmPeriod && (gameState as any).kickOffCompletedTime) {
    const timeSinceKickOff = Date.now() - (gameState as any).kickOffCompletedTime;
    if (timeSinceKickOff < 4000) {
      passSpeed = Math.min(passSpeed, 450); // Cap speed at 450 during calm period
    }
  }

  // Execute pass
  gameState.currentPassReceiver = target;
  const teamStats = player.isHome ? gameState.stats.home : gameState.stats.away;
  teamStats.passesAttempted++;

  passBall(player, player.x, player.y, target.x, target.y, quality, passSpeed, false);
  (gameState as any).totalPasses = ((gameState as any).totalPasses || 0) + 1;

  // Log for debugging
  console.log(`📤 ${player.name} → ${target.name} (${distance.toFixed(0)}px, ${(quality * 100).toFixed(0)}% quality)`);
}

/**
 * Initiate a through ball
 */
export function initiateThroughBall(player: Player, throughBall: ThroughBallOpportunity): void {
  // Using imported gameState from globalExports
  let passSpeed = 600 + player.passing * 5;

  // ✅ FIX: Reduce pass power immediately after kick-off to prevent wild passes
  if ((gameState as any).postKickOffCalmPeriod && (gameState as any).kickOffCompletedTime) {
    const timeSinceKickOff = Date.now() - (gameState as any).kickOffCompletedTime;
    if (timeSinceKickOff < 4000) {
      passSpeed = Math.min(passSpeed, 450); // Cap speed at 450 during calm period
    }
  }

  const quality = calculatePassSuccess(player, throughBall.target, getDistance(player, throughBall.targetPos), false);
  gameState.currentPassReceiver = throughBall.target;
  passBall(player, player.x, player.y, throughBall.targetPos.x, throughBall.targetPos.y, quality, passSpeed, false);
  (gameState as any).totalPasses = ((gameState as any).totalPasses || 0) + 1;
  (throughBall.target as any).speedBoost = 1.4;
  throughBall.target.targetX = throughBall.targetPos.x;
  throughBall.target.targetY = throughBall.targetPos.y;
}

/**
 * Initiate a dribble move
 */
export function initiateDribble(player: Player, goalX: number): void {
  const direction = Math.sign(goalX - player.x) || 1;
  const dribbleSkill = player.dribbling / 100;

  // More variety in dribble movements
  const moveTypes = [
    { name: 'forward', x: direction * 70, y: 0 },
    { name: 'diagonal', x: direction * 60, y: (Math.random() - 0.5) * 50 },
    { name: 'cut_inside', x: direction * 50, y: Math.sign(300 - player.y) * 40 }
  ];

  // Choose move based on skill
  const moveChoice = dribbleSkill > 0.75 ?
    moveTypes[Math.floor(Math.random() * moveTypes.length)]! :
    moveTypes[0]!;

  player.targetX = player.x + moveChoice.x * dribbleSkill;
  player.targetY = player.y + moveChoice.y * dribbleSkill;

  // Speed boost based on skill
  (player as any).speedBoost = 1.0 + (dribbleSkill * 0.4);

  // Boundaries
  player.targetX = Math.max(50, Math.min(750, player.targetX));
  player.targetY = Math.max(50, Math.min(550, player.targetY));

  console.log(`🎯 ${player.name} dribbles ${moveChoice.name}`);
}

// ============================================================================
// DECISION MAKING: FIRST TOUCH SYSTEM
// ============================================================================

/**
 * Handle player with ball using first touch decision system
 *
 * Simpler decision tree focused on quick reactions
 */
export function handlePlayerWithBall_WithFirstTouch(
  player: Player,
  opponents: Player[],
  teammates: Player[]
): void {
  // Using imported gameState from globalExports
  // Using imported GAME_CONFIG from config

  // Can't act if still settling the ball
  if (!canPlayerActOnBall(player)) {
    // Just hold position while controlling
    player.targetX = player.x;
    player.targetY = player.y;
    return;
  }

  const goalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
  const distToGoal = Math.abs(player.x - goalX);
  const angleToGoal = Math.abs(player.y - 300);

  const nearbyOpponents = opponents.filter(opp => getDistance(player, opp) < 50);
  const underPressure = nearbyOpponents.length > 0;
  const underHeavyPressure = nearbyOpponents.length > 1;

  const shootingChance = (player.shooting / 100) * (1 - angleToGoal / 400);
  const isInBox = distToGoal < 180 && angleToGoal < 120;

  // Adjust angle threshold based on proximity to goal
  let adjustedAngleThreshold = 150;
  if (distToGoal < 120) {
    const closenessFactor = (120 - distToGoal) / 120;
    adjustedAngleThreshold += 80 * closenessFactor;
  }

  const isGoodPosition = distToGoal < (GAME_CONFIG as any).GOAL_CHECK_DISTANCE && angleToGoal < adjustedAngleThreshold;

  const hasPathToGoal = !opponents.some(opp => {
    const oppDistToGoal = Math.abs(opp.x - goalX);
    return oppDistToGoal < distToGoal &&
      Math.abs(opp.y - player.y) < 40 &&
      getDistance(player, opp) < 80;
  });

  const now = Date.now();
  const holdTime = (player as any).ballReceivedTime ? now - (player as any).ballReceivedTime : 0;
  const maxHoldTime = underHeavyPressure ? 800 : underPressure ? 1500 : 2000;

  if (holdTime > maxHoldTime) {
    if (underHeavyPressure && Math.random() < 0.6) {
      const passTarget = findBestPassOption_WithVision(player, teammates, opponents);
      if (passTarget) {
        initiatePass(player, passTarget);
        return;
      }
    }
    if (underPressure) {
      if (calculateDribbleSuccess(player, nearbyOpponents) > 0.5) {
        initiateDribble(player, goalX);
        return;
      }
    }
  }

  const decision = Math.random();
  const allPlayers = [...teammates, ...opponents];

  if (isInBox && hasPathToGoal && !underHeavyPressure && decision < 0.8) {
    handleShotAttempt(player, goalX, allPlayers);
    return;
  }

  if (isGoodPosition && decision < shootingChance * 1.5 && hasPathToGoal) {
    handleShotAttempt(player, goalX, allPlayers);
    return;
  }

  if (underHeavyPressure) {
    if (decision < 0.7) {
      const passTarget = findBestPassOption_WithVision(player, teammates, opponents);
      if (passTarget) {
        initiatePass(player, passTarget);
      } else {
        initiateDribble(player, goalX);
      }
    } else {
      initiateDribble(player, goalX);
    }
    return;
  }

  if (!underPressure && distToGoal < 350) {
    const throughBall = checkForThroughBall(player, teammates, opponents, goalX);
    if (throughBall && decision < 0.35) {
      initiateThroughBall(player, throughBall);
      return;
    }
  }

  if (underPressure || decision < (GAME_CONFIG as any).PASSING_CHANCE) {
    const passTarget = findBestPassOption_WithVision(player, teammates, opponents);
    if (passTarget) {
      initiatePass(player, passTarget);
    } else {
      initiateDribble(player, goalX);
    }
  } else {
    initiateDribble(player, goalX);
  }
}

// ============================================================================
// DECISION MAKING: VISION SYSTEM
// ============================================================================

/**
 * Handle player with ball using vision-based decision system
 *
 * More sophisticated system that evaluates action values
 */
export function handlePlayerWithBall_WithVision(
  player: Player,
  opponents: Player[],
  teammates: Player[]
): void {
  // Using imported gameState from globalExports

  // Pre-condition: Can player act on ball?
  if (!canPlayerActOnBall(player)) {
    // Find safest protective dribbling direction based on opponent positions
    let bestAngle = getPlayerFacingDirection(player);
    let maxSpace = 0;

    // Scan 120 degrees ahead to find most open direction
    for (let i = -1; i <= 1; i += 0.5) {
      const angle = getPlayerFacingDirection(player) + (i * Math.PI / 3); // +/- 60 degrees
      const checkPos = { x: player.x + Math.cos(angle) * 50, y: player.y + Math.sin(angle) * 50 };
      const closestOpponentDist = opponents.length > 0
        ? Math.min(...opponents.map(o => getDistance(o, checkPos)))
        : 1000; // No opponents = lots of space
      if (closestOpponentDist > maxSpace) {
        maxSpace = closestOpponentDist;
        bestAngle = angle;
      }
    }

    // Move slowly and controlled in safest direction
    player.targetX = player.x + Math.cos(bestAngle) * 20;
    player.targetY = player.y + Math.sin(bestAngle) * 20;
    (player as any).speedBoost = 0.8; // Slow, controlled movement
    return; // Wait until settle time passes for new decision
  }

  // --- DECISION CENTER: ACTION EVALUATION SYSTEM ---

  // Calculate required basic information
  const goalX = getAttackingGoalX(player.isHome, gameState.currentHalf);
  const allPlayers = [...teammates, ...opponents, player];

  // 1. CALCULATE SHOT VALUE
  let shotValue = 0;
  const distToGoal = getDistance(player, { x: goalX, y: 300 });
  // Only consider shooting at reasonable distance (~35 meters)
  if (distToGoal < 280) {
    const xG = calculateXG(player, goalX, player.y, opponents);
    shotValue = xG * 100; // Convert xG to 0-100 scale

    // Reduce shot value if under pressure or bad angle
    if (opponents.some(o => getDistance(o, player) < 30)) shotValue *= 0.6;
    if (Math.abs(player.y - 300) > 150) shotValue *= 0.7; // Bad angle penalty
  }

  // 2. CALCULATE PASS VALUE
  const passTarget = findBestPassOption_WithVision(player, teammates, opponents);
  let passValue = 0;
  if (passTarget) {
    const distToTarget = getDistance(player, passTarget);
    const spaceAroundTarget = opponents.length > 0
      ? Math.min(...opponents.map(o => getDistance(o, passTarget)))
      : 1000; // No opponents = lots of space

    // Value: Target's open space + base pass value - distance penalty
    passValue = 40 + (spaceAroundTarget) - (distToTarget * 0.5);

    // Reward passes towards attack direction
    if (Math.sign(passTarget.x - player.x) === Math.sign(goalX - player.x)) {
      passValue += 25;
    }
  }

  // 3. CALCULATE DRIBBLE VALUE
  let dribbleValue = 0;
  const forwardAngle = getPlayerFacingDirection(player);
  // Check space 60 units ahead of player
  const dribbleCheckPos = { x: player.x + Math.cos(forwardAngle) * 60, y: player.y + Math.sin(forwardAngle) * 60 };
  const spaceAhead = opponents.length > 0
    ? Math.min(...opponents.map(o => getDistance(o, dribbleCheckPos)))
    : 1000; // No opponents = lots of space

  // Consider dribbling if sufficient space ahead (40 units)
  if (spaceAhead > 40) {
    // Value: Player's dribbling ability + space ahead
    dribbleValue = (player.dribbling * 0.6) + (spaceAhead * 0.4);

    // Encourage dribbling for fast players and wingers
    if (player.pace > 82 || ['RW', 'LW', 'RM', 'LM'].includes(player.role)) {
      dribbleValue += 15;
    }
  }

  // --- ACTION SELECTION AND EXECUTION ---
  // Choose action with highest value that passes threshold

  if (shotValue > passValue && shotValue > dribbleValue && shotValue > 30) {
    handleShotAttempt(player, goalX, allPlayers);
    return;
  }

  // Pass if it has highest value AND above reasonable threshold (e.g: 45)
  if (passValue > dribbleValue && passValue > 45) {
    initiatePass(player, passTarget);
    return;
  }

  // If shot or pass aren't logical options, default to dribbling
  initiateDribble(player, goalX);
}

