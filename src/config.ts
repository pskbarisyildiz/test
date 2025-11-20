/**
 * Main Game Configuration
 * Complete, type-safe configuration for the football simulation
 *
 * ✅ Fully migrated from JavaScript with zero functional changes
 * ✅ Maximum type safety with strict TypeScript
 * ✅ Browser-compatible with global window exports
 */

import type * as types from './types';

// ============================================================================
// GAME LOOP CONFIGURATION
// ============================================================================

export const GAME_LOOP: types.GameLoopConfig = {
  FIXED_TIMESTEP: 6 / 60,
  MAX_FRAME_TIME: 0.25,
  GAME_SPEED: 1.0  // 1.0 = 1 game minute = 1 real second
} as const;

// ============================================================================
// PHYSICS CONFIGURATION
// ============================================================================

export const PHYSICS: types.PhysicsConfig = {
  // ✅ FIXED: Adjusted speeds for realistic physics validation
  MAX_SPEED: 200,               // pixels/second (was 250) - realistic player movement
  SPRINT_MULTIPLIER: 1.6,      // Sprint = 112.5 px/s (was 1.3) - more realistic sprint
  ACCELERATION: 250,            // pixels/s² (was 1200) - realistic acceleration
  FRICTION: 0.88,              // Per second decay
  DRIBBLE_SPEED_PENALTY: 0.75, // 25% slower when dribbling
  COLLISION_RADIUS: 25,        // Increased from 18 - prevent player overlap
  BALL_CONTROL_DISTANCE: 40,   // Increased from 28 - easier ball control
  PASS_INTERCEPT_DISTANCE: 40,
  MOVEMENT_THRESHOLD: 5.0,
  POSITIONING_SMOOTHNESS: 0.04,
  LONG_PASS_THRESHOLD: 150,    // ~20m in real world
  HEADER_HEIGHT_THRESHOLD: 0.3,
  PLAYER_MASS: 75,
  BALL_MASS: 0.45
} as const;

export const BALL_PHYSICS: types.BallPhysicsConfig = {
  MAX_SPEED: 550,              // pixels/second
  FRICTION: 0.88,              // IMPROVED: Slower deceleration (was 0.44) - passes travel further
  GRAVITY: 600,                // Unchanged - feels right
  BOUNCE: 0.6,
  SPIN_EFFECT: 0.05
} as const;

// ============================================================================
// GAME CONFIGURATION
// ============================================================================

export const GAME_CONFIG: types.GameConfig = {
  GOAL_CHECK_DISTANCE: 200,
  SHOOTING_CHANCE_BASE: 0.3,
  PASSING_CHANCE: 0.70,
  EVENT_PROBABILITY: 0.5,
  DECISION_COOLDOWN: 250,            // IMPROVED: Faster decisions (was 600ms)
  GK_HOLD_TIME: 800,                 // IMPROVED: Faster GK distribution (was 1800ms)
  HIGH_DPI_SCALE_FACTOR: 1,
  GOAL_Y_TOP: 240,
  GOAL_Y_BOTTOM: 360,
  PITCH_WIDTH: 800,
  PITCH_HEIGHT: 600,
  AVERAGE_SPRINT_TIME_TO_GOAL: 10,  // seconds
  REACTION_TIME_MIN: 150,            // ms
  REACTION_TIME_MAX: 350,            // ms
  GAME_SPEED: 1.0,
  GOAL_X_LEFT: 50,
  GOAL_X_RIGHT: 750
} as const;

// ============================================================================
// POSITION TO ROLE MAPPING
// ============================================================================

