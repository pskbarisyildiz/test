/**
 * Behavioral Dynamics Engine
 * @migrated-from js/BehaviorSystem.js
 *
 * Comprehensive role-based player intelligence system implementing tactical
 * behaviors across all phases of play. Integrates with existing AI.
 */

import type {
  Player,
  Vector2D,
  GameState
} from '../types';
import { distance as getDistance } from '../utils/math';
import { SetPieceBehaviorSystem } from '../setpieces/SetPieceBehaviorSystem';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Behavior execution result with target position and metadata
 */
export interface BehaviorResultSuccess {
  available: true;
  target: Vector2D;
  speedMultiplier: number;
  description: string;
  shouldLock: boolean;
  error: null;
  duration?: number;
}

/**
 * Unavailable behavior result with reason
 */
export interface BehaviorResultUnavailable {
  available: false;
  target: null;
  speedMultiplier: number;
  description: string;
  shouldLock: false;
  error: string;
  duration?: number;
}

/**
 * Union type for behavior results
 */
export type BehaviorResultType = BehaviorResultSuccess | BehaviorResultUnavailable;

/**
 * Game phases for tactical behavior selection
 */
export type GamePhase =
  | 'defensive'
  | 'attacking'
  | 'transition_attack'
  | 'transition_defense'
  | 'SET_PIECE';

/**
 * Tactical system types
 */
export type TacticalSystemType =
  | 'possession'
  | 'high_press'
  | 'counter_attack'
  | 'low_block'
  | 'balanced';

// ============================================================================
// BEHAVIOR RESULT HELPER
// ============================================================================

/**
 * Helper object for creating consistent behavior results
 * ✅ FIX #9: CONSISTENT BEHAVIOR RESULT TYPE
 */
export const BehaviorResult = {
  /**
   * Create successful behavior result
   */
  success(
    target: Vector2D,
    speedMultiplier: number = 1.0,
    description: string = '',
    shouldLock: boolean = false
  ): BehaviorResultSuccess {
    return {
      available: true,
      target,
      speedMultiplier,
      description,
      shouldLock,
      error: null
    };
  },

  /**
   * Create unavailable behavior result with reason
   */
  unavailable(reason: string = 'Conditions not met'): BehaviorResultUnavailable {
    return {
      available: false,
      target: null,
      speedMultiplier: 1.0,
      description: '',
      shouldLock: false,
      error: reason
    };
  },

  /**
   * Check if result is valid and available
   */
  isValid(result: BehaviorResultType | null): result is BehaviorResultSuccess {
    return result !== null && typeof result === 'object' && result.available === true;
  }
};

// ============================================================================
// PHASE CONSTANTS
// ============================================================================

export const PHASES = {
  DEFENSIVE: 'defensive' as const,
  ATTACKING: 'attacking' as const,
  TRANSITION_TO_ATTACK: 'transition_attack' as const,
  TRANSITION_TO_DEFENSE: 'transition_defense' as const
};

// ============================================================================
// GOALKEEPER BEHAVIORS
// ============================================================================

