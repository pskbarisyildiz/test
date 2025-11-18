// ============================================================================
// FOOTBALL SIMULATOR V2 - SCALABLE COORDINATE SYSTEM
// ============================================================================
// This revolutionary system allows instant scaling to any resolution
// All positions are stored as percentages (0-1), converted to pixels on render
// ============================================================================

import type { Player } from './types';

export const FIELD_CONFIG = {
    // 🎯 SINGLE SOURCE OF TRUTH - Change these to scale everything
    BASE_WIDTH: 800,
    BASE_HEIGHT: 600,

    // Real-world proportions (105m x 68m standard pitch)
    ASPECT_RATIO: 105 / 68,

    // Scaling multiplier (1.0 = 800x600, 2.0 = 1600x1200, etc.)
    SCALE_FACTOR: 2.0,

    // Computed dimensions (auto-calculated)
    get WIDTH() { return this.BASE_WIDTH * this.SCALE_FACTOR; },
    get HEIGHT() { return this.BASE_HEIGHT * this.SCALE_FACTOR; },

    // Boundary margins (as percentage of field size)
    MARGIN: 0.0125, // 1.25% margin (10px at 800px width)

    // Field zones (percentage-based)
    DEFENSIVE_THIRD: 0.333,
    MIDDLE_THIRD: 0.667,
    ATTACKING_THIRD: 1.0,

    // Box dimensions (percentage of field)
    PENALTY_BOX_WIDTH: 0.15,  // ~18 yards
    PENALTY_BOX_HEIGHT: 0.3,  // ~44 yards
    SIX_YARD_BOX_WIDTH: 0.075,
    SIX_YARD_BOX_HEIGHT: 0.133,

    // Goal dimensions
    GOAL_WIDTH: 0.1,  // 10% of field height (realistic proportion)
    GOAL_DEPTH: 0.025,

    // Circle dimensions
    CENTER_CIRCLE_RADIUS: 0.0875, // 9.15m in real life

    // Distances (as percentage of field width for consistency)
    OFFSIDE_TOLERANCE: 0.00625, // 0.5m tolerance
    PASS_INTERCEPT_RANGE: 0.05,
    BALL_CONTROL_DISTANCE: 0.035,
    PLAYER_COLLISION_RADIUS: 0.0225,

    // Methods for easy conversion
    toPixels(relativePos: { x: number; y: number }): { x: number; y: number } {
        return {
            x: relativePos.x * this.WIDTH,
            y: relativePos.y * this.HEIGHT
        };
    },

    toRelative(pixelPos: { x: number; y: number }): { x: number; y: number } {
        return {
            x: pixelPos.x / this.WIDTH,
            y: pixelPos.y / this.HEIGHT
        };
    },

    distanceInMeters(dist: number): number {
        return (dist / this.WIDTH) * 105;
    },

    speedToPixelsPerSecond(metersPerSecond: number): number {
        return (metersPerSecond / 105) * this.WIDTH;
    }
};

export class RelativePosition {
    rx: number;
    ry: number;

    constructor(x: number, y: number) {
        this.rx = x;
        this.ry = y;
    }

    get x(): number { return this.rx * FIELD_CONFIG.WIDTH; }
    get y(): number { return this.ry * FIELD_CONFIG.HEIGHT; }

    setFromPixels(px: number, py: number): void {
        this.rx = px / FIELD_CONFIG.WIDTH;
        this.ry = py / FIELD_CONFIG.HEIGHT;
    }

    clone(): RelativePosition {
        return new RelativePosition(this.rx, this.ry);
    }

    distanceTo(other: RelativePosition): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    lerp(other: RelativePosition, t: number): RelativePosition {
        return new RelativePosition(
            this.rx + (other.rx - this.rx) * t,
            this.ry + (other.ry - this.ry) * t
        );
    }
}

