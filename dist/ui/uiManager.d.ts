/**
 * UI Manager
 * Manages UI state and rendering lifecycle
 *
 * @migrated-from js/ui/uiManager.js
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 */
declare global {
    interface Window {
        updateGameUI?: typeof updateGameUI;
        setupGameScreen?: typeof setupGameScreen;
        initializeCanvasLayers?: () => boolean;
        drawPitchBackground?: () => void;
        renderGame?: () => void;
    }
}
export declare const uiElements: {
    homeScore?: HTMLElement | null;
    awayScore?: HTMLElement | null;
    timeDisplay?: HTMLElement | null;
    halfDisplay?: HTMLElement | null;
    statusIndicator?: HTMLElement | null;
    commentaryContent?: HTMLElement | null;
    statsWrapper?: HTMLElement | null;
    summaryWrapper?: HTMLElement | null;
};
export declare function render(): void;
export declare function updateGameUI(): void;
export declare function setupGameScreen(app: HTMLElement): void;
//# sourceMappingURL=uiManager.d.ts.map