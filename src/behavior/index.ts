/**
 * Behavior Systems Module - Centralized Exports
 *
 * This module exports behavior systems that orchestrate player positioning
 * and decision-making during different game states.
 *
 * @module behavior
 */

// ============================================================================
// SET PIECE BEHAVIOR SYSTEM
// ============================================================================

export { SetPieceBehaviorSystem } from './setPieceBehavior';

// ============================================================================
// BEHAVIORAL DYNAMICS ENGINE
// ============================================================================

export {
  BehaviorResult,
  PHASES,
  GoalkeeperBehaviors,
  DefensiveBehaviors,
  MidfieldBehaviors,
  ForwardBehaviors,
  TransitionBehaviors,
  TacticalSystemModifiers,
  selectPlayerBehavior,
  detectGamePhase,
  getTacticalSystemType
} from './system';

export type {
  BehaviorResultSuccess,
  BehaviorResultUnavailable,
  BehaviorResultType,
  GamePhase,
  TacticalSystemType
} from './system';

// Future behavior systems will be exported here:
// export { DefensiveBehaviorSystem } from './defensiveBehavior';
// export { OffensiveBehaviorSystem } from './offensiveBehavior';
