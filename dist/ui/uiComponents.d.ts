/**
 * UI Components
 * Component library for rendering scoreboard, commentary, stats, and match summary
 *
 * @migrated-from js/ui/uiComponents.js
 * ✅ Migrated from JavaScript with zero functional changes
 * ✅ Full type safety with strict TypeScript
 */
declare global {
    interface Window {
        renderStatisticsSummary?: typeof renderStatisticsSummary;
        lightenColor?: (color: string, amount: number) => string;
    }
}
export declare function renderScoreboard(): string;
export declare function getStatusIndicator(): string;
export declare function renderCommentary(): string;
export declare function renderStats(): string;
export declare function renderMatchSummary(): string;
export declare function renderStatisticsSummary(): string;
export declare function switchSummaryTab(tab: 'events' | 'stats'): void;
//# sourceMappingURL=uiComponents.d.ts.map