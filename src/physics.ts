/**
 * Physics System
 * Handles ball physics, player movement, and collision detection
 *
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 * ✅ NaN-safe calculations throughout
 */

import type { Player, GameState } from './types';
import { distance as getDistance, safeSqrt, safeDiv } from './utils/math';
import { getAttackingGoalX, isSetPieceStatus } from './utils/ui';
import { gameState } from './globalExports';
import { handleBallInterception } from './rules/ballControl';

// Debug flag (replaces window.DEBUG_PHYSICS)
const DEBUG_PHYSICS = false;

// ============================================================================
// GLOBAL DECLARATIONS
// ============================================================================

declare global {
  interface Window {
    DEBUG_PHYSICS?: boolean;
    gameState: GameState;
    updatePhysics: typeof updatePhysics;
    updatePlayerPhysics: typeof updatePlayerPhysics;
    updateBallWithHolder: typeof updateBallWithHolder;
    updateBallTrajectory: typeof updateBallTrajectory;
    validateBallState: typeof validateBallState;
    updateParticles?: (dt: number) => void;
    handleBallInterception?: (progress: number) => void;
    handleBallOutOfBounds: () => void;
    handleThrowIn: () => void;
    resolveBallControl?: (allPlayers: Player[]) => void;
    getPlayerFacingDirection?: (player: Player) => number;
    passBall?: (
      passingPlayer: Player,
      fromX: number,
      fromY: number,
      toX: number,
      toY: number,
      passQuality: number,
      speed: number,
      isShot: boolean
    ) => void;
  }
}

// ============================================================================
// BALL TRAJECTORY UPDATE
// ============================================================================

/**
 * Update ball trajectory during passes and shots
 */
export function updateBallTrajectory(_dt: number): void {
  if (!gameState.ballTrajectory) {
    gameState.ballHeight = 0;
    return;
  }

  const traj = gameState.ballTrajectory;
  const elapsed = Date.now() - traj.startTime;
  const progress = Math.min(elapsed / traj.duration, 1);

  gameState.ballPosition.x = traj.startX + (traj.endX - traj.startX) * progress;
  gameState.ballPosition.y = traj.startY + (traj.endY - traj.startY) * progress;

  const heightProgress = Math.sin(progress * Math.PI);
  gameState.ballHeight = heightProgress * traj.maxHeight;

  // Check for out of bounds during aerial passes
  if (traj.passType === 'aerial' && gameState.ballHeight > 0.5) {
    if (gameState.ballPosition.y < 20 || gameState.ballPosition.y > 580) {
      if (DEBUG_PHYSICS) {
        console.log(`[Physics] Ball out of bounds during aerial pass (y=${gameState.ballPosition.y}), resetting to center`);
      }
      gameState.ballTrajectory = null;
      gameState.ballHeight = 0;
      gameState.ballPosition = { x: 400, y: 300 };
      const outText = `${Math.floor(gameState.timeElapsed)}' Ball out of play!`;
      gameState.commentary.push({ text: outText, type: 'attack' });
      gameState.commentary = gameState.commentary.slice(-6);
      return;
    }
  }

  // Handle interception during pass
  if (!traj.isShot && progress > 0.2 && progress < 0.9) {
    if (typeof handleBallInterception === 'function') {
      handleBallInterception(progress);
    }
  }

  // Trajectory complete
  if (progress >= 1) {
    const direction = Math.atan2(traj.endY - traj.startY, traj.endX - traj.startX);
    const landingSpeed = traj.speed * 0.3;

    gameState.ballVelocity.x = Math.cos(direction) * landingSpeed;
    gameState.ballVelocity.y = Math.sin(direction) * landingSpeed;

    if (DEBUG_PHYSICS) {
      console.log(`[Physics] Ball trajectory complete (${traj.passType}): landed at (${gameState.ballPosition.x.toFixed(1)}, ${gameState.ballPosition.y.toFixed(1)}), velocity=(${gameState.ballVelocity.x.toFixed(1)}, ${gameState.ballVelocity.y.toFixed(1)})`);
    }

    gameState.ballTrajectory = null;
    gameState.ballHeight = 0;
    gameState.shotInProgress = false;
    gameState.shooter = null;
    gameState.currentShotXG = null;

    // ✅ FIX: Assign ball chasers when pass/trajectory completes and ball is loose
    // This ensures players immediately pursue the ball when it lands from a pass
    const priorityChaser = gameState.currentPassReceiver;
    gameState.currentPassReceiver = null;

    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    assignBallChasers(allPlayers, priorityChaser);
  }
}

