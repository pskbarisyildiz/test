/**
 * Type Definitions Index
 * Central export point for all TypeScript types
 */
export type { PlayerPosition, PlayerRole, Vector2D, MutableVector2D, Bounds, PlayerRealStats, PlayerAttributes, PlayerGameState, Player, Foul, BallTrajectory, BallState, TeamJerseys, FormationPosition, FormationName, TacticName, TacticalConfig, TeamState, TeamStateModifier, TeamStats, MatchStats, GoalEvent, CardEvent, CommentaryEntry, SetPieceType, SetPieceState, PenaltyState, Particle, CanvasContexts, CanvasElements, PositionConfig } from './core';
export type { GameStatus, GameState } from './gameState';
export { isSetPieceStatus, isActiveGameplay, isValidPlayer } from './gameState';
export type { GameLoopConfig, PhysicsConfig, BallPhysicsConfig, GameConfig, BehaviorTreeConfig, PositionConfigsMap, FormationsMap, TacticsMap, TeamStateModifiersMap, PositionToRoleMap, FullGameConfig } from './config';
export { getConfigValue } from './config';
export { EVENT_TYPES } from './events';
export type { EventType, FoulEventPayload, GoalEventPayload, ShotEventPayload, PassEventPayload, PossessionChangePayload, CardEventPayload, TeamStateChangePayload, EventListener, EventListenerMap, EventBus } from './events';
//# sourceMappingURL=index.d.ts.map