export const GoalkeeperBehaviors = {
  /**
   * Sweeper-keeper: Actively defend space behind high defensive line
   */
  sweeperKeeping(
    _gk: Player,
    ball: Vector2D,
    teammates: Player[],
    opponents: Player[],
    ownGoalX: number
  ): BehaviorResultSuccess | null {
    const defenders = teammates.filter(t => ['CB', 'RB', 'LB'].includes(t.role as string));
    if (defenders.length === 0) return null; // No defenders = no sweeping needed

    const defensiveLine = Math.max(...defenders.map(t => Math.abs(t.x - ownGoalX)));

    // Only sweep if defensive line is pushed high (>200 units from goal)
    if (defensiveLine < 200) return null;

    
    const threatBehindLine = opponents.find(opp => {
      const oppDistToGoal = Math.abs(opp.x - ownGoalX);
      return oppDistToGoal < defensiveLine - 50 && getDistance(opp, ball) < 100;
    });

    if (threatBehindLine) {
      const interceptPoint = {
        x: ownGoalX + Math.sign(ball.x - ownGoalX) * Math.min(defensiveLine * 0.6, 180),
        y: ball.y
      };

      return {
        available: true,
        target: interceptPoint,
        speedMultiplier: 1.8,
        description: 'sweeper-keeper intercept',
        shouldLock: true,
        error: null
      };
    }

    return null;
  },

  /**
   * Build-up play: GK as first attacker providing +1 option
   */
  buildUpSupport(
    _gk: Player,
    holder: Player | null,
    _teammates: Player[],
    ownGoalX: number
  ): BehaviorResultSuccess | null {
    if (!holder || holder.role === 'GK') return null;

    const holderDistToGoal = Math.abs(holder.x - ownGoalX);

    // Only support if ball is in own half
    if (holderDistToGoal > 400) return null;

    const safeZone = {
      x: ownGoalX + Math.sign(holder.x - ownGoalX) * 80,
      y: 300
    };

    return {
      available: true,
      target: safeZone,
      speedMultiplier: 1.0,
      description: 'GK build-up support',
      shouldLock: false,
      error: null
    };
  },

  /**
   * Positioning for shot-stopping: Narrow the angle
   */
  angleNarrowing(
    _gk: Player,
    ball: Vector2D,
    _shooter: Player | null,
    ownGoalX: number
  ): BehaviorResultSuccess {
    
    const goalCenter = { x: ownGoalX, y: 300 };
    const ballToGoalDist = getDistance(ball, goalCenter);

    // Position on line between ball and goal center
    const optimalDist = Math.min(ballToGoalDist * 0.35, 60);
    const angle = Math.atan2(ball.y - goalCenter.y, ball.x - goalCenter.x);

    return {
      available: true,
      target: {
        x: goalCenter.x + Math.cos(angle) * optimalDist,
        y: goalCenter.y + Math.sin(angle) * optimalDist
      },
      speedMultiplier: 1.4,
      description: 'angle narrowing',
      shouldLock: true,
      error: null
    };
  }
};

// ============================================================================
// DEFENSIVE UNIT BEHAVIORS
// ============================================================================

export const DefensiveBehaviors = {
  /**
   * Collective line movement: Ball-oriented shifting
   */
  defensiveLineShift(
    player: Player,
    ball: Vector2D,
    teammates: Player[],
    ownGoalX: number
  ): BehaviorResultSuccess | null {
    if (!['CB', 'RB', 'LB'].includes(player.role as string)) return null;

    
    const defensiveLine = teammates.filter(t =>
      ['CB', 'RB', 'LB'].includes(t.role as string)
    );

    if (defensiveLine.length < 2) return null;

    // Calculate average line position
    const avgLineX = defensiveLine.reduce((sum, p) => sum + p.x, 0) / defensiveLine.length;
    const targetLineX = avgLineX + (ball.y - 300) * 0.15; // Horizontal shift with ball

    // Vertical position: push up or drop based on pressure
    const ballPressure = Math.min(...teammates.map(t => getDistance(t, ball)));
    const verticalAdjust = ballPressure < 50 ? 25 : -15; // Push up if ball under pressure

    return {
      available: true,
      target: {
        x: player.x + Math.sign(targetLineX - avgLineX) * 20 + verticalAdjust * Math.sign(ownGoalX - player.x),
        y: player.y + (ball.y - player.y) * 0.2 // Shift laterally
      },
      speedMultiplier: 1.0,
      description: 'defensive line shift',
      shouldLock: false,
      error: null
    };
  },

  /**
   * Full-back covering: Prevent crosses and track wide threats
   */
  fullBackCovering(
    fb: Player,
    _ball: Vector2D,
    opponents: Player[],
    _ownGoalX: number
  ): BehaviorResultSuccess | null {
    if (!['RB', 'LB'].includes(fb.role as string)) return null;

    
    const isRightBack = fb.role === 'RB';
    const wideThreats = opponents.filter(opp =>
      (isRightBack && opp.y < 200) || (!isRightBack && opp.y > 400)
    );

    if (wideThreats.length === 0) return null;

    const nearestThreat = wideThreats.sort((a, b) =>
      getDistance(a, fb) - getDistance(b, fb)
    )[0];

    if (!nearestThreat) return null;

    const distToThreat = getDistance(nearestThreat, fb);

    // If threat is advancing with ball, close down aggressively
    if (distToThreat < 150) {
      const interceptAngle = Math.atan2(nearestThreat.y - fb.y, nearestThreat.x - fb.x);

      return {
        available: true,
        target: {
          x: fb.x + Math.cos(interceptAngle) * 50,
          y: fb.y + Math.sin(interceptAngle) * 50
        },
        speedMultiplier: 1.5,
        description: 'full-back pressing winger',
        shouldLock: true,
        error: null
      };
    }

    return null;
  },

  /**
   * Center-back covering and marking
   */
  centerBackMarking(
    cb: Player,
    opponents: Player[],
    _teammates: Player[],
    ownGoalX: number
  ): BehaviorResultSuccess | null {
    if (!['CB'].includes(cb.role as string)) return null;

    
    const strikers = opponents.filter(opp => ['ST', 'CF'].includes(opp.role as string));
    if (strikers.length === 0) return null;

    const nearestStriker = strikers.sort((a, b) =>
      getDistance(a, cb) - getDistance(b, cb)
    )[0];

    if (!nearestStriker) return null;

    // Maintain tight marking within danger zone
    const inDangerZone = Math.abs(nearestStriker.x - ownGoalX) < 200;

    if (inDangerZone) {
      const markingDist = 15;
      const angle = Math.atan2(nearestStriker.y - ownGoalX, nearestStriker.x - ownGoalX);

      return {
        available: true,
        target: {
          x: nearestStriker.x - Math.cos(angle) * markingDist,
          y: nearestStriker.y - Math.sin(angle) * markingDist
        },
        speedMultiplier: 1.3,
        description: 'CB tight marking',
        shouldLock: true,
        error: null
      };
    }

    return null;
  },

  /**
   * Inverted full-back: Move into central midfield during possession
   */
  invertedFullBack(
    fb: Player,
    holder: Player | null,
    teammates: Player[],
    ownGoalX: number
  ): BehaviorResultSuccess | null {
    if (!['RB', 'LB'].includes(fb.role as string)) return null;
    if (!holder || holder.isHome !== fb.isHome) return null;

    // Only invert when ball is in own half
    const ballInOwnHalf = Math.abs(holder.x - ownGoalX) < 400;
    if (!ballInOwnHalf) return null;

    // Check if there's space in midfield
    const midfielders = teammates.filter(t =>
      ['CM', 'CDM', 'CAM'].includes(t.role as string)
    );

    const midFieldCongestion = midfielders.reduce((sum, m) =>
      sum + (Math.abs(m.y - 300) < 100 ? 1 : 0), 0
    );

    if (midFieldCongestion > 2) return null;

    return {
      available: true,
      target: {
        x: ownGoalX + Math.sign(holder.x - ownGoalX) * 250,
        y: 300 // Move to center
      },
      speedMultiplier: 1.1,
      description: 'inverted full-back',
      shouldLock: false,
      error: null
    };
  }
};

