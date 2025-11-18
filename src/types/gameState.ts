/**
 * Game State Type Definitions
 * Central state container for the entire football simulation
 */

import type {
  Player,
  MutableVector2D,
  BallTrajectory,
  SetPieceState,
  Particle,
  CanvasContexts,
  CanvasElements,
  MatchStats,
  GoalEvent,
  CardEvent,
  CommentaryEntry,
  FormationName,
  TacticName,
  TeamState
} from './core';

// ============================================================================
// GAME STATUS
// ============================================================================

/** Game status states */
export type GameStatus =
  | 'upload'       // Initial state, awaiting file upload
  | 'intro'        // Introduction/pre-match state
  | 'setup'        // Team selection and formation setup
  | 'playing'      // Active gameplay
  | 'paused'       // Game paused
  | 'halftime'     // Between halves
  | 'finished'     // Match ended
  | 'goal_scored'  // Goal animation/celebration
  | 'KICK_OFF'     // Kick-off set piece
  | 'GOAL_KICK'    // Goal kick set piece
  | 'CORNER_KICK'  // Corner kick set piece
  | 'FREE_KICK'    // Free kick set piece
  | 'THROW_IN'     // Throw-in set piece
  | 'PENALTY';     // Penalty kick

// ============================================================================
// MAIN GAME STATE
// ============================================================================

/** Complete game state (mutable during simulation) */
export interface GameState {
  // Match status
  status: GameStatus;
  currentHalf: 1 | 2;
  timeElapsed: number;

  // Teams and players
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

  // Team configuration
  teamJerseys: Record<string, { jersey1: string; jersey2: string }>;
  teamCoaches: Record<string, string>;
  teamLogos: Record<string, string>;
  homeFormation: FormationName;
  awayFormation: FormationName;
  homeTactic: TacticName;
  awayTactic: TacticName;
  homeTacticManuallySet: boolean;
  awayTacticManuallySet: boolean;

  // Team tactical state
  homeTeamState: TeamState;
  awayTeamState: TeamState;
  homeDefensiveLine: number;
  awayDefensiveLine: number;
  lastTeamStateUpdate: number;

  // Score
  homeScore: number;
  awayScore: number;

  // Ball state
  ballPosition: MutableVector2D;
  ballVelocity: MutableVector2D;
  ballHeight: number;
  ballTrajectory: BallTrajectory | null;
  ballHolder: Player | null;
  ballChasers: Set<Player>;
  currentPassReceiver: Player | null;
  lastTouchedBy: Player | null;

  // Possession tracking
  lastPossessionChange: number;
  possessionChanges: number;

  // Match statistics tracking
  totalPasses: number;
  totalShots: number;
  totalTackles: number;

  // Shot tracking
  shotInProgress: boolean;
  shooter: Player | null;
  currentShotXG: number | null;

  // Set pieces
  setPiece: SetPieceState | null;
  setPieceExecuting: boolean;

  // Kick-off calm period (prevents immediate shooting after kick-off)
  postKickOffCalmPeriod?: boolean;
  kickOffCompletedTime?: number;

  // Match events
  fouls: number;
  yellowCards: CardEvent[];
  redCards: CardEvent[];
  lastGoalScorer: 'home' | 'away' | null;
  goalEvents: GoalEvent[];
  cardEvents: CardEvent[];
  commentary: CommentaryEntry[];
  lastEventTime: number;
  lastControlAttempt: number;

  // Statistics
  stats: MatchStats;

  // Rendering state
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

  // UI state
  commentaryFadeTimeout: number | null;

  // Cache versioning
  _teamCacheVersion: number;
}

/** Type guard to check if status is a set piece */
export function isSetPieceStatus(status: GameStatus): boolean {
  return ['KICK_OFF', 'GOAL_KICK', 'CORNER_KICK', 'FREE_KICK', 'THROW_IN', 'PENALTY'].includes(status);
}

/** Type guard to check if status is active gameplay */
export function isActiveGameplay(status: GameStatus): boolean {
  return status === 'playing' || isSetPieceStatus(status);
}

/** Type guard to validate player object */
export function isValidPlayer(obj: unknown): obj is Player {
  if (typeof obj !== 'object' || obj === null) return false;
  const p = obj as Record<string, unknown>;
  return (
    typeof p['id'] === 'string' &&
    typeof p['name'] === 'string' &&
    typeof p['team'] === 'string' &&
    typeof p['role'] === 'string' &&
    typeof p['isHome'] === 'boolean' &&
    typeof p['x'] === 'number' &&
    typeof p['y'] === 'number'
  );
}

export type { GameState as default };