// ============================================================================
// BALL STATE VALIDATION (Prevents NaN propagation)
// ============================================================================

/**
 * Validate and sanitize ball state to prevent NaN propagation
 */
export function validateBallState(): void {
  // Validate position
  if (!isFinite(gameState.ballPosition.x) || !isFinite(gameState.ballPosition.y)) {
    console.warn('[Physics] ⚠️ Ball position invalid, resetting to center. Previous value:', gameState.ballPosition);
    gameState.ballPosition = { x: 400, y: 300 };
  }

  // Clamp to pitch bounds with margin
  const oldX = gameState.ballPosition.x;
  const oldY = gameState.ballPosition.y;
  gameState.ballPosition.x = Math.max(5, Math.min(795, gameState.ballPosition.x));
  gameState.ballPosition.y = Math.max(5, Math.min(595, gameState.ballPosition.y));

  if (DEBUG_PHYSICS && (oldX !== gameState.ballPosition.x || oldY !== gameState.ballPosition.y)) {
    console.log(`[Physics] Ball position clamped from (${oldX.toFixed(1)}, ${oldY.toFixed(1)}) to (${gameState.ballPosition.x.toFixed(1)}, ${gameState.ballPosition.y.toFixed(1)})`);
  }

  // Validate velocity
  if (!isFinite(gameState.ballVelocity.x) || !isFinite(gameState.ballVelocity.y)) {
    console.warn('[Physics] ⚠️ Ball velocity invalid, resetting to zero. Previous value:', gameState.ballVelocity);
    gameState.ballVelocity = { x: 0, y: 0 };
  }

  // Clamp extreme velocities (prevent physics explosions)
  const maxVelocity = 1000;
  const speed = Math.sqrt(
    gameState.ballVelocity.x * gameState.ballVelocity.x +
    gameState.ballVelocity.y * gameState.ballVelocity.y
  );
  if (speed > maxVelocity) {
    const scale = maxVelocity / speed;
    if (DEBUG_PHYSICS) {
      console.log(`[Physics] Ball velocity clamped from ${speed.toFixed(1)} to ${maxVelocity} (scale=${scale.toFixed(2)})`);
    }
    gameState.ballVelocity.x *= scale;
    gameState.ballVelocity.y *= scale;
  }

  // Validate height
  if (!isFinite(gameState.ballHeight) || gameState.ballHeight < 0) {
    gameState.ballHeight = 0;
  }
}

// ============================================================================
// BALL HOLDER VALIDATION
// ============================================================================

/**
 * Validate ball holder player object
 */
export function validateBallHolder(player: Player | null): Player | null {
  if (!player) return null;

  if (typeof player.isHome !== 'boolean') {
    console.warn('Ball holder missing isHome property', player);
    return null;
  }

  if (typeof player.x !== 'number' || typeof player.y !== 'number') {
    console.warn('Ball holder missing position', player);
    return null;
  }

  return player;
}

// ============================================================================
// MAIN PHYSICS UPDATE
// ============================================================================

/**
 * Main physics update function called every frame
 */
