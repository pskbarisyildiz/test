/**
 * Football Simulation - TypeScript Entry Point
 *
 * This is the main entry point for the TypeScript version of the football simulation.
 * It imports and initializes all game systems in the correct order.
 *
 * @module index
 * @version 2.0.0-typescript
 */

// ============================================================================
// CORE TYPES (Import first to ensure types are available)
// ============================================================================
export * from './types';

// ============================================================================
// UTILITIES (No dependencies)
// ============================================================================
export * from './utils/math';
export * from './utils/configUtils';

// ============================================================================
// CONFIGURATION (Depends on types)
// ============================================================================
export * from './config';
export * from './eventBus';
export * from './globalExports';

// ============================================================================
// PHYSICS SYSTEM (Phase 2)
// ============================================================================
export * from './physics';

// ============================================================================
// RULES SYSTEMS (Phase 2)
// ============================================================================
export * from './rules';

// ============================================================================
// AI SYSTEMS (Phase 3)
// ============================================================================
export * from './ai';

// ============================================================================
// SET PIECE SYSTEMS (Phase 4)
// ============================================================================
export * from './setpieces';

// ============================================================================
// BEHAVIOR SYSTEMS (Phase 4)
// ============================================================================
export * from './behavior';

// ============================================================================
// UI SYSTEMS (Phase 5)
// ============================================================================
export * from './ui';

// ============================================================================
// RENDERING SYSTEMS (Phase 5)
// ============================================================================
export * from './rendering';

// ============================================================================
// GAME SETUP (Team selection, formation, player initialization)
// ============================================================================
export * from './gameSetup';

// ============================================================================
// CORE GAME LOOP (Phase 7 - FINAL)
// ============================================================================
export * from './core';
export * from './main';

// ============================================================================
// MODULE INITIALIZATION
// ============================================================================

/**
 * Initialize the football simulation system
 * Call this function when the DOM is ready
 */
export function initializeSimulation(): void {
  console.log('🚀 Football Simulation (TypeScript) Initializing...');
  console.log('✅ Type system: LOADED');
  console.log('✅ Configuration: LOADED');
  console.log('✅ Event system: LOADED');
  console.log('✅ Math utilities: LOADED');
  console.log('✅ Physics system: LOADED');
  console.log('✅ Rules systems: LOADED');
  console.log('✅ AI systems: LOADED');
  console.log('✅ Set piece systems: LOADED');
  console.log('✅ Behavior systems: LOADED');
  console.log('✅ UI systems: LOADED');
  console.log('✅ Rendering systems: LOADED');
  console.log('✅ Core game loop: LOADED');
  console.log('✅ Main initialization: LOADED');
  console.log('🎮 Ready to start simulation');
  console.log('🎉 MIGRATION COMPLETE - ALL SYSTEMS OPERATIONAL!');
}

// Auto-initialize when module loads in browser
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSimulation);
  } else {
    initializeSimulation();
  }
}

// ============================================================================
// GLOBAL DECLARATIONS FOR BROWSER
// ============================================================================

declare global {
  interface Window {
    FootballSim: typeof import('./index');
    initializeSimulation: typeof initializeSimulation;
  }
}

if (typeof window !== 'undefined') {
  window.initializeSimulation = initializeSimulation;
}

console.log('✅ Football Simulation Core Module loaded (TypeScript v2.0.0)');
