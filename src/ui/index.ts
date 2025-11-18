/**
 * UI System Index
 * Central export point for all UI functions
 *
 * ✅ TypeScript migration complete
 * ✅ Browser-compatible with global window exports
 */

// Export utility functions
export {
  ensureStatsShape,
  setPossession,
  getNearestAttacker,
  calculateXG,
  getValidStat,
  resolveSide,
  invertSide
} from './utils';

// Export UI manager functions
export {
  uiElements,
  render,
  updateGameUI,
  setupGameScreen
} from './uiManager';

// Export UI screens
export {
  renderUploadScreen,
  renderSetupScreen,
  switchSimulationMode,
  addMatchToBatch
} from './uiScreens';

// Export UI components
export {
  renderScoreboard,
  getStatusIndicator,
  renderCommentary,
  renderStats,
  renderMatchSummary,
  renderStatisticsSummary
} from './uiComponents';