// ============================================================================
// MIDFIELD BEHAVIORS
// ============================================================================

export const MidfieldBehaviors = {
  /**
   * Defensive midfielder screening the defense
   */
  cdmScreening(
    cdm: Player,
    ball: Vector2D,
    _opponents: Player[],
    teammates: Player[],
    _ownGoalX: number
  ): BehaviorResultSuccess | null {
    if (!['CDM'].includes(cdm.role as string)) return null;

    const defensiveLine = teammates.filter(t =>
      ['CB', 'RB', 'LB'].includes(t.role as string)
    );

    if (defensiveLine.length === 0) return null;

    const avgDefLineX = defensiveLine.reduce((sum, p) => sum + p.x, 0) / defensiveLine.length;

    // Position between ball and defense
    const screeningX = avgDefLineX + Math.sign(ball.x - avgDefLineX) * 80;
    const screeningY = 300 + (ball.y - 300) * 0.4; // Shift laterally with ball

    return {
      available: true,
      target: { x: screeningX, y: screeningY },
      speedMultiplier: 1.0,
      description: 'CDM screening defense',
      shouldLock: false,
      error: null
    };
  },

  /**
   * Box-to-box midfielder: Late runs into penalty area
   */
  boxToBoxLateRun(
    cm: Player,
    ball: Vector2D,
    holder: Player | null,
    teammates: Player[],
    opponentGoalX: number
  ): BehaviorResultSuccess | null {
    if (!['CM'].includes(cm.role as string)) return null;
    if (!holder || holder.isHome !== cm.isHome) return null;

    const ballInFinalThird = Math.abs(ball.x - opponentGoalX) < 250;
    const alreadyForward = Math.abs(cm.x - opponentGoalX) < 180;
    const playersInBox = teammates.filter(t =>
      Math.abs(t.x - opponentGoalX) < 150
    ).length;

    if (!ballInFinalThird || alreadyForward || playersInBox > 2) return null;

    return {
      available: true,
      target: {
        x: opponentGoalX - Math.sign(opponentGoalX - 400) * 100,
        y: 300 + (Math.random() - 0.5) * 120
      },
      speedMultiplier: 1.7,
      description: 'box-to-box late run',
      shouldLock: true,
      error: null
    };
  },

  /**
   * Regista/Deep-lying playmaker: Dictate tempo from deep
   */
  registaTempoDictation(
    cm: Player,
    holder: Player | null,
    _teammates: Player[],
    ownGoalX: number
  ): BehaviorResultSuccess | null {
    if (!['CM', 'CDM'].includes(cm.role as string)) return null;
    if (!holder || holder.isHome !== cm.isHome) return null;

    // Stay deep to provide passing options
    const deepPosition = {
      x: ownGoalX + Math.sign(holder.x - ownGoalX) * 200,
      y: 300
    };

    const inDeepZone = Math.abs(cm.x - deepPosition.x) < 60;

    if (inDeepZone) return null;

    return {
      available: true,
      target: deepPosition,
      speedMultiplier: 0.9,
      description: 'regista deep positioning',
      shouldLock: false,
      error: null
    };
  },

  /**
   * Attacking midfielder: Find pockets between the lines
   */
  camBetweenLines(
    cam: Player,
    opponents: Player[],
    opponentGoalX: number
  ): BehaviorResultSuccess | null {
    if (!['CAM'].includes(cam.role as string)) return null;

    // Find defensive and midfield lines of opposition
    const oppDefenders = opponents.filter(o =>
      ['CB', 'RB', 'LB', 'CDM'].includes(o.role as string)
    );

    if (oppDefenders.length < 2) return null;

    const avgDefX = oppDefenders.reduce((sum, p) => sum + p.x, 0) / oppDefenders.length;
    const pocketX = avgDefX + Math.sign(opponentGoalX - avgDefX) * 60;

    return {
      available: true,
      target: {
        x: pocketX,
        y: 300 + (Math.random() - 0.5) * 80
      },
      speedMultiplier: 1.2,
      description: 'CAM finding pocket',
      shouldLock: false,
      error: null
    };
  },

  /**
   * Central midfielder pressing trigger
   */
  cmPressTrigger(
    cm: Player,
    _ball: Vector2D,
    _opponents: Player[],
    holder: Player | null
  ): BehaviorResultSuccess | null {
    if (!['CM'].includes(cm.role as string)) return null;
    if (!holder || holder.isHome === cm.isHome) return null;

    
    // Trigger press when opposition midfielder has ball in central areas
    const holderInCenter = Math.abs(holder.y - 300) < 150;
    const distToHolder = getDistance(cm, holder);

    if (holderInCenter && distToHolder < 80) {
      return {
        available: true,
        target: {
          x: holder.x,
          y: holder.y
        },
        speedMultiplier: 1.6,
        description: 'CM press trigger',
        shouldLock: true,
        error: null
      };
    }

    return null;
  }
};

