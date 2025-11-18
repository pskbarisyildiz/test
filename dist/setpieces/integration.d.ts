import type { Player, GameState } from '../types';
export { executeSetPiece_Router } from './execution';
export declare const SET_PIECE_RULES: {
    MIN_DISTANCE_PIXELS: number;
    THROW_IN_DISTANCE_PIXELS: number;
};
export declare function ensureCorrectSetPiecePlacement(gameState: GameState): void;
export declare function assignSetPieceKicker(player: Player | null): void;
export declare function getCornerKickPosition(isLeftCorner: boolean, isTopCorner: boolean): {
    x: number;
    y: number;
};
export declare function getGoalKickPosition(goalX: number, preferredSide?: string): {
    x: number;
    y: number;
};
export declare function positionForSetPiece_Unified(player: Player, allPlayers: Player[]): void;
export declare function positionForSetPiece_Legacy(player: Player, allPlayers: Player[]): void;
export declare function updatePlayerAI_V2_SetPieceEnhancement(player: Player, allPlayers: Player[], gameState: GameState): boolean;
export declare function executeSetPiece_PostExecution(): void;
//# sourceMappingURL=integration.d.ts.map