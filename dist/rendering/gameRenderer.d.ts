/**
 * Game Renderer
 * Main rendering loop that draws all game entities
 *
 * @migrated-from js/rendering/gameRenderer.js
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 */
import type { GameState } from '../types';
declare global {
    interface Window {
        gameState: GameState;
        renderGame?: typeof renderGame;
        drawOffsideLines?: (ctx: CanvasRenderingContext2D) => void;
    }
}
/**
 * Main game rendering function
 * Renders all entities on the game canvas
 */
export declare function renderGame(): void;
//# sourceMappingURL=gameRenderer.d.ts.map