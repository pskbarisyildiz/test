/**
 * UI Utility Functions
 * Helper functions for UI operations and calculations
 *
 * @migrated-from js/ui/utils.js
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 */
import type { GameState, Player } from '../types';
export declare function CFG(): any;
export declare function ensureStatsShape(gs: GameState): void;
export declare function setPossession(gs: GameState, homePct: number, awayPct: number): void;
export declare const SET_PIECE_STATUSES: readonly string[];
export declare function isSetPieceStatus(status: string | undefined | null): boolean;
export declare function getDistance(a: any, b: any): number;
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
export declare function invertSide(side: 'home' | 'away' | string): 'home' | 'away' | null;
//# sourceMappingURL=utils.d.ts.map