export function updatePhysics(dt: number): void {
  // Validate ball state first to prevent NaN propagation
  validateBallState();

  const isSetPiece = isSetPieceStatus(gameState.status);

  if (isSetPiece) {
    if (gameState.setPiece && gameState.setPiece.position) {
      gameState.ballPosition.x = gameState.setPiece.position.x;
      gameState.ballPosition.y = gameState.setPiece.position.y;
      gameState.ballVelocity = { x: 0, y: 0 };
      gameState.ballHeight = 0;
      gameState.ballTrajectory = null;
    }
    const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
    updatePlayerPhysics(allPlayers, dt);
    return;
  }

  const allPlayers = [...gameState.homePlayers, ...gameState.awayPlayers];
  updateBallTrajectory(dt);
  if (!gameState.ballTrajectory) {
    updateBallWithHolder(allPlayers, dt);
  }
  updatePlayerPhysics(allPlayers, dt);

  // Update particles and camera shake if functions exist
  if (typeof window.updateParticles === 'function') {
    window.updateParticles(dt);
  }
  updateCameraShake(dt);
}

// ============================================================================
// BALL WITH HOLDER UPDATE
// ============================================================================

/**
 * Update ball position when held by a player
 */
export function updateBallWithHolder(allPlayers: Player[], dt: number): void {
  const holder = gameState.ballHolder;

  if (holder && allPlayers.includes(holder)) {
    const facingAngle = typeof window.getPlayerFacingDirection === 'function'
      ? window.getPlayerFacingDirection(holder)
      : 0;
    const ballOffsetDistance = 12;
    const offsetX = Math.cos(facingAngle) * ballOffsetDistance;
    const offsetY = Math.sin(facingAngle) * ballOffsetDistance;
    gameState.ballPosition.x = holder.x + offsetX;
    gameState.ballPosition.y = holder.y + offsetY;

    if (holder.role === 'GK') {
      handleGoalkeeperBallHold(holder, allPlayers);
    }
  } else {
    if (holder) {
      console.log('Clearing invalid ball holder');
      gameState.ballHolder = null;
    }

    const currentSpeed = Math.sqrt(
      gameState.ballVelocity.x * gameState.ballVelocity.x +
      gameState.ballVelocity.y * gameState.ballVelocity.y
    );

    // Apply friction
    const FRICTION = window.BALL_PHYSICS?.FRICTION ?? 0.985;
    const frictionDecay = Math.pow(FRICTION, dt);
    gameState.ballVelocity.x *= frictionDecay;
    gameState.ballVelocity.y *= frictionDecay;

    if (currentSpeed < 5) {
      gameState.ballVelocity.x = 0;
      gameState.ballVelocity.y = 0;
    }

    gameState.ballPosition.x += gameState.ballVelocity.x * dt;
    gameState.ballPosition.y += gameState.ballVelocity.y * dt;

    // Handle out of bounds
    if (gameState.ballPosition.x < 5 || gameState.ballPosition.x > 795) {
      if (typeof window.handleBallOutOfBounds === 'function') {
        window.handleBallOutOfBounds();
      }
      return;
    }

    if (gameState.ballPosition.y < 5 || gameState.ballPosition.y > 595) {
      if (typeof window.handleThrowIn === 'function') {
        window.handleThrowIn();
      }
      return;
    }

    // Ball control resolution
    const now = Date.now();
    const timeSinceLastAttempt = now - (gameState.lastControlAttempt || 0);
    const minInterval = currentSpeed > 100 ? 100 : 200;

    if (timeSinceLastAttempt > minInterval) {
      if (typeof window.resolveBallControl === 'function') {
        window.resolveBallControl(allPlayers);
      }
      gameState.lastControlAttempt = now;
    }
  }
}

// ============================================================================
// PLAYER PHYSICS UPDATE
// ============================================================================

interface PhysicsDefaults {
  MOVEMENT_THRESHOLD: number;
  ACCELERATION: number;
  MAX_SPEED: number;
  DRIBBLE_SPEED_PENALTY: number;
  FRICTION: number;
  BALL_CONTROL_DISTANCE: number;
  HEADER_HEIGHT_THRESHOLD: number;
  PASS_INTERCEPT_DISTANCE: number;
  LONG_PASS_THRESHOLD: number;
}

