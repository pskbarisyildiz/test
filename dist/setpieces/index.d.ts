/**
 * Set Piece Systems Module - Centralized Exports
 *
 * This module exports set piece configuration and utilities:
 * - Configuration: Routine selection and execution timing
 * - Utilities: Position management, validation, offside checks
 * - Behaviors: Kickoff and penalty positioning (more to be added)
 *
 * @module setpieces
 */
export { configureSetPieceRoutines, executeSetPiece_PreConfiguration } from './config';
export { TacticalContext, PositionManager, sanitizePosition, getValidPlayers, getSortedLists, determineSetPieceTeam, isPlayerAttacking, getFormationAwarePosition, checkAndAdjustOffsidePosition, checkAndAdjustOffsidePositionWithAudit } from './utils';
export { PenaltyKickBehaviors } from './behaviors/penalty';
export { KickoffBehaviors } from './behaviors/kickoff';
export { ThrowInBehaviors } from './behaviors/throwIn';
export { ProfessionalCornerBehaviors } from './behaviors/cornerKick';
export { ProfessionalGoalKickBehaviors } from './behaviors/goalKick';
export { ProfessionalFreeKickBehaviors } from './behaviors/freeKick';
export { SetPieceEnforcement } from './enforcement';
export { executeCornerKick_Enhanced, executeFreeKick_Enhanced, executeThrowIn_Enhanced, executeGoalKick_Enhanced, executeKickOff_Enhanced, executeSetPiece_Router } from './execution';
export { SET_PIECE_RULES, ensureCorrectSetPiecePlacement, assignSetPieceKicker, getCornerKickPosition, getGoalKickPosition, positionForSetPiece_Unified, positionForSetPiece_Legacy, updatePlayerAI_V2_SetPieceEnhancement, executeSetPiece_PostExecution } from './integration';
//# sourceMappingURL=index.d.ts.map