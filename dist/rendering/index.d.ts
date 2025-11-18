/**
 * Rendering System
 * Central export point for all rendering-related functions
 *
 * @module rendering
 * @version 1.0.0-typescript
 */
export { initializeCanvasLayers } from './canvasSetup';
export { createGoalExplosion, createBallTrail, createPassEffect, createSaveEffect } from './particles';
export { drawPitchBackground, drawGrass, drawStripes, drawLines, drawCenterCircle, drawGoals, drawPenaltyAreas } from './drawPitch';
export { lightenColor, darkenColor, drawPlayer, drawPlayerShadow, drawPlayerBody, drawPlayerHighlight, drawPlayerLabel, drawBall, drawShotEffect, drawBallBody, drawBallPattern } from './drawEntities';
export { renderGame } from './gameRenderer';
//# sourceMappingURL=index.d.ts.map