export const PITCH_GEOMETRY = {
    leftGoal: {
        center: new RelativePosition(0.0625, 0.5),
        topPost: new RelativePosition(0.0625, 0.5 - FIELD_CONFIG.GOAL_WIDTH / 2),
        bottomPost: new RelativePosition(0.0625, 0.5 + FIELD_CONFIG.GOAL_WIDTH / 2)
    },

    rightGoal: {
        center: new RelativePosition(0.9375, 0.5),
        topPost: new RelativePosition(0.9375, 0.5 - FIELD_CONFIG.GOAL_WIDTH / 2),
        bottomPost: new RelativePosition(0.9375, 0.5 + FIELD_CONFIG.GOAL_WIDTH / 2)
    },

    leftPenaltySpot: new RelativePosition(0.1, 0.5),
    rightPenaltySpot: new RelativePosition(0.9, 0.5),

    centerCircle: new RelativePosition(0.5, 0.5),
    centerLineTop: new RelativePosition(0.5, 0),
    centerLineBottom: new RelativePosition(0.5, 1),

    topLeftCorner: new RelativePosition(0, 0),
    topRightCorner: new RelativePosition(1, 0),
    bottomLeftCorner: new RelativePosition(0, 1),
    bottomRightCorner: new RelativePosition(1, 1),

    leftPenaltyBox: {
        topLeft: new RelativePosition(0, 0.35),
        topRight: new RelativePosition(0.15, 0.35),
        bottomRight: new RelativePosition(0.15, 0.65),
        bottomLeft: new RelativePosition(0, 0.65)
    },

    rightPenaltyBox: {
        topLeft: new RelativePosition(0.85, 0.35),
        topRight: new RelativePosition(1, 0.35),
        bottomRight: new RelativePosition(1, 0.65),
        bottomLeft: new RelativePosition(0.85, 0.65)
    },

    zones: {
        leftDefensiveThird: { x1: 0, x2: 0.333, y1: 0, y2: 1 },
        middleThird: { x1: 0.333, x2: 0.667, y1: 0, y2: 1 },
        rightAttackingThird: { x1: 0.667, x2: 1, y1: 0, y2: 1 },

        leftChannel: { x1: 0, x2: 1, y1: 0, y2: 0.2 },
        leftHalfSpace: { x1: 0, x2: 1, y1: 0.2, y2: 0.4 },
        centralChannel: { x1: 0, x2: 1, y1: 0.4, y2: 0.6 },
        rightHalfSpace: { x1: 0, x2: 1, y1: 0.6, y2: 0.8 },
        rightChannel: { x1: 0, x2: 1, y1: 0.8, y2: 1 }
    },

    isInZone(relPos: RelativePosition, zone: { x1: number; x2: number; y1: number; y2: number }): boolean {
        return relPos.rx >= zone.x1 && relPos.rx <= zone.x2 &&
            relPos.ry >= zone.y1 && relPos.ry <= zone.y2;
    },

    getZone(relPos: RelativePosition): string {
        for (const [name, zone] of Object.entries(this.zones)) {
            if (this.isInZone(relPos, zone)) return name;
        }
        return 'unknown';
    }
};

export class PlayerPositionManager {
    player: Player;
    position: RelativePosition;
    homePosition: RelativePosition;
    targetPosition: RelativePosition;
    velocity: { rx: number; ry: number };

    constructor(player: Player) {
        this.player = player;
        this.position = new RelativePosition(0.5, 0.5);
        this.homePosition = new RelativePosition(0.5, 0.5);
        this.targetPosition = new RelativePosition(0.5, 0.5);
        this.velocity = { rx: 0, ry: 0 };
    }

    updateFromPixels(x: number, y: number): void {
        this.position.setFromPixels(x, y);
    }

    getPixelPosition(): { x: number; y: number } {
        return { x: this.position.x, y: this.position.y };
    }

    moveToward(targetRelPos: RelativePosition, deltaTime: number, speedMultiplier = 1.0): void {
        const maxSpeed = FIELD_CONFIG.speedToPixelsPerSecond(
            this.player.pace / 100 * 10
        ) * speedMultiplier;

        const maxRelSpeed = maxSpeed / FIELD_CONFIG.WIDTH;

        const dx = targetRelPos.rx - this.position.rx;
        const dy = targetRelPos.ry - this.position.ry;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 0.001) return;

