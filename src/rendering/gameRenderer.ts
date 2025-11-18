/**
 * Game Renderer
 * Main rendering loop that draws all game entities
 *
 * @migrated-from js/rendering/gameRenderer.js
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 */

import type { GameState } from '../types';
import { drawPlayer } from './drawEntities';
import { drawBall } from './drawEntities';

// ============================================================================
// GLOBAL DECLARATIONS
// ============================================================================

declare global {
  interface Window {
    gameState: GameState;
    renderGame?: typeof renderGame;
    drawOffsideLines?: (ctx: CanvasRenderingContext2D) => void;
  }
}

// ============================================================================
// MAIN RENDER FUNCTION
// ============================================================================

/**
 * Main game rendering function
 * Renders all entities on the game canvas
 */
export function renderGame(): void {
  if (!window.gameState.contexts || !window.gameState.contexts.game) {
    console.warn('Game context not initialized yet');
    return;
  }

  const ctx = window.gameState.contexts.game;

  // YÜKSEK ÇÖZÜNÜRLÜK AYARLARI
  const SCALE_FACTOR = window.CFG().HIGH_DPI_SCALE_FACTOR;
  const LOGICAL_WIDTH = window.gameState.isVertical ? 600 : 800;
  const LOGICAL_HEIGHT = window.gameState.isVertical ? 800 : 600;

  // 1. Clear the main canvas
  // KRİTİK DÜZELTME: Transform matrisini sıfırla VE hemen ardından ölçeklendirmeyi uygula.
  // Bu, çizimlerin 800x600 koordinat uzayında kalmasını sağlar.
  ctx.setTransform(SCALE_FACTOR, 0, 0, SCALE_FACTOR, 0, 0);

  // Canvas'ı mantıksal boyutta temizle (Örn: 800x600 alanını temizler)
  ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  // 2. Conditionally apply the 90-degree rotation
  // save() çağrısı, setTransform ile ayarlanan SCALE_FACTOR'ü saklar.
  ctx.save();
  if (window.gameState.isVertical) {
    // Çevirme koordinatları hala mantıksal olmalıdır (600x800)
    ctx.translate(600, 0);
    ctx.rotate(Math.PI / 2);
  }

  // 3. Apply camera shake *after* the potential rotation
  if (window.gameState.cameraShake > 0) {
    const shakeX = (Math.random() - 0.5) * window.gameState.cameraShake;
    const shakeY = (Math.random() - 0.5) * window.gameState.cameraShake;
    ctx.translate(shakeX, shakeY);
  }

  // Çizim kodunun geri kalanı (drawPlayer, drawBall) mantıksal koordinatlarda çalışır
  if (window.gameState.particles && window.gameState.particles.length > 0) {
    window.gameState.particles.forEach(p => p.draw(ctx));
  }

  // Draw players
  const allPlayers = [...window.gameState.homePlayers, ...window.gameState.awayPlayers];
  if (allPlayers.length > 0) {
    allPlayers.forEach(player => {
      const hasBall = !!(window.gameState.ballHolder && window.gameState.ballHolder.name === player.name && !window.gameState.ballTrajectory);
      drawPlayer(ctx, player, hasBall); // This calls drawPlayerLabel

      // This 'intro' block also needs the conditional rotation fix
      // Note: 'intro' is not in GameStatus type, but may be set dynamically
      if ((window.gameState.status as string) === 'intro') {
        ctx.save();
        ctx.translate(player.x, player.y + 30);

        // Conditionally un-rotate
        if (window.gameState.isVertical) {
          ctx.rotate(-Math.PI / 2);
        }

        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(player.name, 0, 0);

        ctx.restore();
      }
    });
  }

  if (window.gameState.ballPosition) {
    drawBall(ctx, window.gameState.ballPosition.x, window.gameState.ballPosition.y);
  }

  if (window.SHOW_OFFSIDE_LINES && window.drawOffsideLines) {
    window.drawOffsideLines(ctx);
  }

  // 4. Restore the context (removes rotation/shake)
  ctx.restore();
}

// ============================================================================
// BROWSER EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
  window.renderGame = renderGame;
}
