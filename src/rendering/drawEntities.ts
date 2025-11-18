/**
 * Entity Drawing System
 * Handles rendering of players, ball, and related visual effects
 *
 * @migrated-from js/rendering/drawEntities.js
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 */

import type { GameState, Player } from '../types';
import { createBallTrail } from './particles';

// ============================================================================
// GLOBAL DECLARATIONS
// ============================================================================

declare global {
  interface Window {
    gameState: GameState;
    lightenColor?: typeof lightenColor;
    darkenColor?: typeof darkenColor;
    drawPlayer?: typeof drawPlayer;
    drawPlayerShadow?: typeof drawPlayerShadow;
    drawPlayerBody?: typeof drawPlayerBody;
    drawPlayerHighlight?: typeof drawPlayerHighlight;
    drawPlayerLabel?: typeof drawPlayerLabel;
    drawBall?: typeof drawBall;
    drawShotEffect?: typeof drawShotEffect;
    drawBallBody?: typeof drawBallBody;
    drawBallPattern?: typeof drawBallPattern;
  }
}

// ============================================================================
// COLOR UTILITIES
// ============================================================================

/**
 * Lighten a hex color by a percentage
 */
export function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
}

/**
 * Darken a hex color by a percentage
 */
export function darkenColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return "#" + (0x1000000 + (R > 0 ? R : 0) * 0x10000 +
    (G > 0 ? G : 0) * 0x100 + (B > 0 ? B : 0))
    .toString(16).slice(1);
}

// ============================================================================
// PLAYER DRAWING
// ============================================================================

/**
 * Draw a player on the canvas
 */
