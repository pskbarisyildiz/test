/**
 * Pitch Drawing System
 * Handles rendering of the football pitch background, lines, and markings
 *
 * @migrated-from js/rendering/drawPitch.js
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 */

import type { GameState } from '../types';
import { gameState } from '../globalExports';
import { GAME_CONFIG } from '../config';

// ============================================================================
// GLOBAL DECLARATIONS
// ============================================================================

declare global {
  interface Window {
    gameState: GameState;
    drawPitchBackground?: typeof drawPitchBackground;
    drawGrass?: typeof drawGrass;
    drawStripes?: typeof drawStripes;
    drawLines?: typeof drawLines;
    drawCenterCircle?: typeof drawCenterCircle;
    drawGoals?: typeof drawGoals;
    drawPenaltyAreas?: typeof drawPenaltyAreas;
  }
}

// ============================================================================
// MAIN PITCH DRAWING
// ============================================================================

/**
 * Draw the pitch background with caching
 */
export function drawPitchBackground(): void {
  if (!gameState.contexts || !gameState.contexts.background) {
    console.warn('Background context not ready.');
    return;
  }

  const ctx = gameState.contexts.background;

  // Get dynamic canvas dimensions
  const canvasWidth = gameState.isVertical ? 600 : 800;
  const canvasHeight = gameState.isVertical ? 800 : 600;

  // 1. Clear the main canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 2. Conditionally apply the 90-degree rotation
  ctx.save();
  if (gameState.isVertical) {
    ctx.translate(600, 0); // Translate to top-right corner
    ctx.rotate(Math.PI / 2); // Rotate 90 degrees
  }

  // 3. Check for the cached 800x600 pitch
  if (gameState.offscreenPitch) {
    ctx.drawImage(
      gameState.offscreenPitch,
      0, 0, // Source X, Y
      GAME_CONFIG.PITCH_WIDTH, GAME_CONFIG.PITCH_HEIGHT,
      0, 0, // Destination X, Y (Logical 0, 0)
      GAME_CONFIG.PITCH_WIDTH, GAME_CONFIG.PITCH_HEIGHT
    );
    ctx.restore(); // Restore context (Semicolon removed from the end)
    return; // Exit the function now that the pitch is drawn
  }

  console.log('🖼️ Creating and caching pitch background for the first time...');

  // Create a new hidden canvas in memory (ALWAYS 800x600)
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = GAME_CONFIG.PITCH_WIDTH;  // 800
  offscreenCanvas.height = GAME_CONFIG.PITCH_HEIGHT; // 600
  const offCtx = offscreenCanvas.getContext('2d'); // Draw on the hidden canvas

  if (!offCtx) {
    console.error('Failed to get offscreen context');
    ctx.restore();
    return;
  }

  const w = GAME_CONFIG.PITCH_WIDTH;
  const h = GAME_CONFIG.PITCH_HEIGHT;

  // Perform drawing operations on the hidden 800x600 canvas
  drawGrass(offCtx, w, h);
  drawStripes(offCtx, w, h);
  drawLines(offCtx, w, h);
  drawGoals(offCtx, w, h);
  drawCenterCircle(offCtx, w, h);
  drawPenaltyAreas(offCtx, w, h);

  offCtx.shadowBlur = 0;

  gameState.offscreenPitch = offscreenCanvas;

  ctx.drawImage(
    gameState.offscreenPitch,
    0, 0,
    GAME_CONFIG.PITCH_WIDTH, GAME_CONFIG.PITCH_HEIGHT,
    0, 0,
    GAME_CONFIG.PITCH_WIDTH, GAME_CONFIG.PITCH_HEIGHT
  );
  // -------------------------------------------------------------------
  ctx.restore(); // Restore context
}

// ============================================================================
// PITCH ELEMENT DRAWING
// ============================================================================

/**
 * Draw grass background
 */
export function drawGrass(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  // Modern, vibrant grass with depth
  //const grassGradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w * 0.8);
  // grassGradient.addColorStop(0, '#0d5c2e');
  //grassGradient.addColorStop(0.5, '#0a4d24');
  // grassGradient.addColorStop(1, '#083d1d');
  ctx.fillStyle = '#0d5c2e';
  ctx.fillRect(0, 0, w, h);
}

/**
 * Draw grass stripes (mowing pattern)
 */
export function drawStripes(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  // Realistic mowing pattern stripes
  const stripeWidth = 50; // Her bir şeridin genişliği

  // Yarı saydam açık renk (degradenin yerine)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.07)'; // Hafif bir aydınlatma efekti

  // Her iki şeritte bir (bir boş, bir dolu) aydınlık şerit çiz
  for (let i = 0; i < w; i += stripeWidth * 2) {
    ctx.fillRect(i, 0, stripeWidth, h);
  }

  // Not: globalAlpha veya save/restore'a artık gerek yok
  // çünkü fillStyle'ımız zaten yarı saydam.
}

/**
 * Draw pitch lines
 */
export function drawLines(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  // Ultra-crisp white lines with enhanced glow
  ctx.save();
  ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
  ctx.shadowBlur = 10;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Outer boundary
  ctx.strokeRect(10, 10, w - 20, h - 20);

  // Center line
  ctx.beginPath();
  ctx.moveTo(w / 2, 10);
  ctx.lineTo(w / 2, h - 10);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw center circle
 */
export function drawCenterCircle(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.save();
  ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
  ctx.shadowBlur = 10;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;

  // Center circle
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 70, 0, Math.PI * 2);
  ctx.stroke();

  // Center spot with enhanced glow
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.restore();
}

/**
 * Draw goals
 */
export function drawGoals(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.save();
  ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
  ctx.shadowBlur = 8;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;

  // Left goal
  ctx.strokeRect(10, h / 2 - 120, 120, 240);
  // Right goal
  ctx.strokeRect(w - 130, h / 2 - 120, 120, 240);

  ctx.restore();
}

/**
 * Draw penalty areas and arcs
 */
export function drawPenaltyAreas(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.save();
  ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
  ctx.shadowBlur = 8;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;

  // Left penalty area
  ctx.strokeRect(10, h / 2 - 60, 50, 120);
  // Right penalty area
  ctx.strokeRect(w - 60, h / 2 - 60, 50, 120);

  const angle = Math.acos(50 / 70);

  // Left penalty arc
  ctx.beginPath();
  ctx.arc(80, h / 2, 70, -angle, angle);
  ctx.stroke();

  // Right penalty arc
  ctx.beginPath();
  ctx.arc(w - 80, h / 2, 70, Math.PI - angle, Math.PI + angle);
  ctx.stroke();

  // Penalty spots with enhanced glow
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(80, h / 2, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w - 80, h / 2, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ============================================================================
// BROWSER EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
  window.drawPitchBackground = drawPitchBackground;
  window.drawGrass = drawGrass;
  window.drawStripes = drawStripes;
  window.drawLines = drawLines;
  window.drawCenterCircle = drawCenterCircle;
  window.drawGoals = drawGoals;
  window.drawPenaltyAreas = drawPenaltyAreas;
}
