/**
 * AI Systems Module - Centralized Exports
 *
 * This module exports all AI systems:
 * - Decision-making (pass/shoot/dribble)
 * - Movement and positioning
 * - Goalkeeper behavior
 *
 * @module ai
 */
export { calculateAvgDribbling, passBall, calculateDribbleSuccess, calculatePassSuccess, checkForThroughBall, initiatePass, initiateThroughBall, initiateDribble, handlePlayerWithBall_WithFirstTouch, handlePlayerWithBall_WithVision } from './decisions';
export { getPositionConfig, getPlayerActivePosition, getZoneForPlayer, assessDefensiveThreats, findMostDangerousAttacker, calculateOptimalMarkingPosition, updateTacticalPosition, applyMarkingAndPressing, applyDefensivePositioning, applyAttackingMovement } from './movement';
export { GOALKEEPER_CONFIG, assessGoalkeeperThreats, determineGoalkeeperStance, calculateOptimalGoalkeeperPosition, shouldGoalkeeperSweep, handleCrossSituation, updateGoalkeeperAI_Advanced, calculateSaveProbability_Advanced, triggerGoalkeeperSave, drawGoalkeeperStanceIndicator, resolveShot_WithAdvancedGK } from './goalkeeper';
export { VISION_CONFIG, getPlayerFacingDirection, canPlayerSee, updatePlayerScanning, getVisibleTeammates, findBestPassOption_WithVision, getPerceivedThreats, drawVisionCones } from './playerVision';
export { FIRST_TOUCH_CONFIG, applyFirstTouch, handleFailedFirstTouch, handlePoorFirstTouch, handleSuccessfulFirstTouch, canPlayerActOnBall, drawFirstTouchIndicator, initFirstTouchStats, recordFirstTouchStatistic } from './playerFirstTouch';
export { selectBestAttackingMovement } from './MovementPatterns';
//# sourceMappingURL=index.d.ts.map