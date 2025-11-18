/**
 * Behavior Systems Module - Centralized Exports
 *
 * This module exports behavior systems that orchestrate player positioning
 * and decision-making during different game states.
 *
 * @module behavior
 */
export { SetPieceBehaviorSystem } from './setPieceBehavior';
export { BehaviorResult, PHASES, GoalkeeperBehaviors, DefensiveBehaviors, MidfieldBehaviors, ForwardBehaviors, TransitionBehaviors, TacticalSystemModifiers, selectPlayerBehavior, detectGamePhase, getTacticalSystemType } from './system';
export type { BehaviorResultSuccess, BehaviorResultUnavailable, BehaviorResultType, GamePhase, TacticalSystemType } from './system';
//# sourceMappingURL=index.d.ts.map