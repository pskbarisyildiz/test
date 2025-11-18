/**
 * Set Piece Configuration System - TypeScript Migration
 *
 * Handles tactical routine selection and configuration for set pieces:
 * - Corner kick routines (standard, inswinger, outswinger, short)
 * - Defensive systems (zonal, man marking)
 * - Goal kick strategies (short/long)
 * - Execution timing based on danger level
 *
 * @module setpieces/config
 * @migrated-from js/setpieces/setPieceConfig.js
 */
import type { GameState } from '../types';
/**
 * Intelligent routine selection based on team tactics
 */
export declare function configureSetPieceRoutines(gameState: GameState): void;
/**
 * Pre-configuration hook (Called before positioning players)
 * This simply ensures ball placement and execution time - positioning is handled by SetPieceBehaviorSystem
 */
export declare function executeSetPiece_PreConfiguration(): void;
//# sourceMappingURL=config.d.ts.map