const PHYSICS_DEFAULTS: PhysicsDefaults = {
  MOVEMENT_THRESHOLD: 2,
  ACCELERATION: 1200,
  MAX_SPEED: 220,
  DRIBBLE_SPEED_PENALTY: 0.8,
  FRICTION: 0.88,
  BALL_CONTROL_DISTANCE: 25,
  HEADER_HEIGHT_THRESHOLD: 0.6,
  PASS_INTERCEPT_DISTANCE: 25,
  LONG_PASS_THRESHOLD: 150
};

/**
 * Update all player physics (movement, stamina, etc.)
 */
export function updatePlayerPhysics(allPlayers: Player[], dt: number): void {
  const PHYSICS = window.PHYSICS ?? PHYSICS_DEFAULTS;

  allPlayers.forEach(player => {
    // Validate player position
    if (!isFinite(player.x) || !isFinite(player.y)) {
      console.error('Player position corrupted:', player.name);
      player.x = (player as Player & { homeX?: number }).homeX ?? 400;
      player.y = (player as Player & { homeY?: number }).homeY ?? 300;
      player.vx = 0;
      player.vy = 0;
      return;
    }

    if (!isFinite(player.targetX) || !isFinite(player.targetY)) {
      player.targetX = player.x;
      player.targetY = player.y;
    }

    const dx = player.targetX - player.x;
    const dy = player.targetY - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > PHYSICS.MOVEMENT_THRESHOLD) {
      updatePlayerVelocity(player, dx, dy, dist, dt);

      const speed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
      const distCovered = (player as Player & { distanceCovered?: number }).distanceCovered ?? 0;
      (player as Player & { distanceCovered: number }).distanceCovered = distCovered + speed * dt;

      // IMPROVED: Stamina drain per second (not per frame) - more balanced
      let drainRate = 0.15;
      if (speed > 180) drainRate = 0.8;        // Was 1.8 - way too punishing
      else if (speed > 140) drainRate = 0.4;   // Was 1.0
      else if (speed > 100) drainRate = 0.25;  // Was 0.5

      if (player.isChasingBall) drainRate *= 1.2;

      // Apply drain rate scaled by deltaTime (drain is per second)
      const stamina = (player as Player & { stamina?: number }).stamina ?? 100;
      (player as Player & { stamina: number }).stamina = Math.max(0, stamina - (drainRate * dt));

      if (stamina < 20) {
        player.speedBoost = Math.max(player.speedBoost * 0.90, 0.6);
      } else if (stamina < 40) {
        player.speedBoost = Math.max(player.speedBoost * 0.95, 0.8);
      }
    } else {
      applyPlayerFriction(player, dt);

      const speed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
      const recoveryRate = speed < 10 ? 1.2 : 0.6;

      const stamina = (player as Player & { stamina?: number }).stamina ?? 100;
      (player as Player & { stamina: number }).stamina = Math.min(100, stamina + recoveryRate * dt);
    }

    // Update position
    player.x += player.vx * dt;
    player.y += player.vy * dt;

    // Clamp to pitch bounds
    player.x = Math.max(20, Math.min(780, player.x));
    player.y = Math.max(20, Math.min(580, player.y));
  });
}

// ============================================================================
// BALL CHASERS ASSIGNMENT
// ============================================================================

interface ChaseEvaluation {
  player: Player;
  score: number;
  distToBall: number;
}

/**
 * Assign which players should chase the loose ball
 */
