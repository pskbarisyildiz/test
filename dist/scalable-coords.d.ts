import type { Player } from './types';
export declare const FIELD_CONFIG: {
    BASE_WIDTH: number;
    BASE_HEIGHT: number;
    ASPECT_RATIO: number;
    SCALE_FACTOR: number;
    readonly WIDTH: number;
    readonly HEIGHT: number;
    MARGIN: number;
    DEFENSIVE_THIRD: number;
    MIDDLE_THIRD: number;
    ATTACKING_THIRD: number;
    PENALTY_BOX_WIDTH: number;
    PENALTY_BOX_HEIGHT: number;
    SIX_YARD_BOX_WIDTH: number;
    SIX_YARD_BOX_HEIGHT: number;
    GOAL_WIDTH: number;
    GOAL_DEPTH: number;
    CENTER_CIRCLE_RADIUS: number;
    OFFSIDE_TOLERANCE: number;
    PASS_INTERCEPT_RANGE: number;
    BALL_CONTROL_DISTANCE: number;
    PLAYER_COLLISION_RADIUS: number;
    toPixels(relativePos: {
        x: number;
        y: number;
    }): {
        x: number;
        y: number;
    };
    toRelative(pixelPos: {
        x: number;
        y: number;
    }): {
        x: number;
        y: number;
    };
    distanceInMeters(dist: number): number;
    speedToPixelsPerSecond(metersPerSecond: number): number;
};
export declare class RelativePosition {
    rx: number;
    ry: number;
    constructor(x: number, y: number);
    get x(): number;
    get y(): number;
    setFromPixels(px: number, py: number): void;
    clone(): RelativePosition;
    distanceTo(other: RelativePosition): number;
    lerp(other: RelativePosition, t: number): RelativePosition;
}
export declare const PITCH_GEOMETRY: {
    leftGoal: {
        center: RelativePosition;
        topPost: RelativePosition;
        bottomPost: RelativePosition;
    };
    rightGoal: {
        center: RelativePosition;
        topPost: RelativePosition;
        bottomPost: RelativePosition;
    };
    leftPenaltySpot: RelativePosition;
    rightPenaltySpot: RelativePosition;
    centerCircle: RelativePosition;
    centerLineTop: RelativePosition;
    centerLineBottom: RelativePosition;
    topLeftCorner: RelativePosition;
    topRightCorner: RelativePosition;
    bottomLeftCorner: RelativePosition;
    bottomRightCorner: RelativePosition;
    leftPenaltyBox: {
        topLeft: RelativePosition;
        topRight: RelativePosition;
        bottomRight: RelativePosition;
        bottomLeft: RelativePosition;
    };
    rightPenaltyBox: {
        topLeft: RelativePosition;
        topRight: RelativePosition;
        bottomRight: RelativePosition;
        bottomLeft: RelativePosition;
    };
    zones: {
        leftDefensiveThird: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        };
        middleThird: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        };
        rightAttackingThird: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        };
        leftChannel: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        };
        leftHalfSpace: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        };
        centralChannel: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        };
        rightHalfSpace: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        };
        rightChannel: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        };
    };
    isInZone(relPos: RelativePosition, zone: {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
    }): boolean;
    getZone(relPos: RelativePosition): string;
};
export declare class PlayerPositionManager {
    player: Player;
    position: RelativePosition;
    homePosition: RelativePosition;
    targetPosition: RelativePosition;
    velocity: {
        rx: number;
        ry: number;
    };
    constructor(player: Player);
    updateFromPixels(x: number, y: number): void;
    getPixelPosition(): {
        x: number;
        y: number;
    };
    moveToward(targetRelPos: RelativePosition, deltaTime: number, speedMultiplier?: number): void;
    setHomePosition(relX: number, relY: number): void;
}
export declare const SCALABLE_FORMATIONS: {
    '4-3-3': {
        rx: number;
        ry: number;
        role: string;
    }[];
    '4-4-2': {
        rx: number;
        ry: number;
        role: string;
    }[];
};
export declare function initializePlayerPosition(player: Player, formationPos: {
    rx: number;
    ry: number;
}): void;
export declare function updatePlayerMovement(player: Player, deltaTime: number): void;
export declare function isInAttackingThird(player: Player, isHome: boolean): boolean;
export declare function setFieldScale(newScale: number): void;
//# sourceMappingURL=scalable-coords.d.ts.map