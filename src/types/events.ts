/**
 * Event System Type Definitions
 * Type-safe event bus and event payload definitions
 */

import type { Player } from './core';

// ============================================================================
// EVENT TYPES ENUM
// ============================================================================

export const EVENT_TYPES = {
  // Match events
  MATCH_START: 'match:start',
  MATCH_PAUSE: 'match:pause',
  MATCH_RESUME: 'match:resume',
  MATCH_END: 'match:end',
  HALF_TIME: 'match:halftime',
  KICKOFF: 'match:kickoff',

  // Ball events
  BALL_KICKED: 'ball:kicked',
  BALL_PASSED: 'ball:passed',
  BALL_INTERCEPTED: 'ball:intercepted',
  BALL_OUT: 'ball:out',
  BALL_WON: 'ball:won',
  BALL_LOST: 'ball:lost',
  BALL_POSITION_CHANGED: 'ball:positionChanged',
  BALL_HOLDER_CHANGED: 'ball:holderChanged',

  // Goal events
  GOAL_SCORED: 'goal:scored',
  SHOT_TAKEN: 'shot:taken',
  SHOT_SAVED: 'shot:saved',
  SHOT_MISSED: 'shot:missed',
  SHOT_BLOCKED: 'shot:blocked',
  SHOT_ATTEMPTED: 'shot:attempted',

  // Player events
  PLAYER_COLLISION: 'player:collision',
  PLAYER_TACKLE: 'player:tackle',
  PLAYER_DRIBBLE: 'player:dribble',
  PLAYER_HEADER: 'player:header',
  PLAYER_SUBSTITUTED: 'player:substituted',

  // Foul events
  FOUL_COMMITTED: 'foul:committed',
  CARD_SHOWN: 'card:shown',
  PENALTY_AWARDED: 'penalty:awarded',
  FREE_KICK_AWARDED: 'freekick:awarded',

  // Team events
  TEAM_STATE_CHANGED: 'team:stateChanged',
  FORMATION_CHANGED: 'team:formationChanged',
  TACTIC_CHANGED: 'team:tacticChanged',
  POSSESSION_CHANGED: 'team:possessionChanged',

  // AI events
  AI_DECISION_MADE: 'ai:decisionMade',
  BT_NODE_EXECUTED: 'ai:btNodeExecuted',
  ZONE_ASSIGNED: 'ai:zoneAssigned',

  // Rendering events
  RENDER_BACKGROUND: 'render:background',
  RENDER_GAME: 'render:game',
  RENDER_UI: 'render:ui',

  // Stats events
  STAT_UPDATED: 'stat:updated',
  XG_CALCULATED: 'stat:xgCalculated',
  PASS_COMPLETED: 'stat:passCompleted',
  PASS_FAILED: 'stat:passFailed',

  // Offside events
  OFFSIDE_CALLED: 'offside:called',

  // Set piece events
  SET_PIECE_STARTED: 'setPiece:started',
  SET_PIECE_EXECUTED: 'setPiece:executed',

  // Match lifecycle
  MATCH_STARTED: 'match:started',
  MATCH_FINISHED: 'match:finished'
} as const;

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

// ============================================================================
// EVENT PAYLOAD TYPES
// ============================================================================

export interface FoulEventPayload {
  readonly fouler: Player;
  readonly fouled: Player;
  readonly severity?: number;
}

export interface GoalEventPayload {
  readonly scorer: Player;
  readonly isHome: boolean;
  readonly time: number;
  readonly xG: number;
}

export interface ShotEventPayload {
  readonly shooter: Player;
  readonly targetX: number;
  readonly targetY: number;
  readonly xG: number;
}

export interface PassEventPayload {
  readonly passer: Player;
  readonly receiver: Player | null;
  readonly completed: boolean;
}

export interface PossessionChangePayload {
  readonly newHolder: Player;
  readonly previousHolder: Player | null;
}

export interface CardEventPayload {
  readonly player: Player;
  readonly cardType: 'yellow' | 'red';
  readonly reason: string;
}

export interface TeamStateChangePayload {
  readonly team: 'home' | 'away';
  readonly newState: string;
  readonly previousState: string;
}

// ============================================================================
// EVENT LISTENER TYPES
// ============================================================================

export type EventListener<T = unknown> = (data: T) => void;

export type EventListenerMap = Map<EventType, EventListener[]>;

// ============================================================================
// EVENT BUS INTERFACE
// ============================================================================

export interface EventBus {
  events: Record<string, EventListener[]>;

  /**
   * Subscribe to an event
   * @param eventName - Event to subscribe to
   * @param listener - Callback function
   * @returns Unsubscribe function
   */
  subscribe<T = unknown>(eventName: string, listener: EventListener<T>): () => void;

  /**
   * Publish an event
   * @param eventName - Event to publish
   * @param data - Event payload
   */
  publish<T = unknown>(eventName: string, data: T): void;

  /**
   * Clear event listeners
   * @param eventName - Event to clear (or all if undefined)
   */
  clear(eventName?: string): void;

  /**
   * Get listener count for an event
   * @param eventName - Event name
   * @returns Number of listeners
   */
  getListenerCount(eventName: string): number;

  /**
   * Check if event has listeners
   * @param eventName - Event name
   * @returns True if has listeners
   */
  hasListeners(eventName: string): boolean;
}

export type * from './events';
