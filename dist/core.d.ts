/**
 * @file core.ts
 * @migrated-from js/core.js
 *
 * Core Game Logic and Update Functions
 *
 * THIS MODULE IS RESPONSIBLE FOR:
 * 1. Ball physics simulation and trajectory updates
 * 2. Possession changes based on ballHolder
 * 3. Game loop orchestration and timing
 * 4. Calling updatePlayerAI_V2 for each player
 * 5. Goal detection and score updates
 * 6. Match state management (time, status)
 * 7. Rendering and visual updates
 *
 * CONSTRAINT: This module coordinates all systems but doesn't handle individual
 * player decisions (that's in ai module)
 */
import type { Player, GameState, Foul } from './types';
declare class SpatialAwarenessSystem {
    private grid;
    private cellSize;
    buildGrid(allPlayers: Player[], width: number, height: number): void;
    getNearbyPlayers(player: Player, radius: number): Player[];
    calculateSpacingForce(player: Player, teammates: Player[]): {
        x: number;
        y: number;
    };
}
export declare const spatialSystem: SpatialAwarenessSystem;
interface ActionDecision {
    action: 'SHOOT' | 'PASS' | 'DRIBBLE' | 'HOLD';
    target: Player | {
        x: number;
        y: number;
    } | null;
}
declare class ActionDecisionSystem {
    decideBestAction(player: Player, teammates: Player[], opponents: Player[], gameState: GameState): ActionDecision;
    shouldShootNow(player: Player, opponents: Player[], gameState: GameState): boolean;
    findBestPassTarget(player: Player, teammates: Player[], opponents: Player[], goalX: number): {
        teammate: Player;
        score: number;
    } | null;
    hasSpaceToDribble(player: Player, opponents: Player[], goalX: number): boolean;
}
export declare const actionDecision: ActionDecisionSystem;
declare class SmartTackleSystem {
    shouldAttemptTackle(defender: Player, ballCarrier: Player, gameState: GameState): boolean;
    isInPenaltyBox(player: Player, gameState: GameState): boolean;
    checkForPenalty(foul: Foul, gameState: GameState): {
        awarded: boolean;
        attackingTeam?: string;
        defendingTeam?: string;
    };
}
export declare const tackleSystem: SmartTackleSystem;
interface PenaltyState {
    shooter: Player;
    goalkeeper: Player;
    goalX: number;
    penaltySpotX: number;
    spotY: number;
    phase: 'SETUP' | 'READY' | 'SHOOTING';
    startTime: number;
}
declare class PenaltySystem {
    state: PenaltyState | null;
    initiate(attackingTeam: Player[], defendingTeam: Player[], gameState: GameState): PenaltyState | null;
    update(gameState: GameState): {
        outcome: string;
        message: string;
    } | null;
    positionPlayers(gameState: GameState): void;
    executeShot(gameState: GameState): {
        outcome: string;
        message: string;
    } | null;
    reset(): void;
}
export declare const penaltySystem: PenaltySystem;
export declare function updatePlayerAI_V2(player: Player, ball: {
    x: number;
    y: number;
}, allPlayers: Player[], gameState: GameState): void;
export declare function handleFoul_V2(fouler: Player, fouled: Player): void;
export declare function cleanupShotState(gameState: GameState): void;
export declare function updateDefensiveLines(gameState: GameState): void;
export declare function getScaledTimestep(): number;
export declare function updateParticlesWithCleanup(gameState: GameState): void;
export declare function gameLoop_V2(timestamp: number): void;
export {};
//# sourceMappingURL=core.d.ts.map