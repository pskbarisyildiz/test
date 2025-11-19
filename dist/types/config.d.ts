/**
 * Configuration Type Definitions
 * Type-safe configuration objects for game constants
 */
import type { PositionConfig, TacticalConfig, TeamStateModifier, FormationPosition, PlayerRole } from './core';
export interface GameLoopConfig {
    readonly FIXED_TIMESTEP: number;
    readonly MAX_FRAME_TIME: number;
    readonly GAME_SPEED: number;
}
export interface PhysicsConfig {
    readonly MAX_SPEED: number;
    readonly SPRINT_MULTIPLIER: number;
    readonly ACCELERATION: number;
    readonly FRICTION: number;
    readonly DRIBBLE_SPEED_PENALTY: number;
    readonly COLLISION_RADIUS: number;
    readonly BALL_CONTROL_DISTANCE: number;
    readonly PASS_INTERCEPT_DISTANCE: number;
    readonly MOVEMENT_THRESHOLD: number;
    readonly POSITIONING_SMOOTHNESS: number;
    readonly LONG_PASS_THRESHOLD: number;
    readonly HEADER_HEIGHT_THRESHOLD: number;
    readonly PLAYER_MASS: number;
    readonly BALL_MASS: number;
}
export interface BallPhysicsConfig {
    readonly MAX_SPEED: number;
    readonly FRICTION: number;
    readonly GRAVITY: number;
    readonly BOUNCE: number;
    readonly SPIN_EFFECT: number;
}
export interface GameConfig {
    readonly GOAL_CHECK_DISTANCE: number;
    readonly SHOOTING_CHANCE_BASE: number;
    readonly PASSING_CHANCE: number;
    readonly EVENT_PROBABILITY: number;
    readonly DECISION_COOLDOWN: number;
    readonly GK_HOLD_TIME: number;
    readonly HIGH_DPI_SCALE_FACTOR: number;
    readonly GOAL_Y_TOP: number;
    readonly GOAL_Y_BOTTOM: number;
    readonly PITCH_WIDTH: number;
    readonly PITCH_HEIGHT: number;
    readonly AVERAGE_SPRINT_TIME_TO_GOAL: number;
    readonly REACTION_TIME_MIN: number;
    readonly REACTION_TIME_MAX: number;
    readonly GOAL_X_LEFT: number;
    readonly GOAL_X_RIGHT: number;
    GAME_SPEED?: number;
}
export interface BehaviorTreeConfig {
    readonly PRIORITY_SHOOT: number;
    readonly PRIORITY_PASS: number;
    readonly PRIORITY_DRIBBLE: number;
    readonly PRIORITY_TACKLE: number;
    readonly PRIORITY_MARK: number;
    readonly PRIORITY_POSITION: number;
    readonly BALL_CLOSE_DISTANCE: number;
    readonly OPPONENT_CLOSE_DISTANCE: number;
    readonly TEAMMATE_SUPPORT_DISTANCE: number;
    readonly MAX_BALL_HOLD_TIME: number;
    readonly MAX_BALL_HOLD_TIME_UNDER_PRESSURE: number;
    readonly SHOOT_CHANCE_IN_BOX: number;
    readonly SHOOT_CHANCE_OUTSIDE_BOX: number;
    readonly PASS_CHANCE_UNDER_PRESSURE: number;
    readonly DRIBBLE_CHANCE_IN_SPACE: number;
}
export type PositionConfigsMap = Record<PlayerRole, PositionConfig>;
export type FormationsMap = Record<string, readonly FormationPosition[]>;
export type TacticsMap = Record<string, TacticalConfig>;
export type TeamStateModifiersMap = Record<string, TeamStateModifier>;
export type PositionToRoleMap = Record<string, PlayerRole>;
/** Complete configuration container */
export interface FullGameConfig {
    readonly GAME_LOOP: GameLoopConfig;
    readonly PHYSICS: PhysicsConfig;
    readonly BALL_PHYSICS: BallPhysicsConfig;
    readonly GAME_CONFIG: GameConfig;
    readonly BT_CONFIG: BehaviorTreeConfig;
    readonly POSITION_CONFIGS: PositionConfigsMap;
    readonly FORMATIONS: FormationsMap;
    readonly TACTICS: TacticsMap;
    readonly TEAM_STATE_MODIFIERS: TeamStateModifiersMap;
    readonly positionToRoleMap: PositionToRoleMap;
}
/** Get safe config value with fallback */
export declare function getConfigValue<T>(obj: Record<string, T> | undefined, key: string, defaultValue: T): T;
export type * from './config';
//# sourceMappingURL=config.d.ts.map