// ============================================================================
// FORWARD BEHAVIORS
// ============================================================================

export const ForwardBehaviors = {
  /**
   * Winger: Stretch defense by staying wide
   */
  wingerWidthProviding(
    winger: Player,
    holder: Player | null,
    _teammates: Player[]
  ): BehaviorResultSuccess | null {
    if (!['RW', 'LW', 'RM', 'LM'].includes(winger.role as string)) return null;
    if (!holder || holder.isHome !== winger.isHome) return null;

    const isRight = ['RW', 'RM'].includes(winger.role as string);
    const targetY = isRight ? 80 : 520;
    const currentlyWide = Math.abs(winger.y - targetY) < 40;

    if (currentlyWide) return null;

    return {
      available: true,
      target: {
        x: winger.x + Math.sign(holder.x - winger.x) * 30,
        y: targetY
      },
      speedMultiplier: 1.1,
      description: 'winger providing width',
      shouldLock: false,
      error: null
    };
  },

  /**
   * Inverted winger: Cut inside to shoot
   */
  invertedWingerCutInside(
    winger: Player,
    _ball: Vector2D,
    opponentGoalX: number
  ): BehaviorResultSuccess | null {
    if (!['RW', 'LW'].includes(winger.role as string)) return null;

    const distToGoal = Math.abs(winger.x - opponentGoalX);
    const isWide = (winger.role === 'RW' && winger.y < 150) ||
                   (winger.role === 'LW' && winger.y > 450);

    // Cut inside when approaching final third
    if (distToGoal < 280 && isWide) {
      return {
        available: true,
        target: {
          x: opponentGoalX - Math.sign(opponentGoalX - winger.x) * 100,
          y: 300 + (Math.random() - 0.5) * 100
        },
        speedMultiplier: 1.4,
        description: 'inverted winger cutting inside',
        shouldLock: true,
        error: null
      };
    }

    return null;
  },

  /**
   * Striker: Runs in behind defense
   */
  strikerRunsInBehind(
    striker: Player,
    holder: Player | null,
    opponents: Player[],
    opponentGoalX: number
  ): BehaviorResultSuccess | null {
    if (!['ST', 'CF'].includes(striker.role as string)) return null;
    if (!holder || holder.isHome !== striker.isHome) return null;

    
    const oppDefenders = opponents.filter(o =>
      ['CB', 'RB', 'LB'].includes(o.role as string)
    );

    if (oppDefenders.length === 0) return null;

    const lastDefender = oppDefenders.sort((a, b) =>
      Math.abs(b.x - opponentGoalX) - Math.abs(a.x - opponentGoalX)
    )[0];

    if (!lastDefender) return null;

    const runTargetX = lastDefender.x + Math.sign(opponentGoalX - lastDefender.x) * 30;
    const distToLastDefender = Math.abs(striker.x - lastDefender.x);

    // Only make run if not already ahead and holder can see the pass
    if (distToLastDefender < 20 || getDistance(holder, striker) > 250) return null;

    return {
      available: true,
      target: {
        x: runTargetX,
        y: 300 + (Math.random() - 0.5) * 120
      },
      speedMultiplier: 1.6,
      description: 'striker run in behind',
      shouldLock: true,
      error: null
    };
  },

  /**
   * False 9: Drop deep to create space
   */
  false9DropDeep(
    striker: Player,
    holder: Player | null,
    teammates: Player[],
    opponentGoalX: number
  ): BehaviorResultSuccess | null {
    if (!['ST', 'CF'].includes(striker.role as string)) return null;
    if (!holder || holder.isHome !== striker.isHome) return null;

    // Only drop if wingers/CAM making forward runs
    const forwardRunners = teammates.filter(t =>
      ['RW', 'LW', 'CAM'].includes(t.role as string) &&
      Math.abs(t.vx) > 50
    );

    if (forwardRunners.length === 0) return null;

    const dropPosition = {
      x: striker.x - Math.sign(opponentGoalX - striker.x) * 120,
      y: 300
    };

    return {
      available: true,
      target: dropPosition,
      speedMultiplier: 1.2,
      description: 'false 9 dropping deep',
      shouldLock: true,
      error: null
    };
  },

  /**
   * Target striker: Hold up play
   */
  targetStrikerHoldUp(
    striker: Player,
    _ball: Vector2D,
    opponents: Player[]
  ): BehaviorResultSuccess | null {
    if (!['ST', 'CF'].includes(striker.role as string)) return null;

    
    const nearbyOpponents = opponents.filter(o =>
      getDistance(o, striker) < 60
    );

    // If under pressure, shield the ball
    if (nearbyOpponents.length > 0 && getDistance(striker, _ball) < 25) {
      return {
        available: true,
        target: {
          x: striker.x,
          y: striker.y
        },
        speedMultiplier: 0.7,
        description: 'target striker holding up',
        shouldLock: true,
        error: null
      };
    }

    return null;
  },

  /**
   * Striker pressing: Lead the press against center-backs
   */
  strikerPressingTrigger(
    striker: Player,
    opponents: Player[],
    ball: Vector2D,
    ownGoalX: number
  ): BehaviorResultSuccess | null {
    if (!['ST', 'CF'].includes(striker.role as string)) return null;

    
    const oppCBs = opponents.filter(o =>
      ['CB', 'GK'].includes(o.role as string)
    );

    if (oppCBs.length === 0) return null;

    const nearestCB = oppCBs.sort((a, b) =>
      getDistance(a, ball) - getDistance(b, ball)
    )[0];

    if (!nearestCB) return null;

    const distToCB = getDistance(striker, nearestCB);

    // Trigger press if close enough
    if (distToCB < 100 && Math.abs(nearestCB.x - ownGoalX) > 400) {
      return {
        available: true,
        target: {
          x: nearestCB.x,
          y: nearestCB.y
        },
        speedMultiplier: 1.7,
        description: 'striker leading press',
        shouldLock: true,
        error: null
      };
    }

    return null;
  }
};

