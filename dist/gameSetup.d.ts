/**
 * Game Setup - Team Selection, Formation, and Player Initialization
 * Handles team composition, tactical selection, and player positioning
 */
import type { Player, GameState, MutableVector2D } from './types';
/**
 * Get ideal position for a player based on formation
 */
export declare function getFormationPosition(player: Player, team: string, _formation: string, gameState: GameState): MutableVector2D;
/**
 * Apply formation constraint with smooth blending
 */
export declare function applyFormationConstraint(player: Player, team: string, formation: string, gameState: GameState): Player;
interface FormationPosition {
    x: number;
    y: number;
    role: string;
}
export declare function getFormationPositions(isHome: boolean, isSecondHalf: boolean, formationName: string): FormationPosition[];
export declare function initializePlayers(home: Player[], away: Player[], homeFormation: string, awayFormation: string): {
    home: Player[];
    away: Player[];
};
export declare function selectBestFormation(teamPlayers: Player[]): string;
export declare function selectBestTactic(teamPlayers: Player[]): string;
export declare function selectBestTeam(teamName: string): {
    players: Player[];
    formation: string;
};
/**
 * Initialize game state with proper defaults
 */
export declare function initializeGameSetup(gameState: GameState): void;
export {};
//# sourceMappingURL=gameSetup.d.ts.map