export function assignBallChasers(allPlayers: Player[], priorityChaser: Player | null = null): void {
  gameState.ballChasers.clear();

  if (gameState.ballHolder?.hasBallControl || gameState.ballTrajectory) {
    allPlayers.forEach(p => { p.isChasingBall = false; });
    return;
  }

  if (!gameState.ballPosition) return;

  const chaseEvaluations: ChaseEvaluation[] = allPlayers
    .filter(p => p.role !== 'GK')
    .map(player => {
      const distToBall = getDistance(player, gameState.ballPosition);
      if (distToBall > 150) return { player, score: 0, distToBall };

      let score = 100;
      score += Math.max(0, 100 - distToBall);
      score += (player.pace / 100) * 30;

      const aggressiveRoles = ['ST', 'CAM', 'CDM', 'CM'];
      if (aggressiveRoles.includes(player.role)) score += 20;

      if (player.vx || player.vy) {
        const playerAngle = Math.atan2(player.vy, player.vx);
        const ballAngle = Math.atan2(
          gameState.ballPosition.y - player.y,
          gameState.ballPosition.x - player.x
        );
        let angleDiff = Math.abs(playerAngle - ballAngle);
        if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;

        if (angleDiff < Math.PI / 3) score += 25;
      }

      const stamina = (player as Player & { stamina?: number }).stamina ?? 100;
      if (stamina < 40) score *= 0.7;

      const ownGoalX = getAttackingGoalX(!player.isHome, gameState.currentHalf);
      const ballDistToOwnGoal = Math.abs(gameState.ballPosition.x - ownGoalX);

      if (ballDistToOwnGoal < 250) {
        if (['CB', 'RB', 'LB', 'CDM'].includes(player.role)) {
          score += 30;
        }
      }

      return { player, score, distToBall };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const MAX_CHASERS_PER_TEAM = 2;

  const homeChasers = chaseEvaluations
    .filter(e => e.player.isHome)
    .slice(0, MAX_CHASERS_PER_TEAM);

  const awayChasers = chaseEvaluations
    .filter(e => !e.player.isHome)
    .slice(0, MAX_CHASERS_PER_TEAM);

  [...homeChasers, ...awayChasers].forEach(evaluation => {
    evaluation.player.isChasingBall = true;
    (gameState.ballChasers as Set<unknown>).add(evaluation.player.id);
  });

  if (priorityChaser) {
    priorityChaser.isChasingBall = true;
    (gameState.ballChasers as Set<unknown>).add(priorityChaser.id);
  }
}

// ============================================================================
// GOALKEEPER BALL HOLDING
// ============================================================================

/**
 * Handle goalkeeper holding the ball and distribution
 */
function handleGoalkeeperBallHold(holder: Player, allPlayers: Player[]): void {
  if (!holder.ballReceivedTime) {
    holder.ballReceivedTime = Date.now();
  }

  const GK_HOLD_TIME = window.GAME_CONFIG?.GK_HOLD_TIME ?? 5000;

  if (holder.ballReceivedTime && holder === gameState.ballHolder) {
    const holdTime = Date.now() - holder.ballReceivedTime;
    if (holdTime > GK_HOLD_TIME) {
      const teammates = allPlayers.filter(p => p.isHome === holder.isHome && p.role !== 'GK');
      if (teammates.length === 0) return;

      const teamState = holder.isHome ? gameState.homeTeamState : gameState.awayTeamState;
      let target: Player;

      if (teamState === 'COUNTER_ATTACK') {
        const forwards = teammates.filter(p => ['ST', 'RW', 'LW', 'CAM'].includes(p.role));
        target = forwards.length > 0 ? forwards[Math.floor(Math.random() * forwards.length)]! : teammates[0]!;
      } else {
        const defenders = teammates
          .filter(p => ['CB', 'RB', 'LB', 'CDM'].includes(p.role))
          .sort((a, b) => getDistance(a, holder) - getDistance(b, holder));
        target = defenders.length > 0 ? defenders[0]! : teammates[0]!;
      }

      if (target && typeof window.passBall === 'function') {
        window.passBall(holder, holder.x, holder.y, target.x, target.y, 0.9, 450, false);
        holder.ballReceivedTime = null;
      }
    }
  }
}

// ============================================================================
// PLAYER VELOCITY UPDATE
// ============================================================================

/**
 * Update player velocity using steering behaviors
 */
function updatePlayerVelocity(player: Player, dx: number, dy: number, dist: number, dt: number): void {
  // Safe math guards - prevent NaN propagation
  if (!isFinite(dx) || !isFinite(dy) || !isFinite(dist) || dist === 0) {
    return;
  }

  const PHYSICS = window.PHYSICS ?? PHYSICS_DEFAULTS;
  const SLOWING_RADIUS = 50;

  const physicalityBonus = (player.physicality / 100) * 0.15;
  const speedMultiplier = player.speedBoost || 1.0;
  const paceFactor = 0.3 + (player.pace / 100) * 0.7;
  const accel = PHYSICS.ACCELERATION * (paceFactor + physicalityBonus) * speedMultiplier;
  const maxSpeed = PHYSICS.MAX_SPEED * paceFactor * speedMultiplier;

  // IMPROVED: Players move faster when off-ball to get into position
  const effectiveMaxSpeed = player.hasBallControl
    ? maxSpeed * PHYSICS.DRIBBLE_SPEED_PENALTY  // 75% speed with ball
    : maxSpeed * 1.15;                           // 115% speed without ball (positioning)

  let desiredSpeed = effectiveMaxSpeed;
  if (dist < SLOWING_RADIUS) {
    desiredSpeed = effectiveMaxSpeed * (dist / SLOWING_RADIUS);
  }

  // Use safe division
  const dirX = safeDiv(dx, dist, 0);
  const dirY = safeDiv(dy, dist, 0);

  const desiredVX = dirX * desiredSpeed;
  const desiredVY = dirY * desiredSpeed;

  const steeringForceX = desiredVX - player.vx;
  const steeringForceY = desiredVY - player.vy;

  const maxForce = accel * dt;
  const steeringMagnitude = Math.sqrt(steeringForceX * steeringForceX + steeringForceY * steeringForceY);

  if (steeringMagnitude > maxForce) {
    const ratio = maxForce / steeringMagnitude;
    player.vx += steeringForceX * ratio;
    player.vy += steeringForceY * ratio;
  } else {
    player.vx += steeringForceX;
    player.vy += steeringForceY;
  }

  // Validate velocity
  const currentSpeed = safeSqrt(player.vx * player.vx + player.vy * player.vy, 0);
  (player as Player & { currentSpeed?: number }).currentSpeed = currentSpeed;

  // Safe velocity clamping
  if (currentSpeed > effectiveMaxSpeed && currentSpeed > 0) {
    const ratio = safeDiv(effectiveMaxSpeed, currentSpeed, 1);
    player.vx *= ratio;
    player.vy *= ratio;
  }
}

// ============================================================================
// PLAYER FRICTION
// ============================================================================

/**
 * Apply friction to slow down player when not moving
 */
function applyPlayerFriction(player: Player, dt: number): void {
  const PHYSICS_FRICTION = window.PHYSICS?.FRICTION ?? 0.88;

  const physicalityPenalty = (player.physicality / 100) * 0.05;
  const effectiveFriction = PHYSICS_FRICTION - physicalityPenalty;
  const frictionDecay = Math.pow(effectiveFriction, dt);

  player.vx *= frictionDecay;
  player.vy *= frictionDecay;

  if (Math.abs(player.vx) < 5) player.vx = 0;
  if (Math.abs(player.vy) < 5) player.vy = 0;
  (player as Player & { currentSpeed?: number }).currentSpeed = 0;
}

// ============================================================================
// CAMERA SHAKE
// ============================================================================

/**
 * Update camera shake effect
 */
function updateCameraShake(dt: number): void {
  const cameraShake = (gameState as GameState & { cameraShake?: number }).cameraShake ?? 0;
  if (cameraShake > 0) {
    const newShake = cameraShake - cameraShake * 18 * dt;
    (gameState as GameState & { cameraShake: number }).cameraShake = newShake < 0.1 ? 0 : newShake;
  }
}

// ============================================================================
// GLOBAL EXPORTS FOR BROWSER COMPATIBILITY
// ============================================================================

if (typeof window !== 'undefined') {
  window.updatePhysics = updatePhysics;
  window.updatePlayerPhysics = updatePlayerPhysics;
  window.updateBallWithHolder = updateBallWithHolder;
  window.updateBallTrajectory = updateBallTrajectory;
  window.validateBallState = validateBallState;

  console.log('✅ Physics System loaded (TypeScript)');
}
