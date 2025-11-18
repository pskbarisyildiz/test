/**
 * Canvas Setup System
 * Handles canvas initialization, scaling, and high-DPI support
 *
 * @migrated-from js/rendering/canvasSetup.js
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 */
import { gameState } from '../globalExports';
import { GAME_CONFIG } from '../config';
// ============================================================================
// CANVAS SCALING (IIFE)
// ============================================================================
(() => {
    const LOGICAL_WIDTH = 1280; // Game world width in logical units
    const LOGICAL_HEIGHT = 720; // Game world height in logical units
    const CANVAS_IDS = ['backgroundCanvas', 'gameCanvas', 'uiCanvas'];
    const canvases = CANVAS_IDS
        .map(id => document.getElementById(id))
        .filter((canvas) => canvas !== null);
    const container = document.getElementById('canvas-container');
    function resizeCanvases() {
        const dpr = window.devicePixelRatio || 1;
        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (!ctx)
                return;
            // Only re-size if something actually changed
            const targetW = Math.floor(LOGICAL_WIDTH * dpr);
            const targetH = Math.floor(LOGICAL_HEIGHT * dpr);
            if (canvas.width !== targetW || canvas.height !== targetH) {
                canvas.width = targetW;
                canvas.height = targetH;
            }
            canvas.style.width = `${LOGICAL_WIDTH}px`;
            canvas.style.height = `${LOGICAL_HEIGHT}px`;
            // Reset and apply scale so 1 unit = 1 CSS pixel
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.imageSmoothingEnabled = false; // prevent blurriness for sprites
        });
        // Keep container consistent with logical size
        if (container) {
            container.style.width = `${LOGICAL_WIDTH}px`;
            container.style.height = `${LOGICAL_HEIGHT}px`;
            container.style.margin = '0 auto';
        }
    }
    // Efficient resize handling (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvases, 100);
    });
    // Run once on load
    resizeCanvases();
    // Expose helper if other modules need to force re-scale
    window.GameCanvasScaler = {
        resize: resizeCanvases,
        width: LOGICAL_WIDTH,
        height: LOGICAL_HEIGHT
    };
})();
// ============================================================================
// CANVAS LAYER INITIALIZATION
// ============================================================================
/**
 * Initialize all canvas layers with proper scaling
 */
export function initializeCanvasLayers() {
    const container = document.getElementById('canvas-container');
    if (!container) {
        console.error('Canvas container not found');
        return false;
    }
    // YÜKSEK ÇÖZÜNÜRLÜK İÇİN ÖLÇEK FAKTÖRÜ
    // Bu değer, setupGameScreen'de kullanılan çarpanla aynı olmalıdır (Örn: 2)
    const SCALE_FACTOR = GAME_CONFIG.HIGH_DPI_SCALE_FACTOR; // Çözünürlüğü iki katına çıkarıyoruz (800x600 -> 1600x1200)
    container.style.display = 'block';
    // Initialize canvases and contexts if they don't exist
    if (!gameState.canvases) {
        gameState.canvases = { background: null, game: null, ui: null };
    }
    if (!gameState.contexts) {
        gameState.contexts = { background: null, game: null, ui: null };
    }
    gameState.canvases.background = document.getElementById('backgroundCanvas');
    gameState.canvases.game = document.getElementById('gameCanvas');
    gameState.canvases.ui = document.getElementById('uiCanvas');
    gameState.backgroundDrawn = false;
    // --- Background Canvas ---
    if (gameState.canvases.background) {
        gameState.contexts.background = gameState.canvases.background.getContext('2d', { alpha: false });
        if (gameState.contexts.background) {
            // KRİTİK ADIM: Çizim bağlamını ölçeklendir
            gameState.contexts.background.scale(SCALE_FACTOR, SCALE_FACTOR);
            console.log(`✓ Background canvas initialized and scaled by ${SCALE_FACTOR}x`);
        }
    }
    else {
        console.error('✗ Background canvas not found');
        return false;
    }
    // --- Game Canvas ---
    if (gameState.canvases.game) {
        gameState.contexts.game = gameState.canvases.game.getContext('2d', { alpha: true });
        if (gameState.contexts.game) {
            // KRİTİK ADIM: Çizim bağlamını ölçeklendir
            gameState.contexts.game.scale(SCALE_FACTOR, SCALE_FACTOR);
            console.log(`✓ Game canvas initialized and scaled by ${SCALE_FACTOR}x`);
        }
    }
    else {
        console.error('✗ Game canvas not found');
        return false;
    }
    // --- UI Canvas ---
    if (gameState.canvases.ui) {
        gameState.contexts.ui = gameState.canvases.ui.getContext('2d', { alpha: true });
        if (gameState.contexts.ui) {
            // KRİTİK ADIM: Çizim bağlamını ölçeklendir
            gameState.contexts.ui.scale(SCALE_FACTOR, SCALE_FACTOR);
            console.log(`✓ UI canvas initialized and scaled by ${SCALE_FACTOR}x`);
        }
    }
    else {
        console.error('✗ UI canvas not found');
        return false;
    }
    return true;
}
// ============================================================================
// BROWSER EXPORTS
// ============================================================================
// Function is now exported via ES6 modules - no window exports needed
//# sourceMappingURL=canvasSetup.js.map