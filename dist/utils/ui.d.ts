import type { GameState, Player } from '../types';
import { distance } from './math';
export declare function ensureStatsShape(gs: GameState): void;
export declare function setPossession(gs: GameState, homePct: number, awayPct: number): void;
export declare const SET_PIECE_STATUSES: readonly string[];
export declare function isSetPieceStatus(status: string): boolean;
export { distance as getDistance };
export declare function getAttackingGoalX(isHome: boolean, currentHalf: number): number;
export declare function getNearestAttacker(x: number, y: number, allPlayers: Player[], attackingTeamIsHome: boolean): Player | null;
export declare function calculateXG(shooter: Player, goalX: number, goalY: number, opponents: Player[]): number;
export declare function pointToLineDistance(point: {
    x: number;
    y: number;
}, lineStart: {
    x: number;
    y: number;
}, lineEnd: {
    x: number;
    y: number;
}): number;
export declare function getValidStat(statValue: any, defaultValue?: number): number;
export declare function resolveSide(value: any): 'home' | 'away' | null;
export declare function invertSide(side: 'home' | 'away' | null): 'home' | 'away' | null;
//# sourceMappingURL=ui.d.ts.map