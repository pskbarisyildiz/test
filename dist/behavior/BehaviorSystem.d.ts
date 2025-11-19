import type { Player, GameState } from '../types';
export declare const BehaviorResult: {
    success(target: {
        x: number;
        y: number;
    }, speedMultiplier?: number, description?: string, shouldLock?: boolean): {
        available: boolean;
        target: {
            x: number;
            y: number;
        };
        speedMultiplier: number;
        description: string;
        shouldLock: boolean;
        error: null;
    };
    unavailable(reason?: string): {
        available: boolean;
        target: null;
        speedMultiplier: number;
        description: string;
        shouldLock: boolean;
        error: string;
    };
    isValid(result: unknown): boolean;
};
export declare const PHASES: {
    DEFENSIVE: string;
    ATTACKING: string;
    TRANSITION_TO_ATTACK: string;
    TRANSITION_TO_DEFENSE: string;
};
export declare function selectPlayerBehavior(player: Player, gameState: GameState, phase: string, tacticalSystem: string): {
    target: {
        x: any;
        y: any;
    };
    speedMultiplier: number;
    description: string;
    shouldLock: boolean;
    duration: number;
} | {
    target: {
        x: number;
        y: number;
    };
    speedMultiplier: number;
    description: string;
    shouldLock: boolean;
} | null;
export declare function detectGamePhase(gameState: GameState): string;
export declare function getTacticalSystemType(tacticName: string | null): string;
export declare const BehaviorSystem: {
    selectPlayerBehavior: typeof selectPlayerBehavior;
    detectGamePhase: typeof detectGamePhase;
    getTacticalSystemType: typeof getTacticalSystemType;
    BehaviorResult: {
        success(target: {
            x: number;
            y: number;
        }, speedMultiplier?: number, description?: string, shouldLock?: boolean): {
            available: boolean;
            target: {
                x: number;
                y: number;
            };
            speedMultiplier: number;
            description: string;
            shouldLock: boolean;
            error: null;
        };
        unavailable(reason?: string): {
            available: boolean;
            target: null;
            speedMultiplier: number;
            description: string;
            shouldLock: boolean;
            error: string;
        };
        isValid(result: unknown): boolean;
    };
    PHASES: {
        DEFENSIVE: string;
        ATTACKING: string;
        TRANSITION_TO_ATTACK: string;
        TRANSITION_TO_DEFENSE: string;
    };
};
//# sourceMappingURL=BehaviorSystem.d.ts.map