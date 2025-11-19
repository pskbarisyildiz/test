/**
 * @file main.ts
 * @migrated-from js/main.js
 *
 * Main Initialization and Game Loop
 *
 * This module handles:
 * 1. File upload and Excel data processing
 * 2. UI event listeners
 * 3. Match initialization and setup
 * 4. Game state management (halftime, fulltime)
 * 5. Set piece handling (free kicks, throw-ins, etc.)
 * 6. Match statistics and momentum system
 * 7. Real-time clock and UI updates
 */
import type { Player, TeamState } from './types';
export declare function handleFileUpload(event: Event): void;
export declare function attachSetupEventListeners(): void;
export declare let isBatchMode: boolean;
export declare let lastFrameTime: number;
export declare let gameTime: number;
export declare let physicsAccumulator: number;
export declare let animationFrameId: number | null;
export declare let gameIntervalId: number | null;
interface PendingGameEvent {
    type: string;
    resolveTime: number;
    data: {
        holder: Player;
        xG: number;
        goalkeeper: Player;
        goalX: number;
        shotTargetY: number;
    };
}
export declare let pendingGameEvents: PendingGameEvent[];
export declare function handleFreeKick(foulLocation: {
    x: number;
    y: number;
} | null, foulTeam: boolean | string): void;
export declare function handleThrowIn(): void;
export declare function handleBallOutOfBounds(): void;
export declare function processPendingEvents(currentGameTime: number): void;
export declare function restoreFormationAfterSetPiece(): void;
export declare function selectJerseys(): void;
export declare function setupKickOff(teamWithBall: 'home' | 'away'): void;
export declare function removePlayerFromMatch(playerToRemove: Player): void;
export declare function handleShotAttempt(holder: Player, goalX: number, allPlayers: Player[]): void;
export declare function updateMatchStats(): void;
export declare const MomentumSystem: {
    homeMomentum: number;
    awayMomentum: number;
    lastUpdate: number;
    getMomentumBonus(isHome: boolean): number;
    onGoalScored(scoringTeam: "home" | "away"): void;
    onShotOnTarget(shootingTeam: "home" | "away"): void;
    onTackleWon(tacklingTeam: "home" | "away"): void;
    onPassCompleted(passingTeam: "home" | "away"): void;
    update(): void;
    reset(): void;
};
export declare function applyMomentumToPlayer(player: Player): void;
export declare function updateMomentum(): void;
export declare function renderMomentumBar(ctx: CanvasRenderingContext2D): void;
export declare function updateTeamStates(): void;
export declare function determineTeamState(isHome: boolean): TeamState;
export declare function handlePassAttempt(holder: Player, allPlayers: Player[]): void;
export declare function resetAfterGoal(): void;
export declare function switchSides(): void;
export declare function startMatch(): void;
export declare function debugBallState(): void;
export declare function introRenderLoop(_timestamp: number): void;
export declare function handleHalfTime(): void;
export declare function handleFullTime(): void;
export declare function resetMatch(): void;
export {};
//# sourceMappingURL=main.d.ts.map