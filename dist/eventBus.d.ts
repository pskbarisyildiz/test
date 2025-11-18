/**
 * Event Bus System
 * Type-safe event bus for decoupled architecture
 */
import type { EventBus } from './types';
import { EVENT_TYPES } from './types';
export declare const STANDARD_EVENTS: {
    readonly BALL_POSITION_CHANGED: "ball:positionChanged";
    readonly BALL_HOLDER_CHANGED: "ball:holderChanged";
    readonly POSSESSION_CHANGED: "possession:changed";
    readonly GOAL_SCORED: "goal:scored";
    readonly SHOT_ATTEMPTED: "shot:attempted";
    readonly PASS_ATTEMPTED: "pass:attempted";
    readonly FOUL_COMMITTED: "foul:committed";
    readonly OFFSIDE_CALLED: "offside:called";
    readonly SET_PIECE_STARTED: "setPiece:started";
    readonly SET_PIECE_EXECUTED: "setPiece:executed";
    readonly PLAYER_SUBSTITUTED: "player:substituted";
    readonly MATCH_STARTED: "match:started";
    readonly MATCH_FINISHED: "match:finished";
};
export declare const eventBus: EventBus;
export declare const ConfigManager: {
    /**
     * Get configuration value with guaranteed return
     */
    get<T = unknown>(key: string, defaultValue?: T): T | undefined;
    /**
     * Get multiple config values at once
     */
    getBatch(keys: readonly string[]): Record<string, unknown>;
    /**
     * Check if configuration is valid
     */
    validate(): void;
};
interface DependencyRegistryType {
    loaded: Record<string, unknown>;
    required: Record<string, string[]>;
    register(moduleName: string, exports: unknown): void;
    require(moduleName: string, dependencies: string[]): void;
    get(moduleName: string): unknown;
}
export declare const DependencyRegistry: DependencyRegistryType;
interface TacticDefinition {
    systemType: string;
    pressIntensity: number;
    defensiveLineDepth: number;
    counterAttackSpeed: number;
    possessionPriority: number;
    passingRisk: number;
}
interface TacticalSystemType {
    tactics: Record<string, TacticDefinition>;
    getTactic(tacticName: string): TacticDefinition;
    getSystemType(tacticName: string): string;
    getAllTactics(): string[];
}
export declare const TacticalSystem: TacticalSystemType;
declare global {
    interface Window {
        STANDARD_EVENTS: typeof STANDARD_EVENTS;
        eventBus: EventBus;
        EVENT_TYPES: typeof EVENT_TYPES;
        ConfigManager: typeof ConfigManager;
        DependencyRegistry: typeof DependencyRegistry;
        TacticalSystem: typeof TacticalSystem;
        SHOW_OFFSIDE_LINES: boolean;
        render?: () => void;
    }
}
export {};
//# sourceMappingURL=eventBus.d.ts.map