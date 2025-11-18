/**
 * Rendering System
 * Central export point for all rendering-related functions
 *
 * @module rendering
 * @version 1.0.0-typescript
 */

// ============================================================================
// CANVAS SETUP
// ============================================================================
export { initializeCanvasLayers } from './canvasSetup';

// ============================================================================
// PARTICLES
// ============================================================================
export {
  createGoalExplosion,
  createBallTrail,
  createPassEffect,
  createSaveEffect
} from './particles';

// Note: Particle class is exported from ./particles for browser compatibility
// but not re-exported here to avoid conflicts with the Particle interface in types

// ============================================================================
// PITCH DRAWING
// ============================================================================
export {
  drawPitchBackground,
  drawGrass,
  drawStripes,
  drawLines,
  drawCenterCircle,
  drawGoals,
  drawPenaltyAreas
} from './drawPitch';

// ============================================================================
// ENTITY DRAWING
// ============================================================================
export {
  lightenColor,
  darkenColor,
  drawPlayer,
  drawPlayerShadow,
  drawPlayerBody,
  drawPlayerHighlight,
  drawPlayerLabel,
  drawBall,
  drawShotEffect,
  drawBallBody,
  drawBallPattern
} from './drawEntities';

// ============================================================================
// GAME RENDERER
// ============================================================================
export { renderGame } from './gameRenderer';

console.log('✅ Rendering System loaded (TypeScript v1.0.0)');
