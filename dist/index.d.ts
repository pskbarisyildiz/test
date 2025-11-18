/**
 * Football Simulation - TypeScript Entry Point
 *
 * This is the main entry point for the TypeScript version of the football simulation.
 * It imports and initializes all game systems in the correct order.
 *
 * @module index
 * @version 2.0.0-typescript
 */
export * from './types';
export * from './utils/math';
export * from './utils/configUtils';
export * from './config';
export * from './eventBus';
export * from './globalExports';
export * from './physics';
export * from './rules';
export * from './ai';
export * from './setpieces';
export * from './behavior';
export * from './ui';
export * from './rendering';
export * from './gameSetup';
export * from './core';
export * from './main';
/**
 * Initialize the football simulation system
 * Call this function when the DOM is ready
 */
export declare function initializeSimulation(): void;
declare global {
    interface Window {
        FootballSim: typeof import('./index');
        initializeSimulation: typeof initializeSimulation;
    }
}
//# sourceMappingURL=index.d.ts.map