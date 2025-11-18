/**
 * Rules Systems Module - Centralized Exports
 *
 * This module exports all game rules systems:
 * - Offside detection and enforcement
 * - Ball control resolution
 * - Tackling mechanics
 * - Interception logic
 * - Aerial duels
 *
 * @module rules
 */

// ============================================================================
// OFFSIDE RULES
// ============================================================================

export {
  offsideTracker,
  isPlayerInOffsidePosition,
  recordOffsidePositions,
  checkOffsidePenalty,
  awardOffsideFreeKick,
  drawOffsideLines,
  shouldAvoidOffside,
  initOffsideStats,
  recordOffsideStatistic
} from './offside';

// ============================================================================
// BALL CONTROL RULES
// ============================================================================

export {
  resolveBallControl,
  canControlBall,
  action_attemptTackle,
  handleBallInterception
} from './ballControl';
