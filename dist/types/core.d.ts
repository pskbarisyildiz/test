/**
 * Core Domain Types for Football Simulation
 * Defines the fundamental game entities and their properties
 */
/** Player positions on the field */
export type PlayerPosition = 'Goalkeeper' | 'Keeper' | 'Centre-Back' | 'Center Back' | 'Defender (Centre)' | 'Right-Back' | 'Right Back' | 'Defender (Right)' | 'Left-Back' | 'Left Back' | 'Defender (Left)' | 'Wing-Back (Right)' | 'Wing-Back (Left)' | 'Defensive Midfield' | 'Midfielder (Defensive)' | 'Central Midfield' | 'Midfielder (Centre)' | 'Right Midfield' | 'Midfielder (Right)' | 'Left Midfield' | 'Midfielder (Left)' | 'Attacking Midfield' | 'Midfielder (Attacking)' | 'Right Winger' | 'Forward (Right)' | 'Winger (Right)' | 'Left Winger' | 'Forward (Left)' | 'Winger (Left)' | 'Second Striker' | 'Striker' | 'Centre-Forward' | 'Forward (Centre)';
/** Simplified tactical roles */
export type PlayerRole = 'GK' | 'CB' | 'LCB' | 'RCB' | 'RB' | 'LB' | 'CDM' | 'CM' | 'LCM' | 'RCM' | 'RM' | 'LM' | 'CAM' | 'RW' | 'LW' | 'ST' | 'CF';
/** 2D Position vector */
export interface Vector2D {
    readonly x: number;
    readonly y: number;
}
/** Mutable 2D Position */
export interface MutableVector2D {
    x: number;
    y: number;
}
/** Rectangular bounds */
export interface Bounds {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}
/** Real-world player statistics from FotMob */
export interface PlayerRealStats {
    readonly chancesCreated: number;
    readonly crossesAccuracy: number;
    readonly dribblesSucceeded: number;
    readonly dispossessed: number;
    readonly penaltyWon: number;
    readonly foulsWon: number;
    readonly aerialsWonPercent: number;
    readonly duelWonPercent: number;
    readonly interceptions: number;
    readonly fouls: number;
    readonly recoveries: number;
    readonly goals: number;
    readonly assists: number;
    readonly xG: number;
    readonly xGOT: number;
    readonly shots: number;
    readonly shotsOnTarget: number;
    readonly xA: number;
    readonly passAccuracy: number;
    readonly longBallAccuracy: number;
    readonly wonContest: number;
    readonly touchesOppBox: number;
    readonly gkSaves: number;
    readonly gkSavePercent: number;
    readonly gkGoalsConceded: number;
    readonly gkGoalsPrevented: number;
    readonly gkKeeperSweeper: number;
    readonly gkErrorLedToGoal: number;
    readonly yellowCards: number;
    readonly redCards: number;
}
/** Player attributes (0-100 scale) */
export interface PlayerAttributes {
    readonly pace: number;
    readonly shooting: number;
    readonly passing: number;
    readonly dribbling: number;
    readonly defending: number;
    readonly physicality: number;
    readonly goalkeeping: number;
}
/** Player game state (mutable during simulation) */
export interface PlayerGameState {
    x: number;
    y: number;
    vx: number;
    vy: number;
    targetX: number;
    targetY: number;
    speedBoost: number;
    stamina: number;
    hasBallControl: boolean;
    isChasingBall: boolean;
    chaseStartTime: number | null;
    ballReceivedTime: number | null;
    lastDecisionTime: number;
    stunnedUntil: number | null;
    lockUntil: number;
    intent: string;
    setPieceTarget: Vector2D | null;
    isKicker: boolean;
    isInWall: boolean;
    isDefCBLine: boolean;
    isMarker: boolean;
    targetLocked: boolean;
    targetLockTime: number;
    effectivePace: number;
    effectiveShooting: number;
    effectivePassing: number;
}
/** Complete player entity */
export interface Player extends PlayerAttributes, PlayerGameState {
    readonly id: string;
    readonly name: string;
    readonly team: string;
    readonly position: string;
    readonly role: PlayerRole;
    readonly rating: number;
    readonly realStats: PlayerRealStats;
    readonly isHome: boolean;
    composure?: number;
}
/** Ball trajectory for passes and shots */
export interface BallTrajectory {
    readonly startX: number;
    readonly startY: number;
    readonly endX: number;
    readonly endY: number;
    readonly startTime: number;
    readonly duration: number;
    readonly maxHeight: number;
    readonly isShot: boolean;
    readonly passType: 'ground' | 'aerial' | 'shot';
    readonly passQuality: number;
    readonly dist: number;
    readonly speed: number;
    shotTargetY?: number;
    effectiveAccuracy?: number;
}
/** Ball state */
export interface BallState {
    position: MutableVector2D;
    velocity: MutableVector2D;
    height: number;
    trajectory: BallTrajectory | null;
    holder: Player | null;
    chasers: Set<Player>;
}
/** Team jersey colors */
export interface TeamJerseys {
    readonly jersey1: string;
    readonly jersey2: string;
}
/** Team formation position */
export interface FormationPosition {
    readonly x: number;
    readonly y: number;
    readonly role: PlayerRole;
}
/** Available formations */
export type FormationName = '4-4-2' | '4-3-3' | '4-4-1-1' | '4-4-2-diamond' | '4-3-1-2' | '4-3-2-1';
/** Team tactics */
export type TacticName = 'balanced' | 'high_press' | 'possession' | 'counter_attack' | 'park_the_bus' | 'total_football';
/** Tactical configuration */
export interface TacticalConfig {
    readonly name: string;
    readonly description: string;
    readonly pressIntensity: number;
    readonly defensiveLineDepth: number;
    readonly counterAttackSpeed: number;
    readonly possessionPriority: number;
    readonly passingRisk: number;
    readonly preferHighPress: boolean;
    readonly preferCounterAttack: boolean;
    readonly compactness: number;
}
/** Team state during match */
export type TeamState = 'ATTACKING' | 'DEFENDING' | 'HIGH_PRESS' | 'COUNTER_ATTACK' | 'BALANCED';
/** Team state modifiers */
export interface TeamStateModifier {
    readonly speedMultiplier: number;
    readonly positioningAggression: number;
    readonly riskTolerance: number;
    readonly pressTriggerDistance: number;
}
/** Team match statistics */
export interface TeamStats {
    possession: number;
    possessionTime: number;
    passesCompleted: number;
    passesAttempted: number;
    shotsOnTarget: number;
    shotsOffTarget: number;
    tackles: number;
    interceptions: number;
    xGTotal: number;
    saves?: number;
}
/** Match statistics container */
export interface MatchStats {
    home: TeamStats;
    away: TeamStats;
    possession: {
        home: number;
        away: number;
    };
    possessionTimer: {
        home: number;
        away: number;
    };
    lastPossessionUpdate: number;
}
/** Goal event */
export interface GoalEvent {
    readonly time: number;
    readonly scorer: string;
    readonly isHome: boolean;
    readonly xG: number;
}
/** Card event */
export interface CardEvent {
    readonly player: string;
    readonly time: number;
    readonly type: 'yellow' | 'second_yellow' | 'direct_red';
}
/** Commentary entry */
export interface CommentaryEntry {
    readonly text: string;
    readonly type: 'goal' | 'save' | 'attack' | 'foul' | 'card';
}
/** Set piece types */
export type SetPieceType = 'KICK_OFF' | 'GOAL_KICK' | 'CORNER_KICK' | 'FREE_KICK' | 'THROW_IN' | 'PENALTY';
/** Set piece state */
export interface SetPieceState {
    type: SetPieceType;
    position: MutableVector2D;
    team: boolean;
    executed: boolean;
    executionTime: number;
    kicker?: Player;
    side?: string;
    configured?: boolean;
    isDangerous?: boolean;
}
/** Penalty system state */
export interface PenaltyState {
    shooter: Player;
    goalkeeper: Player;
    goalX: number;
    penaltySpotX: number;
    spotY: number;
    phase: 'SETUP' | 'READY' | 'SHOOTING';
    startTime: number;
}
/** Particle effect */
export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    life: number;
    decay: number;
    gravity: number;
    createdAt: number;
    update(dt: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
/** Canvas contexts */
export interface CanvasContexts {
    background: CanvasRenderingContext2D | null;
    game: CanvasRenderingContext2D | null;
    ui: CanvasRenderingContext2D | null;
}
/** Canvas elements */
export interface CanvasElements {
    background: HTMLCanvasElement | null;
    game: HTMLCanvasElement | null;
    ui: HTMLCanvasElement | null;
}
/** Foul event data */
export interface Foul {
    fouler: Player;
    fouled: Player;
    severity: number;
}
/** Position-specific configuration */
export interface PositionConfig {
    readonly defensiveness: number;
    readonly attackRange: number;
    readonly ballChasePriority: number;
    readonly idealWidth: number;
    readonly pushUpOnAttack: number;
    readonly pressAggression: number;
    readonly zoneCoverage: number;
    readonly supportDistance: number;
    readonly maxSpeed: number;
}
/** Export all types */
export type * from './core';
//# sourceMappingURL=core.d.ts.map