// ============================================================================
// TRANSITION BEHAVIORS
// ============================================================================

export const TransitionBehaviors = {
  /**
   * Counter-attack: Explosive forward runs
   */
  counterAttackRun(
    player: Player,
    _ball: Vector2D,
    opponentGoalX: number,
    justWonPossession: boolean
  ): BehaviorResultSuccess | null {
    if (!justWonPossession) return null;
    if (!['ST', 'RW', 'LW', 'CAM', 'CM'].includes(player.role as string)) return null;

    const spaceAhead = Math.abs(player.x - opponentGoalX);

    // Forwards sprint into space immediately
    if (['ST', 'RW', 'LW'].includes(player.role as string) && spaceAhead > 150) {
      return {
        available: true,
        target: {
          x: opponentGoalX - Math.sign(opponentGoalX - player.x) * 80,
          y: player.role === 'ST' ? 300 : player.y
        },
        speedMultiplier: 2.0,
        description: 'counter-attack sprint',
        shouldLock: true,
        error: null,
        duration: 3000 // Lock for 3 seconds
      };
    }

    // Midfielders support the counter
    if (['CAM', 'CM'].includes(player.role as string)) {
      return {
        available: true,
        target: {
          x: player.x + Math.sign(opponentGoalX - player.x) * 120,
          y: 300
        },
        speedMultiplier: 1.6,
        description: 'counter-attack support',
        shouldLock: true,
        error: null,
        duration: 2500
      };
    }

    return null;
  },

  /**
   * Counter-press (Gegenpressing): Immediate pressure after losing ball
   */
  counterPress(
    player: Player,
    ball: Vector2D,
    justLostPossession: boolean,
    _opponentGoalX: number
  ): BehaviorResultSuccess | null {
    if (!justLostPossession) return null;

    
    const distToBall = getDistance(player, ball);

    // Only players within 80 units press immediately
    if (distToBall > 80) return null;

    return {
      available: true,
      target: {
        x: ball.x,
        y: ball.y
      },
      speedMultiplier: 1.9,
      description: 'counter-press',
      shouldLock: true,
      error: null,
      duration: 4000 // Press aggressively for 4 seconds
    };
  },

  /**
   * Recovery runs: Sprint back to defensive shape
   */
  recoveryRun(
    player: Player,
    ball: Vector2D,
    ownGoalX: number,
    justLostPossession: boolean
  ): BehaviorResultSuccess | null {
    if (!justLostPossession) return null;

    
    const distToBall = getDistance(player, ball);

    // Players far from ball make recovery runs
    if (distToBall < 100) return null;

    const homePositionX = (player as any).homePosition?.x || (ownGoalX + Math.sign(player.x - ownGoalX) * 200);

    return {
      available: true,
      target: {
        x: homePositionX,
        y: (player as any).homePosition?.y || 300
      },
      speedMultiplier: 1.7,
      description: 'recovery run',
      shouldLock: true,
      error: null,
      duration: 3000
    };
  }
};