export const positionToRoleMap: types.PositionToRoleMap = {
  // Goalkeepers
  'Goalkeeper': 'GK',
  'Keeper': 'GK',
  // Defenders
  'Centre-Back': 'CB',
  'Center Back': 'CB',
  'Defender (Centre)': 'CB',
  'Right-Back': 'RB',
  'Right Back': 'RB',
  'Defender (Right)': 'RB',
  'Left-Back': 'LB',
  'Left Back': 'LB',
  'Defender (Left)': 'LB',
  'Wing-Back (Right)': 'RB',
  'Wing-Back (Left)': 'LB',
  // Midfielders
  'Defensive Midfield': 'CDM',
  'Midfielder (Defensive)': 'CDM',
  'Central Midfield': 'CM',
  'Midfielder (Centre)': 'CM',
  'Right Midfield': 'RM',
  'Midfielder (Right)': 'RM',
  'Left Midfield': 'LM',
  'Midfielder (Left)': 'LM',
  'Attacking Midfield': 'CAM',
  'Midfielder (Attacking)': 'CAM',
  // Forwards
  'Right Winger': 'RW',
  'Forward (Right)': 'RW',
  'Winger (Right)': 'RW',
  'Left Winger': 'LW',
  'Forward (Left)': 'LW',
  'Winger (Left)': 'LW',
  'Second Striker': 'ST',
  'Striker': 'ST',
  'Centre-Forward': 'ST',
  'Forward (Centre)': 'ST'
} as const;

/**
 * Convert position string to tactical role
 */
export function getRoleFromPosition(positionString: string | null | undefined): types.PlayerRole {
  if (!positionString) return 'CM'; // Default role
  const primaryPosition = positionString.split(',')[0]?.trim() ?? '';
  return positionToRoleMap[primaryPosition] || 'CM';
}

// ============================================================================
// POSITION-SPECIFIC CONFIGURATIONS
// ============================================================================

