import type { Player } from '../types';
export declare const offsideTracker: {
    lastPassTime: number;
    playersOffsideWhenBallPlayed: Set<string>;
    lastPassingTeam: "home" | "away" | null;
};
export declare function isPlayerInOffsidePosition(player: Player, ball: {
    x: number;
    y: number;
}, opponents: Player[]): boolean;
export declare function recordOffsidePositions(passingPlayer: Player, allPlayers: Player[]): void;
export declare function checkOffsidePenalty(player: Player): boolean;
export declare function awardOffsideFreeKick(offsidePlayer: Player): void;
export declare function drawOffsideLines(ctx: CanvasRenderingContext2D): void;
export declare function shouldAvoidOffside(player: Player, ball: {
    x: number;
    y: number;
}, opponents: Player[]): boolean;
export declare function initOffsideStats(): void;
export declare function recordOffsideStatistic(player: Player): void;
//# sourceMappingURL=offside.d.ts.map