/**
 * Game State Type Definitions
 * Central state container for the entire football simulation
 */
import type { Player, MutableVector2D, BallTrajectory, SetPieceState, Particle, CanvasContexts, CanvasElements, MatchStats, GoalEvent, CardEvent, CommentaryEntry, FormationName, TacticName, TeamState } from './core';
/** Game status states */
export type GameStatus = 'upload' | 'intro' | 'setup' | 'playing' | 'paused' | 'halftime' | 'finished' | 'goal_scored' | 'KICK_OFF' | 'GOAL_KICK' | 'CORNER_KICK' | 'FREE_KICK' | 'THROW_IN' | 'PENALTY';
/** Complete game state (mutable during simulation) */
export interface GameState {
    status: GameStatus;
    currentHalf: 1 | 2;
    timeElapsed: number;
    teams: string[];
    homeTeam: string;
    awayTeam: string;
    homePlayers: Player[];
    awayPlayers: Player[];
    players: ReadonlyArray<Readonly<{
        readonly id: string;
        readonly name: string;
        readonly team: string;
        readonly position: string;
        readonly role: string;
        readonly pace: number;
        readonly shooting: number;
        readonly passing: number;
        readonly dribbling: number;
        readonly defending: number;
        readonly physicality: number;
        readonly goalkeeping: number;
        readonly rating: number;
        readonly realStats: Record<string, number>;
    }>>;
    teamJerseys: Record<string, {
        jersey1: string;
        jersey2: string;
    }>;
    teamCoaches: Record<string, string>;
    teamLogos: Record<string, string>;
    homeFormation: FormationName;
    awayFormation: FormationName;
    homeTactic: TacticName;
    awayTactic: TacticName;
    homeTacticManuallySet: boolean;
    awayTacticManuallySet: boolean;
    homeTeamState: TeamState;
    awayTeamState: TeamState;
    homeDefensiveLine: number;
    awayDefensiveLine: number;
    lastTeamStateUpdate: number;
    homeScore: number;
    awayScore: number;
    ballPosition: MutableVector2D;
    ballVelocity: MutableVector2D;
    ballHeight: number;
    ballTrajectory: BallTrajectory | null;
    ballHolder: Player | null;
    ballChasers: Set<Player>;
    currentPassReceiver: Player | null;
    lastTouchedBy: Player | null;
    lastPossessionChange: number;
    possessionChanges: number;
    totalPasses: number;
    totalShots: number;
    totalTackles: number;
    shotInProgress: boolean;
    shooter: Player | null;
    currentShotXG: number | null;
    setPiece: SetPieceState | null;
    setPieceExecuting: boolean;
    postKickOffCalmPeriod?: boolean;
    kickOffCompletedTime?: number;
    fouls: number;
    yellowCards: CardEvent[];
    redCards: CardEvent[];
    lastGoalScorer: 'home' | 'away' | null;
    goalEvents: GoalEvent[];
    cardEvents: CardEvent[];
    commentary: CommentaryEntry[];
    lastEventTime: number;
    lastControlAttempt: number;
    stats: MatchStats;
    canvases: CanvasElements;
    contexts: CanvasContexts;
    backgroundDrawn: boolean;
    gameUIDisplayed: boolean;
    summaryDrawn: boolean;
    isVertical: boolean;
    orientationChanged: boolean;
    particles: Particle[];
    offscreenPitch: HTMLCanvasElement | null;
    homeJerseyColor: string;
    awayJerseyColor: string;
    cameraShake: number;
    commentaryFadeTimeout: number | null;
    _teamCacheVersion: number;
}
/** Type guard to check if status is a set piece */
export declare function isSetPieceStatus(status: GameStatus): boolean;
/** Type guard to check if status is active gameplay */
export declare function isActiveGameplay(status: GameStatus): boolean;
/** Type guard to validate player object */
export declare function isValidPlayer(obj: unknown): obj is Player;
export type { GameState as default };
//# sourceMappingURL=gameState.d.ts.map