// ============================================================================
// TACTICAL SYSTEM MODIFIERS
// ============================================================================

export const TacticalSystemModifiers = {
  /**
   * Possession-based: Constant movement for passing options
   */
  possessionSystem(
    player: Player,
    holder: Player | null,
    teammates: Player[]
  ): BehaviorResultSuccess | null {
    if (!holder || holder.isHome !== player.isHome) return null;

    
    // Create passing triangles
    const nearbyTeammates = teammates.filter(t =>
      getDistance(t, holder) < 150 && t.id !== player.id && t.id !== holder.id
    );

    if (nearbyTeammates.length < 1) return null;

    // Position to form triangle
    const avgX = nearbyTeammates.reduce((sum, t) => sum + t.x, holder.x) / (nearbyTeammates.length + 1);
    const avgY = nearbyTeammates.reduce((sum, t) => sum + t.y, holder.y) / (nearbyTeammates.length + 1);

    return {
      available: true,
      target: {
        x: avgX + (Math.random() - 0.5) * 40,
        y: avgY + (Math.random() - 0.5) * 40
      },
      speedMultiplier: 0.9, // Controlled movement
      description: 'possession triangle formation',
      shouldLock: false,
      error: null
    };
  },

  /**
   * High-press: Compressed formation in opponent's half
   */
  highPressSystem(
    player: Player,
    _ball: Vector2D,
    _teammates: Player[],
    opponentGoalX: number
  ): BehaviorResultSuccess | null {
    const teamPushUp = Math.abs(player.x - opponentGoalX) > 300;

    if (!teamPushUp) return null;

    // Push entire team into opponent's half
    const targetX = opponentGoalX - Math.sign(opponentGoalX - player.x) * 250;

    return {
      available: true,
      target: {
        x: targetX,
        y: player.y
      },
      speedMultiplier: 1.2,
      description: 'high-press positioning',
      shouldLock: false,
      error: null
    };
  },

  /**
   * Low-block: Deep defensive shape
   */
  lowBlockSystem(
    player: Player,
    ownGoalX: number,
    _teammates: Player[]
  ): BehaviorResultSuccess | null {
    const defensiveThird = ownGoalX + Math.sign(player.x - ownGoalX) * 200;
    const tooAdvanced = Math.abs(player.x - defensiveThird) > 150;

    if (!tooAdvanced) return null;

    return {
      available: true,
      target: {
        x: defensiveThird,
        y: 300 + (player.y - 300) * 0.7 // Narrower shape
      },
      speedMultiplier: 1.0,
      description: 'low-block positioning',
      shouldLock: false,
      error: null
    };
  }
};

