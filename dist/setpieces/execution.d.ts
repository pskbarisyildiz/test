/**
 * Set Piece Execution Module
 * @migrated-from js/setpieces/setPieceExecution.js
 *
 * This module handles the execution of all set pieces:
 * - Corner kicks (enhanced)
 * - Free kicks (enhanced)
 * - Throw-ins (enhanced)
 * - Goal kicks (enhanced)
 * - Kick-offs (enhanced)
 * - Router for dispatching set piece execution
 */
import type { GameState } from '../types';
export declare function executeCornerKick_Enhanced(gameState: GameState): boolean;
export declare function executeFreeKick_Enhanced(gameState: GameState): boolean;
export declare function executeThrowIn_Enhanced(gameState: GameState): boolean;
export declare function executeGoalKick_Enhanced(gameState: GameState): boolean;
export declare function executeKickOff_Enhanced(gameState: GameState): boolean;
export declare function executeSetPiece_Router(gameState: GameState): void;
//# sourceMappingURL=execution.d.ts.map