        const acceleration = maxRelSpeed * 5;

        const dirX = dx / distance;
        const dirY = dy / distance;

        this.velocity.rx += dirX * acceleration * deltaTime;
        this.velocity.ry += dirY * acceleration * deltaTime;

        const currentSpeed = Math.sqrt(
            this.velocity.rx * this.velocity.rx +
            this.velocity.ry * this.velocity.ry
        );

        if (currentSpeed > maxRelSpeed) {
            this.velocity.rx = (this.velocity.rx / currentSpeed) * maxRelSpeed;
            this.velocity.ry = (this.velocity.ry / currentSpeed) * maxRelSpeed;
        }

        this.position.rx += this.velocity.rx * deltaTime;
        this.position.ry += this.velocity.ry * deltaTime;

        this.velocity.rx *= Math.pow(0.9, deltaTime * 60);
        this.velocity.ry *= Math.pow(0.9, deltaTime * 60);
    }

    setHomePosition(relX: number, relY: number): void {
        this.homePosition = new RelativePosition(relX, relY);
    }
}

export const SCALABLE_FORMATIONS = {
    '4-3-3': [
        { rx: 0.08, ry: 0.5, role: 'GK' },
        { rx: 0.22, ry: 0.15, role: 'RB' },
        { rx: 0.22, ry: 0.38, role: 'CB' },
        { rx: 0.22, ry: 0.62, role: 'CB' },
        { rx: 0.22, ry: 0.85, role: 'LB' },
        { rx: 0.45, ry: 0.25, role: 'CM' },
        { rx: 0.45, ry: 0.5, role: 'CDM' },
        { rx: 0.45, ry: 0.75, role: 'CM' },
        { rx: 0.75, ry: 0.2, role: 'RW' },
        { rx: 0.75, ry: 0.5, role: 'ST' },
        { rx: 0.75, ry: 0.8, role: 'LW' }
    ],

    '4-4-2': [
        { rx: 0.08, ry: 0.5, role: 'GK' },
        { rx: 0.22, ry: 0.15, role: 'RB' },
        { rx: 0.22, ry: 0.38, role: 'CB' },
        { rx: 0.22, ry: 0.62, role: 'CB' },
        { rx: 0.22, ry: 0.85, role: 'LB' },
        { rx: 0.5, ry: 0.15, role: 'RM' },
        { rx: 0.5, ry: 0.38, role: 'CM' },
        { rx: 0.5, ry: 0.62, role: 'CM' },
        { rx: 0.5, ry: 0.85, role: 'LM' },
        { rx: 0.75, ry: 0.4, role: 'ST' },
        { rx: 0.75, ry: 0.6, role: 'ST' }
    ]
};

export function initializePlayerPosition(player: Player, formationPos: { rx: number; ry: number }): void {
    (player as any).positionManager = new PlayerPositionManager(player);
    (player as any).positionManager.setHomePosition(formationPos.rx, formationPos.ry);
    (player as any).positionManager.position = (player as any).positionManager.homePosition.clone();
}

export function updatePlayerMovement(player: Player, deltaTime: number): void {
    if (!(player as any).positionManager) return;

    const target = (player as any).positionManager.targetPosition;
    (player as any).positionManager.moveToward(target, deltaTime, player.speedBoost || 1.0);

    const pixelPos = (player as any).positionManager.getPixelPosition();
    player.x = pixelPos.x;
    player.y = pixelPos.y;
}

export function isInAttackingThird(player: Player, isHome: boolean): boolean {
    const pos = (player as any).positionManager.position;
    const attackingZone = isHome ?
        PITCH_GEOMETRY.zones.rightAttackingThird :
        { x1: 0, x2: 0.333, y1: 0, y2: 1 };

    return PITCH_GEOMETRY.isInZone(pos, attackingZone);
}

export function setFieldScale(newScale: number): void {
    FIELD_CONFIG.SCALE_FACTOR = newScale;

    const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (gameCanvas) {
        gameCanvas.width = FIELD_CONFIG.WIDTH;
        gameCanvas.height = FIELD_CONFIG.HEIGHT;
    }
}
