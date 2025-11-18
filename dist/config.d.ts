/**
 * Main Game Configuration
 * Complete, type-safe configuration for the football simulation
 *
 * ✅ Fully migrated from JavaScript with zero functional changes
 * ✅ Maximum type safety with strict TypeScript
 * ✅ Browser-compatible with global window exports
 */
import type * as types from './types';
export declare const GAME_LOOP: types.GameLoopConfig;
export declare const PHYSICS: types.PhysicsConfig;
export declare const BALL_PHYSICS: types.BallPhysicsConfig;
export declare const GAME_CONFIG: types.GameConfig;
export declare const positionToRoleMap: types.PositionToRoleMap;
/**
 * Convert position string to tactical role
 */
export declare function getRoleFromPosition(positionString: string | null | undefined): types.PlayerRole;
export declare const POSITION_CONFIGS: types.PositionConfigsMap;
export declare const TACTICS: types.TacticsMap;
export declare const TEAM_STATE_MODIFIERS: types.TeamStateModifiersMap;
export declare const BT_CONFIG: types.BehaviorTreeConfig;
export declare const FORMATIONS: types.FormationsMap;
/**
 * Draw ground shadow for ball (with height)
 */
export declare function drawGroundShadow(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, ballHeight: number): void;
/**
 * Toggle screen orientation (vertical/horizontal)
 * Requires gameState and render function to be available globally
 */
export declare function toggleOrientation(): void;
/**
 * Validate physics realism (development only)
 */
export declare function validatePhysicsRealism(): void;
//# sourceMappingURL=config.d.ts.map