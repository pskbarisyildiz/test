import type { Player } from '../types';
export declare function resolveBallControl(allPlayers: Player[]): void;
export declare function canControlBall(player: Player, ball: {
    x: number;
    y: number;
}): boolean;
export declare function action_attemptTackle(player: Player, allPlayers: Player[]): boolean;
export declare function handleBallInterception(progress: number): void;
//# sourceMappingURL=ballControl.d.ts.map