// ============================================================================
// MASTER BEHAVIORAL SELECTOR
// ============================================================================

/**
 * Main function to select the best behavior for a player based on game phase
 * and tactical context. Integrates with existing AI system.
 */
export function selectPlayerBehavior(
  player: Player,
  gameState: GameState,
  phase: GamePhase,
  tacticalSystem?: TacticalSystemType
): BehaviorResultSuccess | null {
  const allPlayers = [...(gameState.homePlayers || []), ...(gameState.awayPlayers || [])];
  const teammates = allPlayers.filter(p => p.isHome === player.isHome && p.id !== player.id);
  const opponents = allPlayers.filter(p => p.isHome !== player.isHome);
  const ball = gameState.ballPosition;
  const holder = gameState.ballHolder;

  // Calculate goal positions
  const ownGoalX = player.isHome ?
    (gameState.currentHalf === 1 ? 50 : 750) :
    (gameState.currentHalf === 1 ? 750 : 50);
  const opponentGoalX = player.isHome ?
    (gameState.currentHalf === 1 ? 750 : 50) :
    (gameState.currentHalf === 1 ? 50 : 750);

  // Possession transition detection
  const timeSinceChange = Date.now() - ((gameState as any).lastPossessionChange || 0);
  const justWonPossession = timeSinceChange < 5000 && holder?.isHome === player.isHome;
  const justLostPossession = timeSinceChange < 5000 && holder?.isHome !== player.isHome;

  // ++++++++++ NEW SAFETY CHECK (CONFLICT FIX) ++++++++++
  // If game status is 'SET_PIECE', this system should return null
  // to allow SetPieceIntegration.js to take control.
  // This prevents players from "ghosting" during set pieces.
  if (phase === 'SET_PIECE') {
    (player as any).currentBehavior = 'set_piece_hold';
    return null; // Allow SetPieceIntegration to take control
  }
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  const behaviors: (BehaviorResultSuccess | null)[] = [];

  // PHASE 1: TRANSITION TO ATTACK
  if (phase === PHASES.TRANSITION_TO_ATTACK || justWonPossession) {
    behaviors.push(
      TransitionBehaviors.counterAttackRun(player, ball, opponentGoalX, justWonPossession)
    );
  }

  // PHASE 2: TRANSITION TO DEFENSE
  if (phase === PHASES.TRANSITION_TO_DEFENSE || justLostPossession) {
    behaviors.push(
      TransitionBehaviors.counterPress(player, ball, justLostPossession, opponentGoalX),
      TransitionBehaviors.recoveryRun(player, ball, ownGoalX, justLostPossession)
    );
  }

  // PHASE 3: DEFENSIVE PHASE
  if (phase === PHASES.DEFENSIVE || (holder && holder.isHome !== player.isHome)) {
    // Goalkeeper behaviors
    if (player.role === 'GK') {
      behaviors.push(
        GoalkeeperBehaviors.sweeperKeeping(player, ball, teammates, opponents, ownGoalX),
        GoalkeeperBehaviors.angleNarrowing(player, ball, holder, ownGoalX)
      );
    }

    // Defensive unit behaviors
    behaviors.push(
      DefensiveBehaviors.defensiveLineShift(player, ball, teammates, ownGoalX),
      DefensiveBehaviors.fullBackCovering(player, ball, opponents, ownGoalX),
      DefensiveBehaviors.centerBackMarking(player, opponents, teammates, ownGoalX)
    );

    // Midfield defensive behaviors
    behaviors.push(
      MidfieldBehaviors.cdmScreening(player, ball, opponents, teammates, ownGoalX),
      MidfieldBehaviors.cmPressTrigger(player, ball, opponents, holder)
    );

    // Forward defensive behaviors
    behaviors.push(
      ForwardBehaviors.strikerPressingTrigger(player, opponents, ball, ownGoalX)
    );
  }

  // PHASE 4: ATTACKING PHASE
  if (phase === PHASES.ATTACKING || (holder && holder.isHome === player.isHome)) {
    // Goalkeeper behaviors
    if (player.role === 'GK') {
      behaviors.push(
        GoalkeeperBehaviors.buildUpSupport(player, holder, teammates, ownGoalX)
      );
    }

    // Defensive unit attacking behaviors
    behaviors.push(
      DefensiveBehaviors.invertedFullBack(player, holder, teammates, ownGoalX)
    );

    // Midfield attacking behaviors
    behaviors.push(
      MidfieldBehaviors.boxToBoxLateRun(player, ball, holder, teammates, opponentGoalX),
      MidfieldBehaviors.registaTempoDictation(player, holder, teammates, ownGoalX),
      MidfieldBehaviors.camBetweenLines(player, opponents, opponentGoalX)
    );

    // Forward attacking behaviors
    behaviors.push(
      ForwardBehaviors.wingerWidthProviding(player, holder, teammates),
      ForwardBehaviors.invertedWingerCutInside(player, ball, opponentGoalX),
      ForwardBehaviors.strikerRunsInBehind(player, holder, opponents, opponentGoalX),
      ForwardBehaviors.false9DropDeep(player, holder, teammates, opponentGoalX),
      ForwardBehaviors.targetStrikerHoldUp(player, ball, opponents)
    );
  }

  // TACTICAL SYSTEM OVERLAYS
  if (tacticalSystem === 'possession') {
    behaviors.push(
      TacticalSystemModifiers.possessionSystem(player, holder, teammates)
    );
  } else if (tacticalSystem === 'high_press') {
    behaviors.push(
      TacticalSystemModifiers.highPressSystem(player, ball, teammates, opponentGoalX)
    );
  } else if (tacticalSystem === 'low_block' || tacticalSystem === 'counter_attack') {
    behaviors.push(
      TacticalSystemModifiers.lowBlockSystem(player, ownGoalX, teammates)
    );
  }

  // Find first valid behavior
  const validBehavior = behaviors.find(b => b !== null);

  if (validBehavior) (player as any).currentBehavior = validBehavior.description; // Debug info
  return validBehavior || null;
}

