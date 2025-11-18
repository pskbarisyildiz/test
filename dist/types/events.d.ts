/**
 * Event System Type Definitions
 * Type-safe event bus and event payload definitions
 */
import type { Player } from './core';
export declare const EVENT_TYPES: {
    readonly MATCH_START: "match:start";
    readonly MATCH_PAUSE: "match:pause";
    readonly MATCH_RESUME: "match:resume";
    readonly MATCH_END: "match:end";
    readonly HALF_TIME: "match:halftime";
    readonly KICKOFF: "match:kickoff";
    readonly BALL_KICKED: "ball:kicked";
    readonly BALL_PASSED: "ball:passed";
    readonly BALL_INTERCEPTED: "ball:intercepted";
    readonly BALL_OUT: "ball:out";
    readonly BALL_WON: "ball:won";
    readonly BALL_LOST: "ball:lost";
    readonly BALL_POSITION_CHANGED: "ball:positionChanged";
    readonly BALL_HOLDER_CHANGED: "ball:holderChanged";
    readonly GOAL_SCORED: "goal:scored";
    readonly SHOT_TAKEN: "shot:taken";
    readonly SHOT_SAVED: "shot:saved";
    readonly SHOT_MISSED: "shot:missed";
    readonly SHOT_BLOCKED: "shot:blocked";
    readonly SHOT_ATTEMPTED: "shot:attempted";
    readonly PLAYER_COLLISION: "player:collision";
    readonly PLAYER_TACKLE: "player:tackle";
    readonly PLAYER_DRIBBLE: "player:dribble";
    readonly PLAYER_HEADER: "player:header";
    readonly PLAYER_SUBSTITUTED: "player:substituted";
    readonly FOUL_COMMITTED: "foul:committed";
    readonly CARD_SHOWN: "card:shown";
    readonly PENALTY_AWARDED: "penalty:awarded";
    readonly FREE_KICK_AWARDED: "freekick:awarded";
    readonly TEAM_STATE_CHANGED: "team:stateChanged";
    readonly FORMATION_CHANGED: "team:formationChanged";
    readonly TACTIC_CHANGED: "team:tacticChanged";
    readonly POSSESSION_CHANGED: "team:possessionChanged";
    readonly AI_DECISION_MADE: "ai:decisionMade";
    readonly BT_NODE_EXECUTED: "ai:btNodeExecuted";
    readonly ZONE_ASSIGNED: "ai:zoneAssigned";
    readonly RENDER_BACKGROUND: "render:background";
    readonly RENDER_GAME: "render:game";
    readonly RENDER_UI: "render:ui";
    readonly STAT_UPDATED: "stat:updated";
    readonly XG_CALCULATED: "stat:xgCalculated";
    readonly PASS_COMPLETED: "stat:passCompleted";
    readonly PASS_FAILED: "stat:passFailed";
    readonly OFFSIDE_CALLED: "offside:called";
    readonly SET_PIECE_STARTED: "setPiece:started";
    readonly SET_PIECE_EXECUTED: "setPiece:executed";
    readonly MATCH_STARTED: "match:started";
    readonly MATCH_FINISHED: "match:finished";
};
export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];
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
export type EventListener<T = unknown> = (data: T) => void;
export type EventListenerMap = Map<EventType, EventListener[]>;
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
//# sourceMappingURL=events.d.ts.map