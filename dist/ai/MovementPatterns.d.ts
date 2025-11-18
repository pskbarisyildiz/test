import type { Player, GameState } from '../types';
export declare function selectBestAttackingMovement(player: Player, holder: Player, teammates: Player[], opponents: Player[], activePosition: {
    x: number;
    y: number;
}, opponentGoalX: number, gameState: GameState): {
    x: any;
    y: any;
    speedBoost: number;
    shouldLock: boolean;
};
//# sourceMappingURL=MovementPatterns.d.ts.map