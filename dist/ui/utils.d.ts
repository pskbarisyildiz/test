/**
 * UI Utility Functions
 * Helper functions for UI operations and calculations
 *
 * @migrated-from js/ui/utils.js
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 */
import type { GameState, Player } from '../types';
import { GAME_CONFIG } from '../config';
export declare function CFG(): typeof GAME_CONFIG;
export declare function ensureStatsShape(gs: GameState): void;
export declare function setPossession(gs: GameState, homePct: number, awayPct: number): void;
export declare const SET_PIECE_STATUSES: readonly string[];
export declare function isSetPieceStatus(status: string | undefined | null): boolean;
export declare function getDistance(a: {
    x?: number;
    y?: number;
} | null | undefined, b: {
    x?: number;
    y?: number;
} | null | undefined): number;
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
export declare function getValidStat(statValue: unknown, defaultValue?: number): number;
export declare function resolveSide(value: unknown): 'home' | 'away' | null;
export declare function invertSide(side: 'home' | 'away' | string): 'home' | 'away' | null;
//# sourceMappingURL=utils.d.ts.map