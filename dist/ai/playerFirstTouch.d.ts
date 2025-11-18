import type { Player, BallTrajectory } from '../types';
export declare const FIRST_TOUCH_CONFIG: {
    PERFECT_TOUCH_THRESHOLD: number;
    GOOD_TOUCH_THRESHOLD: number;
    POOR_TOUCH_THRESHOLD: number;
    PERFECT_TOUCH_SPEED: number;
    GOOD_TOUCH_SPEED: number;
    POOR_TOUCH_SPEED: number;
    PERFECT_TOUCH_SETTLE_TIME: number;
    GOOD_TOUCH_SETTLE_TIME: number;
    POOR_TOUCH_SETTLE_TIME: number;
    MIN_BOUNCE_DISTANCE: number;
    MAX_BOUNCE_DISTANCE: number;
    SLOW_PASS_SPEED: number;
    FAST_PASS_SPEED: number;
    PRESSURE_DISTANCE: number;
    PRESSURE_PENALTY_PER_OPP: number;
};
export declare function applyFirstTouch(player: Player, trajectory: BallTrajectory | null, allPlayers: Player[]): {
    outcome: string;
    quality: number;
    settleTime: number;
    speedMultiplier: number;
};
export declare function handleFailedFirstTouch(player: Player, allPlayers: Player[]): void;
export declare function handlePoorFirstTouch(player: Player, touchResult: {
    outcome: string;
    quality: number;
    settleTime: number;
    speedMultiplier: number;
}): void;
export declare function handleSuccessfulFirstTouch(player: Player, touchResult: {
    outcome: string;
    quality: number;
    settleTime: number;
    speedMultiplier: number;
}): void;
export declare function canPlayerActOnBall(player: Player): boolean;
export declare function drawFirstTouchIndicator(ctx: CanvasRenderingContext2D, player: Player): void;
export declare function initFirstTouchStats(): void;
export declare function recordFirstTouchStatistic(player: Player, outcome: string): void;
//# sourceMappingURL=playerFirstTouch.d.ts.map