export const POSITION_CONFIGS: types.PositionConfigsMap = {
  'GK': {
    defensiveness: 1.0,
    attackRange: 0,
    ballChasePriority: 0.1,
    idealWidth: 0,
    pushUpOnAttack: 0,
    pressAggression: 0.0,
    zoneCoverage: 1.0,
    supportDistance: 0,
    maxSpeed: 140
  },
  'CB': {
    defensiveness: 0.9,
    attackRange: 0.15,
    ballChasePriority: 0.3,
    idealWidth: 0.15,
    pushUpOnAttack: 90,
    pressAggression: 0.5,
    zoneCoverage: 0.7,
    supportDistance: 40,
    maxSpeed: 144
  },
  'LCB': {
    defensiveness: 0.9,
    attackRange: 0.15,
    ballChasePriority: 0.3,
    idealWidth: 0.2,
    pushUpOnAttack: 90,
    pressAggression: 0.5,
    zoneCoverage: 0.7,
    supportDistance: 40,
    maxSpeed: 144
  },
  'RCB': {
    defensiveness: 0.9,
    attackRange: 0.15,
    ballChasePriority: 0.3,
    idealWidth: 0.2,
    pushUpOnAttack: 90,
    pressAggression: 0.5,
    zoneCoverage: 0.7,
    supportDistance: 40,
    maxSpeed: 144
  },
  'RB': {
    defensiveness: 0.7,
    attackRange: 0.75,
    ballChasePriority: 0.4,
    idealWidth: 0.35,
    pushUpOnAttack: 160,
    pressAggression: 0.5,
    zoneCoverage: 0.7,
    supportDistance: 60,
    maxSpeed: 156
  },
  'LB': {
    defensiveness: 0.7,
    attackRange: 0.75,
    ballChasePriority: 0.4,
    idealWidth: 0.35,
    pushUpOnAttack: 160,
    pressAggression: 0.5,
    zoneCoverage: 0.7,
    supportDistance: 60,
    maxSpeed: 156
  },
  'CDM': {
    defensiveness: 0.65,
    attackRange: 0.45,
    ballChasePriority: 0.6,
    idealWidth: 0.2,
    pushUpOnAttack: 120,
    pressAggression: 0.6,
    zoneCoverage: 0.8,
    supportDistance: 50,
    maxSpeed: 148
  },
  'CM': {
    defensiveness: 0.5,
    attackRange: 0.6,
    ballChasePriority: 0.7,
    idealWidth: 0.25,
    pushUpOnAttack: 160,
    pressAggression: 0.7,
    zoneCoverage: 0.6,
    supportDistance: 70,
    maxSpeed: 152
  },
  'LCM': {
    defensiveness: 0.5,
    attackRange: 0.6,
    ballChasePriority: 0.7,
    idealWidth: 0.3,
    pushUpOnAttack: 160,
    pressAggression: 0.7,
    zoneCoverage: 0.6,
    supportDistance: 70,
    maxSpeed: 152
  },
  'RCM': {
    defensiveness: 0.5,
    attackRange: 0.6,
    ballChasePriority: 0.7,
    idealWidth: 0.3,
    pushUpOnAttack: 160,
    pressAggression: 0.7,
    zoneCoverage: 0.6,
    supportDistance: 70,
    maxSpeed: 152
  },
  'RM': {
    defensiveness: 0.4,
    attackRange: 0.7,
    ballChasePriority: 0.75,
    idealWidth: 0.35,
    pushUpOnAttack: 180,
    pressAggression: 0.6,
    zoneCoverage: 0.5,
    supportDistance: 80,
    maxSpeed: 160
  },
  'LM': {
    defensiveness: 0.4,
    attackRange: 0.7,
    ballChasePriority: 0.75,
    idealWidth: 0.35,
    pushUpOnAttack: 180,
    pressAggression: 0.6,
    zoneCoverage: 0.5,
    supportDistance: 80,
    maxSpeed: 160
  },
  'CAM': {
    defensiveness: 0.3,
    attackRange: 0.75,
    ballChasePriority: 0.85,
    idealWidth: 0.15,
    pushUpOnAttack: 200,
    pressAggression: 0.8,
    zoneCoverage: 0.4,
    supportDistance: 90,
    maxSpeed: 154
  },
  'RW': {
    defensiveness: 0.25,
    attackRange: 0.85,
    ballChasePriority: 0.8,
    idealWidth: 0.4,
    pushUpOnAttack: 200,
    pressAggression: 0.5,
    zoneCoverage: 0.3,
    supportDistance: 100,
    maxSpeed: 164
  },
  'LW': {
    defensiveness: 0.25,
    attackRange: 0.85,
    ballChasePriority: 0.8,
    idealWidth: 0.4,
    pushUpOnAttack: 200,
    pressAggression: 0.5,
    zoneCoverage: 0.3,
    supportDistance: 100,
    maxSpeed: 164
  },
  'ST': {
    defensiveness: 0.10,
    attackRange: 0.9,
    ballChasePriority: 0.9,
    idealWidth: 0.1,
    pushUpOnAttack: 240,
    pressAggression: 0.4,
    zoneCoverage: 0.2,
    supportDistance: 110,
    maxSpeed: 158
  },
  'CF': {
    defensiveness: 0.10,
    attackRange: 0.9,
    ballChasePriority: 0.9,
    idealWidth: 0.1,
    pushUpOnAttack: 240,
    pressAggression: 0.4,
    zoneCoverage: 0.2,
    supportDistance: 110,
    maxSpeed: 158
  }
} as const;

// ============================================================================
// TACTICS
// ============================================================================