export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player, hasBall: boolean): void {
  if (!player || typeof player.x !== 'number' || typeof player.y !== 'number' ||
    !isFinite(player.x) || !isFinite(player.y)) {
    console.warn('Invalid player position:', player?.name, player?.x, player?.y);
    return;
  }

  const size = 16;

  // Enhanced shadow with better depth
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.restore();

  // Draw player body with improved gradient
  const offset = size * 0.5;
  const gradient = ctx.createRadialGradient(
    player.x - offset, player.y - offset, 0,
    player.x, player.y, size
  );
  const color = player.isHome ? window.gameState.homeJerseyColor : window.gameState.awayJerseyColor;

  gradient.addColorStop(0, lightenColor(color, 50));
  gradient.addColorStop(0.5, color);
  gradient.addColorStop(1, darkenColor(color, 30));

  ctx.beginPath();
  ctx.arc(player.x, player.y, size, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Enhanced highlight with better visibility
  const isShooter = window.gameState.shooter && window.gameState.shooter.name === player.name && window.gameState.shotInProgress;

  if (hasBall || isShooter) {
    ctx.save();
    ctx.shadowColor = isShooter ? '#ff4444' : '#ffd700';
    ctx.shadowBlur = 15;
    ctx.strokeStyle = isShooter ? '#ff4444' : '#ffd700';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(player.x, player.y, size + 2, 0, Math.PI * 2);
    ctx.stroke();

    // Add pulsing outer ring
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(player.x, player.y, size + 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(player.x, player.y, size + 1.5, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawPlayerLabel(ctx, player);
}

/**
 * Draw player shadow (unused but kept for compatibility)
 */
export function drawPlayerShadow(_ctx: CanvasRenderingContext2D, _player: Player, _size: number): void {
  // This function is kept for compatibility but not actively used
  // The shadow is now drawn directly in drawPlayer
}

/**
 * Draw player body (unused but kept for compatibility)
 */
export function drawPlayerBody(ctx: CanvasRenderingContext2D, player: Player, size: number): void {
  const offset = size * 0.5; // e.g., 5 * 0.5 = 2.5
  const gradient = ctx.createRadialGradient(player.x - offset, player.y - offset, 0, player.x, player.y, size);
  const color = player.isHome ? window.gameState.homeJerseyColor : window.gameState.awayJerseyColor;

  gradient.addColorStop(0, lightenColor(color, 40));
  gradient.addColorStop(0.6, color);
  gradient.addColorStop(1, darkenColor(color, 40));

  ctx.beginPath();
  ctx.arc(player.x, player.y, size, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

/**
 * Draw player highlight (unused but kept for compatibility)
 */
export function drawPlayerHighlight(ctx: CanvasRenderingContext2D, player: Player, size: number, hasBall: boolean): void {
  const isShooter = window.gameState.shooter && window.gameState.shooter.name === player.name && window.gameState.shotInProgress;

  // Define smaller line widths
  const highlightLineWidth = isShooter ? 2 : 1.5;
  // Define smaller size offset
  const highlightRadius = size + 1.5;

  if (hasBall || isShooter) {
    ctx.save();
    ctx.shadowColor = isShooter ? '#ff4444' : '#fbbf24';
    ctx.shadowBlur = 10; // Reduced blur
    ctx.strokeStyle = isShooter ? '#ff4444' : '#fbbf24';
    ctx.lineWidth = highlightLineWidth;
    ctx.beginPath();
    // Use the new, smaller radius
    ctx.arc(player.x, player.y, highlightRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Use the new, smaller radius
    ctx.arc(player.x, player.y, highlightRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

/**
 * Draw player name label
 */
export function drawPlayerLabel(ctx: CanvasRenderingContext2D, player: Player): void {
  ctx.save(); // Save the (potentially) rotated context state

  // 1. Move to the player's position
  ctx.translate(player.x, player.y);

  // 2. Conditionally un-rotate the context
  if (window.gameState.isVertical) {
    ctx.rotate(-Math.PI / 2);
  }

  // 3. Draw the text at the new (0,0) origin
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 3;
  ctx.fillStyle = 'white';
  ctx.font = 'bold 13px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(player.name.substring(0, 2).toUpperCase(), 0, 0);

  ctx.restore(); // Restore the context
}

// ============================================================================
// BALL DRAWING
// ============================================================================

/**
 * Draw ground shadow for the ball
 * @migrated-from js/config.js (drawGroundShadow function)
 */
export function drawGroundShadow(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, ballHeight: number): void {
  const shadowY = y + size / 2; // Shadow is on the ground plane, slightly below the ball's center
  const shadowRadiusX = size * 1.2 * (1 - ballHeight * 0.4);
  const shadowRadiusY = shadowRadiusX * 0.3; // Elliptical shadow
  const shadowOpacity = 0.4 * (1 - ballHeight * 0.5);

  if (shadowOpacity > 0) {
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity})`;
    ctx.beginPath();
    ctx.ellipse(x, shadowY, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Draw the ball
 */
export function drawBall(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  if (!isFinite(x) || !isFinite(y)) {
    console.warn('Invalid ball position:', x, y);
    x = 400;
    y = 300;
  }

  const baseSize = 9;
  const size = baseSize + window.gameState.ballHeight * 6;

  // Create ball trail effect when ball is moving
  if (window.gameState.ballTrajectory || (window.gameState.ballVelocity && (Math.abs(window.gameState.ballVelocity.x) > 50 || Math.abs(window.gameState.ballVelocity.y) > 50))) {
    createBallTrail(x, y);
  }

  drawShotEffect(ctx, x, y, size);

  // Draw a dedicated shadow on the ground before drawing the ball
  drawGroundShadow(ctx, x, y, baseSize, window.gameState.ballHeight);

  // Draw the ball itself on top of the shadow
  drawBallBody(ctx, x, y, size);
  drawBallPattern(ctx, x, y, size);
}

/**
 * Draw shot effect around the ball
 */
export function drawShotEffect(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  if (window.gameState.shotInProgress && window.gameState.ballTrajectory) {
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, size + 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(x, y, size + 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * Draw ball body with 3D shading
 */
export function drawBallBody(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  // Enhanced 3D ball with realistic shading

  // Main ball gradient for depth
  const mainGradient = ctx.createRadialGradient(
    x - size * 0.35, y - size * 0.35, size * 0.1,
    x, y, size
  );
  mainGradient.addColorStop(0, '#ffffff');
  mainGradient.addColorStop(0.3, '#f5f5f5');
  mainGradient.addColorStop(0.7, '#d0d0d0');
  mainGradient.addColorStop(1, '#a0a0a0');

  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = mainGradient;
  ctx.fill();

  // Bright specular highlight for 3D effect
  const highlightGradient = ctx.createRadialGradient(
    x - size * 0.4, y - size * 0.4, 0,
    x - size * 0.4, y - size * 0.4, size * 0.6
  );
  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  highlightGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)');
  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = highlightGradient;
  ctx.fill();

  // Shadow side for extra depth
  const shadowGradient = ctx.createRadialGradient(
    x + size * 0.3, y + size * 0.3, 0,
    x + size * 0.3, y + size * 0.3, size * 0.7
  );
  shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  shadowGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)');
  shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
  ctx.fillStyle = shadowGradient;
  ctx.fill();

  // Crisp outline
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1.8;
  ctx.stroke();
}

/**
 * Draw ball pattern (pentagon)
 */
export function drawBallPattern(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  // Subtle pentagon pattern for realistic football look
  ctx.save();
  ctx.strokeStyle = 'rgba(80, 80, 80, 0.4)';
  ctx.lineWidth = 0.8;

  // Draw subtle panel lines
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
    const startX = x + Math.cos(angle) * (size * 0.3);
    const startY = y + Math.sin(angle) * (size * 0.3);
    const endX = x + Math.cos(angle) * (size * 0.75);
    const endY = y + Math.sin(angle) * (size * 0.75);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }

  // Central pentagon
  ctx.beginPath();
  for (let i = 0; i <= 5; i++) {
    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
    const px = x + Math.cos(angle) * (size * 0.3);
    const py = y + Math.sin(angle) * (size * 0.3);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  ctx.restore();
}

// ============================================================================
// BROWSER EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
  window.lightenColor = lightenColor;
  window.darkenColor = darkenColor;
  window.drawPlayer = drawPlayer;
  window.drawPlayerShadow = drawPlayerShadow;
  window.drawPlayerBody = drawPlayerBody;
  window.drawPlayerHighlight = drawPlayerHighlight;
  window.drawPlayerLabel = drawPlayerLabel;
  window.drawBall = drawBall;
  window.drawShotEffect = drawShotEffect;
  window.drawBallBody = drawBallBody;
  window.drawBallPattern = drawBallPattern;
  // Note: drawGroundShadow is already exported by config module
}
