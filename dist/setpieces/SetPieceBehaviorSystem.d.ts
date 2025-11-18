import type { Player, GameState } from '../types';
declare function getSetPiecePosition(player: Player, gameState: GameState): import("./utils").PositionWithMovement;
declare function shouldLockSetPiecePosition(player: Player, gameState: GameState): boolean;
declare function getSetPieceMovementType(player: Player, gameState: GameState): string;
declare function isSetPieceActive(gameState: GameState): boolean;
export declare const SetPieceBehaviorSystem: {
    getSetPiecePosition: typeof getSetPiecePosition;
    shouldLockSetPiecePosition: typeof shouldLockSetPiecePosition;
    getSetPieceMovementType: typeof getSetPieceMovementType;
    isSetPieceActive: typeof isSetPieceActive;
};
export {};
//# sourceMappingURL=SetPieceBehaviorSystem.d.ts.map