// ============================================================================
// PHASE DETECTION
// ============================================================================

/**
 * Detect current game phase based on possession and timing
 */
export function detectGamePhase(gameState: GameState): GamePhase {
  // INTEGRATION: Added per SetPieceIntegration.js instructions
  if (SetPieceBehaviorSystem.isSetPieceActive(gameState)) {
    return 'SET_PIECE'; // Special phase
  }

  const holder = gameState.ballHolder;
  const timeSinceChange = Date.now() - ((gameState as any).lastPossessionChange || 0);

  // Transition phases last 5 seconds after possession change
  if (timeSinceChange < 5000) {
    if (holder) {
      return PHASES.TRANSITION_TO_ATTACK;
    } else {
      return PHASES.TRANSITION_TO_DEFENSE;
    }
  }

  // Stable phases
  if (holder) {
    return PHASES.ATTACKING;
  }

  return PHASES.DEFENSIVE;
}

// ============================================================================
// INTEGRATION HELPERS
// ============================================================================

/**
 * Map tactic names to system types
 */
export function getTacticalSystemType(tacticName?: string): TacticalSystemType {
  const systemMap: Record<string, TacticalSystemType> = {
    'possession': 'possession',
    'tiki_taka': 'possession',
    'high_press': 'high_press',
    'gegenpress': 'high_press',
    'counter_attack': 'counter_attack',
    'defensive': 'low_block',
    'park_bus': 'low_block'
  };

  return systemMap[tacticName?.toLowerCase() || ''] || 'balanced';
}

// ============================================================================
// BROWSER EXPORTS
// ============================================================================

// Functions are now exported via ES6 modules - no window exports needed
console.log('✅ BEHAVIORAL DYNAMICS ENGINE LOADED');
console.log('   ✓ 11 role-specific behavior sets');
console.log('   ✓ 4 game phases supported');
console.log('   ✓ 3 tactical system modifiers');
console.log('   ✓ FIX #9: BehaviorResult wrapper for consistent returns');
console.log('   ✓ Ready for integration');
