import type { Player } from '../types';
export declare const VISION_CONFIG: {
    NORMAL_VISION_ANGLE: number;
    BALL_CARRIER_ANGLE: number;
    UNDER_PRESSURE_ANGLE: number;
    MAX_VISION_RANGE: number;
    PERIPHERAL_RANGE: number;
    SCAN_INTERVAL_MIN: number;
    SCAN_INTERVAL_MAX: number;
    SCAN_DURATION: number;
    BALL_ALWAYS_VISIBLE_RANGE: number;
    VISION_STAT_BONUS: number;
    COMPOSURE_BONUS: number;
};
export declare function getPlayerFacingDirection(player: Player): number;
export declare function canPlayerSee(player: Player, target: {
    x: number;
    y: number;
    id?: string | number;
    isVisibleTo?: {
        [key: string]: boolean;
    };
}, detailLevel?: string): boolean;
export declare function updatePlayerScanning(player: Player): void;
export declare function getVisibleTeammates(player: Player, allPlayers: Player[]): Player[];
export declare function findBestPassOption_WithVision(passer: Player, teammates: Player[], opponents: Player[]): Player | null;
export declare function getPerceivedThreats(player: Player, opponents: Player[]): Player[];
export declare function drawVisionCones(ctx: CanvasRenderingContext2D): void;
//# sourceMappingURL=playerVision.d.ts.map