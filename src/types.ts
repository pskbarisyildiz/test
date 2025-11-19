
export interface GameLoopConfig {
    FIXED_TIMESTEP: number;
    MAX_FRAME_TIME: number;
    GAME_SPEED: number;
}

export interface PhysicsConfig {
    MAX_SPEED: number;
    SPRINT_MULTIPLIER: number;
    ACCELERATION: number;
    FRICTION: number;
    DRIBBLE_SPEED_PENALTY: number;
    COLLISION_RADIUS: number;
    BALL_CONTROL_DISTANCE: number;
    PASS_INTERCEPT_DISTANCE: number;
    MOVEMENT_THRESHOLD: number;
    POSITIONING_SMOOTHNESS: number;
    LONG_PASS_THRESHOLD: number;
    HEADER_HEIGHT_THRESHOLD: number;
    PLAYER_MASS: number;
    BALL_MASS: number;
}

export interface BallPhysicsConfig {
    MAX_SPEED: number;
    FRICTION: number;
    GRAVITY: number;
    BOUNCE: number;
    SPIN_EFFECT: number;
}

export interface GameConfig {
    GOAL_CHECK_DISTANCE: number;
    SHOOTING_CHANCE_BASE: number;
    PASSING_CHANCE: number;
    EVENT_PROBABILITY: number;
    DECISION_COOLDOWN: number;
    GK_HOLD_TIME: number;
    HIGH_DPI_SCALE_FACTOR: number;
    GOAL_Y_TOP: number;
    GOAL_Y_BOTTOM: number;
    PITCH_WIDTH: number;
    PITCH_HEIGHT: number;
    AVERAGE_SPRINT_TIME_TO_GOAL: number;
    REACTION_TIME_MIN: number;
    REACTION_TIME_MAX: number;
    GAME_SPEED: number;
    GOAL_X_LEFT: number;
    GOAL_X_RIGHT: number;
}

export interface BehaviorTreeConfig {
    PRIORITY_SHOOT: number;
    PRIORITY_PASS: number;
    PRIORITY_DRIBBLE: number;
    PRIORITY_TACKLE: number;
    PRIORITY_MARK: number;
    PRIORITY_POSITION: number;
    BALL_CLOSE_DISTANCE: number;
    OPPONENT_CLOSE_DISTANCE: number;
    TEAMMATE_SUPPORT_DISTANCE: number;
    MAX_BALL_HOLD_TIME: number;
    MAX_BALL_HOLD_TIME_UNDER_PRESSURE: number;
    SHOOT_CHANCE_IN_BOX: number;
    SHOOT_CHANCE_OUTSIDE_BOX: number;
    PASS_CHANCE_UNDER_PRESSURE: number;
    DRIBBLE_CHANCE_IN_SPACE: number;
}

export type PlayerRole = 'GK' | 'CB' | 'LCB' | 'RCB' | 'RB' | 'LB' | 'CDM' | 'CM' | 'LCM' | 'RCM' | 'RM' | 'LM' | 'CAM' | 'RW' | 'LW' | 'ST' | 'CF';

export interface PositionConfig {
    defensiveness: number;
    attackRange: number;
    ballChasePriority: number;
    idealWidth: number;
    pushUpOnAttack: number;
    pressAggression: number;
    zoneCoverage: number;
    supportDistance: number;
    maxSpeed: number;
}

export type PositionConfigsMap = {
    [key in PlayerRole]: PositionConfig;
};

export interface FormationPosition {
    x: number;
    y: number;
    role: PlayerRole;
}

export type FormationsMap = {
    [key: string]: FormationPosition[];
};

export interface Tactic {
    name: string;
    description: string;
    pressIntensity: number;
    defensiveLineDepth: number;
    counterAttackSpeed: number;
    possessionPriority: number;
    passingRisk: number;
    preferHighPress: boolean;
    preferCounterAttack: boolean;
    compactness: number;
}

export type TacticsMap = {
    [key: string]: Tactic;
};

export interface TeamStateModifier {
    speedMultiplier: number;
    positioningAggression: number;
    riskTolerance: number;
    pressTriggerDistance: number;
}

export type TeamStateModifiersMap = {
    [key: string]: TeamStateModifier;
};

export type PositionToRoleMap = {
    [key: string]: PlayerRole;
};

export interface Player {
    id: string | number;
    name: string;
    x: number;
    y: number;
    isHome: boolean;
    role: PlayerRole;
    shooting: number;
    vx: number;
    vy: number;
    targetX: number;
    targetY: number;
    speedBoost: number;
    hasBallControl: boolean;
    isChasingBall: boolean;
    dribbling: number;
    physicality: number;
    pace: number;
    defending: number;
    rating: number;
    ballReceivedTime: number | null;
    realStats: any;
    stamina: number;
    passing: number;
    effectivePace: number;
    effectiveShooting: number;
    effectivePassing: number;
    chaseStartTime: number | null;
    targetLocked: boolean;
    lastDecisionTime: number;
    stunnedUntil: number;
    isInWall: boolean;
    isDefCBLine: boolean;
    isMarker: boolean;
    isKicker: boolean;
    targetLockTime: number;
    position: string;
    lockUntil: number;
    setPieceTarget: { x: number; y: number } | null;
    intent: string;
    goalkeeping: number;
    homeX: number;
    homeY: number;
    currentBehavior: string;
    team: string;
    goalkeeper: any;
    // Dynamic game state properties (added for type safety)
    wasOffsideWhenBallPlayed?: boolean; // Tracks offside status when ball was played
    facingAngle?: number; // Player's facing direction in radians
    // First touch temporary properties
    firstTouchQuality?: number; // Quality of last first touch (0-1)
    firstTouchTime?: number; // Timestamp of first touch
    ballSettleTime?: number; // Time needed to settle the ball
    // Set piece properties
    setPieceRole?: string; // Role in set piece (KICKER, THROWER, etc.)
}

