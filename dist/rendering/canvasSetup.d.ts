/**
 * Canvas Setup System
 * Handles canvas initialization, scaling, and high-DPI support
 *
 * @migrated-from js/rendering/canvasSetup.js
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 */
import type { GameState } from '../types';
declare global {
    interface Window {
        gameState: GameState;
        GameCanvasScaler?: {
            resize: () => void;
            width: number;
            height: number;
        };
    }
}
/**
 * Initialize all canvas layers with proper scaling
 */
export declare function initializeCanvasLayers(): boolean;
//# sourceMappingURL=canvasSetup.d.ts.map