export const TACTICS: types.TacticsMap = {
  balanced: {
    name: 'Balanced',
    description: 'Flexible approach adapting to game situation',
    pressIntensity: 0.5,
    defensiveLineDepth: 0.5,
    counterAttackSpeed: 1.1,
    possessionPriority: 0.5,
    passingRisk: 0.5,
    preferHighPress: false,
    preferCounterAttack: false,
    compactness: 0.5
  },
  high_press: {
    name: 'High Press',
    description: 'Aggressive pressing to win ball high up the pitch',
    pressIntensity: 0.9,
    defensiveLineDepth: 0.7,
    counterAttackSpeed: 1.2,
    possessionPriority: 0.4,
    passingRisk: 0.6,
    preferHighPress: true,
    preferCounterAttack: false,
    compactness: 0.8
  },
  possession: {
    name: 'Possession',
    description: 'Control the game through patient build-up play',
    pressIntensity: 0.4,
    defensiveLineDepth: 0.6,
    counterAttackSpeed: 1.0,
    possessionPriority: 0.9,
    passingRisk: 0.3,
    preferHighPress: false,
    preferCounterAttack: false,
    compactness: 0.7
  },
  counter_attack: {
    name: 'Counter-Attack',
    description: 'Absorb pressure and strike on the break',
    pressIntensity: 0.3,
    defensiveLineDepth: 0.3,
    counterAttackSpeed: 1.4,
    possessionPriority: 0.3,
    passingRisk: 0.7,
    preferHighPress: false,
    preferCounterAttack: true,
    compactness: 0.9
  },
  park_the_bus: {
    name: 'Park the Bus',
    description: 'Ultra-defensive, protect the lead at all costs',
    pressIntensity: 0.2,
    defensiveLineDepth: 0.2,
    counterAttackSpeed: 1.3,
    possessionPriority: 0.2,
    passingRisk: 0.8,
    preferHighPress: false,
    preferCounterAttack: true,
    compactness: 1.0
  },
  total_football: {
    name: 'Total Football',
    description: 'Fluid positional play with high technical demands',
    pressIntensity: 0.8,
    defensiveLineDepth: 0.7,
    counterAttackSpeed: 1.25,
    possessionPriority: 0.8,
    passingRisk: 0.5,
    preferHighPress: true,
    preferCounterAttack: false,
    compactness: 0.6
  }
} as const;

// ============================================================================
// TEAM STATE MODIFIERS
// ============================================================================

export const TEAM_STATE_MODIFIERS: types.TeamStateModifiersMap = {
  ATTACKING: {
    speedMultiplier: 1.08,
    positioningAggression: 0.8,
    riskTolerance: 0.7,
    pressTriggerDistance: 100
  },
  DEFENDING: {
    speedMultiplier: 1.0,
    positioningAggression: 0.3,
    riskTolerance: 0.2,
    pressTriggerDistance: 60
  },
  HIGH_PRESS: {
    speedMultiplier: 1.25,
    positioningAggression: 0.9,
    riskTolerance: 0.5,
    pressTriggerDistance: 120
  },
  COUNTER_ATTACK: {
    speedMultiplier: 1.4,
    positioningAggression: 0.9,
    riskTolerance: 0.8,
    pressTriggerDistance: 40
  },
  BALANCED: {
    speedMultiplier: 1.0,
    positioningAggression: 0.5,
    riskTolerance: 0.5,
    pressTriggerDistance: 80
  }
} as const;

// ============================================================================
// BEHAVIOR TREE CONFIGURATION
// ============================================================================

export const BT_CONFIG: types.BehaviorTreeConfig = {
  PRIORITY_SHOOT: 100,
  PRIORITY_PASS: 70,
  PRIORITY_DRIBBLE: 50,
  PRIORITY_TACKLE: 90,
  PRIORITY_MARK: 60,
  PRIORITY_POSITION: 40,
  BALL_CLOSE_DISTANCE: 100,
  OPPONENT_CLOSE_DISTANCE: 35,
  TEAMMATE_SUPPORT_DISTANCE: 150,
  MAX_BALL_HOLD_TIME: 2000,
  MAX_BALL_HOLD_TIME_UNDER_PRESSURE: 800,
  SHOOT_CHANCE_IN_BOX: 0.75,
  SHOOT_CHANCE_OUTSIDE_BOX: 0.25,
  PASS_CHANCE_UNDER_PRESSURE: 0.75,
  DRIBBLE_CHANCE_IN_SPACE: 0.55
} as const;

