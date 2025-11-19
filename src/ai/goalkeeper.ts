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
import { distance } from '../utils/math';
import { getAttackingGoalX } from '../utils/ui';
import { eventBus } from '../eventBus';
import { EVENT_TYPES } from '../types/events';
import { Particle, createGoalExplosion } from '../rendering/particles';
import { showGoalAnimation } from '../ui/goalAnimation';
import { resetAfterGoal } from '../main';
import { gameState } from '../globalExports';
import { GAME_CONFIG } from '../config';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// CONFIGURATION
// ============================================================================

export const GOALKEEPER_CONFIG: GoalkeeperConfig = {
  // Positioning parameters
  BASE_POSITION_RATIO: 0.05,        // How far from goal line (5%)
  THREAT_ADVANCE_MAX: 50,            // Max distance to advance (pixels)
  ANGLE_CUT_RATIO: 0.3,              // How much to advance toward ball

  // Stance types and their effects
  STANCES: {
    COMFORTABLE: {
      name: 'comfortable',
      saveBonus: 0,
      mobilityPenalty: 0,
      description: 'No immediate threat'
    },
    READY: {
      name: 'ready',
      saveBonus: 0.05,
      mobilityPenalty: 0.1,
      description: 'Threat nearby, ready to react'
    },
    SET: {
      name: 'set',
      saveBonus: 0.15,
      mobilityPenalty: 0.3,
      description: 'Shot imminent, set position'
    },
    ADVANCING: {
      name: 'advancing',
      saveBonus: 0.10,
      mobilityPenalty: 0,
      description: 'Coming out to narrow angle'
    },
    ONE_ON_ONE: {
      name: 'oneOnOne',
      saveBonus: 0.20,
      mobilityPenalty: 0.5,
      description: 'Making self big for 1v1'
    }
  },

  // Threat assessment
  DANGER_ZONE_DISTANCE: 280,         // Distance considered dangerous
  IMMEDIATE_THREAT_DISTANCE: 150,    // Distance for "set" stance
  ONE_ON_ONE_DISTANCE: 80,           // Distance for 1v1 stance

  // Sweeping behavior
  SWEEPER_DISTANCE: 120,             // Max distance to sweep
  THROUGH_BALL_INTERCEPT_RANGE: 200, // Range to intercept through balls

  // Save positioning
  GOAL_CENTER_Y: 300,
  GOAL_WIDTH: 120,                   // GOAL_Y_BOTTOM - GOAL_Y_TOP
  REACTION_TIME: 200,                // ms to react to shot

  // Cross handling
  CROSS_CLAIM_RANGE: 80,             // Range to claim crosses
  CROSS_PUNCH_RANGE: 120             // Range to punch if can't claim
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Safe distance calculation wrapper
 */
function getDistance(p1: Vector2D | Player, p2: Vector2D | Player): number {
  return distance(p1, p2);
}

// getAttackingGoalX is now imported from '../utils/ui'

// ============================================================================
// THREAT ASSESSMENT
// ============================================================================

/**
 * Assess threats to goalkeeper
 *
 * Evaluates opponents based on:
 * - Distance to goal
 * - Angle quality
 * - Ball possession
 * - Player role (attackers prioritized)
 */
export function assessGoalkeeperThreats(
  goalkeeper: Player,
  _ball: Vector2D,
  opponents: Player[]
): ThreatInfo[] {
  // Using imported gameState from globalExports
  const goalX = getAttackingGoalX(!goalkeeper.isHome, gameState.currentHalf);

  const threats = opponents
    .filter(opp => opp.role !== 'GK')
    .map(opp => {
      const distToGoal = Math.abs(opp.x - goalX);
      const distToGK = getDistance(goalkeeper, opp);
      const angleToGoal = Math.abs(opp.y - GOALKEEPER_CONFIG.GOAL_CENTER_Y);
      const hasBall = gameState.ballHolder?.id === opp.id;

      let threatScore = 0;

      if (distToGoal < GOALKEEPER_CONFIG.DANGER_ZONE_DISTANCE) {
        threatScore += (1 - distToGoal / GOALKEEPER_CONFIG.DANGER_ZONE_DISTANCE) * 50;
      }

      const angleQuality = 1 - (angleToGoal / (GOALKEEPER_CONFIG.GOAL_WIDTH / 2));
      threatScore += angleQuality * 30;

      if (hasBall) {
        threatScore += 40;
      }

      if (opp.role === 'ST' || opp.role === 'RW' || opp.role === 'LW') {
        threatScore += 10;
      }

      return {
        player: opp,
        score: threatScore,
        distToGoal: distToGoal,
        distToGK: distToGK,
        hasBall: hasBall,
        angleToGoal: angleToGoal
      };
    })
    .filter(threat => threat.score > 20)
    .sort((a, b) => b.score - a.score);

  return threats;
}

// ============================================================================
// GOALKEEPER STANCE
// ============================================================================

/**
 * Determine goalkeeper's stance based on threat level
 */
export function determineGoalkeeperStance(
  _goalkeeper: Player,
  mainThreat: ThreatInfo | null,
  threats: ThreatInfo[],
  _ball: Vector2D
): GoalkeeperStance {
  // Using imported gameState from globalExports

  if (!mainThreat) {
    return GOALKEEPER_CONFIG.STANCES['COMFORTABLE']!;
  }

  // 1v1 situation?
  if (mainThreat.hasBall &&
    mainThreat.distToGoal < GOALKEEPER_CONFIG.ONE_ON_ONE_DISTANCE &&
    threats.length === 1) {
    return GOALKEEPER_CONFIG.STANCES['ONE_ON_ONE']!;
  }

  // Imminent shot?
  if (mainThreat.hasBall &&
    mainThreat.distToGoal < GOALKEEPER_CONFIG.IMMEDIATE_THREAT_DISTANCE) {
    return GOALKEEPER_CONFIG.STANCES['SET']!;
  }

  // Ball in air (cross/high ball)?
  if (gameState.ballHeight > 0.5) {
    return GOALKEEPER_CONFIG.STANCES['ADVANCING']!;
  }

  // General danger?
  if (mainThreat.distToGoal < GOALKEEPER_CONFIG.DANGER_ZONE_DISTANCE) {
    return GOALKEEPER_CONFIG.STANCES['READY']!;
  }

  return GOALKEEPER_CONFIG.STANCES['COMFORTABLE']!;
}

// ============================================================================
// POSITIONING
// ============================================================================

/**
 * Calculate optimal goalkeeper position
 */
export function calculateOptimalGoalkeeperPosition(
  goalkeeper: Player,
  mainThreat: ThreatInfo | null,
  stance: GoalkeeperStance,
  ball: Vector2D
): Vector2D {
  // Using imported gameState from globalExports
  // Using imported GAME_CONFIG from config
  const goalX = getAttackingGoalX(!goalkeeper.isHome, gameState.currentHalf);
  const goalCenterY = GOALKEEPER_CONFIG.GOAL_CENTER_Y;

  // IMPROVED CORNER POSITIONING
  if (gameState.status === 'CORNER_KICK' && gameState.setPiece) {
    const cornerY = gameState.setPiece.position.y;

    const realStats = goalkeeper.realStats || {};
    const sweeperRating = realStats.gkKeeperSweeper || 5;
    const aggressionFactor = sweeperRating / 10; // 0.5 to 1.0

    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    const attackersInBox = allPlayers
      .filter(p => p.isHome !== goalkeeper.isHome && Math.abs(p.x - goalX) < 120)
      .length;

    // More attackers = stay closer to goal line
    const crowdingPenalty = Math.min(attackersInBox * 0.1, 0.3);

    // FIXED: Better positioning calculation
    const baseShift = (cornerY - goalCenterY) * (0.25 + aggressionFactor * 0.15 - crowdingPenalty);

    // FIXED: Consider corner side more carefully
    const isNearPost = (cornerY < goalCenterY && cornerY < 250) || (cornerY > goalCenterY && cornerY > 350);
    const postAdjustment = isNearPost ? 0 : 10;

    let targetY = goalCenterY + baseShift + (cornerY > goalCenterY ? postAdjustment : -postAdjustment);

    // FIXED: Ensure keeper stays within reasonable bounds
    const minY = GAME_CONFIG.GOAL_Y_TOP + 25;
    const maxY = GAME_CONFIG.GOAL_Y_BOTTOM - 25;
    targetY = Math.max(minY, Math.min(maxY, targetY));

    // FIXED: Slight forward positioning for corners
    const forwardOffset = Math.sign(400 - goalX) * (2 + aggressionFactor * 3);

    console.log(`⚽ ${goalkeeper.name} corner positioning: Y=${targetY.toFixed(0)} (aggression: ${aggressionFactor.toFixed(2)}, attackers: ${attackersInBox})`);

    return {
      x: goalX + forwardOffset,
      y: targetY
    };
  }

  // Original positioning logic for non-corner situations
  if (!mainThreat) {
    return {
      x: goalX + (ball.x - goalX) * GOALKEEPER_CONFIG.BASE_POSITION_RATIO,
      y: goalCenterY + (ball.y - goalCenterY) * 0.15
    };
  }

  const threat = mainThreat.player;

  // Angle cutting logic
  const vectorX = threat.x - goalX;
  const vectorY = threat.y - goalCenterY;
  const vectorLength = Math.sqrt(vectorX * vectorX + vectorY * vectorY);

  if (vectorLength === 0) {
    return { x: goalX, y: goalCenterY };
  }

  const normX = vectorX / vectorLength;
  const normY = vectorY / vectorLength;

  const realStats = goalkeeper.realStats || {};
  const sweeperAbility = realStats.gkKeeperSweeper || 0;
  const sweeperModifier = sweeperAbility * 0.3;

  let advanceDistance = GOALKEEPER_CONFIG.THREAT_ADVANCE_MAX;

  switch (stance.name) {
    case 'oneOnOne':
      advanceDistance = Math.min(mainThreat.distToGK * 0.5, 80);
      break;
    case 'set':
      advanceDistance = 25;
      break;
    case 'advancing':
      advanceDistance = 60 + sweeperModifier * 20;
      break;
    case 'ready':
      advanceDistance = 35 + sweeperModifier * 15;
      break;
    case 'comfortable':
      advanceDistance = 15;
      break;
  }

  const targetX = goalX + normX * advanceDistance;
  const targetY = goalCenterY + normY * (advanceDistance * 0.6);

  const goalTop = GAME_CONFIG.GOAL_Y_TOP;
  const goalBottom = GAME_CONFIG.GOAL_Y_BOTTOM;

  // FIXED: Better X constraint
  const isLeftGoal = goalX < 400;
  const constrainedX = isLeftGoal ?
    Math.max(goalX - 5, Math.min(goalX + advanceDistance + 10, targetX)) :
    Math.max(goalX - advanceDistance - 10, Math.min(goalX + 5, targetX));

  const constrainedY = Math.max(goalTop + 10, Math.min(goalBottom - 10, targetY));

  return {
    x: constrainedX,
    y: constrainedY
  };
}

// ============================================================================
// SWEEPING LOGIC
// ============================================================================

/**
 * Determine if goalkeeper should sweep (come out for through ball)
 */
export function shouldGoalkeeperSweep(
  goalkeeper: Player,
  _ball: Vector2D,
  opponents: Player[]
): boolean {
  // Using imported gameState from globalExports

  // Is ball trajectory heading toward goal?
  if (!gameState.ballTrajectory || gameState.ballTrajectory.isShot) {
    return false;
  }

  const goalX = getAttackingGoalX(!goalkeeper.isHome, gameState.currentHalf);
  const traj = gameState.ballTrajectory;

  // Ball heading toward goal area?
  const ballHeadingToGoal = Math.abs(traj.endX - goalX) < GOALKEEPER_CONFIG.SWEEPER_DISTANCE;

  if (!ballHeadingToGoal) {
    return false;
  }

  // Is an attacker chasing it?
  const attackersChasingBall = opponents.filter(opp => {
    const distToBallTarget = Math.sqrt(
      Math.pow(opp.x - traj.endX, 2) +
      Math.pow(opp.y - traj.endY, 2)
    );
    return distToBallTarget < 100 && opp.role !== 'GK';
  });

  if (attackersChasingBall.length === 0) {
    return false;
  }

  // Can keeper get there first?
  const keeperDistToBall = getDistance(goalkeeper, { x: traj.endX, y: traj.endY });
  const attackerDistToBall = Math.min(...attackersChasingBall.map(att =>
    getDistance(att, { x: traj.endX, y: traj.endY })
  ));

  // Sweeper ability affects decision
  const realStats = goalkeeper.realStats || {};
  const sweeperConfidence = (realStats.gkKeeperSweeper || 0) / 10;

  // Keeper should sweep if they can get there first (with safety margin)
  return keeperDistToBall < (attackerDistToBall * (1.1 - sweeperConfidence * 0.1));
}

/**
 * Handle cross situations
 */
export function handleCrossSituation(
  goalkeeper: Player,
  _ball: Vector2D,
  _opponents: Player[]
): CrossAction | null {
  // Using imported gameState from globalExports

  // Is it a cross? (high ball in wide position)
  if (!gameState.ballHeight || gameState.ballHeight < 0.5) {
    return null;
  }

  if (!gameState.ballTrajectory) {
    return null;
  }

  const traj = gameState.ballTrajectory;
  const goalCenterY = GOALKEEPER_CONFIG.GOAL_CENTER_Y;

  // Is ball crossing toward goal area?
  const isCrossing = Math.abs(traj.endY - goalCenterY) < 150 &&
    Math.abs(traj.startY - traj.endY) > 100;

  if (!isCrossing) {
    return null;
  }

  // Can keeper claim it?
  const distToBall = getDistance(goalkeeper, { x: traj.endX, y: traj.endY });

  const realStats = goalkeeper.realStats || {};
  const aerialAbility = realStats.aerialsWonPercent || 50;

  if (distToBall < GOALKEEPER_CONFIG.CROSS_CLAIM_RANGE) {
    // Attempt to claim
    return {
      action: 'claim',
      targetX: traj.endX,
      targetY: traj.endY,
      successChance: (aerialAbility / 100) * 0.85
    };
  } else if (distToBall < GOALKEEPER_CONFIG.CROSS_PUNCH_RANGE) {
    // Punch clear
    return {
      action: 'punch',
      targetX: traj.endX,
      targetY: traj.endY,
      successChance: (aerialAbility / 100) * 0.95
    };
  }

  return null;
}

// ============================================================================
// MAIN GOALKEEPER AI
// ============================================================================

/**
 * Update goalkeeper AI (advanced system)
 *
 * Main entry point for goalkeeper behavior
 */
export function updateGoalkeeperAI_Advanced(
  goalkeeper: Player,
  ball: Vector2D,
  opponents: Player[]
): void {
  // Using imported gameState from globalExports

  const threats = assessGoalkeeperThreats(goalkeeper, ball, opponents);
  const mainThreat = threats[0] || null;

  const stance = determineGoalkeeperStance(goalkeeper, mainThreat, threats, ball);
  goalkeeper.stance = stance.name;
  goalkeeper.stanceSaveBonus = stance.saveBonus;
  goalkeeper.stanceMobilityPenalty = stance.mobilityPenalty;

  if (shouldGoalkeeperSweep(goalkeeper, ball, opponents)) {
    const traj = gameState.ballTrajectory;
    if (traj) {
      goalkeeper.targetX = traj.endX;
      goalkeeper.targetY = traj.endY;
      goalkeeper.speedBoost = 1.3;
      goalkeeper.isSweeping = true;
      console.log(`🏃 ${goalkeeper.name} sweeping!`);
      return;
    }
  }

  const crossAction = handleCrossSituation(goalkeeper, ball, opponents);
  if (crossAction) {
    goalkeeper.targetX = crossAction.targetX;
    goalkeeper.targetY = crossAction.targetY;
    goalkeeper.speedBoost = 1.2;
    goalkeeper.isClaimingCross = true;
    goalkeeper.crossClaimStartTime = Date.now();
    console.log(`🙌 ${goalkeeper.name} going for cross!`);

    const claimStartTime = Date.now();
    const expectedDuration = gameState.ballTrajectory ? gameState.ballTrajectory.duration * 0.8 : 500;

    setTimeout(() => {
      // Validate game state hasn't changed
      if (gameState.status === 'finished' || gameState.status === 'goal_scored') {
        return;
      }

      // Check if goalkeeper is still claiming and close enough
      if (goalkeeper.isClaimingCross &&
          goalkeeper.crossClaimStartTime === claimStartTime &&
          getDistance(goalkeeper, gameState.ballPosition) < 40) {
        if (Math.random() < crossAction.successChance) {
          gameState.ballHolder = goalkeeper;
          goalkeeper.hasBallControl = true;
          gameState.ballTrajectory = null;
          goalkeeper.ballReceivedTime = Date.now();
          console.log(`✅ ${goalkeeper.name} claims the cross!`);
        } else {
          console.log(`❌ ${goalkeeper.name} missed the cross!`);
        }
      }
      goalkeeper.isClaimingCross = false;
    }, expectedDuration);

    return;
  }

  const optimalPosition = calculateOptimalGoalkeeperPosition(
    goalkeeper,
    mainThreat,
    stance,
    ball
  );

  goalkeeper.targetX = optimalPosition.x;
  goalkeeper.targetY = optimalPosition.y;

  goalkeeper.speedBoost = 1.0 - stance.mobilityPenalty;

  goalkeeper.currentMainThreat = mainThreat?.player || null;
  goalkeeper.threatCount = threats.length;

  goalkeeper.isSweeping = false;
  goalkeeper.isClaimingCross = false;
}

// ============================================================================
// SAVE PROBABILITY
// ============================================================================

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
export function calculateSaveProbability_Advanced(
  xG: number,
  goalkeeper: Player | null,
  shotTargetY: number,
  shooter?: Player
): number {
  if (!goalkeeper) return 0.3;

  // ============= GOALKEEPER BASE ABILITY =============

  const gkSkill = goalkeeper.goalkeeping / 100; // 0.6–1.0 typically
  const gkRatingNorm = (goalkeeper.rating - 6.0) / 4.0; // Normalize 6–10 → 0–1
  const baseAbility = (gkSkill * 0.7) + (gkRatingNorm * 0.3);

  const realStats = goalkeeper.realStats || {};
  const savePercentBonus = realStats.gkSavePercent ? (realStats.gkSavePercent / 100) * 0.30 : 0;
  const reflexBonus = (goalkeeper.pace / 100) * 0.20;
  const consistencyBonus = (realStats.gkGoalsPrevented || 0) * 0.01; // each prevented goal = +1%
  const experienceBonus = (goalkeeper.rating > 7.0 ? 0.05 : 0);

  // ============= SHOOTER QUALITY EFFECT =============

  let attackerEffect = 1.0; // Neutral by default
  if (shooter) {
    const rs = shooter.realStats || {};

    // Key offensive metrics
    const finisherSkill = (shooter.shooting || 60) / 100; // base
    const dribbleQuality = (shooter.dribbling || 60) / 100;
    const xGOTFactor = Math.min(1, (rs.xGOT || 0.3)); // expected goals on target
    const shotAccuracy = rs.shotsOnTarget && rs.shots ? (rs.shotsOnTarget / rs.shots) : 0.4;

    // Combine offensive efficiency
    const finishingPower = (
      finisherSkill * 0.5 +
      dribbleQuality * 0.2 +
      shotAccuracy * 0.2 +
      xGOTFactor * 0.1
    );

    // Balance vs GK
    const relativeGap = finishingPower - baseAbility;

    // Adjust save chance (strong attacker = less save chance)
    attackerEffect = 1 - (relativeGap * 0.5);
    attackerEffect = Math.max(0.6, Math.min(1.4, attackerEffect));
  }

  // ============= POSITIONING & STANCE =============

  const goalCenterY = 300;
  const distanceToShot = Math.abs(goalkeeper.y - shotTargetY);
  const maxReach = 120;
  const reachRatio = Math.max(0, 1 - (distanceToShot / maxReach));

  const stanceBonus = goalkeeper.stanceSaveBonus || 0;
  const anticipationBonus = (goalkeeper.stance === 'set' || goalkeeper.stance === 'ready') ? 0.10 : 0;

  // ============= SHOT DIFFICULTY =============

  const goalHeight = 120;
  const placementDifficulty = Math.abs(shotTargetY - goalCenterY) / (goalHeight / 2);

  // ============= BASE SAVE CHANCE =============

  let saveProbability = 1 - xG;
  const abilityMultiplier = (baseAbility + savePercentBonus + reflexBonus + consistencyBonus + experienceBonus) * 1.8;
  saveProbability *= abilityMultiplier;

  const positioningMultiplier = 0.3 + (reachRatio * 0.7);
  saveProbability *= positioningMultiplier;
  saveProbability += stanceBonus + anticipationBonus;

  // Placement bonus (central shots easier)
  if (placementDifficulty < 0.3) saveProbability += 0.25;
  else if (placementDifficulty < 0.6) saveProbability += 0.15;

  // Apply attacker vs GK effect
  saveProbability *= attackerEffect;

  // ============= REALISTIC BOUNDS =============

  saveProbability = Math.max(0.10, Math.min(0.93, saveProbability));

  // Low xG shots are usually saved
  if (xG < 0.15) saveProbability = Math.max(saveProbability, 0.75);

  console.log(
    `SAVE%: ${(saveProbability * 100).toFixed(0)} | xG:${(xG * 100).toFixed(0)} | GK:${(baseAbility * 100).toFixed(0)} | ShooterAdj:${(attackerEffect * 100).toFixed(0)}%`
  );

  return saveProbability;
}

// ============================================================================
// SAVE ANIMATION
// ============================================================================

/**
 * Trigger goalkeeper save animation
 */
export function triggerGoalkeeperSave(
  goalkeeper: Player,
  shotX: number,
  shotY: number,
  saveProbability: number = 0.5
): void {
  if (!goalkeeper) return;

  // Using imported gameState from globalExports

  // --- BASIC DIVE SETUP ---
  const diveX = shotX - goalkeeper.x;
  const diveY = shotY - goalkeeper.y;

  goalkeeper.isDiving = true;
  goalkeeper.diveStartTime = Date.now();
  goalkeeper.diveDirection = { x: diveX, y: diveY };

  // --- IMPROVED: DYNAMIC TIMING & REACH ---
  const gkSkill = (goalkeeper.goalkeeping || 60) / 100;
  const distanceDive = Math.sqrt(diveX ** 2 + diveY ** 2);
  const maxReach = 180;
  const reachFactor = Math.min(1, distanceDive / maxReach);

  // Faster dive for tough shots and skilled GKs
  const baseDuration = 600 + (200 * (1 - gkSkill));
  const diveDuration = baseDuration * (1.0 - (saveProbability * 0.3));
  goalkeeper.diveDuration = diveDuration;

  // Apply limited reach so animation looks realistic
  goalkeeper.diveDirection.x *= reachFactor;
  goalkeeper.diveDirection.y *= reachFactor;

  // --- AUTO RESET ---
  setTimeout(() => {
    goalkeeper.isDiving = false;
  }, diveDuration);

  // --- PARTICLES ---
  const numParticles = Math.floor(8 + Math.random() * 4);
  const particleColor = saveProbability > 0.6 ? '#60a5fa' : '#1e40af';

  if (gameState?.particles) {
    for (let i = 0; i < numParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 120;
      const velocityX = Math.cos(angle) * speed;
      const velocityY = Math.sin(angle) * speed;

      const particle = new Particle(
        goalkeeper.x,
        goalkeeper.y,
        particleColor,
        velocityX,
        velocityY
      );
      particle.size = 2 + Math.random() * 2;
      gameState.particles.push(particle);
    }
  }
}

/**
 * Draw goalkeeper stance indicator (debug)
 */
export function drawGoalkeeperStanceIndicator(
  ctx: CanvasRenderingContext2D,
  goalkeeper: Player
): void {
  if (!goalkeeper.stance) return;

  const stanceColors: Record<string, string> = {
    comfortable: '#10b981',
    ready: '#3b82f6',
    set: '#f59e0b',
    advancing: '#8b5cf6',
    oneOnOne: '#ef4444'
  };

  const color = stanceColors[goalkeeper.stance] || '#6b7280';

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(goalkeeper.x, goalkeeper.y, 25, 0, Math.PI * 2);
  ctx.stroke();

  // Draw stance text
  ctx.fillStyle = color;
  ctx.font = 'bold 10px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(goalkeeper.stance.toUpperCase(), goalkeeper.x, goalkeeper.y - 35);

  ctx.restore();
}

// ============================================================================
// SHOT RESOLUTION
// ============================================================================

/**
 * Resolve shot with advanced goalkeeper system
 */
export function resolveShot_WithAdvancedGK(params: ShotResolution): void {
  // Using imported gameState from globalExports
  // Using imported GAME_CONFIG from config
  const { holder, xG, goalkeeper, goalX, shotTargetY } = params;

  if (!gameState.shotInProgress) {
    return;
  }

  const teamStats = holder.isHome ? gameState.stats.home : gameState.stats.away;
  const goalTop = GAME_CONFIG.GOAL_Y_TOP;
  const goalBottom = GAME_CONFIG.GOAL_Y_BOTTOM;

  if (shotTargetY < goalTop || shotTargetY > goalBottom) {
    teamStats.shotsOffTarget++;
    gameState.commentary.push({
      text: `${Math.floor(gameState.timeElapsed)}' ${holder.name}'s shot is off target!`,
      type: 'attack'
    });
    gameState.shotInProgress = false;
    gameState.shooter = null;
    gameState.currentShotXG = null;
    return;
  }

  teamStats.shotsOnTarget++;
  const saveProbability = calculateSaveProbability_Advanced(xG, goalkeeper, shotTargetY, holder);
  const keeperSaves = Math.random() < saveProbability;

  if (!keeperSaves) {
    // --- GOAL SCORED ---
    gameState.status = 'goal_scored';
    if (holder.isHome) gameState.homeScore++;
    else gameState.awayScore++;

    const scorerName = holder.name;
    const teamColors = holder.isHome
      ? [gameState.homeJerseyColor, '#ffffff']
      : [gameState.awayJerseyColor, '#ffffff'];

    // FIXED: isHome instead of team
    gameState.goalEvents.push({
      scorer: holder.name,
      time: Math.floor(gameState.timeElapsed),
      team: holder.isHome ? gameState.homeTeam : gameState.awayTeam,
      isHome: holder.isHome
    });

    createGoalExplosion(goalX, shotTargetY,
      holder.isHome ? gameState.homeJerseyColor : gameState.awayJerseyColor);

    const xGDisplay = (xG * 100).toFixed(0);
    gameState.commentary.push({
      text: `${Math.floor(gameState.timeElapsed)}' GOAL! ${holder.name} scores! (xG: ${xGDisplay}%)`,
      type: 'goal'
    });

    if (eventBus && EVENT_TYPES) {
      eventBus.publish(EVENT_TYPES.GOAL_SCORED, {
        scorer: holder,
        xG: xG,
        time: Math.floor(gameState.timeElapsed)
      });
    }

    gameState.lastGoalScorer = holder.isHome ? 'home' : 'away';

    // FIXED: Delay goal animation until ball has visually crossed the line
    // Calculate delay based on ball trajectory duration (typically 300-600ms)
    const animationDelay = gameState.ballTrajectory ? 400 : 200;
    setTimeout(() => {
      showGoalAnimation(scorerName, teamColors);
    }, animationDelay);

    resetAfterGoal();
  } else {
    // --- SAVED ---
    triggerGoalkeeperSave(goalkeeper, goalX, shotTargetY, saveProbability);
    const saveQuality = saveProbability > 0.7 ? 'incredible' :
      saveProbability > 0.5 ? 'great' : 'good';

    gameState.commentary.push({
      text: `${Math.floor(gameState.timeElapsed)}' ${saveQuality} save by ${goalkeeper.name}!`,
      type: 'save'
    });

    if (eventBus && EVENT_TYPES) {
      eventBus.publish(EVENT_TYPES.SHOT_SAVED, {
        goalkeeper: goalkeeper,
        shooter: holder,
        saveQuality: saveQuality
      });
    }

    gameState.ballHolder = goalkeeper;
    goalkeeper.hasBallControl = true;
    goalkeeper.ballReceivedTime = Date.now();
  }

  gameState.commentary = gameState.commentary.slice(-6);
  gameState.shotInProgress = false;
  gameState.shooter = null;
  gameState.currentShotXG = null;
}