export interface GameState {
    stats: {
        home: any; // TeamStats but need to avoid circular dependency
        away: any;
        possession?: { home: number; away: number };
        possessionTimer?: { home: number; away: number };
        lastPossessionUpdate?: number;
    };
    canvases?: {
        background: HTMLCanvasElement | null;
        game: HTMLCanvasElement | null;
        ui: HTMLCanvasElement | null;
    };
    contexts?: {
        background: CanvasRenderingContext2D | null;
        game: CanvasRenderingContext2D | null;
        ui: CanvasRenderingContext2D | null;
    };
    isVertical: boolean;
    orientationChanged: boolean;
    backgroundDrawn: boolean;
    status: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    timeElapsed: number;
    currentHalf: number;
    commentary: any[];
    goalEvents: any[];
    cardEvents: any[];
    players: any[];
    homePlayers: any[];
    awayPlayers: any[];
    setPiece: any;
    teamLogos: Record<string, string>;
    homeTactic: string;
    awayTactic: string;
    ballTrajectory: any;
    ballPosition: Vector2D;
    ballVelocity: Vector2D;
    ballHolder: Player | null;
    homeTeamState: TeamState;
    awayTeamState: TeamState;
    lastTouchedBy: any;
    ballHeight: number;
    currentPassReceiver: Player | null;
    ballChasers: Set<Player>;
    lastPossessionChange: number;
    shotInProgress: boolean;
    shooter: Player | null;
    homeJerseyColor: string;
    awayJerseyColor: string;
    offscreenPitch: any;
    cameraShake: any;
    particles: Particle[];
    lastTeamStateUpdate: number;
    postKickOffCalmPeriod: boolean;
    kickOffCompletedTime: number;
    currentShotXG: number | null;
    lastGoalScorer: string | null;
    homeDefensiveLine: number;
    awayDefensiveLine: number;
    homeFormation: string;
    awayFormation: string;
    homeTacticManuallySet: boolean;
    awayTacticManuallySet: boolean;
    lastEventTime: number;
    totalPasses: number;
    totalShots: number;
    fouls: number;
    yellowCards: any[];
    redCards: any[];
    setPieceExecuting: boolean;
    lastControlAttempt: number;
    possessionChanges: number;
    gameUIDisplayed: boolean;
    summaryDrawn: boolean;
    teams: string[];
    teamJerseys: Record<string, { jersey1: string; jersey2: string; }>;
    teamCoaches: Record<string, string>;
    totalTackles: number;
    commentaryFadeTimeout: any;
    _teamCacheVersion: number;
}

export interface Vector2D {
    x: number;
    y: number;
}

export interface MutableVector2D {
    x: number;
    y: number;
}

export interface PositionWithMovement {
    x: number;
    y: number;
}

export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    alpha: number;
    type: string;
    size: number;
    rotation: number;
    life: number;
    createdAt: number;
    draw: (ctx: CanvasRenderingContext2D) => void;
}

export interface BallTrajectory {
    x: number;
    y: number;
    z: number;
    endX: number;
    startX: number;
    duration: number;
    endY: number;
    startY: number;
}

export type TeamState = 'ATTACKING' | 'DEFENDING' | 'HIGH_PRESS' | 'COUNTER_ATTACK' | 'BALANCED';

export enum EVENT_TYPES {
    MATCH_START = 'MATCH_START',
    HALF_TIME = 'HALF_TIME',
    MATCH_END = 'MATCH_END',
    BALL_PASSED = 'BALL_PASSED',
    GOAL_SCORED = 'GOAL_SCORED',
    SHOT_SAVED = 'SHOT_SAVED',
    FOUL_COMMITTED = 'FOUL_COMMITTED',
    SHOT_TAKEN = 'SHOT_TAKEN',
    TEAM_STATE_CHANGED = 'TEAM_STATE_CHANGED',
    POSSESSION_CHANGED = 'POSSESSION_CHANGED',
    BALL_LOST = 'BALL_LOST',
}

export interface EventBus {
    subscribe<T>(eventType: string | EVENT_TYPES, listener: EventListener<T>): () => void;
    unsubscribe<T>(eventType: string | EVENT_TYPES, listener: EventListener<T>): void;
    publish<T>(eventType: string | EVENT_TYPES, data: T): void;
    events: Record<string, EventListener<any>[]>;
    getListenerCount(eventType: string | EVENT_TYPES): number;
    clear(eventType?: string | EVENT_TYPES): void;
    hasListeners(eventType: string | EVENT_TYPES): boolean;
}

export type EventListener<T> = (data: T) => void;

export interface GoalEventPayload {
    scorer: Player;
    assist: Player | null;
    team: string;
    time: number;
    xG: number;
}

export interface ShotEventPayload {
    shooter: Player;
    team: string;
    time: number;
    isOnTarget: boolean;
    xG: number;
}

export interface FoulEventPayload {
    foulingPlayer: Player;
    victim: Player;
    fouler: Player;
    fouled: Player;
    team: string;
    time: number;
}

export interface TeamStateChangePayload {
    team: string;
    newState: TeamState;
    previousState: TeamState;
    time: number;
}

export interface PossessionChangePayload {
    newTeam: string;
    previousTeam: string;
    newHolder: Player;
    time: number;
}

export interface Foul {
    fouler: Player;
    fouled: Player;
    severity: number;
}