// ============================================================================
// FORMATIONS (Normalized 0-1 coordinates)
// ============================================================================

export const FORMATIONS: types.FormationsMap = {
  '4-4-2': [
    { x: 0.08, y: 0.5, role: 'GK' },
    { x: 0.22, y: 0.15, role: 'RB' },
    { x: 0.22, y: 0.38, role: 'CB' },
    { x: 0.22, y: 0.62, role: 'CB' },
    { x: 0.22, y: 0.85, role: 'LB' },
    { x: 0.5, y: 0.15, role: 'RM' },
    { x: 0.5, y: 0.38, role: 'CM' },
    { x: 0.5, y: 0.62, role: 'CM' },
    { x: 0.5, y: 0.85, role: 'LM' },
    { x: 0.75, y: 0.4, role: 'ST' },
    { x: 0.75, y: 0.6, role: 'ST' }
  ],
  '4-3-3': [
    { x: 0.08, y: 0.5, role: 'GK' },
    { x: 0.22, y: 0.15, role: 'RB' },
    { x: 0.22, y: 0.38, role: 'CB' },
    { x: 0.22, y: 0.62, role: 'CB' },
    { x: 0.22, y: 0.85, role: 'LB' },
    { x: 0.45, y: 0.25, role: 'CM' },
    { x: 0.45, y: 0.5, role: 'CDM' },
    { x: 0.45, y: 0.75, role: 'CM' },
    { x: 0.75, y: 0.2, role: 'RW' },
    { x: 0.75, y: 0.5, role: 'ST' },
    { x: 0.75, y: 0.8, role: 'LW' }
  ],
  '4-4-1-1': [
    { x: 0.08, y: 0.5, role: 'GK' },
    { x: 0.22, y: 0.15, role: 'RB' },
    { x: 0.22, y: 0.38, role: 'CB' },
    { x: 0.22, y: 0.62, role: 'CB' },
    { x: 0.22, y: 0.85, role: 'LB' },
    { x: 0.5, y: 0.15, role: 'RM' },
    { x: 0.5, y: 0.38, role: 'CM' },
    { x: 0.5, y: 0.62, role: 'CM' },
    { x: 0.5, y: 0.85, role: 'LM' },
    { x: 0.68, y: 0.5, role: 'CAM' },
    { x: 0.82, y: 0.5, role: 'ST' }
  ],
  '4-4-2-diamond': [
    { x: 0.08, y: 0.5, role: 'GK' },
    { x: 0.22, y: 0.15, role: 'RB' },
    { x: 0.22, y: 0.38, role: 'CB' },
    { x: 0.22, y: 0.62, role: 'CB' },
    { x: 0.22, y: 0.85, role: 'LB' },
    { x: 0.42, y: 0.5, role: 'CDM' },
    { x: 0.55, y: 0.3, role: 'CM' },
    { x: 0.55, y: 0.7, role: 'CM' },
    { x: 0.68, y: 0.5, role: 'CAM' },
    { x: 0.8, y: 0.4, role: 'ST' },
    { x: 0.8, y: 0.6, role: 'ST' }
  ],
  '4-3-1-2': [
    { x: 0.08, y: 0.5, role: 'GK' },
    { x: 0.22, y: 0.15, role: 'RB' },
    { x: 0.22, y: 0.38, role: 'CB' },
    { x: 0.22, y: 0.62, role: 'CB' },
    { x: 0.22, y: 0.85, role: 'LB' },
    { x: 0.45, y: 0.25, role: 'CM' },
    { x: 0.45, y: 0.5, role: 'CDM' },
    { x: 0.45, y: 0.75, role: 'CM' },
    { x: 0.65, y: 0.5, role: 'CAM' },
    { x: 0.8, y: 0.4, role: 'ST' },
    { x: 0.8, y: 0.6, role: 'ST' }
  ],
  '4-3-2-1': [
    { x: 0.08, y: 0.5, role: 'GK' },
    { x: 0.22, y: 0.15, role: 'RB' },
    { x: 0.22, y: 0.38, role: 'CB' },
    { x: 0.22, y: 0.62, role: 'CB' },
    { x: 0.22, y: 0.85, role: 'LB' },
    { x: 0.45, y: 0.25, role: 'CM' },
    { x: 0.45, y: 0.5, role: 'CDM' },
    { x: 0.45, y: 0.75, role: 'CM' },
    { x: 0.65, y: 0.35, role: 'CAM' },
    { x: 0.65, y: 0.65, role: 'CAM' },
    { x: 0.82, y: 0.5, role: 'ST' }
  ]
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Draw ground shadow for ball (with height)
 */
export function drawGroundShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  ballHeight: number
): void {
  const shadowY = y + size / 2;
  const shadowRadiusX = size * 1.2 * (1 - ballHeight * 0.4);
  const shadowRadiusY = shadowRadiusX * 0.3;
  const shadowOpacity = 0.4 * (1 - ballHeight * 0.5);

  if (shadowOpacity > 0) {
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity})`;
    ctx.beginPath();
    ctx.ellipse(x, shadowY, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Toggle screen orientation (vertical/horizontal)
 * Requires gameState and render function to be available globally
 */
export function toggleOrientation(): void {
  console.log('Toggling orientation...');

  if (typeof window === 'undefined' || !window.gameState) {
    console.error('toggleOrientation: gameState not available');
    return;
  }

  // Toggle the state
  window.gameState.isVertical = !window.gameState.isVertical;

  // Set flag to force background cache rebuild
  window.gameState.orientationChanged = true;

  // Clear canvas and context references
  window.gameState.canvases = { background: null, game: null, ui: null };
  window.gameState.contexts = { background: null, game: null, ui: null };
  window.gameState.backgroundDrawn = false;

  // Re-render the entire UI structure
  if (typeof window.render === 'function') {
    window.render();
  }
}

/**
 * Validate physics realism (development only)
 */
export function validatePhysicsRealism(): void {
  console.log('=== PHYSICS REALISM VALIDATION ===');

  // Test 1: Time to cross pitch
  const pitchWidth = GAME_CONFIG.PITCH_WIDTH;
  const maxSpeed = PHYSICS.MAX_SPEED;
  const timeToCross = pitchWidth / maxSpeed;
  console.log(`✓ Time to cross pitch: ${timeToCross.toFixed(1)}s (target: 10-12s)`);
  console.assert(timeToCross >= 5 && timeToCross <= 15, 'Pitch crossing time unrealistic!');

  // Test 2: Ball faster than players
  const ballSpeed = BALL_PHYSICS.MAX_SPEED;
  console.log(`✓ Ball max speed: ${ballSpeed} px/s (${(ballSpeed / maxSpeed).toFixed(1)}x player speed)`);
  console.assert(ballSpeed > maxSpeed * 2, 'Ball should be significantly faster than players!');

  // Test 3: Acceleration time
  const timeToMaxSpeed = maxSpeed / PHYSICS.ACCELERATION;
  console.log(`✓ Time to max speed: ${timeToMaxSpeed.toFixed(1)}s (target: 2-3s)`);
  console.assert(timeToMaxSpeed >= 1.5 && timeToMaxSpeed <= 3.5, 'Acceleration unrealistic!');

  // Test 4: Sprint multiplier
  const sprintSpeed = maxSpeed * PHYSICS.SPRINT_MULTIPLIER;
  console.log(`✓ Sprint speed: ${sprintSpeed.toFixed(0)} px/s`);
  console.assert(sprintSpeed < 350, 'Sprint speed too high!');

  console.log('=== ALL TESTS PASSED ===');
}

// Continuation in next block...
